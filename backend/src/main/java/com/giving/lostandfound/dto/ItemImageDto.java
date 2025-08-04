package com.giving.lostandfound.dto;

import jakarta.validation.constraints.NotBlank;

public class ItemImageDto {
    private Long id;

    @NotBlank(message = "Image URL must not be blank")
    private String imageUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
