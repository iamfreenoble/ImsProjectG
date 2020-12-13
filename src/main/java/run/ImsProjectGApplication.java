package run;

import ims.basic.bean.ImsProperty;
import ims.basic.bean.ImsPropertyLoad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.core.env.Environment;

/**
 * Main Run
 */
@SpringBootApplication
@EnableCaching(proxyTargetClass = true)
public class ImsProjectGApplication {

    static final Logger logger = LoggerFactory.getLogger(ImsProjectGApplication.class);

    private final Environment env;

    /**
     * 환경설정
     * @param env
     */
    public ImsProjectGApplication(Environment env) {
        this.env = env;
        ImsPropertyLoad imsPropertyLoad = new ImsPropertyLoad(this.env);
        logger.info("GUBUN-env="+ env.getProperty("GUBUN"));
    }

    /**
     * main
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(ImsProjectGApplication.class, args);
        logger.info("GUBUN-System="+ System.getProperty("imsLocation"));
        logger.info("GUBUN-ImsProperty=" + ImsProperty.getInstance().getProperty("GUBUN"));

    }

}
