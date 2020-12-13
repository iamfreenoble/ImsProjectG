package biz.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * 
 * @author : iamfreeguy-LiSangjun
 * @description 스프링 스케줄 최신버전
 *
 */
public class IrbScheduler {

	static final Logger logger = LoggerFactory.getLogger(IrbScheduler.class);

	// @Autowired
	// Schedule2 schedule2 ;

	// @Autowired
	// Schedule3 schedule3 ;

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 6. 2.
	 * @description 1시간단위로 읽어서 아카이브에 등록함
	 * @throws Exception
	 *
	 */
	@Scheduled(cron = "0 0 0/1 * * *")
	public void schedule01_file_move() throws Exception {

		logger.info("CRON--file_move---START");
		// schedule2.scheduler2();
		logger.info("CRON--file_move---END");

	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 6. 2.
	 * @description 매일 밤 1시 10분에 2일후 휴가일을 읽어서 공지사항을 등록함
	 * @throws Exception
	 *
	 */
	@Scheduled(cron = "0 10 1 * * *")
	public void schedule03_holidayCheck() throws Exception {

		logger.info("CRON--holidayCheck---START");
		// schedule3.schedule3();
		logger.info("CRON--holidayCheck---END");

	}

}
