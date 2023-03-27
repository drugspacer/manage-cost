package xyz.jesusohmyjesus.managecost.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.jesusohmyjesus.managecost.entities.Activity;

import java.util.UUID;

public interface ActivityRepository extends CrudRepository<Activity, UUID> {
}
