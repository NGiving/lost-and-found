package com.giving.lostandfound.controller;

import com.giving.lostandfound.auth.CustomUserDetails;
import com.giving.lostandfound.dto.ItemDto;
import com.giving.lostandfound.service.ItemService;
import com.giving.lostandfound.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;
    private final UserService userService;

    public ItemController(ItemService itemService, UserService userService) {
        this.itemService = itemService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDto> getItem(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping
    public ResponseEntity<List<ItemDto>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ItemDto>> getMyItems(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(itemService.getItemsByFilledBy(userDetails.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemDto>> searchItems(
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateBefore,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateAfter,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir
    ) {
        List<ItemDto> items = itemService.searchItems(field, query, dateBefore, dateAfter, location, sortBy, sortDir);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ItemDto> newItem(@RequestBody ItemDto itemDto, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ItemDto createdItem = itemService.createItem(userId, itemDto);
        URI location = URI.create("/api/items/" + createdItem.getId());
        return ResponseEntity.created(location).body(createdItem);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ItemDto>> newItemBatch(@RequestBody List<ItemDto> itemDtos, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        List<ItemDto> createdItems = itemService.createItems(userId, itemDtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItems);
    }

    @PreAuthorize("@itemService.isOwner(#id, principal.id) or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ItemDto> updateItem(@PathVariable Long id, @RequestBody ItemDto itemDto) {
        ItemDto updatedItem = itemService.replaceItem(id, itemDto);
        return ResponseEntity.ok(updatedItem);
    }

    @PreAuthorize("@itemService.isOwner(#id, principal.id) or hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ItemDto> patchItem(@PathVariable Long id, @RequestBody ItemDto itemDto) {
        ItemDto updatedItem = itemService.patchItem(id, itemDto);
        return ResponseEntity.ok(updatedItem);
    }

    @PreAuthorize("@itemService.isOwner(#id, principal.id) or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
