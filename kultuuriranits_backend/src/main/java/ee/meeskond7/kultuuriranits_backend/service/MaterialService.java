package ee.meeskond7.kultuuriranits_backend.service;

import ee.meeskond7.kultuuriranits_backend.entity.Material;
import ee.meeskond7.kultuuriranits_backend.repository.MaterialRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class MaterialService {
    private final MaterialRepository materialRepository;

    public Material findByIdAndProgramId(Long materialId, Long programId) {
        return materialRepository
                .findByIdAndProgramId(materialId, programId)
                .orElseThrow(() -> new RuntimeException("Material not found"));
    }
}
