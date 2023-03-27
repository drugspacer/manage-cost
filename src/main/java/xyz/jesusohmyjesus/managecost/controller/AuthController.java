package xyz.jesusohmyjesus.managecost.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.security.TokenService;
import xyz.jesusohmyjesus.managecost.service.AuthService;

@RestController
public class AuthController {
    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    TokenService tokenService;

    @Autowired
    AuthService authService;

    @GetMapping(value = "/login")
    public void getLogin() {}

    @GetMapping(value = "/register")
    public void getRegister() {}

    @PostMapping(value = "/login")
    public void login(@RequestBody User user) {
        authService.login(user);
    }

    @PostMapping(value = "/register")
    public void register(@RequestBody User user) {
        authService.login(user);
    }

    @PostMapping("/token")
    public String token(Authentication authentication) {
        LOG.debug("Token requested for user: '{}'", authentication.getName());
        String token = tokenService.generateToken(authentication);
        LOG.debug("Token granted {}", token);
        return token;
    }
}
