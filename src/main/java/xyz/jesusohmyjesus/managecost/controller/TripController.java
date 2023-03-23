package xyz.jesusohmyjesus.managecost.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
import xyz.jesusohmyjesus.managecost.input.NewTrip;
import xyz.jesusohmyjesus.managecost.service.TripService;

import java.util.UUID;

@RestController
@RequestMapping("/trips")
public class TripController {
    @Autowired
    TripService tripService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Trip createNewTrip(@RequestBody NewTrip data) {
        return tripService.createNewTrip(data);
    }

    @PostMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Trip createNewActivity(@PathVariable UUID id, @RequestBody Activity data) {
        return tripService.createNewActivity(id, data);
    }

    @PostMapping(value = "/{id}/finish")
    public Trip finishTrip(@PathVariable UUID id) {
        return tripService.finishTrip(id);
    }

    @PostMapping(value = "/{id}/return")
    public Trip returnFromArchive(@PathVariable UUID id) {
        return tripService.returnFromArchive(id);
    }

    @PutMapping
    public Trip updateTrip(@RequestBody NewTrip data) {
        return tripService.updateTrip(data);
    }

    @PutMapping(value = "/{id}")
    public Trip updateActivity(@PathVariable UUID id, @RequestBody Activity data) {
        return tripService.updateActivity(id, data);
    }

    @GetMapping
    public Iterable<Trip> getAll() {
        return tripService.getAll();
    }

    @GetMapping("/{id}")
    public Trip getById(@PathVariable UUID id) {
        return tripService.getById(id);
    }

    @DeleteMapping("/{tripId}/activity/{activityId}")
    public Trip deleteActivity(@PathVariable UUID tripId, @PathVariable UUID activityId) {
        return tripService.deleteActivity(tripId, activityId);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable UUID id) {
        tripService.deleteTrip(id);
    }
}
