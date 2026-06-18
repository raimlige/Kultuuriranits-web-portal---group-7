package ee.meeskond7.kultuuriranits_backend.controller;


import ee.meeskond7.kultuuriranits_backend.entity.Booking;
import ee.meeskond7.kultuuriranits_backend.entity.Notification;
import ee.meeskond7.kultuuriranits_backend.repository.NotificationRepository;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("notification")
    public List<Notification> findAll(HttpSession session) {
        Long organizationId = (Long) session.getAttribute("organization_id");
        if (organizationId == null) {
            throw new RuntimeException("Kasutaja pole sisse logitud!");
        }
        return notificationRepository.findByOrganizationId(organizationId);
    }

    @PostMapping("notification")
    public List<Notification> addNotification(@RequestBody Notification notification){
        if (notification.getId() != null){
            throw new RuntimeException("Cannot add with ID");
        }
        notification.setCreatedAt(java.time.LocalDateTime.now());
        notification.setStatus("unread");
        notificationRepository.save(notification);
        return notificationRepository.findAll();
    }

    @PutMapping("notification/{id}")
    public List<Notification> editNotification(@RequestBody Notification notification){
        if (notification.getId() == null){
            throw new RuntimeException("Cannot edit without ID");
        }
        if (!notificationRepository.existsById(notification.getId())){
            throw new RuntimeException("Booking ID doesn't exist");
        }
       notificationRepository.save(notification);
        return notificationRepository.findAll();
    }

    @DeleteMapping("notification/{id}")
    public List<Notification> deleteNotification(@PathVariable Long id){
        notificationRepository.deleteById(id);
        return notificationRepository.findAll();
    }
}
