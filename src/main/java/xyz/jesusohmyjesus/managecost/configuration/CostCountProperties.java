package xyz.jesusohmyjesus.managecost.configuration;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Component
@Validated
@Getter
@Setter
@ConfigurationProperties(prefix = "cost-count")
public class CostCountProperties {
    /**
     * The current version. This is set use Spring Boot's automatic
     * property expansion.
     */
    private String version;
    /**
     * What origins to allow access from
     */
    private String[] corsAllowedOrigins;
    /**
     * How long JWT tokens are good for
     */
    @NonNull
    private Duration jwtTokenDuration;
    /**
     * How long JWT refresh tokens are good for
     */
    @NotNull
    private Duration refreshTokenDuration;
    /**
     * The hostname of the environment
     */
    @NotEmpty
    private String hostname;

    public boolean isHttpsEnvironment() {
        return !"localhost".equals(hostname);
    }
}
