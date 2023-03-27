package xyz.jesusohmyjesus.managecost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

/*    @Autowired
    AuthenticationManager authenticationManager;*/

/*    @Autowired
    PasswordEncoder passwordEncoder;*/

    public void login(User user) {
    }
}
