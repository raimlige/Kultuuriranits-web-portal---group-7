package ee.meeskond7.kultuuriranits_backend.repository;

import ee.meeskond7.kultuuriranits_backend.entity.Organization;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<@NonNull Organization,@NonNull Long> {
}
