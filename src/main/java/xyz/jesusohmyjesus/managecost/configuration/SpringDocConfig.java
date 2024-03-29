package xyz.jesusohmyjesus.managecost.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;

public class SpringDocConfig {
    @Autowired
    private CostCountProperties properties;

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI().info(new Info()
                .title("Manage Cost API")
                .description("Endpoints available in the Manage Cost API")
                .version(properties.getVersion())
                .contact(new Contact().name("drugspacer")
                        .url("https://github.com/drugspacer/manage-cost")
                        .email("icq584549567@gmail.com")
                )
        );
    }
}
