package xyz.jesusohmyjesus.managecost.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.controller.message.SuccessMessage;
import xyz.jesusohmyjesus.managecost.entities.User;
import xyz.jesusohmyjesus.managecost.exception.ApiErrorResponse;
import xyz.jesusohmyjesus.managecost.request.PasswordRq;
import xyz.jesusohmyjesus.managecost.response.MessageResponse;
import xyz.jesusohmyjesus.managecost.service.UserService;

import java.util.UUID;

import static xyz.jesusohmyjesus.managecost.controller.message.SuccessMessage.UPDATED;

@Tag(name = "User endpoints")
@RestController
@RequestMapping(Endpoints.USERS)
public class UserController {
    @Autowired
    private UserService userService;

    @Operation(description = "Get user by it's jwt token")
    @GetMapping(Endpoints.CURRENT_USER)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "get current user"),
            @ApiResponse(
                    responseCode = "404",
                    description = "current user no longer exists",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public MessageResponse<User> currentUser(JwtAuthenticationToken jwtAuthenticationToken) {
        return new MessageResponse<>(userService.findByUsername(jwtAuthenticationToken.getName()));
    }

    @Operation(description = "Find all users")
    @GetMapping
    public MessageResponse<Iterable<User>> findAll() {
        return new MessageResponse<>(userService.findAll());
    }

    @Operation(description = "Delete current user")
    @DeleteMapping(Endpoints.CURRENT_USER)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "user deleted"),
            @ApiResponse(
                    responseCode = "404",
                    description = "current user not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public MessageResponse<Void> deleteCurrentUser(JwtAuthenticationToken jwtAuthenticationToken) {
        userService.delete(jwtAuthenticationToken.getName());
        MessageResponse<Void> response = new MessageResponse<>();
        response.setMessage(SuccessMessage.USER_DELETED.getLabel());
        return response;
    }

    @Operation(description = "Update current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "user updated"),
            @ApiResponse(
                    responseCode = "404",
                    description = "user not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PutMapping(Endpoints.CURRENT_USER)
    public MessageResponse<User> updateCurrentUser(JwtAuthenticationToken jwtAuthenticationToken,
                                                   @RequestBody User newUser) {
        return new MessageResponse<>(UPDATED.getLabel(), userService.update(jwtAuthenticationToken.getName(), newUser));
    }

    @Operation(description = "Create a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "user created"),
            @ApiResponse(
                    responseCode = "403",
                    description = "user already exists",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PreAuthorize("hasAuthority('Admin')")
    @PostMapping
    public MessageResponse<User> create(@RequestBody @Validated User newUser) {
        return new MessageResponse<>(SuccessMessage.CREATED.getLabel(), userService.create(newUser));
    }

    @Operation(description = "Update an existing user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "user update"),
            @ApiResponse(
                    responseCode = "404",
                    description = "user not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PutMapping
    public MessageResponse<User> update(@RequestBody @Validated User newUser) {
        return new MessageResponse<>(UPDATED.getLabel(), userService.update(newUser));
    }

    @Operation(description = "Delete an existing user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "user deleted"),
            @ApiResponse(
                    responseCode = "404",
                    description = "user not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PreAuthorize("hasAuthority('Admin')")
    @DeleteMapping(value = "/{id}")
    public MessageResponse<Void> delete(@PathVariable UUID id) {
        userService.delete(id);
        MessageResponse<Void> response = new MessageResponse<>();
        response.setMessage(SuccessMessage.DELETED.getLabel());
        return response;
    }

    @Operation(description = "Change password for current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "password changed"),
            @ApiResponse(
                    responseCode = "404",
                    description = "user not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "incorrect old password provided",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping(Endpoints.CHANGE_PASSWORD)
    public MessageResponse<Void> changePassword(@RequestBody PasswordRq passwords, JwtAuthenticationToken jwtAuthenticationToken) {
        userService.changePassword(jwtAuthenticationToken.getName(), passwords);
        MessageResponse<Void> response = new MessageResponse<>();
        response.setMessage(SuccessMessage.PASSWORD_CHANGED.getLabel());
        return response;
    }
}
