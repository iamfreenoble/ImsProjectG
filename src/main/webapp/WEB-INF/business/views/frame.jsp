<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.text.*,java.util.*" %>
<%@ page import="ims.basic.bean.ImsProperty" %>
<%@ page import="java.text.SimpleDateFormat,java.util.Date" %>
<% 
	/** 
	 * 	작성자		:	이상준	
	 * 	작성일		:	2020.03
	 *	Desc	:	프레임 화면. 공통 스크립트 포함 
	 *					프레임  
	 *				
	 */ 
	
	String gubun2	= ImsProperty.getInstance().getProperty("GUBUN");
	String ver2		=	ImsProperty.getInstance().getProperty("VERSION");
	SimpleDateFormat formatter2	= new SimpleDateFormat("yyyyMMdd");
	request.setAttribute("version",  ("real".equals(gubun2) ? ver2 : formatter2.format(new Date())));

%>
<!doctype html>
<html lang="ko"> <!-- manifest="/IMS02/custom/IMS_cache.manifest"> -->
<head>
	<meta http-equiv="Content-Type" 		content="text/html; charset=UTF-8"> 
	<meta http-equiv=”Cache-Control” 		content=”private,max-age=86400”>
	<meta http-equiv="X-UA-Compatible" 	content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="short icon" href="/IMS02/module/html/images/favicon.ico">
	<title>ImsProject-2019</title>
	<link rel="stylesheet" type="text/css" href="/html/css/include.css?version=${version}"/>
	<link rel="stylesheet" type="text/css" href="/IMS02/custom/IMS_Include.css?version=${version}"/>
	
	<!--[if lt IE 9]>
			<script type="text/javascript" charset="utf-8" src="/business/common/html5shiv.js"></script>  
	<![endif]-->
	
</head>
<body>
	
	<%@include file="/IMS02/custom/IMS_Include.jspf" %>
	
	<%
		session = request.getSession();
		String auth_code	=	(String)session.getAttribute("session_auth_code");
		String uname		=	(String)session.getAttribute("user_nm");
		
		String utype	=	"";
		String uaname	=	"";
		if ("01".equals(auth_code)){		
			utype	=	"researcher";
			uaname	=	"연구원";
		
		} else if ("02".equals(auth_code)){	
			utype	=	"committee";
			uaname	=	"심의위원";
		
		} else if ("03".equals(auth_code)){	
			utype	=	"steward";
			uaname	=	"행정/전문간사";
		
		} else if ("04".equals(auth_code)){	
			utype	=	"steward";
			uaname	=	"행정/전문간사";
		
		} else if ("05".equals(auth_code)){	
			utype	=	"manager";
			uaname	=	"관리자";
		
		}
	
	%>
	
	<!-- SESSION ID -->
	<input type="hidden" id="_SESSION_ID" value="${session_user_id}">
  	<input type="hidden" id="_SESSION_AUTH_CODE" value="${session_auth_code}">
	
	<header id="frame_top">
		<article>
			<a class="menu">
				<span class="imsproject">IMS Project 2019</span>
				<span onclick="go('/<%=utype%>')"><%=(uname + " ( " + uaname + " ) 님")%> </span>
				<span onclick="go('/G2Basic')">G2 Basic</span>
				<span onclick="go('/G2Double')">G2 Double</span>
				<span onclick="go('/Sample')">Sample</span>
			</a>
			<a class="menu2">
				<span onclick="lfnLogoutdo()">로그아웃</span> 
			</a>
		</article>		
	</header>
	 
	<section id="frame_main"></section>	
	
	<footer id="frame_bottom">
		<span>이용약관  | 개인정보처리방침  | 업무별 담당자 연락처 | build version <a class="lightblue"><%=ver%></a></span>
		<address><b>경기도 화성시  전화 : 010-4472-4003</b></address>
		<span>Copyright(c) 2019 Ims Project. All rights reserved</span>
	</footer>	
	
	<section id="frame_duration">
		<table>
			<tr><td>start time</td><td></td></tr>
			<tr><td>end time</td><td></td></tr>
			<tr><td>duration</td><td></td></tr>
		</table>
	</section>
	
<script>
		
		//	화면 닫을때 로그아웃 처리  
		window.onbeforeunload = function () {
		//	$A.call({url:"/logout.do",async:false},function(d){
		//	});
 		}
	
		//	Start
		$U.ready(document,function(){
			//--*	그리드 사용 초기화
			G2_begin();
			//--**	go('/committeeManagement');
			//go("/G2Basic");
			go("/Sample");
		});
		
		//	서버처리중 화면 fadein fadeout
		var _D	=	"";
		var _E	=	"";
		function fadeinout(opt){
			$hD("#frame_duration").style.display	=	opt === "out" ? "block"	:	"none";
			if (opt === "out"){
				_D = new Date();
				$hA("#frame_duration table")[0].rows[0].cells[1].innerHTML	=	_D.getHours() + ":" + _D.getMinutes() + ":" + _D.getSeconds();
			} else {
				_D = "";
			}
		}

		function fadeinoutforalert(opt){
			fadeinout(opt);
			$hD("#frame_popup header img").src	=	"/html/img/ico_alarm.png";	
			$hD("#frame_popup footer img").src	=	"/html/img/btn_alarm.png";	
			$hD("#frame_popup article").innerHTML	=	s;
			$hD("#frame_popup").style.display = "block";
			$hD("#frame_popup footer img").focus();
		}
		
		function fadeinoutforerror(opt){
			fadeinout(opt);
			$hD("#frame_popup header img").src	=	"/html/img/ico_error.png";	
			$hD("#frame_popup footer img").src	=	"/html/img/btn_error.png";	
			$hD("#frame_popup article").innerHTML	=	s;
			$hD("#frame_popup").style.display = "block";
			$hD("#frame_popup footer img").focus();
		}
		
		function popupclose(){
			fadeinout("in");
			$hD("#frame_popup").style.display = "none";
		}
		
		//	go function
		function go(g){
			$A.call({url:"/go.do?go=" + g}, function(d){
				$U.html($hD("#frame_main"),d);	
			});
		}
		
		function home(p){
			self.location.href	=	"/?session_auth_code=" + p;			
		}
		
		function lfnLogoutdo(){
			$A.call({url:"/userInfo/logoutdo.do"},function(d){
				if (d.result==="OK"){
					self.location.href = "../../../..";
				} else {
					alert(d.message);
				}
			});
		}
		
	</script>

</body>
</html>