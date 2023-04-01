package xyz.jesusohmyjesus.managecost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.AssociationOverride;
import jakarta.persistence.AssociationOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "person_trip")
@AssociationOverrides({
        @AssociationOverride(name = "primaryKey.person", joinColumns = @JoinColumn(name = "person_id")),
        @AssociationOverride(name = "primaryKey.trip", joinColumns = @JoinColumn(name = "trip_id"))
})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class PersonTrip {
    @EmbeddedId
    @EqualsAndHashCode.Include
    private final PersonTripId primaryKey = new PersonTripId();

    @Transient
    public Person getPerson() {
        return primaryKey.getPerson();
    }

    public void setPerson(Person person) {
        primaryKey.setPerson(person);
    }

    @Transient
    @JsonIgnore
    public Trip getTrip() {
        return primaryKey.getTrip();
    }

    public void setTrip(Trip trip) {
        primaryKey.setTrip(trip);
    }

    public PersonTrip(Trip trip, Person person) {
        setPerson(person);
        setTrip(trip);
    }

    @Setter
    @Getter
    @Column(precision = 2, insertable = false, columnDefinition = "numeric")
    private BigDecimal sum;
}
