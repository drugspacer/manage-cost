package xyz.jesusohmyjesus.managecost.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.server.Cookie;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import xyz.jesusohmyjesus.managecost.configuration.CostCountProperties;

import java.time.Duration;

@Component
public class SecurityUtils {
    public static final String CLAIMS_REFRESH_TOKEN_KEY = "refreshToken";
    public static final String CLAIMS_AUTHORITIES_KEY = "authorities";

    @Autowired
    private TokenService tokenService;

    private final CostCountProperties properties;

    @Autowired
    public SecurityUtils(CostCountProperties properties) {
        if (properties.getRefreshTokenDuration().compareTo(properties.getJwtTokenDuration()) < 0) {
            throw new IllegalArgumentException("jwt token duration cannot be greater than refresh token duration");
        }
        this.properties = properties;
    }

    public ResponseCookie createRefreshTokenCookie(Authentication authentication) {
        return buildRefreshTokenCookie(
                tokenService.generateRefreshToken(authentication),
                properties.getRefreshTokenDuration()
        );
    }

    public ResponseCookie deleteRefreshTokenCookie() {
        return buildRefreshTokenCookie("", Duration.ZERO);
    }

    private ResponseCookie buildRefreshTokenCookie(String token, Duration maxAge) {
        return ResponseCookie.from("refresh_token", token)
                .domain(properties.getHostname())
                .path("/")
                .httpOnly(true)
                .secure(properties.isHttpsEnvironment())
                .maxAge(maxAge)
                .sameSite(Cookie.SameSite.STRICT.name())
                .build();
    }
}
