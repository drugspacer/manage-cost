package xyz.jesusohmyjesus.managecost.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Version;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Activity implements Comparable<Activity> {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, columnDefinition = "uuid")
    @EqualsAndHashCode.Include
    private UUID id;

    @Version
    private int version;

    @Column(nullable = false, length = 32)
    @NonNull
    private String name;

    @Column(columnDefinition = "numeric", precision = 2)
    @NonNull
    private BigDecimal sum;

    @Column
    @Temporal(TemporalType.DATE)
    @NonNull
    private Date date;

    @OneToMany(mappedBy = "primaryKey.activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecordEntity> records = new ArrayList<>();

    @Override
    public int compareTo(Activity o) {
        return this.getDate()
                .compareTo(o.getDate());
    }
}
