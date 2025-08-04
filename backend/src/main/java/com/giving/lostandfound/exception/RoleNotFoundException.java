package com.giving.lostandfound.exception;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException(String name) {
        super("No such role with name " + name);
    }
}
