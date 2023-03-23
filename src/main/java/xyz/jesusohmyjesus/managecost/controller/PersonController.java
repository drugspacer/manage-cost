package xyz.jesusohmyjesus.managecost.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.entities.Person;
import xyz.jesusohmyjesus.managecost.service.PersonService;

@RestController
@RequestMapping("/persons")
public class PersonController {
    @Autowired
    PersonService personService;

    @GetMapping
    public Iterable<Person> getAll() {
        return personService.getAll();
    }
}
