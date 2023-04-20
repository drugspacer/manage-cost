package xyz.jesusohmyjesus.managecost.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import xyz.jesusohmyjesus.managecost.model.ETag;

import java.util.UUID;

@Entity
@Table
@Getter
@Setter
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, columnDefinition = "uuid")
    private UUID id;

    @NotNull
    @Column(unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private ETag name;
}
