package xyz.jesusohmyjesus.managecost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import xyz.jesusohmyjesus.managecost.security.RsaKeyProperties;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties.class)
public class ManageCostApplication {
    public static void main(String[] args) {
        SpringApplication.run(ManageCostApplication.class, args);
    }
}
