<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<section class="title"><i class="fab fa-hubspot"></i>&nbsp;사용자관리</section>

<!-- LIST -->
<table id="bootContainerTable">
	<colgroup>
		<col width="600">
		<col width="300">
		<col width="600">
	</colgroup>
	<tbody>
		<tr>
			<td>
				
				<div id="bootContainer">
					<G2	id="G2DoubleList01" 
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
								" 
					></G2>		
				</div>
				
			</td>
			<td>
			
			</td>
			<td>

				<div id="bootContainer">
					<G2	id="G2DoubleList02" 
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
								" 
					></G2>		
				</div>
			
			
			</td>
		</tr>
	</tbody>
</table>
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
<script type="text/javascript" charset="utf-8" src="/business/control/G2Double.js"></script>
