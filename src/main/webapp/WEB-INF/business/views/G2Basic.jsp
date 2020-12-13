<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<section class="title"><i class="fab fa-hubspot"></i>&nbsp;사용자관리</section>

<!-- LIST -->
<div id="bootContainer">
<!--                     
            headergroup="
                        { row=0, cell=1, colspan=6, title=도로/시정보 }
                        { row=0, cell=7, colspan=3, title=동명/고시일 }
                        { row=1, cell=1, colspan=2, title=도로정보 }
                        { row=1, cell=8, colspan=2, title=동별 }
                        "
 -->                   

	<G2	id="G2BasicList" 
		url="/userInfo/list.do" 
		headerHeight="30"    
		headerRowCnt="1" 
		rowHeight="22"    
		viewRowCnt="20"
		pageRowCnt="100"
		fixCnt="2"
		rowSpan="3,4" 
		mode="view"
		headergroup=""
		header="
					{ title=아이디, id=user_id, width=70, align=center }
					{ title=이름, id=user_nm, width=80, align=center, click=lfUserInfoUpdatePopup }
					{ title=사용자구분, id=p_gubun, width=80, align=center }
					{ title=성별, id=sex, width=50, formatter=lfSexFormatter }
					{ title=소속, id=school, width=120, align=left }
					{ title=부서, id=aff, width=120, align=left }
					{ title=직급, id=pos, width=90, align=center}
					{ title=전공, id=major, width=90, align=center}
					{ title=HP, id=hp1, width=100, align=center}
					{ title=TEL, id=tel1, width=100, align=center}
					{ title=이메일, id=email, width=120 }
					{ title=승인여부, id=p_approve, width=80 }
				" 
	></G2>		
</div>
<script>
	function lfUserInfoUpdatePopup(d,ad){
		CUserInfo.popupupdate(ad.user_id);
	}
	function lfSexFormatter(d,ad){
		if (d === "M"){
			return "남자";
		} else if (d === "F"){
			return "여자";
		}
		return d;
	}
</script>

<section class="buttonarea">
	<span gubun="insert" class="button01">사용자 등록</span>
</section>

<!-- INCLUDE -->
<script type="text/javascript" charset="utf-8" src="/business/common/garbage.js"></script>  <!-- 항상 맨앞 gaebage 처리 필수임 -->
<script type="text/javascript" charset="utf-8" src="/business/control/G2Basic.js"></script>
