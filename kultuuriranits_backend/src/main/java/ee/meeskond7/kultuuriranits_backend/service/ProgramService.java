package ee.meeskond7.kultuuriranits_backend.service;

import ee.meeskond7.kultuuriranits_backend.entity.Program;
import ee.meeskond7.kultuuriranits_backend.repository.ProgramRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class ProgramService {

    private final ProgramRepository programRepository;

    // Programmide otsing
    public Page<Program> searchPrograms(String keyword, Long categoryId, Pageable pageable) {
        if (categoryId != null) {
            return programRepository.searchProgramsWithCategory(keyword, categoryId, pageable);
        }
        return programRepository.searchPrograms(keyword, pageable);
    }



    public Page<Program> searchProgramsAll(String keyword, Long categoryId, String location, String language, BigDecimal pricePerStudent, Integer durationMinutes, String targetGroup, Integer minGroupSize, Integer maxGroupSize, String status, Pageable pageable) {
        
        return programRepository.searchProgramsAll((keyword==null)?null:"%"+keyword.toLowerCase()+"%", categoryId, location, language, pricePerStudent, durationMinutes, targetGroup, minGroupSize,maxGroupSize, status, pageable);
    }


    // Programmide lisamine
    public Program addProgram(Program program, MultipartFile imageFile) throws IOException {
        program.setCreatedAt(LocalDateTime.now());
        program.setUpdatedAt(LocalDateTime.now());

        program.setImageName(imageFile.getOriginalFilename());
        program.setImageType(imageFile.getContentType());
        program.setImageData(imageFile.getBytes());

        return programRepository.save(program);
    }
    public Program getProgramById(Long id) {
        return programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programmi ei leitud ID-ga: " + id));
    }
}