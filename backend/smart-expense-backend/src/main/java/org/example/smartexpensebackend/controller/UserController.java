package org.example.smartexpensebackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.smartexpensebackend.dto.UserResponseDTO;
import org.example.smartexpensebackend.entity.User;
import org.example.smartexpensebackend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody User user) {

        User savedUser = userService.createUser(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody User user) {

        User loggedInUser =
                userService.login(
                        user.getEmail(),
                        user.getPassword()
                );

        return new UserResponseDTO(
                loggedInUser.getId(),
                loggedInUser.getName(),
                loggedInUser.getEmail(),
                loggedInUser.getRole()
        );
    }

    @RequestMapping(
            value = "/login",
            method = RequestMethod.OPTIONS
    )
    public void loginOptions() {
    }
}