package biz.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

/**
 *
 * @author : LiSangJun
 * @description Gmail 전송
 *
 */
public class Gmail extends Authenticator {

    /*
     * if ("JW".equals(MAIL_CONTENT_CD)) MAIL_CONTENT =
     * (String)reqInfo.get("requestDtStr") + " 제출하신 연구가 접수 되었습니다." + " 심의일 : " +
     * CON_DT; if ("JB".equals(MAIL_CONTENT_CD)) MAIL_CONTENT =
     * (String)reqInfo.get("requestDtStr") + " 제출하신 연구가 접수반려 되었습니다. e-IRB에서 확인가능.";
     * if ("GT".equals(MAIL_CONTENT_CD)) { MAIL_CONTENT = CON_DT + " 심의된 " +
     * IRB_APPR_NO + " " + REVIEW_KIND_NM + "이(가) " + REVIEW_RESULT_NM + "되었습니다."; }
     * if ("JG".equals(MAIL_CONTENT_CD)) MAIL_CONTENT = ""; if
     * ("GS".equals(MAIL_CONTENT_CD)) MAIL_CONTENT = "IRB No : " + IRB_APPR_NO +
     * " 승인유효기간 만료일 60일 전입니다. 지속심의 신청서를 30일전까지 제출하시기 바랍니다."; if
     * ("JR".equals(MAIL_CONTENT_CD)) { MAIL_CONTENT = "IRB No : " + IRB_APPR_NO +
     * " 연구기간 만료 30일 전입니다. 종료보고 또는 계획변경을 진행하시기 바랍니다."; }
     */

    /**
     * Logger
     */
    static final Logger logger = LoggerFactory.getLogger(Gmail.class);

    private static final String hostId = "iamfreenoble@gmail.com";
    private static final String hostPw = "Qkekgksmfrnfma4$$";
    // private static final String hostId = "irb2092@gmail.com";
    // private static final String hostPw = "irb2092!";

    public Gmail() {
    }

    /**
     *
     * @author : LiSangJun
     * @date : 2019. 8. 23.
     * @description 전송
     * @param mailTitle
     * @param receiverAddr
     * @param sendMailContent
     *
     */
    public static void sendEmail(String mailTitle, String receiverAddr, String sendMailContent) {
        List<String> list = new ArrayList<String>();
        list.add(receiverAddr);
        sendEmail(mailTitle, list, sendMailContent);
    }

    /**
     *
     * @author : LiSangJun
     * @date : 2019. 8. 23.
     * @description Gmail Send
     * @param mailTitle
     * @param receiverAddr
     * @param sendMailContent
     *
     */
    public static void sendEmail(String mailTitle, List<String> receiverAddr, String sendMailContent) {

        String subject = "[GUGMC IRB] " + mailTitle;
        String from = "iamfreenoble@gmail.com"; // "irb2092@gmail.com";
        String fromName = "IRB관리자";
        sendMailContent = "[GUGMC IRB] " + sendMailContent
                + "<br/><br/>이 메일은 발신전용 메일입니다. 회신 메일에 대해서는 처리되지 않습니다. <br/>감사합니다.";

        logger.info("GMAIL -> 메일제목 	:	" + subject);
        logger.info("GMAIL -> 메일주소 	:	" + from);
        logger.info("GMAIL -> 보내는사람	:	" + fromName);
        logger.info("GMAIL -> 받는사람	:	" + receiverAddr);
        logger.info("GMAIL -> 내용 		:	" + sendMailContent);

        try {
            Properties props = new Properties();
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.transport.protocol", "smtp");
            props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "465");
            props.put("mail.smtp.auth", "true");
            Authenticator auth = new MyAuthentication(hostId, hostPw);
            Session mailSession = Session.getInstance(props, auth);

            Message msg = new MimeMessage(mailSession);
            msg.setFrom(new InternetAddress(from, MimeUtility.encodeText(fromName, "UTF-8", "B")));

            InternetAddress[] address1 = new InternetAddress[receiverAddr.size()];
            for (int i = 0; i < receiverAddr.size(); i++) {
                if ((receiverAddr.get(i) != null) && (!"".equals(((String) receiverAddr.get(i)).trim())))
                    address1[i] = new InternetAddress((String) receiverAddr.get(i));
            }

            msg.setRecipients(Message.RecipientType.TO, address1);
            msg.setSubject(subject);
            msg.setSentDate(new Date());
            msg.setContent(sendMailContent, "text/html;charset=euc-kr");

            Transport.send(msg);

            /*
             * Transport t = mailSession.getTransport("smtp"); try { t.connect();
             * t.sendMessage(msg, msg.getAllRecipients()); } catch(Exception e){
             * logger.debug(e.getMessage()); } finally { t.close(); }
             */
            logger.info("GMAIL -> SENDING		:	OK !!");
        } catch (Exception ex) {
            logger.info("GMAIL -> ERROR 		:	" + ex.getMessage());
        }
    }

    /*
     * public static String getMailString(){ StringBuffer sb = new StringBuffer();
     * sb.append("메일알림서비스"); return sb.toString(); }
     */

}

/**
 *
 * @author : LiSangJun
 * @description 인증
 *
 */
class MyAuthentication extends Authenticator {
    PasswordAuthentication pa;

    public MyAuthentication(String mailId, String mailPass) {
        pa = new PasswordAuthentication(mailId, mailPass);
    }

    public PasswordAuthentication getPasswordAuthentication() {
        return pa;
    }
}
