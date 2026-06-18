package ee.meeskond7.kultuuriranits_backend.service;

import ee.meeskond7.kultuuriranits_backend.entity.Program;
import ee.meeskond7.kultuuriranits_backend.repository.FeedbackRepository;
import ee.meeskond7.kultuuriranits_backend.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ProgramRepository programRepository;

    @Transactional
    public void updateProgramAverageRating(Long programId) {
        Double avgRating = feedbackRepository.getAverageRatingByProgramId(programId);
        if (avgRating == null) {
            avgRating = 0.0;
        }
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Programmi ei leitud ID-ga: " + programId));

        program.setAverageRating(avgRating);
        programRepository.save(program);
    }

/*    @Transactional
    public Feedback saveFeedback(Feedback feedback) {
        if (feedback.getProgram() == null || feedback.getProgram().getId() == null) {
            throw new IllegalArgumentException("Tagasisidel peab olema seotud programm!");
        }
        Feedback savedFeedback = feedbackRepository.saveAndFlush(feedback);
        updateProgramAverageRating(savedFeedback.getProgram().getId());
        return savedFeedback;
    }*/
}