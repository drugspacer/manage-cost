package xyz.jesusohmyjesus.managecost.request;

import lombok.Data;
import xyz.jesusohmyjesus.managecost.entities.Person;

import java.util.Set;
import java.util.UUID;

@Data
public class NewTrip {
    private UUID id;
    private String name;
    private String place;
    private Set<Person> persons;
}
