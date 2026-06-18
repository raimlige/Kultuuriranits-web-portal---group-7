package ee.meeskond7.kultuuriranits_backend.service;

import ee.meeskond7.kultuuriranits_backend.entity.Material;
import ee.meeskond7.kultuuriranits_backend.entity.Program;
import ee.meeskond7.kultuuriranits_backend.repository.MaterialRepository;
import ee.meeskond7.kultuuriranits_backend.repository.ProgramRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final MaterialRepository materialRepository;

    // Programmide otsing
    public Page<Program> searchPrograms(String keyword, Long categoryId, Pageable pageable) {
        if (categoryId != null) {
            return programRepository.searchProgramsWithCategory(keyword, categoryId, pageable);
        }
        return programRepository.searchPrograms(keyword, pageable);
    }



    public Page<Program> searchProgramsAll(String keyword,BigDecimal minPricePerStudent, BigDecimal maxPricePerStudent, Long categoryId, Long organizationId, String location, List<String> languages, BigDecimal pricePerStudent, Integer durationMinutes, Integer minDurationMinutes,Integer maxDurationMinutes ,List<String> targetGroups, Integer minGroupSize, Integer maxGroupSize, String status,Boolean lak, Boolean hev, Boolean outdoor, Boolean wheelchair, String county, Pageable pageable) {

        return programRepository.searchProgramsAll((keyword==null)?null:"%"+keyword.toLowerCase()+"%",minPricePerStudent, maxPricePerStudent, categoryId, organizationId, location, languages, pricePerStudent, durationMinutes,minDurationMinutes, maxDurationMinutes, targetGroups, minGroupSize,maxGroupSize, status, lak, hev, outdoor, wheelchair,county, pageable);
    }



    // Programmide lisamine
    public Program addProgram(Program program, MultipartFile imageFile, List<MultipartFile> materialFiles, List<String> materialTitles) throws IOException {
        program.setCreatedAt(LocalDateTime.now());
        program.setUpdatedAt(LocalDateTime.now());

        program.setImageName(imageFile.getOriginalFilename());
        program.setImageType(imageFile.getContentType());
        program.setImageData(imageFile.getBytes());

        for (int i = 0; i < materialFiles.size(); i++) {
            MultipartFile file = materialFiles.get(i);

            Material m = new Material();

            if (materialTitles != null && i < materialTitles.size()) {
                m.setTitle(materialTitles.get(i));
            }

            m.setName(file.getOriginalFilename());
            m.setFileType(file.getContentType());
            m.setFileData(file.getBytes());

            program.addMaterial(m);
        }

        return programRepository.save(program);
    }
    public Program getProgramById(Long id) {
        return programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programmi ei leitud ID-ga: " + id));
    }


    public Program updateProgram(Long id, Program incomingProgram, MultipartFile imageFile, List<MultipartFile> materialFiles, List<String> materialTitles) throws IOException {
        Program existingProgram = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programmi ei leitud ID-ga: " + id));
        existingProgram.setUpdatedAt(LocalDateTime.now());

        // programmi atribuudid
        existingProgram.setTitle(incomingProgram.getTitle());
        existingProgram.setDescription(incomingProgram.getDescription());
        existingProgram.setShortDescription(incomingProgram.getShortDescription());
        existingProgram.setConnection(incomingProgram.getConnection());
        existingProgram.setConnectionKeys(incomingProgram.getConnectionKeys());
        existingProgram.setAddInfo(incomingProgram.getAddInfo());
        existingProgram.setContactEmail(incomingProgram.getContactEmail());
        existingProgram.setContactPhone(incomingProgram.getContactPhone());
        existingProgram.setAddress(incomingProgram.getAddress());
        existingProgram.setCounty(incomingProgram.getCounty());
        existingProgram.setPricePerStudent(incomingProgram.getPricePerStudent());
        existingProgram.setDurationMinutes(incomingProgram.getDurationMinutes());
        existingProgram.setTargetGroups(incomingProgram.getTargetGroups());
        existingProgram.setMinGroupSize(incomingProgram.getMinGroupSize());
        existingProgram.setMaxGroupSize(incomingProgram.getMaxGroupSize());
        existingProgram.setLocation(incomingProgram.getLocation());
        existingProgram.setLanguages(incomingProgram.getLanguages());
        existingProgram.setStatus(incomingProgram.getStatus());
        existingProgram.setLak(incomingProgram.getLak());
        existingProgram.setHev(incomingProgram.getHev());
        existingProgram.setOutdoor(incomingProgram.getOutdoor());
        existingProgram.setWheelchair(incomingProgram.getWheelchair());

        if (incomingProgram.getCategory() != null) {
            existingProgram.setCategory(incomingProgram.getCategory());
        }

        if (incomingProgram.getOrganization() != null) {
            existingProgram.setOrganization(incomingProgram.getOrganization());
        }

        // 5. Pildifaili uuendamise kontroll
        if (imageFile != null && !imageFile.isEmpty()) {
            existingProgram.setImageName(imageFile.getOriginalFilename());
            existingProgram.setImageType(imageFile.getContentType());
            existingProgram.setImageData(imageFile.getBytes());
        }

        for (Material material : new ArrayList<>(existingProgram.getMaterials())) {
            existingProgram.removeMaterial(material);
        }

        if (incomingProgram.getMaterials() != null) {
            for (Material material : incomingProgram.getMaterials()) {
                Material existingMaterial =
                        materialRepository.findById(material.getId())
                                .orElseThrow();

                existingProgram.addMaterial(existingMaterial);
            }
        }
        if (materialFiles != null && !materialFiles.isEmpty()) {
            for (int i = 0; i < materialFiles.size(); i++) {
                MultipartFile file = materialFiles.get(i);

                Material m = new Material();

                if (materialTitles != null && i < materialTitles.size()) {
                    m.setTitle(materialTitles.get(i));
                }

                m.setName(file.getOriginalFilename());
                m.setFileType(file.getContentType());
                m.setFileData(file.getBytes());

                existingProgram.addMaterial(m);
            }
        }

        return programRepository.save(existingProgram);
    }
}