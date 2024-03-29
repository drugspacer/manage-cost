package xyz.jesusohmyjesus.managecost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.entities.Person;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiException;
import xyz.jesusohmyjesus.managecost.exception.ApiForbiddenException;
import xyz.jesusohmyjesus.managecost.exception.ApiNotFoundException;
import xyz.jesusohmyjesus.managecost.repository.UserRepository;
import xyz.jesusohmyjesus.managecost.request.PasswordRq;

import java.util.Iterator;
import java.util.UUID;
import java.util.function.Supplier;

import static org.springframework.context.i18n.LocaleContextHolder.getLocale;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MessageSource messageSource;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiNotFoundException(
                        messageSource.getMessage("error.not_found.current_user", null, getLocale()))
                );
    }

    public Iterable<User> findAll() {
        return userRepository.findAll();
    }

    public User create(User newUser) {
        if (userRepository.existsByUsername(newUser.getUsername())) {
            throw new ApiForbiddenException(messageSource.getMessage(
                    "error.duplicated.user",
                    new Object[]{newUser.getUsername()},
                    getLocale()
            ));
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.getPersons()
                .forEach(person -> person.setUser(newUser));
        return userRepository.save(newUser);
    }

    public User update(User newUser) {
        return update(userRepository.findById(newUser.getId())
                .orElseThrow(throwUserNotFoundSupplier(newUser.getId().toString())), newUser);
    }

    public User update(String username, User newUser) {
        return update(userRepository.findByUsername(username)
                .orElseThrow(throwUserNotFoundSupplier(username)), newUser);
    }

    public void delete(UUID id) {
        userRepository.findById(id)
                .ifPresentOrElse(user -> userRepository.deleteById(id), throwUserNotFoundRunnable(id.toString()));
    }

    public void delete(String username) {
        userRepository.findByUsername(username)
                .ifPresentOrElse(user -> userRepository.deleteById(user.getId()), throwUserNotFoundRunnable(username));
    }

    public void changePassword(String username, PasswordRq passwords) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(throwUserNotFoundSupplier(username));
        if (!passwordEncoder.matches(passwords.getOldPassword(), user.getPassword())) {
            throw new ApiException(
                    messageSource.getMessage("error.incorrect.password", null, getLocale()),
                    HttpStatus.BAD_REQUEST
            );
        }
        user.setPassword(passwordEncoder.encode(passwords.getPassword()));
        userRepository.save(user);
    }

    private User update(User user, User newUser) {
        for (Iterator<Person> iterator = user.getPersons().iterator(); iterator.hasNext(); ) {
            Person personDb = iterator.next();
            newUser.getPersons()
                    .stream()
                    .filter(person -> personDb.getId()
                            .equals(person.getId()))
                    .findAny()
                    .ifPresentOrElse(person -> personDb.setName(person.getName()), iterator::remove);
        }
        newUser.getPersons()
                .stream()
                .filter(person -> person.getId() == null)
                .forEach(user::addPerson);
        return userRepository.save(user);
    }

    private Runnable throwUserNotFoundRunnable(String identifier) {
        return () -> {
            throw new ApiNotFoundException(
                    messageSource.getMessage("error.not_found.user", new Object[]{identifier}, getLocale())
            );
        };
    }

    private Supplier<ApiNotFoundException> throwUserNotFoundSupplier(String identifier) {
        return () -> new ApiNotFoundException(
                messageSource.getMessage("error.not_found.user", new Object[]{identifier}, getLocale())
        );
    }
}
