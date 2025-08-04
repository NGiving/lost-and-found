package com.giving.lostandfound.exception;

public class ImageNotFoundException extends RuntimeException {
    public ImageNotFoundException(Long id) {
        super("No such image found " + id);
    }
}
