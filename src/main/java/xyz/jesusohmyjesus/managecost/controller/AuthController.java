package xyz.jesusohmyjesus.managecost.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiErrorResponse;
import xyz.jesusohmyjesus.managecost.response.MessageResponse;
import xyz.jesusohmyjesus.managecost.security.SecurityUtils;
import xyz.jesusohmyjesus.managecost.service.AuthService;

import static org.springframework.http.HttpHeaders.SET_COOKIE;

@RestController
@RequestMapping(Endpoints.AUTH)
public class AuthController {
    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private AuthService authService;

    @Autowired
    private MessageSource messageSource;

    @Operation(description = "Registration new user endpoint")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "token and refresh token created, user created"),
            @ApiResponse(
                    responseCode = "403",
                    description = "user already exists",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping(Endpoints.REGISTER)
    public ResponseEntity<MessageResponse<String>> register(@Valid @RequestBody User user) {
        String token = authService.register(user);
        return ResponseEntity.ok()
                .header(SET_COOKIE, securityUtils.createRefreshTokenCookie(SecurityContextHolder.getContext()
                                .getAuthentication()
                        ).toString()
                ).body(new MessageResponse<>(
                        messageSource.getMessage("success.register", null, LocaleContextHolder.getLocale()),
                        token
                ));
    }

    @Operation(description = "Get JWT from username and password")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "token and refresh token created")})
    @PostMapping(Endpoints.TOKEN)
    public ResponseEntity<MessageResponse<String>> token(
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
    ) {
        return ResponseEntity.ok()
                .header(SET_COOKIE, securityUtils.createRefreshTokenCookie(usernamePasswordAuthenticationToken)
                        .toString()
                ).body(new MessageResponse<>(authService.createToken(usernamePasswordAuthenticationToken)));
    }

    @Operation(description = "Deletes a JWT by removing the refresh_token cookie. This will force a client to log back in.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "refresh cookie was deleted")})
    @DeleteMapping(Endpoints.TOKEN)
    public ResponseEntity<Void> deleteToken() {
        return ResponseEntity.ok()
                .header(SET_COOKIE, securityUtils.deleteRefreshTokenCookie()
                        .toString()
                ).build();
    }

    @Operation(description = "Get JWT from refresh token")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "token and refresh token created")})
    @PostMapping(Endpoints.REFRESH_TOKEN)
    public ResponseEntity<MessageResponse<String>> refreshToken(JwtAuthenticationToken jwtAuthenticationToken) {
        return ResponseEntity.ok()
                .header(SET_COOKIE, securityUtils.createRefreshTokenCookie(jwtAuthenticationToken)
                        .toString()
                ).body(new MessageResponse<>(authService.createToken(jwtAuthenticationToken)));
    }
}
