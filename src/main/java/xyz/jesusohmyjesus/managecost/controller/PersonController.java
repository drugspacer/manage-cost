package xyz.jesusohmyjesus.managecost.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(description = "Get all persons for a current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "get list of persons"),
    })
    @GetMapping
    public Iterable<Person> getAll() {
        return personService.getAll();
    }
}
