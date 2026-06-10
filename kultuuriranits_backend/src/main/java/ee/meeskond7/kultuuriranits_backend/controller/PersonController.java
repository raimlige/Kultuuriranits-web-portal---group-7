package ee.meeskond7.kultuuriranits_backend.controller;

import ee.meeskond7.kultuuriranits_backend.dto.PersonLoginRecordDto;
import ee.meeskond7.kultuuriranits_backend.entity.Category;
import ee.meeskond7.kultuuriranits_backend.entity.Person;
import ee.meeskond7.kultuuriranits_backend.repository.PersonRepository;
import ee.meeskond7.kultuuriranits_backend.service.PersonService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Person> signup(@RequestBody Person person, HttpSession session) {
        //personService.validate(person, true); <-- valideerib isikukoodi õigsust: arenduse ajal võiks olla välja kommenteeritud.

        // Parooli krüpteerimine
        person.setPassword(personService.hashPassword(person.getPassword()));
        Person savedPerson = personRepository.save(person);

        session.setAttribute("user_id", savedPerson.getId());
        session.setAttribute("user_role", person.getRole().getName());
        return ResponseEntity.ok(savedPerson);
    }

    // Sisselogimine
    @PostMapping("/login")
    public ResponseEntity<Person> login(@RequestBody PersonLoginRecordDto personDto, HttpSession session) {
        Person dbPerson = personRepository.findByEmail(personDto.email());
        if (dbPerson == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Parooli kontroll
        if (!personService.checkPassword(personDto.password(), dbPerson.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Sessiooni loomine
        session.setAttribute("user_id", dbPerson.getId());
        session.setAttribute("user_role", dbPerson.getRole().getName());
        return ResponseEntity.ok(dbPerson);
    }

/*    // Väljalogimine
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate(); // Hävitab sessiooni serveris
        return ResponseEntity.ok().build();
    }*/

    // Kasutajaandmete muutmine
    @PutMapping("/profile")
    public ResponseEntity<Person> updateProfile(@RequestBody Person person, HttpSession session) {
        Long loggedInUserId = (Long) session.getAttribute("user_id");
        if (loggedInUserId == null || !loggedInUserId.equals(person.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        //personService.validate(person, false);
        if (person.getPassword() != null && !person.getPassword().isBlank()) {
            String hashedPassword = personService.hashPassword(person.getPassword());
            person.setPassword(hashedPassword);
        }
        return ResponseEntity.ok(personRepository.save(person));
    }


    //ADMIN JAOKS

    @GetMapping("/users")
    public List<Person> getUsers(){
        return personRepository.findAll();
    }
}