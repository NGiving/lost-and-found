package com.giving.lostandfound.service;

import com.giving.lostandfound.dto.ItemDto;
import com.giving.lostandfound.dto.ItemImageDto;
import com.giving.lostandfound.enums.ItemStatus;
import com.giving.lostandfound.exception.ItemNotFoundException;
import com.giving.lostandfound.exception.UserNotFoundException;
import com.giving.lostandfound.model.Item;
import com.giving.lostandfound.model.User;
import com.giving.lostandfound.repository.ItemRepository;
import com.giving.lostandfound.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ItemImageService itemImageService;

    public ItemService(ItemRepository itemRepository, UserRepository userRepository, ItemImageService itemImageService) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.itemImageService = itemImageService;
    }

    public ItemDto getItemById(Long id) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        return mapToDto(item);
    }

    public List<ItemDto> getAllItems() {
        return itemRepository.findAll().stream().map(this::mapToDto).toList();
    }

    public List<ItemDto> getItemsByFilledBy(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        return itemRepository.findByFilledBy(user).stream().map(this::mapToDto).toList();
    }

    public List<ItemDto> getItemsByName(String name) {
        return itemRepository.findByNameContainingIgnoreCase(name).stream().map(this::mapToDto).toList();
    }

    public List<ItemDto> getItemsByDescription(String description) {
        return itemRepository.findByDescriptionFts(description).stream().map(this::mapToDto).toList();
    }

    public List<ItemDto> searchItems(String field, String query, LocalDateTime dateBefore, LocalDateTime dateAfter, String location, String sortBy, String sortDir) {
        Specification<Item> spec = (root, cq, cb) -> cb.conjunction();

        if (StringUtils.hasText(field) && StringUtils.hasText(query)) {
            if (field.equalsIgnoreCase("name")) {
                spec = spec.and((root, cq, cb) -> cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"));
            } else if (field.equalsIgnoreCase("description")) {
                spec = spec.and((root, cq, cb) -> cb.like(cb.lower(root.get("description")), "%" + query.toLowerCase() + "%"));
            }
        }

        if (dateBefore != null) {
            spec = spec.and((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("dateReported"), dateBefore));
        }

        if (dateAfter != null) {
            spec = spec.and((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("dateReported"), dateAfter));
        }

        if (StringUtils.hasText(location)) {
            spec = spec.and((root, cq, cb) -> cb.equal(cb.lower(root.get("location")), location.toLowerCase()));
        }

        Sort sort = Sort.unsorted();
        if (StringUtils.hasText(sortBy) && StringUtils.hasText(sortDir)) {
            try {
                sortBy = sortBy.equalsIgnoreCase("date") ? "dateReported" : sortBy;
                sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
            } catch (IllegalArgumentException e) {
                sort = Sort.by(sortBy);
            }
        }
        return itemRepository.findAll(spec, sort).stream().map(this::mapToDto).toList();
    }

    public ItemDto createItem(Long userId, ItemDto itemDto) {
        User filledBy = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Filled by user not found"));

        Item item = mapToEntity(itemDto);
        item.setFilledBy(filledBy);
        if (item.getStatus() == null) item.setStatus(ItemStatus.UNCLAIMED);
        return mapToDto(itemRepository.save(item));
    }

    public List<ItemDto> createItems(Long userId, List<ItemDto> itemDtos) {
        User filledBy = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Filled by user not found"));

        List<Item> items = itemDtos.stream()
                .map(this::mapToEntity)
                .peek(item -> {
                    item.setFilledBy(filledBy);
                    if (item.getStatus() == null) item.setStatus(ItemStatus.UNCLAIMED);
                })
                .toList();
        return itemRepository.saveAll(items).stream().map(this::mapToDto).toList();
    }

    public ItemDto replaceItem(Long id, ItemDto itemDto) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        item.setName(itemDto.getName());
        item.setDescription(itemDto.getDescription());
        item.setLocation(itemDto.getLocation());
        item.setDateReported(itemDto.getDateReported());
        item.setStatus(itemDto.getStatus());
        item.setDateClaimed(itemDto.getDateClaimed());

        if (itemDto.getClaimedByUserId() != null) {
            User claimant = userRepository.findById(itemDto.getClaimedByUserId()).orElseThrow(() -> new IllegalArgumentException("Claiming user not found"));
            item.setClaimedBy(claimant);
        }

        return mapToDto(itemRepository.save(item));
    }

    public ItemDto patchItem(Long id, ItemDto itemDto) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        if (itemDto.getName() != null) item.setName(itemDto.getName());
        if (itemDto.getDescription() != null) item.setDescription(itemDto.getDescription());
        if (itemDto.getLocation() != null) item.setLocation(itemDto.getLocation());
        if (itemDto.getDateReported() != null) item.setDateReported(itemDto.getDateReported());
        if (itemDto.getStatus() != null) item.setStatus(itemDto.getStatus());

        if (itemDto.getClaimedByUserId() != null) {
            if (itemDto.getDateClaimed() == null) {
                throw new IllegalArgumentException("dateClaimed must be provided when claiming an item.");
            }

            User claimant = userRepository.findById(itemDto.getClaimedByUserId()).orElseThrow(() -> new IllegalArgumentException("Claiming user not found"));
            item.setClaimedBy(claimant);
            item.setDateClaimed(itemDto.getDateClaimed());

        } else {
            item.setClaimedBy(null);
            item.setDateClaimed(null);
        }

        return mapToDto(itemRepository.save(item));
    }

    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) throw new ItemNotFoundException(id);
        itemRepository.deleteById(id);
    }

    private ItemDto mapToDto(Item item) {
        ItemDto itemDto = new ItemDto();
        itemDto.setId(item.getId());
        itemDto.setName(item.getName());
        itemDto.setDescription(item.getDescription());
        itemDto.setLocation(item.getLocation());
        itemDto.setDateReported(item.getDateReported());
        itemDto.setStatus(item.getStatus());
        itemDto.setDateClaimed(item.getDateClaimed());
        itemDto.setFilledByUserId(item.getFilledBy().getId());

        if (item.getClaimedBy() != null) {
            itemDto.setClaimedByUserId(item.getClaimedBy().getId());
        }

        List<ItemImageDto> imageUrls = item.getImages().stream().map(itemImageService::mapToDto).toList();
        itemDto.setImages(imageUrls);

        return itemDto;
    }

    private Item mapToEntity(ItemDto itemDto) {
        Item item = new Item();
        item.setName(itemDto.getName());
        item.setDescription(itemDto.getDescription());
        item.setLocation(itemDto.getLocation());
        item.setDateReported(itemDto.getDateReported());
        item.setDateClaimed(itemDto.getDateClaimed());
        item.setStatus(itemDto.getStatus());
        return item;
    }

    public boolean isOwner(Long itemId, Long userId) {
        return itemRepository.findById(itemId).map(item -> item.getFilledBy() != null && item.getFilledBy().getId().equals(userId)).orElse(false);
    }
}
