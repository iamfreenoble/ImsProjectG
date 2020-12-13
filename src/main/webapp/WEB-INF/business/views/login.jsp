<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.text.*,java.util.*" %>
<%@ page import="ims.basic.bean.ImsProperty" %>
<% 
	/** 
	 * 	작성자	:	이상준	
	 * 	작성일	: 	2018.12
	 *	Desc	:	로그인
	 *				
	 */ 
		String gubun2	= ImsProperty.getInstance().getProperty("GUBUN");
		String ver2		=	ImsProperty.getInstance().getProperty("VERSION");
		SimpleDateFormat formatter2	= new SimpleDateFormat("yyyyMMdd");
		request.setAttribute("version",  ("real".equals(gubun2) ? ver2 : formatter2.format(new Date())));
%>

<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
	<link rel="short icon" href="/IMS02/module/html/images/favicon.ico">
	<title>irb-2019</title>
	<link rel="stylesheet" type="text/css" href="/html/css/include.css?version=${version}"/>
	<link rel="stylesheet" type="text/css" href="/IMS02/custom/IMS_Include.css?version=${version}"/>

	<!--[if lt IE 9]>
			<script type="text/javascript" charset="utf-8" src="/business/common/html5shiv.js"></script>  
	<![endif]-->
	
</head>
<body>
	<%@include file="/IMS02/custom/IMS_Include.jspf" %>
	<section id="login_section">
		<section>
			<form name="loginForm">
				<div><input type="text" validate="{title:ID,type:notnull}" name="user_id" placeholder="ID" value=""></div>
				<div><input type="password" validate="{title:Password,type:notnull}" name="user_pw" placeholder="Password" value=""></div>
				<div style="padding:10px 0 0 5px;font-size:12px;cursor:pointer">
						<span gubun="idFind">아이디찾기</span>
						<span>&nbsp;|&nbsp;</span>
						<span gubun="pwFind">비밀번호찾기</span>
						<span>&nbsp;|&nbsp;</span>
						<span gubun="userIns">사용자 등록</span>
				</div>
			</form>
		</section>
		<div class="loginbutton">
			<input onclick="lfnLogindo()" type="button" value="LOGIN">
		</div>
		
	</section>	
	<div style="position:absolute;top:10px;left:20px;width:100px">
	    <input style="margin:10px" type="button" onclick="lfnLogindoExt(1)" 	value="00001->연구자로 로그인">
	    <input style="margin:10px" type="button" onclick="lfnLogindoExt(12)" 	value="00012->연구책임자로 로그인">
	    <input style="margin:10px" type="button" onclick="lfnLogindoExt(2)" 	value="00002->심의위원으로 로그인">
	    <input style="margin:10px" type="button" onclick="lfnLogindoExt(3)" 	value="00003->행정간사로 로그인">
	    <input style="margin:10px" type="button" onclick="lfnLogindoExt(5)" 	value="00005->관리자로 로그인">
	</div>
	
	<div id="bootContainer" style="position:absolute;top:250px;left:20px;width:500px">
		<G2	id="userInfoList" 
			url="/userInfo/list.do" 
			headerHeight="30"    
			headerRowCnt="1" 
			rowHeight="22"    
			viewRowCnt="10"
			pageRowCnt="100"
			fixCnt="2"
			rowSpan="3,4" 
			mode="view"
			headergroup=""
			header="
						{ title=아이디, id=user_id, width=70, align=center }
						{ title=이름, id=user_nm, width=80, align=center, click=lfUserSelect }
						{ title=사용자구분, id=p_gubun, width=80, align=center }
						{ title=성별, id=sex, width=50 }
						{ title=소속, id=school, width=120, align=left }
						{ title=부서, id=aff, width=120, align=left }
						{ title=직급, id=pos, width=90, align=center}
						{ title=전공, id=major, width=90, align=center}
					" 
		></G2>		
	</div>
	
	
	<script>
		
	  //--**	임시	로그인
		function lfnLogindoExt(opt){
			switch(opt){
		  case 1 :
				$hD("input[name=user_id]").value = "00001";
        $hD("input[name=user_pw]").value = "1";
			 	break;
    	case 2 :
      	$hD("input[name=user_id]").value = "00002";
        $hD("input[name=user_pw]").value = "1";
        break;
      case 3 :
        $hD("input[name=user_id]").value = "00003";
        $hD("input[name=user_pw]").value = "1";
        break;
      case 5 :
        $hD("input[name=user_id]").value = "00005";
        $hD("input[name=user_pw]").value = "1";
        break;
      case 12 :
        $hD("input[name=user_id]").value = "00012";
        $hD("input[name=user_pw]").value = "1";
        break;
			}
			lfnLogindo();
		}
	  function lfUserSelect(d,ad){
        $hD("input[name=user_id]").value = ad.user_id;
        $hD("input[name=user_pw]").value = "1";
				lfnLogindo();
	  }
		
	  //--**	로그인
   	function lfnLogindo(){
	  	if (!$V.validate("loginForm")){
		 		return;
	   	}
		
	   	$A.call({url:"/userInfo/logindo.do",ptarget:$hD("form[name=loginForm]")},function(d){
		 		if (d.result==="OK"){
			  	self.location.href = "../../../..";
		 		} else {
			  	alert(d.message);
		 		}
	   	});
		}
		
	  //--**	엔터일때 로그인 처리
	  $U.eventbind(document,"onkeyup",function(ev){
			if ((ev.which||ev.keyCode) === 13){
				lfnLogindo();
			}
		})
		
		$U.ready(document,function(){
			//--*	그리드 사용 초기화
			G2_begin();
			setTimeout(function(){
				new G2($hD("#userInfoList"),{InitialSearch:true});
			},1000);
		});
	
	</script>
	<script type="text/javascript" charset="utf-8" src="/business/common/garbage.js"></script>  <!-- 항상 맨앞 gaebage 처리 필수임 -->

</body>
</html>