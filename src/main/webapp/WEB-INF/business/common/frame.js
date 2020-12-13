/*=================================================================================
 *	[ description ]	
 *		-	2019.08.25	이상준 	IRB frame (심의신청서) 관련 공통 스크립트
=================================================================================*/

//-------------------------------------------
//--**	공통 custombutton event, value binding
function gfnFrameButtonSet(d, poo){

	switch(d.review.task_status){
	case "TS" :
	case "TB" :
	case "JB" :
		$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.update(1); });
		$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ poo.attr.target.update(2); });
		$U.eventbind(poo.custombuttonobj["button03"], "onclick", function(){ poo.attr.target.remove(); });
		$hD("a",poo.custombuttonobj["button01"]).innerHTML = "임시저장";
		$hD("a",poo.custombuttonobj["button02"]).innerHTML = "제출";
		$hD("a",poo.custombuttonobj["button03"]).innerHTML = "삭제";
		break;
	case "SY" :	//--**	연구책임자 제출
		if (d.review.review_director === $hD("#_SESSION_ID").value){
			$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.updatestatus(1); });
			$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ poo.attr.target.updatestatus(2); });
			$hD("a",poo.custombuttonobj["button01"]).innerHTML = "재작성요청";
			$hD("a",poo.custombuttonobj["button02"]).innerHTML = "제출";
		} else {
			$hD("a",poo.custombuttonobj["button01"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button02"]).parentElement.style.display = "none";
		}
		$hD("a",poo.custombuttonobj["button03"]).parentElement.style.display = "none";
		break;
	case "SW" :	//--**	접수대기  행정/전문 간사 처리
		if ($hD("#_SESSION_AUTH_CODE").value === "03"){
			$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.updatestatus(3); });
			$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ poo.attr.target.popuprefuse(d.review.master_key); });
			$hD("a",poo.custombuttonobj["button01"]).innerHTML = "과제접수";
			$hD("a",poo.custombuttonobj["button02"]).innerHTML = "접수반려";
		} else {
			$hD("a",poo.custombuttonobj["button01"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button02"]).parentElement.style.display = "none";
		}
		$hD("a",poo.custombuttonobj["button03"]).parentElement.style.display = "none";
		break;
	case "JB" :	//--**	접수반려시 처리
		if (d.review.review_director === $hD("#_SESSION_ID").value){
			$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.updatestatus(1); });
			$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ poo.attr.target.updatestatus(1); });
			$U.eventbind(poo.custombuttonobj["button03"], "onclick", function(){ poo.attr.target.updatestatus(2); });
			$hD("a",poo.custombuttonobj["button01"]).innerHTML = "반려사유";
			$hD("a",poo.custombuttonobj["button02"]).innerHTML = "재작성요청";
			$hD("a",poo.custombuttonobj["button03"]).innerHTML = "제출";
		} else {
			$hD("a",poo.custombuttonobj["button01"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button02"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button03"]).parentElement.style.display = "none";
		}
		break;
	case "JW" :	//--**	접수완료  행정/전문 간사 처리
		if ($hD("#_SESSION_AUTH_CODE").value === "03"){
			$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.updatestatus(5); });
			$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ CAssignmentRegist.assignmentRegistFormPopup(d.review.master_key, d.review.revision_key) });
			$U.eventbind(poo.custombuttonobj["button03"], "onclick", function(){ poo.attr.target.updatestatus(6); });
			$hD("a",poo.custombuttonobj["button01"]).innerHTML = "접수취소";
			$hD("a",poo.custombuttonobj["button02"]).innerHTML = "심사위원배정";
			$hD("a",poo.custombuttonobj["button03"]).innerHTML = "확정하기";
		} else {
			$hD("a",poo.custombuttonobj["button01"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button02"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button03"]).parentElement.style.display = "none";
		}
		break;
	
	case "SB" :	//--**	심의배정 행정/전문 간사 처리
		if ($hD("#_SESSION_AUTH_CODE").value === "03"){
			$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ CReviewEvaluation.popupreviewevaluationlist(	d.review.master_key
																															,	d.review.revision_key
																															,	d.review.review_type
																															,	d.review.task_status
																															,	d.review.commissioner_id); });
			$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ CResultNotics.popupresultNotics(	d.review.master_key
																												,	d.review.revision_key
																												,	d.review.review_type
																												,	d.review.task_status); });
			$U.eventbind(poo.custombuttonobj["button03"], "onclick", function(){ alert("작업중") });
			$hD("a",poo.custombuttonobj["button01"]).innerHTML = "심의평가표";
			$hD("a",poo.custombuttonobj["button02"]).innerHTML = "결과보고서";
			$hD("a",poo.custombuttonobj["button03"]).innerHTML = "간사기록지";
		} else {
			$hD("a",poo.custombuttonobj["button01"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button02"]).parentElement.style.display = "none";
			$hD("a",poo.custombuttonobj["button03"]).parentElement.style.display = "none";
		}
		break;
		
	case "GT" :	//--**	결과통보시
		$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ CReviewEvaluation.popupreviewevaluationlist(	d.review.master_key
																														,	d.review.revision_key
																														,	d.review.review_type
																														,	d.review.task_status
																														,	d.review.commissioner_id); });
		$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ CResultNotics.popupresultNotics(	d.review.master_key
																											,	d.review.revision_key
																											,	d.review.review_type
																											,	d.review.task_status); });
		$U.eventbind(poo.custombuttonobj["button03"], "onclick", function(){ alert("작업중") });
		$hD("a",poo.custombuttonobj["button01"]).innerHTML = "심의평가표";
		$hD("a",poo.custombuttonobj["button02"]).innerHTML = "결과보고서";
		$hD("a",poo.custombuttonobj["button03"]).innerHTML = "간사기록지";
		break;
		
	}
}

//-------------------------------------------
//--**	공통  상태값 업데이트
//	opt	상태옵션
//	target variable object
//	#review_02_change_section
//	form[name=review_02_change_form]
//	#review_02_change_div
//	review_type
function gfnFrameStatusUpdate(opt, too, soo, foo, doo, review_type){
	
	var v = {};
	try{
		
		//--**	paramter 방식으로 전달
		v.uoo		=	$hA("#selectUserFrame table tbody th",	soo);
		v.userid	=	"";
		v.usertp	=	"";
		v.task_status 	= 	"";
		v.task_name		=	"";
		
		switch(opt){
		case 1 :	v.task_status	=	"TB";	v.task_name	=	"재작성요청";	break;	//--**	재작성요청	
		case 2 :	v.task_status	=	"SW";	v.task_name	=	"신청완료";	break;	//--**	신청완료
		case 3 :	v.task_status	=	"JW";	v.task_name	=	"접수완료";	break;	//--**	접수완료
		case 4 :	v.task_status	=	"JB";	v.task_name	=	"접수반려";	break;	//--**	접수반려
		case 5 :	v.task_status	=	"SW";	v.task_name	=	"신청완료";	break;	//--**	신청완료
		case 6 :	v.task_status	=	"SB";	v.task_name	=	"심의배정";	break;	//--**	심의배정
		}
		
		p		=	"master_key="		+	$hD("input[name=master_key]", foo).value
				+	"&revision_key="	+	$hD("input[name=revision_key]",	foo).value
				+	"&task_name_ko="	+	$hD("#task_name_ko",	doo).innerHTML
				+	"&task_name_en="	+	$hD("#task_name_en",	doo).innerHTML
				+	"&task_status="		+	v.task_status
				+	"&review_type="		+	review_type
				+	"&user_id="			+	v.userid
				+	"&user_type="		+	v.usertp;
		
		var ooo = too;
		var task_name	=	v.task_name;
		$A.call({url:"/review/01/updatestatus.do",param:p,ptype:"string"},function(d){
		  alert("["+task_name+"] 되었습니다!!");
		  ooo.popwin.close();
		  ooo.callback();
		}); 
		
	} catch(e){
		alert("[ gfnFrameStatusUpdate ]" + e);
	} finally{
		v	=	null;
	}
	
}


function gfnFrameStatusUpdate2(opt, pmaster_key, prevision_key, ptask_name_ko, ptask_name_en, preview_type){
	
	var v = {};
	try{
		
		//--**	paramter 방식으로 전달
		v.task_status 	= 	"";
		v.task_name		=	"";
		v.userid 		= 	"";
		v.usertp		=	"";
		
		switch(opt){
		case 1 :	v.task_status	=	"TB";	v.task_name	=	"재작성요청";	break;	//--**	재작성요청	
		case 2 :	v.task_status	=	"SW";	v.task_name	=	"신청완료";	break;	//--**	신청완료
		case 3 :	v.task_status	=	"JW";	v.task_name	=	"접수완료";	break;	//--**	접수완료
		case 4 :	v.task_status	=	"JB";	v.task_name	=	"접수반려";	break;	//--**	접수반려
		case 5 :	v.task_status	=	"SW";	v.task_name	=	"신청완료";	break;	//--**	신청완료
		case 6 :	v.task_status	=	"SB";	v.task_name	=	"심의배정";	break;	//--**	심의배정
		}
		
		p		=	"master_key="		+	pmaster_key
				+	"&revision_key="	+	prevision_key
				+	"&task_name_ko="	+	ptask_name_ko
				+	"&task_name_en="	+	ptask_name_en
				+	"&task_status="		+	v.task_status
				+	"&review_type="		+	preview_type
				+	"&user_id="			+	v.userid
				+	"&user_type="		+	v.usertp;
		
		var task_name	=	v.task_name;
		$A.call({url:"/review/01/updatestatus.do",param:p,ptype:"string"},function(d){
		   CSteward.countview();
		   CSteward.grid.reload();
		   alert("["+task_name+"] 되었습니다!!");
		   
		}); 
		
	} catch(e){
		alert("[ gfnFrameStatusUpdate2 ]" + e);
	} finally{
		v	=	null;
	}
	
}



//-------------------------------------------
//--**	공통  행정메모 업데이트
//	form[name=review_02_change_form]
//	#review_02_change_section
function gfnFrameStewardMemoUpdate(foo,soo){
	var v = {};
	try{
		v.p		=	"master_key="		+	$hD("input[name=master_key]",	foo).value
				+	"&revision_key="	+	$hD("input[name=revision_key]",	foo).value
				+	"&steward_memo="	+	$hD("#steward_memo",	soo).innerHTML;
		$A.call({url:"/review/01/updatestewardmemo.do",param:v.p,ptype:"string"},function(d){
		  alert("수정되었습니다!!");
		}); 
		
	} catch(e){
		alert("[ gfnFrameStewardMemoUpdate ]" + e);
	} finally{
		v	=	null;
	}
	
}

//-------------------------------------------
//--**	과제 HTML정보 읽어오기
//	master_key
//	revision_key
//	cont in obj
//	user in obj
//	cont2 in obj
function gfnSetTaskHTML(mkey, rkey, contobj, userobj, form, vtype ){
	var v;
	try{
		//--**	조회값 세팅
		$A.call({url:"/review/01/view.do", ptype:"json", param:"contents_type=01&master_key="+mkey+"&revision_key="+rkey },function(d){
			
			var doo	=	gfnChangeStringToTag(d.contents.contents);
			
			//--**	user
			if (!$U.isNull(userobj)){ 
				var user	= 	doo.substring(doo.indexOf("content_div_user_start"), doo.indexOf("content_div_user_end"));
				user		=	user.substring(user.indexOf("<table"), user.lastIndexOf("</table>"));
				userobj.innerHTML	=	user 	+	"</table>"
			};
			
			//--**	contents
			if (!$U.isNull(contobj)){ 
				var cont	=	doo.substring(doo.indexOf("content_div_content_start"), doo.indexOf("ctag11"));
				cont		=	cont.substring(cont.indexOf("<tr"), cont.lastIndexOf("</tr>"));
				
				//--**	vtype 별로 hidden 처리
				//console.log(cont);
				switch(vtype){
				case "02"	:	//--**	연구계획변경 신청서
				case "03"	:	//--**	검토의견에 대한 답변서
				case "05"	:	//--**	연구 기타 보고서
				case "10"	:	//--**	이의 신청서
				case "11"	:	//--**	연구계획 변동,위반,미준수 보고서
				case "12"	:	//--**	중대한 이상반응 보고서(타기관,해외)
				case "13"	:	//--**	중대한 이상반응 보고서(원내)
				case "14"	:	//--**	안정성 관련정보 보고서
				case "16"	:	//--**	예상하지 못한 문제의 보고서
					cont	=	cont.replace(/ctag01=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag02=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag03=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag04=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag05=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag06=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag07=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag08=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag09=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag10=\"\"/g,"style='display:none'");
					break;
				case "04"	:	//--**	지속심의 신청서
				case "06"	:	//--**	연구중간보고서
					cont	=	cont.replace(/ctag10=\"\"/g,"style='display:none'");
					break;
				case "07"	:	//--**	연구 조기 종료 보고서
				case "08"	:	//--**	연구 종료 보고서
				case "09"	:	//--**	연구 결과 보고서
				case "15"	:	//--**	연구중지(보류)보고서 및 철회사유서
					cont	=	cont.replace(/ctag05=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag06=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag07=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag08=\"\"/g,"style='display:none'");
					cont	=	cont.replace(/ctag09=\"\"/g,"style='display:none'");
					break;
				}
				
				contobj.innerHTML	=	cont	+	"</tr>"; 
			};		
			
			//--**	데이타 세팅
			if (!$U.isNull(form)){ 
				$H.datasync(form,d.review);
			}
			
		});	
	} catch(e){
		alert("[ gfnGetTaskHTML ]" + e);
	} finally{
		v	=	null;
	}
	
}


//-------------------------------------------
//--**	과제 VIEW 읽어오기
//	master_key
//	revision_key
//	cont in obj
//	user in obj
function gfnSetReviewView(mkey,rkey,review_type,poo,callback,callback2 ){

	$A.call({url:"/review/01/view.do", ptype:"json", param:"contents_type=01&master_key="+mkey +"&revision_key="+rkey},function(d){
		
		//--**	contents
		$hLD("#preview_01_section").innerHTML 		=	$hD("#preview_01").innerHTML;
		$hLD("#review_01_section").innerHTML		=	gfnChangeStringToTag(d.contents.contents);
		$hLD("#review_01_summary_section").innerHTML		=	gfnChangeStringToTag(d.contents_summary.contents_summary);
		$hLD("#review_01_expense_section").innerHTML		=	$hD("#review_01_expense").innerHTML;	
		$hLD("#pledge_01_section").innerHTML		=	$hD("#pledge_01").innerHTML;
		$hLD("#pledge_02_section").innerHTML		=	$hD("#pledge_02").innerHTML;
		$hLD("#review_history_section").innerHTML	=	$hD("#review_history").innerHTML;
		
		//--**	데이타 세팅
		$H.datasync("review_01_form",d.review);
		$H.datasync("review_01_summary_form",d.review);
		gfnDivInDataSync("review_01_expense_div",d.review);
		gfnDivInDataSync("preview_01_div",d.review);
		
		//--**	반려가 있는 경우 처리
		if (d.refuse.cnt > 0){
			$U.eventbind(poo.custombuttonobj["button04"], "onclick", function(){ poo.attr.target.popuprefuseview(d.review.master_key); });
			$hD("a",poo.custombuttonobj["button04"]).innerHTML = "반려이력";
		} else {
			$hD("a",poo.custombuttonobj["button04"]).parentElement.style.display = "none";
		}
		
		//--**	행정메모 , 과제개요 처리
		if (	d.review.task_status === "TS" 
			||	d.review.task_status === "TB" 
			||	d.review.task_status === "JB" 
			||	d.review.task_status === "SY"	){
			$hD("a",poo.custombuttonobj["button05"]).parentElement.style.display = "none";
		    $U.set($hLA("#frame_01_tab button")[0], "class", "none");
		    $U.set($hLA("#frame_01_tab button")[1], "class", "on");
		    $U.set($hLD("#preview_01_section"), "class", "none");
		    $U.set($hLD("#review_01_section"), "class", "block");
		    $U.set($hLD("#review_signature_section"), "class", "block");
			
		} else {
			if ($hD("#_SESSION_AUTH_CODE").value === "03"){
				$U.eventbind(poo.custombuttonobj["button05"], "onclick", function(){ poo.attr.target.updatestewardmemo(); });
				$hD("a",poo.custombuttonobj["button05"]).innerHTML = "행정메모저장";
			} else {
				$hD("a",poo.custombuttonobj["button05"]).parentElement.style.display = "none";
			}
		    $U.set($hLA("#frame_01_tab button")[0], "class", "inline on");
		    $U.set($hLA("#frame_01_tab button")[1], "class", "off");
		    $U.set($hLD("#preview_01_section"), "class", "block");
		    $U.set($hLD("#review_01_section"), "class", "none");
		    $U.set($hLD("#review_signature_section"), "class", "none");
		}
		
		if (!$U.isNull(callback)){
			callback(d,poo);
		}
		
		if (!$U.isNull(callback2)){
			callback2(d,poo);
		}
		
	});
	
}

//-------------------------------------------
//--**	심의화면 등록 오픈
function gfnReviewPopupRegistCall(opt, callback){
	switch(opt){
	case 1	:	CFrame_01.popupregist(callback);			break;
	case 2	:	CFrame_02_change.popupregist(callback);		break;
	case 3	:	CFrame_03_opinion.popupregist(callback);	break;
	case 4	:	CFrame_04_keep.popupregist(callback);		break;
	case 5	:	CFrame_05_etc.popupregist(callback);		break;
	case 6	:	CFrame_06_middle.popupregist(callback);		break;
	case 7	:	CFrame_07_earlyclose.popupregist(callback);	break;
	case 8	:	CFrame_08_close.popupregist(callback);		break;
	case 9	:	CFrame_09_result.popupregist(callback);		break;
	case 10	:	CFrame_10_appeal.popupregist(callback);		break;
	case 11	:	CFrame_11_violation.popupregist(callback);	break;
	case 12	:	CFrame_12_adverse01.popupregist(callback);	break;
	case 13	:	CFrame_13_adverse02.popupregist(callback);	break;
	case 14	:	CFrame_14_safety.popupregist(callback);		break;
	case 15	:	CFrame_15_stop.popupregist(callback);		break;
	case 16	:	CFrame_16_issue.popupregist(callback);		break;
	}
}

//-------------------------------------------
//--**	심의화면 수정오픈
function gfnReviewPopupUpdateCall(id,revision,review_type,callback){
	switch(review_type){
	case "SG"	:	CFrame_01.popupupdate(id, revision, callback);				break;	
	case "BG"	:	CFrame_02_change.popupupdate(id, revision, callback);		break;
	case "DB"	:	CFrame_03_opinion.popupupdate(id, revision, callback);		break;
	case "GS"	:	CFrame_04_keep.popupupdate(id, revision, callback);			break;
	case "GT"	:	CFrame_05_etc.popupupdate(id, revision, callback);			break;
	case "JG"	:	CFrame_06_middle.popupupdate(id, revision, callback);		break;
	case "JK"	:	CFrame_07_earlyclose.popupupdate(id, revision, callback);	break;
	case "JR"	:	CFrame_08_close.popupupdate(id, revision, callback);		break;
	case "KG"	:	CFrame_09_result.popupupdate(id, revision, callback);		break;
	case "LL"	:	CFrame_10_appeal.popupupdate(id, revision, callback);		break;
	case "NF"	:	CFrame_11_violation.popupupdate(id, revision, callback);	break;
	case "OP"	:	CFrame_12_adverse01.popupupdate(id, revision, callback);	break;
	case "IP"	:	CFrame_13_adverse02.popupupdate(id, revision, callback);	break;
	case "SF"	:	CFrame_14_safety.popupupdate(id, revision, callback);		break;
	case "ST"	:	CFrame_15_stop.popupupdate(id, revision, callback);			break;
	case "YS"	:	CFrame_16_issue.popupupdate(id, revision, callback);		break;
	}
}

//-------------------------------------------
//--**	첩무파일 default callback
//	tobj	:	타겟 오브젝트
//	vgroupkey	:	그룹 키이
//	vdata	:	파일 그리드 데이타
function gfnFileDefaultCallback(tobj,vgroupkey,vdata){
	$hA("a", tobj)[0].innerHTML	=	$U.isNull(vdata) ? "<font style='color:#cdcdcd'>0</font>" : 
										( vdata.length === 0 ? "<font style='color:#cdcdcd'>0</font>" : "<font style='color:red'>"+vdata.length+"</font>");
}