package com.giving.lostandfound.service;

import com.giving.lostandfound.config.CloudflareProperties;
import com.giving.lostandfound.dto.ItemImageDto;
import com.giving.lostandfound.exception.FileUploadException;
import com.giving.lostandfound.exception.ImageNotFoundException;
import com.giving.lostandfound.exception.ItemNotFoundException;
import com.giving.lostandfound.exception.UnsupportedMediaTypeException;
import com.giving.lostandfound.model.Item;
import com.giving.lostandfound.model.ItemImage;
import com.giving.lostandfound.repository.ItemImageRepository;
import com.giving.lostandfound.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
public class ItemImageService {
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final ItemImageRepository itemImageRepository;
    private final ItemRepository itemRepository;
    private final String bucket;

    public ItemImageService(
            ItemImageRepository itemImageRepository,
            ItemRepository itemRepository,
            S3Client s3Client,
            S3Presigner s3Presigner,
            CloudflareProperties cloudflareProperties
    ) {
        this.itemImageRepository = itemImageRepository;
        this.itemRepository = itemRepository;
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.bucket = cloudflareProperties.getBucket();
    }

    public URL generatePresignedUrl(String key, Duration expiration) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest preSignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(expiration)
                .getObjectRequest(getObjectRequest)
                .build();
        return s3Presigner.presignGetObject(preSignRequest).url();
    }

    public List<ItemImageDto> getImagesByItemId(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException(itemId));
        return item.getImages().stream()
                .map(this::mapToDto)
                .toList();
    }

    public ItemImageDto saveImage(Long itemId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileUploadException("Uploaded file is empty");
        }

        String contentType = Optional.ofNullable(file.getContentType())
                .orElseThrow(() -> new UnsupportedMediaTypeException("Content-Type is unknown"));

        if (!isSupportedImageType(contentType)) {
            throw new UnsupportedMediaTypeException("Only image files are allowed");
        }

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException(itemId));

        ItemImage itemImage = new ItemImage();
        itemImage.setItem(item);
        itemImage.setImageUrl("");
        itemImage = itemImageRepository.save(itemImage);

        String key = String.format("%s/%s", itemId, itemImage.getId());

        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        try {
            s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));
        } catch (IOException e) {
            throw new FileUploadException("File upload to Cloudflare R2 failed", e);
        }

        itemImage.setImageUrl(key);
        return mapToDto(itemImageRepository.save(itemImage));
    }

    public void deleteImage(Long imageId) {
        ItemImage itemImage = itemImageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException(imageId));

        String key = String.format("%s/%s", itemImage.getItem().getId(), imageId);

        DeleteObjectRequest req = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.deleteObject(req);
        itemImageRepository.deleteById(imageId);
    }

    public ItemImageDto mapToDto(ItemImage image) {
        ItemImageDto itemImageDto = new ItemImageDto();
        itemImageDto.setId(image.getId());

        String key = image.getImageUrl();
        URL signedUrl = generatePresignedUrl(key, Duration.ofHours(2));
        itemImageDto.setImageUrl(signedUrl.toString());
        return itemImageDto;
    }

    public boolean isOwner(Long itemId, Long userId) {
        return itemRepository.findById(itemId)
                .map(item -> item.getFilledBy() != null && item.getFilledBy().getId().equals(userId))
                .orElse(false);
    }

    private boolean isSupportedImageType(String contentType) {
        return contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/webp");
    }
}
