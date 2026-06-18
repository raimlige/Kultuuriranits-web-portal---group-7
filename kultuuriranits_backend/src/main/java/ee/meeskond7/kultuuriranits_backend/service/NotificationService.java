package ee.meeskond7.kultuuriranits_backend.service;

import ee.meeskond7.kultuuriranits_backend.entity.Notification;
import ee.meeskond7.kultuuriranits_backend.entity.Organization; // 💡 Toome sisse Organizationi
import ee.meeskond7.kultuuriranits_backend.repository.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(Organization recipientOrg, String title, String message) {
        if (recipientOrg == null) {
            System.out.println("VIGA: Teavitust ei saanud saata, kuna sihtorganisatsioon on puudu.");
            return;
        }

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("unread");
        notification.setOrganization(recipientOrg); // Seome asutusega

        notificationRepository.save(notification);
    }
}