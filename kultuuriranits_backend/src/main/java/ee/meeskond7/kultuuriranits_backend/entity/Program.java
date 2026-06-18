package ee.meeskond7.kultuuriranits_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.math.BigDecimal;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    private String shortDescription;

    private String connection;

    @ElementCollection
    @CollectionTable(
            name = "program_connection_keys",
            joinColumns = @JoinColumn(name = "program_id")
    )
    @Column(name = "connection_key")
    private List<String> connectionKeys = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "program_languages",
            joinColumns = @JoinColumn(name = "program_id")
    )
    @Column(name = "language1")
    private List<String> languages = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "program_target_groups",
            joinColumns = @JoinColumn(name = "program_id")
    )
    @Column(name = "connection_group1")
    private List<String> targetGroups = new ArrayList<>();

    private BigDecimal pricePerStudent;

    private Integer durationMinutes;

    //private String targetGroup;

    private Integer minGroupSize;

    private Integer maxGroupSize;

    private String location;

    //private String language;

    private String status;

    private Boolean wheelchair;

    private Boolean outdoor;

    private Boolean hev;

    private Boolean lak;

    private String addInfo;

    private String contactEmail;

    private String contactPhone;

    private String address;

    private String county;
    private Double averageRating;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String imageName;
    private String imageType;
    @Lob
    @JsonIgnore
    //@JdbcTypeCode(Types.BINARY)
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Organization organization;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Material> materials;

    public void addMaterial(Material material) {
        if (materials == null) {
            materials = new ArrayList<>();
        }
        materials.add(material);
        material.setProgram(this);
    }

    public void removeMaterial(Material material) {
        materials.remove(material);
        material.setProgram(null);
    }
}