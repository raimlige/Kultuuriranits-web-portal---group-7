package ee.meeskond7.kultuuriranits_backend.controller;


import ee.meeskond7.kultuuriranits_backend.dto.EmailDto;
import ee.meeskond7.kultuuriranits_backend.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
public class AdminEmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/sendEmail")
    public ResponseEntity<String> sendBroadcast(@RequestBody EmailDto emailDto) {
        if (emailDto.subject() == null || emailDto.subject().isBlank() ||
                emailDto.body() == null || emailDto.body().isBlank()) {
            return ResponseEntity.badRequest().body("Teema ja sisu on kohustuslikud!");
        }
        emailService.sendBroadcastEmail(emailDto.subject(), emailDto.body());

        return ResponseEntity.ok("E-mailide masssaatmine käivitati edukalt taustal.");
    }

}
