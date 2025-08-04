package com.giving.lostandfound.dto;

import com.giving.lostandfound.enums.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public class ItemDto {
    private Long id;

    @NotNull
    @Size(min = 1, max = 100)
    private String name;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull
    @Size(min = 1, max = 255)
    private String location;

    @NotNull
    private LocalDateTime dateReported;

    @NotNull
    private ItemStatus status;
    private LocalDateTime dateClaimed;
    private Long filledByUserId;
    private Long claimedByUserId;
    private List<ItemImageDto> images;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDateReported() {
        return dateReported;
    }

    public void setDateReported(LocalDateTime dateReported) {
        this.dateReported = dateReported;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public LocalDateTime getDateClaimed() {
        return dateClaimed;
    }

    public void setDateClaimed(LocalDateTime dateClaimed) {
        this.dateClaimed = dateClaimed;
    }

    public Long getFilledByUserId() {
        return filledByUserId;
    }

    public void setFilledByUserId(Long filledByUserId) {
        this.filledByUserId = filledByUserId;
    }

    public Long getClaimedByUserId() {
        return claimedByUserId;
    }

    public void setClaimedByUserId(Long claimedByUserId) {
        this.claimedByUserId = claimedByUserId;
    }

    public List<ItemImageDto> getImages() {
        return images;
    }

    public void setImages(List<ItemImageDto> images) {
        this.images = images;
    }
}
