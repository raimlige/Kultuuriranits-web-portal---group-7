package ee.meeskond7.kultuuriranits_backend.service;


import ee.meeskond7.kultuuriranits_backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PersonRepository personRepository;

    @Async
    public void sendBroadcastEmail(String subject, String body) {
        List<String> activeUserEmails = personRepository.findAll().stream()
                .map(person -> person.getEmail())
                .filter(email -> email != null && !email.isEmpty())
                .toList();
        for (String email : activeUserEmails) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("jaltdorf@tlu.ee");
                message.setTo(email);
                message.setSubject(subject);
                message.setText(body);

                mailSender.send(message);
            } catch (Exception e) {
                System.err.println("Viga e-maili saatmisel aadressile " + email + ": " + e.getMessage());
            }
        }
    }
}
