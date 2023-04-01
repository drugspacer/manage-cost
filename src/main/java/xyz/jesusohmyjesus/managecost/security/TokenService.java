package xyz.jesusohmyjesus.managecost.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.configuration.CostCountProperties;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
public class TokenService {
    @Autowired
    private JwtEncoder encoder;

    @Autowired
    private CostCountProperties properties;

    public String generateToken(Authentication authentication) {
        return buildToken(authentication, properties.getJwtTokenDuration(), claims -> {
            claims.put(SecurityUtils.CLAIMS_REFRESH_TOKEN_KEY, false);
            claims.put(SecurityUtils.CLAIMS_AUTHORITIES_KEY, authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(" ")));
        });
    }

    public String generateRefreshToken(Authentication authentication) {
        return buildToken(
                authentication,
                properties.getRefreshTokenDuration(),
                claims -> claims.put(SecurityUtils.CLAIMS_REFRESH_TOKEN_KEY, true)
        );
    }

    private String buildToken(Authentication authentication, Duration duration, Consumer<Map<String, Object>> claims) {
        Instant now = Instant.now();
        return this.encoder.encode(JwtEncoderParameters.from(JwtClaimsSet.builder()
                .id(UUID.randomUUID()
                        .toString()
                ).issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(duration))
                .subject(authentication.getName())
                .claims(claims)
                .build()
        )).getTokenValue();
    }
}
