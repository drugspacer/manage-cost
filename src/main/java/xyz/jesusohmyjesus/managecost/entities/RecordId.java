package xyz.jesusohmyjesus.managecost.entities;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class RecordId implements Serializable {
    @ManyToOne
    private Activity activity;

    @ManyToOne
    private Person person;
}
