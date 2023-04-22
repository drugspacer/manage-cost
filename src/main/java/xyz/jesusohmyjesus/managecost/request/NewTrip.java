package xyz.jesusohmyjesus.managecost.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import xyz.jesusohmyjesus.managecost.entities.Person;

import java.util.Set;
import java.util.UUID;

@Data
public class NewTrip {
    private UUID id;

    @NotBlank
    @Size(max = 32)
    private String name;

    @NotBlank
    @Size(max = 32)
    private String place;

    @NotBlank
    private String currency;

    @Valid
    private Set<Person> persons;
}
