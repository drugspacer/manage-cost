package xyz.jesusohmyjesus.managecost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiForbiddenException;
import xyz.jesusohmyjesus.managecost.model.ERole;
import xyz.jesusohmyjesus.managecost.repository.RoleRepository;
import xyz.jesusohmyjesus.managecost.repository.UserRepository;
import xyz.jesusohmyjesus.managecost.security.JpaUserDetailsService;
import xyz.jesusohmyjesus.managecost.security.SecurityUtils;
import xyz.jesusohmyjesus.managecost.security.TokenService;

import java.util.Collections;

import static xyz.jesusohmyjesus.managecost.controller.EndpointMessages.NO_ROLE_FOUND;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JpaUserDetailsService userDetailsService;

    @Autowired
    TokenService tokenService;

    @Autowired
    SecurityUtils securityUtils;

    @Autowired
    UserService userService;

    @Autowired
    RoleRepository roleRepository;

    public String register(User user) {
        user.setRoles(Collections.singleton(roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> {
                    throw new ApiForbiddenException(String.format(NO_ROLE_FOUND.getLabel(), ERole.USER));
                })
        ));
        String password = user.getPassword();
        userService.create(user);
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                user.getUsername(), password
        ));
        SecurityContextHolder.getContext()
                .setAuthentication(authentication);
        return tokenService.generateToken(authentication);
    }

    public String createToken(Authentication authentication) {
        return tokenService.generateToken(authentication);
    }
}
