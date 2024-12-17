package com.mypropertyapp_restapi.service;

import com.mypropertyapp_restapi.config.MailSend;
import com.mypropertyapp_restapi.model.*;
import com.mypropertyapp_restapi.repository.CompanyRepository;
import com.mypropertyapp_restapi.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Objects;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private MailSend mailSend;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User register(SignUpDto signUpDto) throws MessagingException {
        Company company = new Company();
        company.setName(signUpDto.getCompanyName());
        companyRepository.save(company);

        User user = new User();
        user.setFirstName(signUpDto.getFirstName());
        user.setLastName(signUpDto.getLastName());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(encoder.encode(signUpDto.getPassword()));
        user.setCode(encrypt(generateActivationCode() + ""));
        user.setCompany(company);
        user.setRole("Admin");
        user.setEnabled(false);
        user.setAccountNonExpired(false);
        user.setAccountNonLocked(false);
        user.setCredentialsNonExpired(false);
        userRepository.save(user);
        mailSend.sendMail(user.getEmail(), user.getCode());
        return user;
    }

    public User findByEmail(String email) {return userRepository.findByEmail(email);}

    public String verify(User user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getEmail());
        } else {
            return "fail";
        }
    }


    private static SecretKey secretKey;
    private static final String ALGORITHM = "AES";

    static {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(128);
            secretKey = keyGenerator.generateKey();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String encrypt(String strToEncrypt) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encrypted = cipher.doFinal(strToEncrypt.getBytes());
            return Base64.getUrlEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            System.out.println("Error while encrypting: " + e.toString());
        }
        return null;
    }

    public String decrypt(String strToDecrypt) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decrypted = cipher.doFinal(Base64.getUrlDecoder().decode(strToDecrypt));
            return new String(decrypted);
        } catch (Exception e) {
            System.out.println("Error while decrypting: " + e.toString());
        }
        return null;
    }

    public static int generateActivationCode() {
        Random random = new Random();
        return 100000 + random.nextInt(899999);
    }


    public boolean verifyEmail(String email, String code){
        User user = findByEmail(email);
        if(user!=null && Objects.equals(decrypt(user.getCode()), decrypt(code))){
            user.setEnabled(true);
            user.setAccountNonExpired(true);
            user.setAccountNonLocked(true);
            user.setCredentialsNonExpired(true);
            user.setCode(null);
            userRepository.save(user);
            return true;
        }else{
            return false;
        }
    }


    public Page<User> PageAllUser(Integer pageNo, Long companyId,  Integer size){
        PageRequest pageable = PageRequest.of(pageNo -1, size);
        return userRepository.findByCompany_Id(companyId, pageable);
    }

    public void addUser(String email, String role, Company company){
        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setCompany(company);
        user.setFirstName("");
        user.setLastName("");
        userRepository.save(user);
    }

    public void addNewUser(String email, String firstName, String lastName, String password){
        User user = findByEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setCode(encrypt(generateActivationCode() + ""));
        user.setPassword(encoder.encode(password));
        user.setEnabled(false);
        user.setAccountNonExpired(false);
        user.setAccountNonLocked(false);
        user.setCredentialsNonExpired(false);
        userRepository.save(user);
        mailSend.sendMail(user.getEmail(), user.getCode());
    }

    public void deleteUser(Long id){
        userRepository.delete(userRepository.findById(id));
    }
}