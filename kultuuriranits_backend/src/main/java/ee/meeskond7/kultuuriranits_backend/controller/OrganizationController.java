package ee.meeskond7.kultuuriranits_backend.controller;


import ee.meeskond7.kultuuriranits_backend.entity.Booking;
import ee.meeskond7.kultuuriranits_backend.entity.Organization;
import ee.meeskond7.kultuuriranits_backend.repository.BookingRepository;
import ee.meeskond7.kultuuriranits_backend.repository.OrganizationRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @GetMapping("organization")
    public List<Organization> getOrganization(){
        return organizationRepository.findAll();
    }

    @GetMapping("organization/{id}")
    public Organization getOneOrganization(@PathVariable Long id){
        return organizationRepository.findById(id).orElseThrow();
    }

    @DeleteMapping("organization/{id}")
    public List<Organization> deleteOrganization(@PathVariable Long id){
        organizationRepository.deleteById(id);
        return organizationRepository.findAll();
    }

    @PostMapping("organization")
    public List<Organization> addOrganization(@RequestBody Organization organization){
        if (organization.getId() != null){
            throw new RuntimeException("Cannot add with ID");
        }
        organizationRepository.save(organization);
        return organizationRepository.findAll();
    }

    @PutMapping("organization")
    public List<Organization> editOrganization(@RequestBody Organization organization){
        if (organization.getId() == null){
            throw new RuntimeException("Cannot edit without ID");
        }
        if (!organizationRepository.existsById(organization.getId())){
            throw new RuntimeException("Booking ID doesn't exist");
        }
        organizationRepository.save(organization);
        return organizationRepository.findAll();
    }
}
