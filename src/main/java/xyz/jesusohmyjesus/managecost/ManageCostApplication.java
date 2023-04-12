package xyz.jesusohmyjesus.managecost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import xyz.jesusohmyjesus.managecost.security.RsaKeyProperties;

import java.nio.charset.StandardCharsets;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties.class)
public class ManageCostApplication {
    public static void main(String[] args) {
        SpringApplication.run(ManageCostApplication.class, args);
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
        messageSource.setBasename("classpath:messages/messages");
        return messageSource;
    }
}
