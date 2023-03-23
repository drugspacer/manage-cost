package xyz.jesusohmyjesus.managecost.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.collection.spi.PersistentSortedSet;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, columnDefinition = "uuid")
    private UUID id;

    @Version
    private int version;

    @Column(nullable = false, length = 32)
    @NonNull
    private String name;

    @Column(nullable = false, length = 32)
    @NonNull
    private String place;

    @Column(nullable = false, precision = 2, insertable = false, columnDefinition = "numeric")
    private BigDecimal sum;

    @Column(name = "archive")
    private boolean isArchive = false;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "trip_id", referencedColumnName = "id", nullable = false)
    private PersistentSortedSet<Activity> activities;

    @OneToMany(mappedBy = "primaryKey.trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PersonTrip> persons = new HashSet<>();
    
    public void addPerson(Person person) {
        PersonTrip personTrip = new PersonTrip(this, person);
        persons.add(personTrip);
        person.getPersonTrips().add(personTrip);
    }

    public void removePerson(Person person) {
        for (Iterator<PersonTrip> iterator = persons.iterator(); iterator.hasNext(); ) {
            PersonTrip personTrip = iterator.next();
            if (personTrip.getTrip().equals(this) && personTrip.getPerson().equals(person)) {
                iterator.remove();
                personTrip.getPerson().getPersonTrips().remove(personTrip);
            }
        }
    }
}
