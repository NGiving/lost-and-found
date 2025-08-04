package com.giving.lostandfound.service;

import com.giving.lostandfound.dto.UserDto;
import com.giving.lostandfound.enums.RoleName;
import com.giving.lostandfound.exception.DuplicateUserException;
import com.giving.lostandfound.exception.RoleNotFoundException;
import com.giving.lostandfound.exception.UserNotFoundException;
import com.giving.lostandfound.model.Role;
import com.giving.lostandfound.model.User;
import com.giving.lostandfound.repository.RoleRepository;
import com.giving.lostandfound.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateUserException(userDto.getEmail());
        }

        User user = mapToEntity(userDto, RoleName.ROLE_USER);
        return mapToDto(userRepository.save(user));
    }

    public UserDto createAdmin(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateUserException(userDto.getEmail());
        }

        User admin = mapToEntity(userDto, RoleName.ROLE_ADMIN);
        return mapToDto(userRepository.save(admin));
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findUserIdByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return mapToDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public UserDto getUserByEmail(String email) {
        User user =  userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
        return mapToDto(user);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());

        if (userDto.getRoleName() != null) {
            Role role = roleRepository.findByName(userDto.getRoleName())
                    .orElseThrow(() -> new RoleNotFoundException(userDto.getRoleName().name()));
            user.setRole(role);
        }
        return mapToDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id))
            throw new UserNotFoundException(id);
        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setRoleName(user.getRole().getName());
        return userDto;
    }

    private User mapToEntity(UserDto userDto, RoleName roleName) {
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException(roleName.name()));
        user.setRole(role);
        return user;
    }
}
