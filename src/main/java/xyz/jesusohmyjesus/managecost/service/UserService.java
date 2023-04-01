package xyz.jesusohmyjesus.managecost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.controller.EndpointMessages;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiForbiddenException;
import xyz.jesusohmyjesus.managecost.exception.ApiNotFoundException;
import xyz.jesusohmyjesus.managecost.repository.UserRepository;

import java.util.UUID;

import static xyz.jesusohmyjesus.managecost.controller.EndpointMessages.NO_USER_FOUND;
import static xyz.jesusohmyjesus.managecost.controller.EndpointMessages.USER_ALREADY_EXISTS;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiNotFoundException(EndpointMessages.CURRENT_USER_NOT_FOUND.getLabel()));
    }

    public Iterable<User> findAll() {
        return userRepository.findAll();
    }

    public User create(User newUser) {
        if (userRepository.existsByUsername(newUser.getUsername())) {
            throw new ApiForbiddenException(String.format(USER_ALREADY_EXISTS.getLabel(), newUser.getUsername()));
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return userRepository.save(newUser);
    }

    public User update(User newUser) {
        newUser.setPassword(userRepository.findById(newUser.getId())
                .orElseThrow(() -> new ApiNotFoundException(String.format(NO_USER_FOUND.getLabel(), newUser.getId())))
                .getPassword()
        );
        return userRepository.save(newUser);
    }

    public void delete(UUID id) {
        userRepository.findById(id)
                .ifPresentOrElse(userDto -> userRepository.deleteById(userDto.getId()), () -> {
            throw new ApiNotFoundException(String.format(NO_USER_FOUND.getLabel(), id));
        });
    }
}
