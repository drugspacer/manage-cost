package xyz.jesusohmyjesus.managecost.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.entities.Activity;
import xyz.jesusohmyjesus.managecost.entities.Trip;
import xyz.jesusohmyjesus.managecost.exception.ApiErrorResponse;
import xyz.jesusohmyjesus.managecost.request.NewTrip;
import xyz.jesusohmyjesus.managecost.response.MessageResponse;
import xyz.jesusohmyjesus.managecost.service.TripService;
import xyz.jesusohmyjesus.managecost.validation.IsUUID;

import java.util.UUID;

import static org.springframework.context.i18n.LocaleContextHolder.getLocale;

@Tag(name = "Trip endpoints")
@RestController
@RequestMapping(Endpoints.TRIPS)
public class TripController {
    @Autowired
    TripService tripService;

    @Autowired
    MessageSource messageSource;

    @Operation(description = "Create a new trip")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "get created trip")})
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public MessageResponse<Trip> createNewTrip(JwtAuthenticationToken jwtAuthenticationToken,
                                               @Valid @RequestBody NewTrip data) {
        return new MessageResponse<>(
                messageSource.getMessage("success.created", null, getLocale()),
                tripService.createNewTrip(data, jwtAuthenticationToken.getName())
        );
    }

    @Operation(description = "Create a new activity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "get trip with created activity"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping(value = Endpoints.ID, consumes = MediaType.APPLICATION_JSON_VALUE)
    public MessageResponse<Trip> createNewActivity(JwtAuthenticationToken jwtAuthenticationToken,
                                                   @IsUUID @PathVariable UUID id,
                                                   @Valid @RequestBody Activity data) {
        return new MessageResponse<>(
                messageSource.getMessage("success.created", null, getLocale()),
                tripService.createNewActivity(jwtAuthenticationToken.getName(), id, data)
        );
    }

    @Operation(description = "An endpoint for total calculating")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "get calculated trip"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping(Endpoints.FINISH)
    public MessageResponse<Trip> finishTrip(JwtAuthenticationToken jwtAuthenticationToken,
                                            @IsUUID @PathVariable UUID id) {
        return new MessageResponse<>(
                messageSource.getMessage("success.archived", null, getLocale()),
                tripService.finishTrip(jwtAuthenticationToken.getName(), id)
        );
    }

    @Operation(description = "Return a trip from an archive to next editing")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "get returned trip"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping(Endpoints.RETURN)
    public MessageResponse<Trip> returnFromArchive(JwtAuthenticationToken jwtAuthenticationToken,
                                                   @IsUUID @PathVariable UUID id) {
        return new MessageResponse<>(tripService.returnFromArchive(jwtAuthenticationToken.getName(), id));
    }

    @Operation(description = "Update trip")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "get updated trip"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PutMapping
    public MessageResponse<Trip> updateTrip(JwtAuthenticationToken jwtAuthenticationToken,
                                            @Valid @RequestBody NewTrip data) {
        return new MessageResponse<>(
                messageSource.getMessage("success.updated", null, getLocale()),
                tripService.updateTrip(jwtAuthenticationToken.getName(), data)
        );
    }

    @Operation(description = "Update an activity for a specific trip")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "get updated trip"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PutMapping(Endpoints.ID)
    public MessageResponse<Trip> updateActivity(JwtAuthenticationToken jwtAuthenticationToken,
                                                @IsUUID @PathVariable UUID id,
                                                @Valid @RequestBody Activity data) {
        return new MessageResponse<>(
                messageSource.getMessage("success.updated", null, getLocale()),
                tripService.updateActivity(jwtAuthenticationToken.getName(), id, data)
        );
    }

    @Operation(description = "Get all trips for current user")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "get trips")})
    @GetMapping
    public MessageResponse<Iterable<Trip>> getAll(JwtAuthenticationToken jwtAuthenticationToken) {
        return new MessageResponse<>(tripService.getAll(jwtAuthenticationToken.getName()));
    }

    @Operation(description = "Get a specific trip by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "get a trip"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @GetMapping(Endpoints.ID)
    public MessageResponse<Trip> getById(JwtAuthenticationToken jwtAuthenticationToken, @IsUUID @PathVariable UUID id) {
        return new MessageResponse<>(tripService.getById(jwtAuthenticationToken.getName(), id));
    }

    @Operation(description = "Delete an activity of a specific trip")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "return updated trip"),
            @ApiResponse(
                    responseCode = "404",
                    description = "trip not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @DeleteMapping(Endpoints.DELETE_ACTIVITY)
    public MessageResponse<Trip> deleteActivity(JwtAuthenticationToken jwtAuthenticationToken,
                                                @IsUUID @PathVariable UUID tripId,
                                                @IsUUID @PathVariable UUID activityId) {
        return new MessageResponse<>(
                messageSource.getMessage("success.deleted", null, getLocale()),
                tripService.deleteActivity(jwtAuthenticationToken.getName(), tripId, activityId)
        );
    }

    @Operation(description = "Delete a trip by id")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "return nothing")})
    @DeleteMapping(Endpoints.ID)
    public MessageResponse<Void> deleteTrip(JwtAuthenticationToken jwtAuthenticationToken,
                                            @IsUUID @PathVariable UUID id) {
        tripService.deleteTrip(jwtAuthenticationToken.getName(), id);
        MessageResponse<Void> response = new MessageResponse<>();
        response.setMessage(messageSource.getMessage("success.deleted", null, getLocale()));
        return response;
    }
}
