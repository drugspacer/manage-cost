package xyz.jesusohmyjesus.managecost.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.service.ActivityService;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    @Autowired
    ActivityService activityService;
}
