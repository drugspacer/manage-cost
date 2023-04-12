package xyz.jesusohmyjesus.managecost.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.entities.Activity;
import xyz.jesusohmyjesus.managecost.entities.Person;
import xyz.jesusohmyjesus.managecost.entities.PersonTrip;
import xyz.jesusohmyjesus.managecost.entities.RecordEntity;
import xyz.jesusohmyjesus.managecost.entities.Trip;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiForbiddenException;
import xyz.jesusohmyjesus.managecost.repository.UserRepository;
import xyz.jesusohmyjesus.managecost.request.NewTrip;
import xyz.jesusohmyjesus.managecost.repository.ActivityRepository;
import xyz.jesusohmyjesus.managecost.repository.TripRepository;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static org.springframework.context.i18n.LocaleContextHolder.getLocale;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource;

    @Transactional
    public Trip createNewTrip(NewTrip data, String username) {
        Trip newTrip = new Trip(data.getName(), data.getPlace());
        User user = userService.findByUsername(username);
        data.getPersons()
                .stream()
                .filter(person -> person.getId() == null)
                .forEach(user::addPerson);
        userRepository.save(user);
        user.getPersons()
                .stream()
                .filter(person -> data.getPersons()
                        .stream()
                        .anyMatch(item -> person.getName()
                                .equals(item.getName()))
                ).forEach(newTrip::addPerson);
        newTrip.setUser(user);
        return tripRepository.save(newTrip);
    }

    public Trip createNewActivity(String username, UUID id, Activity data) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(throwNoTripFound(id));
        checkAccess(
                trip,
                username,
                messageSource.getMessage("error.forbidden.trip", new Object[]{data.getId()}, getLocale())
        );
        data.getRecords().forEach(record -> record.setActivity(data));
        trip.getActivities().add(data);
        activityRepository.save(data);
        return trip;
    }

    @Transactional
    public Trip updateTrip(String username, NewTrip data) {
        Trip trip = tripRepository.findById(data.getId())
                .orElseThrow(throwNoTripFound(data.getId()));
        checkAccess(
                trip,
                username,
                messageSource.getMessage("error.forbidden.trip", new Object[]{data.getId()}, getLocale())
        );
        trip.setName(data.getName());
        trip.setPlace(data.getPlace());
        User user = trip.getUser();
        data.getPersons()
                .stream()
                .filter(person -> person.getId() == null)
                .forEach(user::addPerson);
        userRepository.save(user);
        Set<Person> oldPersons = trip.getPersons()
                .stream()
                .map(PersonTrip::getPerson)
                .collect(Collectors.toSet());
        user.getPersons()
                .stream()
                .filter(person -> data.getPersons()
                        .stream()
                        .anyMatch(item -> person.getName()
                                .equals(item.getName()))
                        && !oldPersons.contains(person)
                ).forEach(trip::addPerson);
        oldPersons.stream()
                .filter(person -> !data.getPersons()
                        .contains(person)
                ).forEach(trip::removePerson);
        return tripRepository.save(trip);
    }

    public Trip updateActivity(String username, UUID tripId, Activity data) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(throwNoTripFound(tripId));
        checkAccess(
                trip,
                username,
                messageSource.getMessage("error.forbidden.activity", new Object[]{data.getId()}, getLocale())
        );
        data.getRecords()
                .forEach(record -> record.setActivity(data));
        activityRepository.save(data);
        return trip;
    }

    public Trip deleteActivity(String username, UUID tripId, UUID activityId) {
        checkAccess(tripId, username);
        activityRepository.deleteById(activityId);
        return tripRepository.findById(tripId)
                .orElseThrow(throwNoTripFound(tripId));
    }

    public void deleteTrip(String username, UUID id) {
        checkAccess(id, username);
        tripRepository.deleteById(id);
    }

    public Trip finishTrip(String username, UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(throwNoTripFound(id));
        checkAccess(trip, username);
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

    public Trip returnFromArchive(String username, UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(throwNoTripFound(id));
        checkAccess(trip, username);
        trip.getPersons()
                .forEach(person -> person.setSum(BigDecimal.valueOf(0)));
        trip.setArchive(false);
        return tripRepository.save(trip);
    }

    public Trip getById(String username, UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(throwNoTripFound(id));
        checkAccess(trip, username);
        trip.getActivities();
        return trip;
    }

    public Iterable<Trip> getAll(String username) {
        return tripRepository.findAllByUser(userService.findByUsername(username));
    }

    private void checkAccess(UUID tripId, String username) {
        tripRepository.findById(tripId)
                .ifPresentOrElse(
                        trip -> checkAccess(
                                trip,
                                username,
                                messageSource.getMessage("error.forbidden.delete", null, getLocale())
                        ),
                        () -> {
                            throw new ApiForbiddenException(messageSource.getMessage(
                                    "error.not_found.trip",
                                    new Object[]{tripId},
                                    getLocale()
                            ));
                        }
                );
    }

    private void checkAccess(Trip trip, String username) {
        if (!trip.getUser()
                .getUsername()
                .equals(username)) {
            throw new ApiForbiddenException(
                    messageSource.getMessage("error.forbidden.default", null, getLocale())
            );
        }
    }

    private void checkAccess(Trip trip, String username, String message) {
        if (!trip.getUser()
                .getUsername()
                .equals(username)) {
            throw new ApiForbiddenException(message);
        }
    }

    private Supplier<ApiForbiddenException> throwNoTripFound(UUID id) {
        return () -> new ApiForbiddenException(
                messageSource.getMessage("error.not_found.trip", new Object[]{id}, getLocale())
        );
    }
}
