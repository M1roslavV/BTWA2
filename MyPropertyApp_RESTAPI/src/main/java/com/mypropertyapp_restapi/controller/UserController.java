package com.mypropertyapp_restapi.controller;

import com.mypropertyapp_restapi.config.MailSend;
import com.mypropertyapp_restapi.model.SignUpDto;
import com.mypropertyapp_restapi.model.User;
import com.mypropertyapp_restapi.model.UserDetailsCustom;
import com.mypropertyapp_restapi.service.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private MailSend mailSend;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        String token = userService.verify(user);
        if (token != null) {
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> saveUser(@RequestBody SignUpDto userDto) throws MessagingException {
        String errors = "";

        if (userService.findByEmail(userDto.getEmail()) != null)
            errors += "Email already exists.";

        if (!errors.isEmpty())
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);

        userService.register(userDto);
        return ResponseEntity.ok("User registered successfully. Verification email sent.");
    }

    @PostMapping("/role")
    public ResponseEntity<?> getRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
        }

        String email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        return ResponseEntity.ok(Collections.singletonMap("role", user.getRole()));
    }


    @GetMapping("/verify/email")
    public ResponseEntity<?> verifyEmail(@RequestParam("code") String code, @RequestParam("email") String email) {
        boolean isVerified = userService.verifyEmail(email, code);
        System.out.println(email + " " + code + isVerified);
        if (isVerified) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost:5173/login"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            return ResponseEntity.badRequest().body("Invalid verification code or email.");
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok("ok");
    }


    @GetMapping("/users")
    public Map<String, Object> getAllUsers(
            @RequestParam(defaultValue = "1") Integer pageNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();
        Long companyId = userService.findByEmail(email).getCompany().getId();
        Page<User> page = userService.PageAllUser(pageNo,companyId, 7);
        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent().stream()
                .map(user -> Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "name", user.getFirstName() + " " + user.getLastName(),
                        "role", user.getRole()))
                .toList());
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("currentPage", page.getNumber());
        return response;
    }

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@RequestBody Map<String, String> user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String manager_email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();

        if (userService.findByEmail(user.get("email")) != null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email already exists");
        }else{
            userService.addUser(user.get("email"), user.get("role"), userService.findByEmail(manager_email).getCompany());
            mailSend.addNewUser(user.get("email"));
            return ResponseEntity.ok("User added successfully");
        }
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registerNewUser")
    public ResponseEntity<?> registerNewUser(@RequestBody Map<String, String> user) throws MessagingException {
        userService.addNewUser(user.get("email"), user.get("firstName"), user.get("lastName"), user.get("password"));
        return ResponseEntity.ok("User registered successfully. Verification email sent.");
    }


}