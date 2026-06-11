package ee.meeskond7.kultuuriranits_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.math.BigDecimal;
import java.sql.Types;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal pricePerStudent;

    private Integer durationMinutes;

    private String targetGroup;

    private Integer minGroupSize;

    private Integer maxGroupSize;

    private String location;

    private String language;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String imageName;
    private String imageType;
    @Lob
    @JsonIgnore
    @JdbcTypeCode(Types.BINARY)
    private byte[] imageData;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Organization organization;
}