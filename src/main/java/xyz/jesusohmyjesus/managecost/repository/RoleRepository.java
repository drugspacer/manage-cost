package xyz.jesusohmyjesus.managecost.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.jesusohmyjesus.managecost.entities.Role;
import xyz.jesusohmyjesus.managecost.model.ERole;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends CrudRepository<Role, UUID> {
    Optional<Role> findByName(ERole name);
}
