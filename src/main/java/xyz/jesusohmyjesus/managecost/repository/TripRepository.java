package xyz.jesusohmyjesus.managecost.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.jesusohmyjesus.managecost.entities.Trip;

import java.util.UUID;

@Repository
public interface TripRepository extends CrudRepository<Trip, UUID> {}
