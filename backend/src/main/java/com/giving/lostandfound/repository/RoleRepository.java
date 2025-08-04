package com.giving.lostandfound.repository;

import com.giving.lostandfound.enums.RoleName;
import com.giving.lostandfound.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
