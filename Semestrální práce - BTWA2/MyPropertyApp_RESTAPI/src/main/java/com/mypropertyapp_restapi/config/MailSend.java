package com.mypropertyapp_restapi.config;


import com.mypropertyapp_restapi.model.SignUpDto;
import com.mypropertyapp_restapi.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class MailSend {

    private final JavaMailSender mailSender;


    public void sendMail(String email, String code) {
        try {
            String verificationUrl = String.format("http://localhost:8080/api/verify/email?code=%s&email=%s", code, email);
            System.out.println(verificationUrl);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("\uD83D\uDD11 Verification your email form App MyProperty");
            helper.setText("<h2>Verification your email</h2> <p>" +
                    "Good day,</p></br><p>Thank you for registering with MyProperty! We are delighted" +
                    "that you have decided to use our services for the management of your properties.</p> </br>" +
                    "<p>To complete the registration process and activate your account, you must verify your email." +
                    "With this step, we ensure that your email was entered correctly and that you are its authorized owner.</p></br>" +
                    String.format("<p>Please click on the link below to verify your email: <a href='%s'>Verification</a></p>", verificationUrl), true);

            mailSender.send(message);
        }catch (MessagingException e) {
            e.printStackTrace();
        }
    }


    public void addNewUser(String email) {
        try {
            String verificationUrl = String.format("http://localhost:5173/registerNewUser?email=%s", email);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("\uD83D\uDD11 Verification your email form App MyProperty");
            helper.setText("<h2>Verification your email</h2> <p>" +
                    "Good day,</p></br><p>Thank you for registering with MyProperty! We are delighted" +
                    "that you have decided to use our services for the management of your properties.</p> </br>" +
                    "<p>To complete the registration process and activate your account, you must verify your email." +
                    "With this step, we ensure that your email was entered correctly and that you are its authorized owner.</p></br>" +
                    String.format("<p>Please click on the link below to verify your email: <a href='%s'>Verification</a></p>", verificationUrl), true);

            mailSender.send(message);
        }catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
