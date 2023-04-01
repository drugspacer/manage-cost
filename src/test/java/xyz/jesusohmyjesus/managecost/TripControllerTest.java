package xyz.jesusohmyjesus.managecost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import xyz.jesusohmyjesus.managecost.configuration.SecurityConfig;
import xyz.jesusohmyjesus.managecost.controller.AuthController;
import xyz.jesusohmyjesus.managecost.controller.TripController;
import xyz.jesusohmyjesus.managecost.security.TokenService;

@WebMvcTest({TripController.class, AuthController.class})
@Import({SecurityConfig.class, TokenService.class})
public class TripControllerTest {
    @Autowired
    MockMvc mvc;

/*    @Test
    void rootWhenAuthenticatedThen401() throws Exception {
        this.mvc.perform(MockMvcRequestBuilders.get("/"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }*/
}
