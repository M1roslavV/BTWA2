//package com.mypropertyapp.user;
//
//import com.mypropertyapp.exception_config.MailSend;
//import jakarta.mail.MessagingException;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.ModelAttribute;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import java.util.Objects;
//import java.util.Optional;
//
//@Controller
//@AllArgsConstructor
//public class UserController {
//
//    private final UserService userService;
//    private final MailSend mailSend;
//    private final UserRepository userRepository;
//
//    @GetMapping("/")
//    public String home(){ return "/home/index"; }
//
//    @GetMapping("/aboutUs")
//    public String aboutUs(){ return "/home/about_us"; }
//
//    @GetMapping("/sign_up")
//    public String sign_up(Model model){
//        model.addAttribute("SingUpDto", new SignUpDto());
//        return "/auth/sign_up";
//    }
//    @GetMapping("/login")
//    public String login(HttpServletRequest request) {
//        if (request.getUserPrincipal() != null) {
//            return "redirect:/dashboard";
//        }
//        return "/auth/sign_in";
//    }
//
//    @PostMapping("/sign_up/process")
//    public String saveUser(@ModelAttribute("SignUpDto") SignUpDto userDto) throws MessagingException {
//        String errors = "";
//        if (!Objects.equals(userDto.getConfirmPassword(), userDto.getPassword()))
//            errors += "_passwords_not_match";
//        if(userDto.getPassword().length()<10)
//            errors += "_low_password";
//        if(userService.findByEmail(userDto.getEmail()).isPresent())
//            errors += "_email_exists";
//
//        if(!errors.isEmpty())
//            return "redirect:/sign_up?" + errors;
//
//        userService.register(userDto);
//        mailSend.sendMail(userDto);
//        return "redirect:/login";
//    }
//
//    @GetMapping("/login/verify")
//    public String verifyEmail(@RequestParam("code") String code, @RequestParam("email") String email) {
//        Optional<User> user = userRepository.findByEmail(userService.decrypt(email));
//        if (user.isPresent() && Objects.equals(userService.decrypt(user.get().getCode()), userService.decrypt(code))) {
//            user.get().setEnabled(true);
//            user.get().setCode(null);
//            userRepository.save(user.get());
//            return "/auth/sign_in";
//        } else {
//            return "redirect:/sign_up";
//        }
//    }
//
//}

package com.mypropertyapp.user;

import com.mypropertyapp.exception_config.MailSend;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")  // API base path
public class UserController {

    private final UserService userService;
    private final MailSend mailSend;
    private final UserRepository userRepository;

    // Endpoint pro domácí stránku (nepoužívá se v REST API, ale je součástí vaší původní logiky)
    @GetMapping("/")
    public ResponseEntity<String> home() {
        return new ResponseEntity<>("Welcome to the API", HttpStatus.OK);
    }

    // Endpoint pro zobrazení informací o aplikaci "About Us"
    @GetMapping("/aboutUs")
    public ResponseEntity<String> aboutUs() {
        return new ResponseEntity<>("About Us Information", HttpStatus.OK);
    }

    // Endpoint pro registraci uživatele
    @PostMapping("/sign-up")
    public ResponseEntity<String> saveUser(@RequestBody SignUpDto userDto) {
        String errors = "";
        System.out.println("Received user data: " + userDto);

        if (!Objects.equals(userDto.getConfirmPassword(), userDto.getPassword()))
            errors += "Passwords do not match. ";
        if (userDto.getPassword().length() < 10)
            errors += "Password is too short. ";
        if (userService.findByEmail(userDto.getEmail()).isPresent())
            errors += "Email already exists.";

        if (!errors.isEmpty())
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);

        try {
            userService.register(userDto);
            mailSend.sendMail(userDto);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred during registration: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("User registered successfully. Verification email sent.", HttpStatus.CREATED);
    }


    // Endpoint pro přihlášení (můžete implementovat vlastní logiku přihlášení)
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SignInDto loginDto) {
        Optional<User> user = userService.findByEmail(loginDto.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(loginDto.getPassword())) {
            return new ResponseEntity<>("Login successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    // Endpoint pro verifikaci emailu
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("code") String code, @RequestParam("email") String email) {
        Optional<User> user = userRepository.findByEmail(userService.decrypt(email));
        if (user.isPresent() && Objects.equals(userService.decrypt(user.get().getCode()), userService.decrypt(code))) {
            user.get().setEnabled(true);
            user.get().setCode(null);
            userRepository.save(user.get());
            return new ResponseEntity<>("Email verified successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid verification code or email.", HttpStatus.BAD_REQUEST);
        }
    }
}
