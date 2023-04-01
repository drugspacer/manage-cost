package xyz.jesusohmyjesus.managecost.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
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
import xyz.jesusohmyjesus.managecost.service.TripService;

import java.util.UUID;

@Tag(name = "Trip endpoints")
@RestController
@RequestMapping(Endpoints.TRIPS)
public class TripController {
    @Autowired
    TripService tripService;

    @Operation(description = "Create a new trip")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "get created trip")})
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Trip createNewTrip(JwtAuthenticationToken jwtAuthenticationToken, @RequestBody NewTrip data) {
        return tripService.createNewTrip(data, jwtAuthenticationToken.getName());
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
    public Trip createNewActivity(@PathVariable UUID id, @RequestBody Activity data) {
        return tripService.createNewActivity(id, data);
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
    public Trip finishTrip(@PathVariable UUID id) {
        return tripService.finishTrip(id);
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
    public Trip returnFromArchive(@PathVariable UUID id) {
        return tripService.returnFromArchive(id);
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
    public Trip updateTrip(@RequestBody NewTrip data) {
        return tripService.updateTrip(data);
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
    public Trip updateActivity(@PathVariable UUID id, @RequestBody Activity data) {
        return tripService.updateActivity(id, data);
    }

    @Operation(description = "Get all trips for current user")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "get trips")})
    @GetMapping
    public Iterable<Trip> getAll(JwtAuthenticationToken jwtAuthenticationToken) {
        return tripService.getAll(jwtAuthenticationToken.getName());
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
    public Trip getById(@PathVariable UUID id) {
        return tripService.getById(id);
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
    public Trip deleteActivity(@PathVariable UUID tripId, @PathVariable UUID activityId) {
        return tripService.deleteActivity(tripId, activityId);
    }

    @Operation(description = "Delete a trip by id")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "return nothing")})
    @DeleteMapping(Endpoints.ID)
    public void deleteTrip(@PathVariable UUID id) {
        tripService.deleteTrip(id);
    }
}
