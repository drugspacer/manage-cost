package xyz.jesusohmyjesus.managecost.security.filter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import xyz.jesusohmyjesus.managecost.exception.ApiErrorResponse;

import java.io.IOException;

public class ApiResponseBasicAuthenticationFilter extends BasicAuthenticationFilter {
    public ApiResponseBasicAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void onUnsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        ApiErrorResponse.writeExceptionToResponse(failed, request, response);
    }
}
