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
@Table(name = "record")
@AssociationOverrides({
        @AssociationOverride(name = "primaryKey.person", joinColumns = @JoinColumn(name = "person_id")),
        @AssociationOverride(name = "primaryKey.activity", joinColumns = @JoinColumn(name = "activity_id"))
})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class RecordEntity {
    @EmbeddedId
    @EqualsAndHashCode.Include
    private final RecordId primaryKey = new RecordId();

    @Transient
    public Person getPerson() {
        return primaryKey.getPerson();
    }

    public void setPerson(Person person) {
        primaryKey.setPerson(person);
    }

    @Transient
    @JsonIgnore
    public Activity getActivity() {
        return primaryKey.getActivity();
    }

    public void setActivity(Activity activity) {
        primaryKey.setActivity(activity);
    }

    public RecordEntity(Activity activity, Person person) {
        setPerson(person);
        setActivity(activity);
    }

    @Getter
    @Setter
    @Column(name = "land_money", columnDefinition = "numeric", precision = 2)
    private BigDecimal landMoney;

    @Getter
    @Setter
    @Column(name = "borrow_money", columnDefinition = "numeric", precision = 2)
    private BigDecimal borrowMoney;
}
