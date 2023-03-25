package xyz.jesusohmyjesus.managecost.input;

import lombok.Getter;
import lombok.Setter;
import xyz.jesusohmyjesus.managecost.entities.Person;

import java.util.Set;
import java.util.UUID;

@Setter
@Getter
public class NewTrip {
    private UUID id;
    private String name;
    private String place;
    private Set<Person> persons;
}
