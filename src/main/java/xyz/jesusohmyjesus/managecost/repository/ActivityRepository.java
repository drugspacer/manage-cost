package xyz.jesusohmyjesus.managecost.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.jesusohmyjesus.managecost.entities.Activity;

import java.util.UUID;

@Repository
public interface ActivityRepository extends CrudRepository<Activity, UUID> {
}
