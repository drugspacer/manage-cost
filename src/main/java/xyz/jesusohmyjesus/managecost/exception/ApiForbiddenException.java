package xyz.jesusohmyjesus.managecost.exception;

import org.springframework.http.HttpStatus;

public class ApiForbiddenException extends ApiException {
    public ApiForbiddenException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
