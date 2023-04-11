package xyz.jesusohmyjesus.managecost.controller.message;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorMessages {
    CURRENT_USER_NOT_FOUND("Unable to retrieve the current user."),
    NO_USER_FOUND("No user found for id: %d."),
    NO_TRIP_FOUND("No trip found for id: %d."),
    NO_ROLE_FOUND("No role found for name: %d."),
    USER_ALREADY_EXISTS("A user already exists with username: %s."),
    INCORRECT_OLD_PASSWORD("Incorrect old password provided"),
    TRIP_MODIFICATION_FORBIDDEN("Modification for trip: %d is forbidden."),
    ACTIVITY_MODIFICATION_FORBIDDEN("Modification for activity: %d is forbidden."),
    DELETE_FORBIDDEN("This resourse deletion is forbidden"),
    MODIFICATION_FORBIDDEN("This resourse modification is forbidden");

    private final String label;
}
