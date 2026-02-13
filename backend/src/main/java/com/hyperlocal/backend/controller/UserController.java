package com.hyperlocal.backend.controller;

import com.hyperlocal.backend.model.User;
import com.hyperlocal.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginDetails) {
        return userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(loginDetails.getEmail()) &&
                        u.getPassword().equals(loginDetails.getPassword()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    // Create user (no login, just save)
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
