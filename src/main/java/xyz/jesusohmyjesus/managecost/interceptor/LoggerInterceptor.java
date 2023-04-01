package xyz.jesusohmyjesus.managecost.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequestInterceptor;
import org.springframework.web.servlet.handler.WebRequestHandlerInterceptorAdapter;

@Component
public class LoggerInterceptor extends WebRequestHandlerInterceptorAdapter {
    private static final Logger logger = LoggerFactory.getLogger(LoggerInterceptor.class);

    /**
     * Create a new WebRequestHandlerInterceptorAdapter for the given WebRequestInterceptor.
     *
     * @param requestInterceptor the WebRequestInterceptor to wrap
     */
    public LoggerInterceptor(WebRequestInterceptor requestInterceptor) {
        super(requestInterceptor);
    }

    @Override
    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler)
            throws Exception {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        logger.debug(String.format("Starting request for time for %s", request.getRequestURL()));
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler,
            Exception ex) throws Exception {
        logger.debug(String.format(
                "Execute time for %s was %d ms",
                request.getRequestURL(),
                System.currentTimeMillis() - (long) request.getAttribute("startTime")
        ));
        super.afterCompletion(request, response, handler, ex);
    }
}
