package xyz.jesusohmyjesus.managecost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.jesusohmyjesus.managecost.repository.ActivityRepository;

import java.util.UUID;

@Service
public class ActivityService {
    @Autowired
    ActivityRepository activityRepository;

    public void deleteActivity(UUID id) {
        activityRepository.deleteById(id);
    }
}
