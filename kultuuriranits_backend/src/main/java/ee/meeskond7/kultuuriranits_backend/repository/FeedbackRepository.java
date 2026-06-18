package ee.meeskond7.kultuuriranits_backend.repository;

import ee.meeskond7.kultuuriranits_backend.entity.Feedback;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<@NonNull Feedback,@NonNull Long> {
    boolean existsByProgramIdAndPersonId(Long programId, Long personId);

    List<Feedback> findByPersonId(Long userId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.program.id = :programId")
    Double getAverageRatingByProgramId(@Param("programId") Long programId);
}
