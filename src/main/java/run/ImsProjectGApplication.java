package run;

import ims.basic.bean.ImsProperty;
import ims.basic.bean.ImsPropertyLoad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

/**
 * Main Run
 */
@SpringBootApplication
@Configuration
@EnableCaching(proxyTargetClass = true)
public class ImsProjectGApplication extends SpringBootServletInitializer {

    static final Logger logger = LoggerFactory.getLogger(ImsProjectGApplication.class);

    private final Environment env;

    /**
     * 환경설정
     * Sevlet config 흫 뤼ㅙ WebServletInit bean 을 사용함
     * @param env
     */
    public ImsProjectGApplication(Environment env, ServletContext servletContext) {
        this.env = env;
        ImsPropertyLoad imsPropertyLoad = new ImsPropertyLoad(this.env);
        logger.info("GUBUN-env="+ env.getProperty("GUBUN"));
    }

    /**
     * main
     * @param args
     */
    public static void main(String[] args) throws ServletException {
        SpringApplication.run(ImsProjectGApplication.class, args);
        logger.info("GUBUN-System="+ System.getProperty("imsLocation"));
        logger.info("GUBUN-ImsProperty=" + ImsProperty.getInstance().getProperty("GUBUN"));

    }

}
