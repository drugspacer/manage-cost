package xyz.jesusohmyjesus.managecost.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import xyz.jesusohmyjesus.managecost.exception.ApiErrorResponse;

@ControllerAdvice
public class ControllerExceptionAdvice {
    private static final Logger logger = LoggerFactory.getLogger(ControllerExceptionAdvice.class);

    @ExceptionHandler({Exception.class})
    public ResponseEntity<ApiErrorResponse> handleException(Exception e, HttpServletRequest request) {
        logger.error(String.format("%s occurred", e.getClass().getName()), e);
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(e, request);
        return new ResponseEntity<>(apiErrorResponse, apiErrorResponse.getHttpStatus());
    }
}
