package ee.meeskond7.kultuuriranits_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String name;
    private String fileType;
    @Lob
    @JsonIgnore
    @Column(columnDefinition = "LONGBLOB")
    //@JdbcTypeCode(Types.BINARY)
    private byte[] fileData;

    @ManyToOne
    @JoinColumn(name = "program_id")
    @JsonBackReference
    private Program program;
}
