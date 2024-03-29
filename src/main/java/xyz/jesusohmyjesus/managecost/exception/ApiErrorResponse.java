package xyz.jesusohmyjesus.managecost.exception;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@EqualsAndHashCode
public class ApiErrorResponse {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final String VALIDATION_MESSAGES = "Validation failed. See validation messages.";
    private final String timestamp;
    private final String path;
    private final String message;
    private final String exception;
    @JsonIgnore
    private final HttpStatus httpStatus;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Map<String, String> validationMessages;

    public ApiErrorResponse(Exception e, HttpServletRequest request) {
        this.timestamp = ZonedDateTime.now()
                .toOffsetDateTime()
                .toString();
        this.path = StringUtils.isNotBlank(request.getQueryString())
                ? request.getRequestURI() + "?" + request.getQueryString()
                : request.getRequestURI();
        this.exception = e.getClass()
                .getName();
        if (e instanceof AuthenticationException || e instanceof JwtException) {
            this.httpStatus = HttpStatus.UNAUTHORIZED;
        } else if (e instanceof AccessDeniedException) {
            this.httpStatus = HttpStatus.FORBIDDEN;
        } else if (e instanceof HttpMessageConversionException
                || e instanceof MethodArgumentTypeMismatchException
                || e instanceof BindException) {
            this.httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        } else if (e instanceof ApiException) {
            this.httpStatus = ((ApiException) e).getStatus();
        } else {
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        if (e instanceof BindException) {
            this.message = VALIDATION_MESSAGES;
            this.validationMessages = getValidationMessages(e);
        } else {
            this.message = e.getMessage();
            this.validationMessages = null;
        }
    }

    public static void writeExceptionToResponse(Exception e, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(e, request);
        response.setStatus(apiErrorResponse.getStatus());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), apiErrorResponse);
    }

    private int getStatus() {
        return httpStatus.value();
    }

    private static Map<String, String> getValidationMessages(Exception e) {
        Map<String, String> validateMessages = new HashMap<>();
        List<FieldError> fieldErrors;
        ObjectError objectError;
        if (e instanceof MethodArgumentNotValidException methodArgumentNotValidException) {
            fieldErrors = methodArgumentNotValidException.getBindingResult()
                    .getFieldErrors();
            objectError = methodArgumentNotValidException.getBindingResult()
                    .getGlobalError();
        } else {
            fieldErrors = ((BindException) e).getBindingResult()
                    .getFieldErrors();
            objectError = ((BindException) e).getBindingResult()
                    .getGlobalError();
        }
        fieldErrors.forEach(fieldError -> validateMessages.put(fieldError.getField(), fieldError.getDefaultMessage()));
        if (objectError != null) {
            validateMessages.put(objectError.getObjectName(), objectError.getDefaultMessage());
        }
        return validateMessages;
    }
}
