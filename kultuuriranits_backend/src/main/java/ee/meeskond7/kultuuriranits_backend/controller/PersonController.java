package ee.meeskond7.kultuuriranits_backend.controller;

import ee.meeskond7.kultuuriranits_backend.dto.PersonLoginRecordDto;
import ee.meeskond7.kultuuriranits_backend.entity.Booking;
import ee.meeskond7.kultuuriranits_backend.entity.Category;
import ee.meeskond7.kultuuriranits_backend.entity.Person;
import ee.meeskond7.kultuuriranits_backend.entity.Program;
import ee.meeskond7.kultuuriranits_backend.repository.PersonRepository;
import ee.meeskond7.kultuuriranits_backend.service.PersonService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(
        origins = {"http://localhost:3000/", "http://127.0.0.1:3000"},
        allowCredentials = "true"
)
@RestController
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PersonService personService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Sisselogimise kontroll (Next.js küsib seda lehe laadimisel)
    @GetMapping("/me")
    public ResponseEntity<Person> getMe(HttpSession session) {
        Long personId = (Long) session.getAttribute("user_id");
        if (personId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(personRepository.findById(personId).orElseThrow());
    }

    // Registreerimine
    @PostMapping("/signup")
    public ResponseEntity<Person> signup(@RequestBody Person person, HttpServletRequest request) {

        person.setPassword(personService.hashPassword(person.getPassword()));
        Person savedPerson = personRepository.save(person);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(person.getEmail(), person.getPassword())
            );
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

            session.setAttribute("user_id", savedPerson.getId());
            session.setAttribute("user_role", savedPerson.getRole().getName());
            if (savedPerson.getOrganization() != null) {
                session.setAttribute("organization_id", savedPerson.getOrganization().getId());
            }
        } catch (Exception e) {
            return ResponseEntity.ok(savedPerson);
        }

        return ResponseEntity.ok(savedPerson);
    }

    // Sisselogimine
    @PostMapping("/login")
    public ResponseEntity<Person> login(@RequestBody PersonLoginRecordDto personDto, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(personDto.email(), personDto.password())
            );

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

            Person dbPerson = personRepository.findByEmail(personDto.email());

            session.setAttribute("user_id", dbPerson.getId());
            session.setAttribute("user_role", dbPerson.getRole().getName());
            if (dbPerson.getOrganization() != null) {
                session.setAttribute("organization_id", dbPerson.getOrganization().getId());
            }

            return ResponseEntity.ok(dbPerson);

        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // Kasutajaandmete muutmine
    @PutMapping("/profile")
    public ResponseEntity<Person> updateProfile(@RequestBody Person person, HttpSession session) {
        Long loggedInUserId = (Long) session.getAttribute("user_id");
        if (loggedInUserId == null || !loggedInUserId.equals(person.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Person existingPerson = personRepository.findById(person.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kasutajat ei leitud"));
        if (person.getPassword() != null && !person.getPassword().isBlank()) {
            String hashedPassword = personService.hashPassword(person.getPassword());
            person.setPassword(hashedPassword);
        } else {
            person.setPassword(existingPerson.getPassword());
        }
        return ResponseEntity.ok(personRepository.save(person));
    }


    //ADMIN JAOKS

    @GetMapping("/users")
    public List<Person> getUsers(){
        return personRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public Person getOnePerson(@PathVariable Long id){
        return personRepository.findById(id).orElseThrow();
    }

    @PutMapping("/users/{id}")
    public List<Person> editPerson(@RequestBody Person person){
        if (person.getId() == null){
            throw new RuntimeException("Cannot edit without ID");
        }
        if (!personRepository.existsById(person.getId())){
            throw new RuntimeException("Person ID doesn't exist");
        }
        person.setPassword(personService.hashPassword(person.getPassword()));
        personRepository.save(person);
        return personRepository.findAll();
    }

    @DeleteMapping("users/{id}")
    public List<Person> deletePerson(@PathVariable Long id){
        personRepository.deleteById(id);
        return personRepository.findAll();
    }
}