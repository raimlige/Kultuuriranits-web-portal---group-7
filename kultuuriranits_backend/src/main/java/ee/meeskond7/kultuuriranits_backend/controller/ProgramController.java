package ee.meeskond7.kultuuriranits_backend.controller;

import ee.meeskond7.kultuuriranits_backend.entity.Organization;
import ee.meeskond7.kultuuriranits_backend.entity.Program;
import ee.meeskond7.kultuuriranits_backend.repository.ProgramRepository;
import ee.meeskond7.kultuuriranits_backend.service.ProgramService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
public class ProgramController {

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private ProgramService programService;


    // GET Programs
    // http://localhost:5050/program?categoryId=3 <-- Filtreerib kategooria järgi
    @GetMapping("/program")
    public Page<Program> getProgram(
            @RequestParam(required = false) Long categoryId,
            Pageable pageable) {

        if (categoryId != null) {
            return programRepository.findByCategoryId(categoryId, pageable);
        }

        return programRepository.findAll(pageable);
    }

    // pildid programmidele
    @GetMapping("/program/{programId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable Long programId){

        Program program = programService.getProgramById(programId);
        byte[] imageFile = program.getImageData();

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(program.getImageType()))
                .body(imageFile);
    }

    // search bar programmide jaoks
    // http://localhost:5050/program/search?keyword=teater&categoryId=3
    @GetMapping("/program/search")
    public ResponseEntity<Page<Program>> searchPrograms(
            @RequestParam String keyword,
            @RequestParam(required = false) Long categoryId,
            Pageable pageable){

        System.out.println("searching with keyword: " + keyword + " and categoryId: " + categoryId);

        Page<Program> programs = programService.searchPrograms(keyword, categoryId, pageable);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    @GetMapping("/program/searchall")
    public ResponseEntity<Page<Program>> searchProgramsAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) BigDecimal pricePerStudent,
            @RequestParam(required = false) Integer durationMinutes,
            @RequestParam(required = false) String targetGroup,
            @RequestParam(required = false) Integer minGroupSize,
            @RequestParam(required = false) Integer maxGroupSize,
            @RequestParam(required = false) String status,
            Pageable pageable){

        System.out.println("searching with keyword: " + keyword + " and categoryId: " + categoryId);

        Page<Program> programs = programService.searchProgramsAll(keyword, categoryId, location, language, pricePerStudent,
                durationMinutes, targetGroup, minGroupSize,maxGroupSize, status, pageable);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    // Yks programm id kaudu
    @GetMapping("/program/{id}")
    public Program getOneProgram(@PathVariable Long id){
        return programRepository.findById(id).orElseThrow();
    }


    // Programmi lisamine
    @PostMapping("/program")
    public ResponseEntity<?> addProgram (@RequestPart Program program,
                                         @RequestPart MultipartFile imageFile, HttpSession session){
        try {
            Long orgId = (Long) session.getAttribute("organization_id");

            if (orgId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Sessioon puudub või sul pole õigust selle organisatsiooni alt programme lisada.");
            }

            Organization org = new Organization();
            org.setId(orgId);
            program.setOrganization(org);

            Program program1 = programService.addProgram(program, imageFile);
            return new ResponseEntity<>(program1, HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Programmi kustutamine
    @DeleteMapping("/program/{id}")
    public List<Program> deleteProgram(@PathVariable Long id){
        programRepository.deleteById(id);
        return programRepository.findAll();
    }

    // Programmi update
    @PutMapping("/program")
    public List<Program> editProgram(@RequestBody Program program){
        if (program.getId() == null){
            throw new RuntimeException("Cannot edit without ID");
        }
        if (!programRepository.existsById(program.getId())){
            throw new RuntimeException("Booking ID doesn't exist");
        }
        programRepository.save(program);
        return programRepository.findAll();
    }

}