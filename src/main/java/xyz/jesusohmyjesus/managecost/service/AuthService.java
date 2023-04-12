package xyz.jesusohmyjesus.managecost.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
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

import static org.springframework.context.i18n.LocaleContextHolder.getLocale;

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

    @Autowired
    private MessageSource messageSource;

    @Transactional
    public String register(User user) {
        user.setRoles(Collections.singleton(roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> {
                    throw new ApiForbiddenException(
                            messageSource.getMessage("error.not_found.role", new Object[]{ERole.USER}, getLocale())
                    );
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
