package ee.meeskond7.kultuuriranits_backend.controller;


import ee.meeskond7.kultuuriranits_backend.entity.Favorites;
import ee.meeskond7.kultuuriranits_backend.entity.Feedback;
import ee.meeskond7.kultuuriranits_backend.entity.Person;
import ee.meeskond7.kultuuriranits_backend.repository.FeedbackRepository;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    @GetMapping("feedback")
    public List<Feedback> getFeedback(HttpSession session){
        Long userId = (Long) session.getAttribute("user_id");
        if (userId == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Selle tegevuse jaoks pead olema sisselogitud!"
            );
        }
        return feedbackRepository.findByPersonId(userId);
    }

    @PostMapping("feedback")
    public List<Feedback> addFeedback(@RequestBody Feedback feedback){
        if (feedback.getId() != null){
            throw new RuntimeException("Cannot add with ID");
        }
        boolean alreadyAdded = feedbackRepository.existsByProgramIdAndPersonId(
                feedback.getProgram().getId(),
                feedback.getPerson().getId()
        );

        if (alreadyAdded) {throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.CONFLICT, "Sellele programmile oled juba lisanud tagasiside!");
        }
        feedbackRepository.save(feedback);
        return feedbackRepository.findAll();
    }

    @DeleteMapping("feedback/{id}")
    public List<Feedback> deleteFeedback(@PathVariable Long id){
        feedbackRepository.deleteById(id);
        return feedbackRepository.findAll();
    }
}
