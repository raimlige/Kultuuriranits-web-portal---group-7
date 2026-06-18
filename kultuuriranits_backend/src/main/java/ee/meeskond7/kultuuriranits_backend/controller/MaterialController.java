package ee.meeskond7.kultuuriranits_backend.controller;

import ee.meeskond7.kultuuriranits_backend.entity.Material;
import ee.meeskond7.kultuuriranits_backend.repository.MaterialRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @GetMapping("material")
    public Page<Material> getMaterial(Pageable pageable) {
        return materialRepository.findAll(pageable);
    }

    @DeleteMapping("material/{id}")
    public List<Material> deleteMaterial(@PathVariable Long id){
        materialRepository.deleteById(id);
        return materialRepository.findAll();
    }

    @GetMapping("material/{id}/download")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long id) {
        Optional<Material> materialOptional = materialRepository.findById(id);

        if (materialOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Material material = materialOptional.get();
        byte[] fileBytes = material.getFileData();

        if (fileBytes == null) {
            return ResponseEntity.badRequest().build();
        }

        ByteArrayResource resource = new ByteArrayResource(fileBytes);
        String fileName = material.getName() != null ? material.getName() : "allalaaditud_fail";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(fileBytes.length)
                .body(resource);
    }
}