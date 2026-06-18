package ee.meeskond7.kultuuriranits_backend.repository;

import ee.meeskond7.kultuuriranits_backend.entity.Program;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {

    //Tavaline filtreerimine ainult kategooria järgi
    Page<Program> findByCategoryId(Long categoryId, Pageable pageable);

    //Otsing nime/kirjelduse järgi ILMA kategooriata
    @Query("SELECT p FROM Program p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Program> searchPrograms(@Param("keyword") String keyword, Pageable pageable);

    //Otsing nime/kirjelduse järgi JA kategooria järgi koos
    @Query("SELECT p FROM Program p WHERE " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "p.category.id = :categoryId")
    Page<Program> searchProgramsWithCategory(@Param("keyword") String keyword, @Param("categoryId") Long categoryId, Pageable pageable);



    @Query("""
      SELECT p FROM Program p
         WHERE
         (:keyword IS NULL\s
         OR p.title LIKE :keyword\s
         OR p.description LIKE :keyword )
         AND (:categoryId IS NULL OR p.category.id = :categoryId)
         AND (:organizationId IS NULL OR p.organization.id = :organizationId)
         AND (:location IS NULL OR p.location = :location)
         AND (:languages IS NULL OR EXISTS (
            SELECT l FROM Program p2 JOIN p2.languages l
            WHERE p2 = p AND l IN :languages
        ))
         AND (:pricePerStudent IS NULL OR p.pricePerStudent = :pricePerStudent)
         AND (:maxPricePerStudent IS NULL OR p.pricePerStudent <= :maxPricePerStudent)
         AND (:minPricePerStudent IS NULL OR p.pricePerStudent >= :minPricePerStudent)
         AND (:durationMinutes IS NULL OR p.durationMinutes = :durationMinutes)
         AND (:minDurationMinutes IS NULL OR p.durationMinutes >= :minDurationMinutes)
         AND (:maxDurationMinutes IS NULL OR p.durationMinutes <= :maxDurationMinutes)
         AND (:targetGroups IS NULL OR EXISTS (
              SELECT t FROM Program p2 JOIN p2.targetGroups t
              WHERE p2 = p AND t IN :targetGroups
          ))
         AND (:minGroupSize IS NULL OR p.minGroupSize >= :minGroupSize)
         AND (:maxGroupSize IS NULL OR p.maxGroupSize <= :maxGroupSize)
         AND (:outdoor IS NULL OR p.outdoor = :outdoor)
         AND (:wheelchair IS NULL OR p.wheelchair = :wheelchair)
         AND (:hev IS NULL OR p.hev = :hev)
         AND (:lak IS NULL OR p.lak = :lak)
         AND (:county IS NULL OR p.county = :county)
       \s
""")
    Page<Program> searchProgramsAll(
            @Param("keyword") String keyword,
            @Param("minPricePerStudent") BigDecimal minPricePerStudent,
            @Param("maxPricePerStudent") BigDecimal maxPricePerStudent,
            @Param("categoryId") Long categoryId,
            @Param("organizationId") Long organizationId,
            @Param("location") String location,
            @Param("languages") List<String> languages,
            @Param("pricePerStudent") BigDecimal pricePerStudent,
            @Param("durationMinutes") Integer durationMinutes,
            @Param("minDurationMinutes") Integer minDurationMinutes,
            @Param("maxDurationMinutes") Integer maxDurationMinutes,
            @Param("targetGroups") List<String> targetGroups,
            @Param("minGroupSize") Integer minGroupSize,
            @Param("maxGroupSize") Integer maxGroupSize,
            @Param("status") String status,
            @Param("lak") Boolean lak,
            @Param("hev") Boolean hev,
            @Param("outdoor") Boolean outdoor,
            @Param("wheelchair") Boolean wheelchair,
            @Param("county") String county,
            Pageable pageable
    );
}