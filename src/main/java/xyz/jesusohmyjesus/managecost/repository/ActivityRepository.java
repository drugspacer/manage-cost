package xyz.jesusohmyjesus.managecost.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import xyz.jesusohmyjesus.managecost.entities.Activity;

import java.util.UUID;

@RepositoryRestResource
public interface ActivityRepository extends CrudRepository<Activity, UUID> {
}
