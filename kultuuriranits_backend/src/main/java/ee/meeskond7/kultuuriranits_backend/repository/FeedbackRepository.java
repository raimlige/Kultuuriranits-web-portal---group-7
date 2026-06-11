package ee.meeskond7.kultuuriranits_backend.repository;

import ee.meeskond7.kultuuriranits_backend.entity.Feedback;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<@NonNull Feedback,@NonNull Long> {
    boolean existsByProgramIdAndPersonId(Long programId, Long personId);

    List<Feedback> findByPersonId(Long userId);
}
