package xyz.jesusohmyjesus.managecost.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiForbiddenException;
import xyz.jesusohmyjesus.managecost.model.ERole;
import xyz.jesusohmyjesus.managecost.repository.RoleRepository;
import xyz.jesusohmyjesus.managecost.security.TokenService;

import java.util.Collections;

import static xyz.jesusohmyjesus.managecost.controller.message.ErrorMessages.NO_ROLE_FOUND;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional
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
