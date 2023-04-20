package xyz.jesusohmyjesus.managecost.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.jesusohmyjesus.managecost.entities.Tag;

import java.util.UUID;

@Repository
public interface TagRepository extends CrudRepository<Tag, UUID> {
}
