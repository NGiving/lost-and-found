package com.giving.lostandfound.exception;

public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(Long id) {
        super("No such item with id " + id);
    }
}
