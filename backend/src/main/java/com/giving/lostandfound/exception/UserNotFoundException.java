package com.giving.lostandfound.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("No such user with id " + id);
    }

    public UserNotFoundException(String email) {
        super("No such user with email " + email);
    }
}
