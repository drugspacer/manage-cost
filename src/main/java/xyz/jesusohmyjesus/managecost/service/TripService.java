package xyz.jesusohmyjesus.managecost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.entities.Activity;
import xyz.jesusohmyjesus.managecost.entities.Person;
import xyz.jesusohmyjesus.managecost.entities.PersonTrip;
import xyz.jesusohmyjesus.managecost.entities.RecordEntity;
import xyz.jesusohmyjesus.managecost.entities.Trip;
import xyz.jesusohmyjesus.managecost.input.NewTrip;
import xyz.jesusohmyjesus.managecost.repository.ActivityRepository;
import xyz.jesusohmyjesus.managecost.repository.TripRepository;
import xyz.jesusohmyjesus.managecost.repository.PersonRepository;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ActivityRepository activityRepository;

    public Trip createNewTrip(NewTrip data) {
        Trip newTrip = new Trip(data.getName(), data.getPlace());
        data.getPersons()
                .stream()
                .filter(item -> item.getId() == null)
                .forEach(item -> personRepository.save(item));
        data.getPersons()
                .forEach(newTrip::addPerson);
        return tripRepository.save(newTrip);
    }

    public Trip createNewActivity(UUID id, Activity data) {
        Trip trip = tripRepository.findById(id).orElseThrow();
        data.getRecords().forEach(record -> record.setActivity(data));
        trip.getActivities().add(data);
        activityRepository.save(data);
        return trip;
    }

    public Trip updateTrip(NewTrip data) {
        Trip trip = tripRepository.findById(data.getId())
                .orElseThrow();
        trip.setName(data.getName());
        trip.setPlace(data.getPlace());
        data.getPersons()
                .stream()
                .filter(item -> item.getId() == null)
                .forEach(item -> personRepository.save(item));
        Set<Person> oldPersons = trip.getPersons()
                .stream()
                .map(PersonTrip::getPerson)
                .collect(Collectors.toSet());
        data.getPersons()
                .stream()
                .filter(person -> !oldPersons.contains(person))
                .forEach(trip::addPerson);
        oldPersons.stream()
                .filter(person -> !data.getPersons().contains(person))
                .forEach(trip::removePerson);
        return tripRepository.save(trip);
    }

    public Trip updateActivity(UUID tripId, Activity data) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow();
        data.getRecords()
                .forEach(record -> record.setActivity(data));
        activityRepository.save(data);
        return trip;
    }

    public Trip deleteActivity(UUID tripId, UUID activityId) {
        activityRepository.deleteById(activityId);
        return tripRepository.findById(tripId).orElseThrow();
    }

    public void deleteTrip(UUID id) {
        tripRepository.deleteById(id);
    }

    public Trip finishTrip(UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow();
        Map<Person, PersonTrip> personsMap = trip.getPersons()
                .stream()
                .collect(Collectors.toMap(PersonTrip::getPerson, Function.identity()));
        trip.getActivities()
                .forEach(activity -> {
                    BigDecimal sum = activity.getSum();
                    List<RecordEntity> records = activity.getRecords();
                    records.forEach(record -> {
                        PersonTrip person = personsMap.get(record.getPerson());
                        BigDecimal personSum = person.getSum();
                        if (record.getBorrowMoney() != null) {
                            personSum = personSum.subtract(record.getBorrowMoney());
                        } else {
                            personSum = personSum.subtract(sum.divide(
                                    BigDecimal.valueOf(records.size()),
                                    MathContext.DECIMAL128
                            ));
                        }
                        if (record.getLandMoney() != null) {
                            personSum = personSum.add(record.getLandMoney());
                        }
                        person.setSum(personSum.setScale(2, RoundingMode.HALF_UP));
                    });
                });
        trip.setArchive(true);
        return tripRepository.save(trip);
    }

    public Trip returnFromArchive(UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow();
        trip.getPersons()
                .forEach(person -> person.setSum(BigDecimal.valueOf(0)));
        trip.setArchive(false);
        return tripRepository.save(trip);
    }

    public Trip getById(UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow();
        trip.getActivities();
        return trip;
    }

    public Iterable<Trip> getAll() {
        return tripRepository.findAll();
    }
}