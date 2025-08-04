package com.giving.lostandfound.controller;

import com.giving.lostandfound.dto.ItemImageDto;
import com.giving.lostandfound.service.ItemImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/items/{itemId}/images")
public class ItemImageController {

    private final ItemImageService itemImageService;

    public ItemImageController(ItemImageService itemImageService) {
        this.itemImageService = itemImageService;
    }

    @GetMapping
    public ResponseEntity<List<ItemImageDto>> getImages(@PathVariable Long itemId) {
        List<ItemImageDto> images = itemImageService.getImagesByItemId(itemId);
        return ResponseEntity.ok(images);
    }

    @PreAuthorize("@itemImageService.isOwner(#itemId, principal.id) or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ItemImageDto> uploadImage(
            @PathVariable Long itemId,
            @RequestParam("file") MultipartFile file
    ) {
        ItemImageDto savedImage = itemImageService.saveImage(itemId, file);
        URI location = URI.create(String.format("/api/items/%s/images/%d", itemId, savedImage.getId()));
        return ResponseEntity.created(location).body(savedImage);
    }

    @PreAuthorize("@itemImageService.isOwner(#itemId, principal.id) or hasRole('ADMIN')")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long itemId, @PathVariable Long imageId) {
        itemImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
