package xyz.jesusohmyjesus.managecost.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Locale;
import java.util.Set;

import static org.springframework.context.i18n.LocaleContextHolder.setLocale;
import static org.springframework.http.HttpHeaders.ACCEPT_LANGUAGE;

public class AcceptLanguageInterceptor implements HandlerInterceptor {
    private final Set<Locale> serverLocales = Set.of(Locale.ENGLISH, Locale.of("ru"));

    @Override
    public boolean preHandle(HttpServletRequest request,
                             @NonNull HttpServletResponse response,
                             @NonNull Object handler) {
        setLocale(Locale.lookup(Locale.LanguageRange.parse(request.getHeader(ACCEPT_LANGUAGE)), serverLocales));
        return true;
    }
}
