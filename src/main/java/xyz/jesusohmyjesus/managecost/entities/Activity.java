package xyz.jesusohmyjesus.managecost.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Version;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import xyz.jesusohmyjesus.managecost.response.DateOnlySerializer;

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
    @NotBlank
    @Size(max = 32)
    private String name;

    @Column(nullable = false, columnDefinition = "numeric", precision = 9, scale = 2)
    @NotNull
    @Positive
    private BigDecimal sum;

    @Column
    @Temporal(TemporalType.DATE)
    @NotNull
    @JsonSerialize(using = DateOnlySerializer.class)
    private Date date;

    @Valid
    @OneToMany(mappedBy = "primaryKey.activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecordEntity> records = new ArrayList<>();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Override
    public int compareTo(Activity o) {
        return this.getDate()
                .compareTo(o.getDate());
    }
}
