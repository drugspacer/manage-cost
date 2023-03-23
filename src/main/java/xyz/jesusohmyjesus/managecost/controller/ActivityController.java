package xyz.jesusohmyjesus.managecost.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.entities.Activity;
import xyz.jesusohmyjesus.managecost.service.ActivityService;

import java.util.UUID;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    @Autowired
    ActivityService activityService;
}
