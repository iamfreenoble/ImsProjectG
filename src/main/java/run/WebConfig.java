package run;

import biz.core.Interceptor;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.servlet.config.annotation.*;

import javax.servlet.ServletContextListener;
import java.util.List;

@Configuration
@ServletComponentScan(basePackages={"biz","ims","run"})
@ComponentScan( basePackages={"biz","ims","run"}
            ,   useDefaultFilters=true
            ,   includeFilters=@ComponentScan.Filter(type=FilterType.ASSIGNABLE_TYPE, classes=ims.basic.bean.ImsFilter.class))
class WebConfig implements WebMvcConfigurer {

/*
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable("default");
    }
*/
    /**
     * Resource Mapping
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/html/**")
                .addResourceLocations("/resources/")
                .setCachePeriod(20);
        registry.addResourceHandler("/IMS02/**")
                .addResourceLocations("/IMS02/")
                .setCachePeriod(20);
        registry.addResourceHandler("/business/**")
                .addResourceLocations("/WEB-INF/business/")
                .setCachePeriod(20);

    }

    /**
     * Interceptor
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(new Interceptor())
                .addPathPatterns("/")
                .addPathPatterns("/**")
                .excludePathPatterns("/resources/css/*")
                .excludePathPatterns("/resources/css/**")
                .excludePathPatterns("/resources/img/*")
                .excludePathPatterns("/login")
                .excludePathPatterns("/userInfo/logindo.do")
                .excludePathPatterns("/userInfo/checkId.do")
                .excludePathPatterns("/userInfo/checkDupId.do")
                .excludePathPatterns("/userInfo/checkPw.do")
                .excludePathPatterns("/userInfo/insertNoSess.do")
                .excludePathPatterns("/userInfo/list.do");
    }

    /**
     * Message Converter
     * 기존 메시지 converers 확장
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(new GsonHttpMessageConverter());
    }

}
