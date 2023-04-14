package xyz.jesusohmyjesus.managecost.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import xyz.jesusohmyjesus.managecost.interceptor.AcceptLanguageInterceptor;
import xyz.jesusohmyjesus.managecost.interceptor.LoggerInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private LoggerInterceptor loggerInterceptor;

    @Autowired
    private CostCountProperties properties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/locales/**")
                .addResourceLocations("classpath:/static/public/locales/");
        registry.addResourceHandler("/*.ico")
                .addResourceLocations("classpath:/static/public/");
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/{path:^(?!api|index\\.html|.*\\.js$).*}", "index.html");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggerInterceptor);
        registry.addInterceptor(new AcceptLanguageInterceptor());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(properties.getCorsAllowedOrigins())
                .allowCredentials(true)
                .allowedHeaders("*")
                .allowedMethods(
                        HttpMethod.OPTIONS.name(),
                        HttpMethod.GET.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.PATCH.name(),
                        HttpMethod.DELETE.name()
                );
    }
}
