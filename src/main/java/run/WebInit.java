package run;

import ims.basic.bean.ImsFilter;
import ims.basic.bean.ImsProperty;
import ims.basic.session.ImsSessionListener;
import ims.component.socket.WebSocketSave;
import ims.extend.ImsExcel;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.*;

public class WebInit implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {

        /*
        context.setServletContext(servletContext);
        context.setConfigLocation("com.config");
        context.refresh();
        */

        //--**  dispatcher servlet
        long MAX_FILE_ZIZE = 1024*1024*1024*10;
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        ServletRegistration.Dynamic dispatcher = servletContext.addServlet("DispatcherServlet", new DispatcherServlet(context));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
        MultipartConfigElement mce =  new MultipartConfigElement(   ImsProperty.getInstance().getProperty("FILE.defaultpath")
                                                                ,   MAX_FILE_ZIZE
                                                                ,   MAX_FILE_ZIZE
                                                                ,   0);
        dispatcher.setMultipartConfig(mce);

        //--**  character encoding filter
        FilterRegistration.Dynamic characterEncodingFilter = servletContext.addFilter("characterEncodingFilter", new ImsFilter());
        characterEncodingFilter.setInitParameter("encoding", "UTF-8");
        characterEncodingFilter.setInitParameter("forceEncoding", "true");
        characterEncodingFilter.addMappingForUrlPatterns(null, false, "/*");

        //--**  multipartFilter filter
        FilterRegistration.Dynamic multipartFilter = servletContext.addFilter("multipartFilter", new MultipartFilter());
        multipartFilter.addMappingForUrlPatterns(null, false, "/*");

        //--**  ImsExcel
        ServletRegistration.Dynamic imsExcel = servletContext.addServlet("ImsExcel", new ImsExcel());
        dispatcher.setLoadOnStartup(2);
        dispatcher.addMapping("/ImsExcel");

        //--**  WebSocket
        ServletRegistration.Dynamic webSocket = servletContext.addServlet("WebSocket", new WebSocketSave());
        dispatcher.setLoadOnStartup(2);
        dispatcher.addMapping("/WebSocketSave");

        //--**  listener imsSessionListener
        context.register(ImsSessionListener.class);
        servletContext.addListener(new ContextLoaderListener(context));

        //--**  listener RequestContextListener
        context.register(RequestContextListener.class);
        servletContext.addListener(new ContextLoaderListener(context));

        //--**  세션 bean
        /*
        BeanDefinitionRegistry beanFactory = (BeanDefinitionRegistry) context.getBeanFactory();
        beanFactory.registerBeanDefinition("sqlSession"
                                        ,   BeanDefinitionBuilder.genericBeanDefinition(ImsSqlSessionTemplate.class).getBeanDefinition());
        */
    }
}
