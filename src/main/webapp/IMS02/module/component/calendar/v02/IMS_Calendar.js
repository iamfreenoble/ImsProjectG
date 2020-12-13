/*=================================================================================
 *	파 일 명		: IMS_Calendar.js
 *	작성목적		: calendar 관련 함수
 *	작 성 자		: 이상준
 *	최초작성일		: 2018.08.26
 *	최종작성일		:
 *	수정내역		:
 *				2018-08-26		이상준		calendar 재개발
=================================================================================*/

var Cal2 = {
	
		datediv	:	IMS_config.calendardiv
	,	tvalue	:	""
	,	target	:	null
	,	callback:	null	
	,	format	:	"yyyy"+IMS_config.calendardiv+"MM"+IMS_config.calendardiv+"dd"
	,	tframe	:	"<section id=\"Cal2\" style=\"display:block\">{0}</section>"
	,	thead	:	"	<div>"
				+	"		<select onchange='Cal2.change(1,this)'>"
				+	"		    <option value=\"2013\">2013</option>"
				+	"		    <option value=\"2014\">2014</option>"
				+	"		    <option value=\"2015\">2015</option>"
				+	"		    <option value=\"2016\">2016</option>"
				+	"		    <option value=\"2017\">2017</option>"
				+	"		    <option value=\"2018\">2018</option>"
				+	"		    <option value=\"2019\">2019</option>"
				+	"		    <option value=\"2020\">2020</option>"
				+	"		    <option value=\"2021\">2021</option>"
				+	"		    <option value=\"2022\">2022</option>"
				+	"		    <option value=\"2023\">2023</option>"
				+	"		    <option value=\"2024\">2024</option>"
				+	"		    <option value=\"2025\">2025</option>"
				+	"		    <option value=\"2026\">2026</option>"
				+	"		    <option value=\"2027\">2027</option>"
				+	"		    <option value=\"2028\">2028</option>"
				+	"		    <option value=\"2029\">2029</option>"
				+	"		</select>"
				+	"		<span onclick='Cal2.change(2,this)'>1</span>"
				+	"		<span onclick='Cal2.change(2,this)'>2</span>"
				+	"		<span onclick='Cal2.change(2,this)'>3</span>"
				+	"		<span onclick='Cal2.change(2,this)'>4</span>"
				+	"		<span onclick='Cal2.change(2,this)'>5</span>"
				+	"		<span onclick='Cal2.change(2,this)'>6</span>"
				+	"		<span onclick='Cal2.change(2,this)'>7</span>"
				+	"		<span onclick='Cal2.change(2,this)'>8</span>"
				+	"		<span onclick='Cal2.change(2,this)'>9</span>"
				+	"		<span onclick='Cal2.change(2,this)'>10</span>"
				+	"		<span onclick='Cal2.change(2,this)'>11</span>"
				+	"		<span onclick='Cal2.change(2,this)'>12</span>"
				+	"	</div>"
				+	"	<table>"
				+	"	<colgroup>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	<col width='50'>"
				+	"	</colgroup>"
				+	"	<thead>"
				+	"		<tr>"
				+	"			<th>주</th>"
				+	"			<th>월</th>"
				+	"			<th>화</th>"
				+	"			<th>수</th>"
				+	"			<th>목</th>"
				+	"			<th>금</th>"
				+	"			<th>토</th>"
				+	"			<th>일</th>"
				+	"		</tr>"
				+	"	</thead>"
				+	"	<tbody>"	
				+	"	{0}"
				+	"	</tbody>"	
				+	"	</table>"
				+	"	<div>"
				+	"		<span id='cdate' onclick=\"Cal2.change(3,this)\">{1}</span>"
				+	"	</div>"
	,	tbody	:	"		<tr>"
				+	"			<td>{0}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{8}'  class='{15}'>{1}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{9}'  class='{16}'>{2}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{10}' class='{17}'>{3}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{11}' class='{18}'>{4}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{12}' class='{19}'>{5}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{13}' class='{20}'>{6}</td>"
				+	"			<td onclick=\"Cal2.select(this)\" val='{14}' class='{21}'>{7}</td>"
				+	"		</tr>"
		
	//-------------------------------------------------------
	//	달력 팝업 오픈 , 해당 object
	//-------------------------------------------------------
	,	show	:
			function(obj,callback){
				
				this.callback	=	callback;
				this.tvalue	=	$U.isNull(obj) ? this.tvalue : (obj.tagName.toUpperCase() === "INPUT" ? obj.value : obj.innerHTML);
				this.target	=	$U.isNull(obj) ? this.target : obj;

				var cdate,curdate,cyear,cmonth,cday,lday,fweek,cfdate,cwfday,hbody,
					fdate,calobj,chtml,selobj,pos,foff,coff,targetvalue,templatesection;

				try{
					targetvalue	=	(this.target.tagName.toUpperCase() === "INPUT" ? this.target.value : this.target.innerHTML)		
					
					//--**	obj 의 value 확인 값이 없을 경우 현재일 사용	
					cdate	=	$U.isNullOrEmpty(this.tvalue) ? new Date() : this.getdate(this.tvalue); 
					curdate	=	$U.isEmpty(targetvalue) ? new Date() : this.getdate(targetvalue);
					
					//--**	처리할 년월일을 구한다
					cyear	=	cdate.getFullYear();	
					cmonth	=	cdate.getMonth() + 1;
					cday	=	cdate.getDate();
					
					//--**	마지막 일을 구한다
					lday	=	this.getlastday(cyear,cmonth);
					fweek	=	this.getweek(new Date(cyear, cmonth-1, 1));		//--**	1 일일때 주차를 구한다
					
					//--**	1일일때 날자를 구하고 , 첫주의 첫일을 구한다
					cfdate	=	new Date(cyear, cmonth-1, 1);		
					cwfday	=	new Date(cfdate.setDate(cfdate.getDate() - cfdate.getDay() + ( cfdate.getDay() === 0 ? (- 6) :  1)));	
					
					//--**	달력의 body 를 셋업한다
					hbody	=	"";
					
					cwfday	=	new Date(cwfday.setDate(cwfday.getDate() - 1));
					foff	=	["","","","","","",""];
					fdate	=	[null,null,null,null,null,null,null];
					
					for (var di=fweek,dj=fweek+10; di<dj; di+=1){
						
						fdate[0]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						fdate[1]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						fdate[2]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						fdate[3]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						fdate[4]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						fdate[5]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						fdate[6]	=	new Date(cwfday.setDate(cwfday.getDate() + 1));
						
						if (di === fweek){
							coff	=	"off";
							for (var qq=0; qq<7; qq+=1){
								if (Number(fdate[qq].format("dd")) === 1){
									coff	=	"";
								}
								foff[qq] =	coff;		
							}
						} else {
							coff	=	"";
							for (var qq=0; qq<7; qq+=1){
								if (Number(fdate[qq].format("dd")) === 1){
									coff	=	"off";
								}
								foff[qq] =	coff;		
							}
						}
						
						hbody	+=	$U.format(	this.tbody
											,	di
											,	fdate[0].format("dd")
											,	fdate[1].format("dd")
											,	fdate[2].format("dd")
											,	fdate[3].format("dd")
											,	fdate[4].format("dd")
											,	fdate[5].format("dd")
											,	fdate[6].format("dd")	
											,	fdate[0].format(this.format)
											,	fdate[1].format(this.format)
											,	fdate[2].format(this.format)
											,	fdate[3].format(this.format)
											,	fdate[4].format(this.format)
											,	fdate[5].format(this.format)
											,	fdate[6].format(this.format)
											,	fdate[0].format(this.format) === curdate.format(this.format) ? "currday" : foff[0] 
											,	fdate[1].format(this.format) === curdate.format(this.format) ? "currday" : foff[1]
											,	fdate[2].format(this.format) === curdate.format(this.format) ? "currday" : foff[2]
											,	fdate[3].format(this.format) === curdate.format(this.format) ? "currday" : foff[3]
											,	fdate[4].format(this.format) === curdate.format(this.format) ? "currday" : foff[4]
											,	fdate[5].format(this.format) === curdate.format(this.format) ? "currday" : foff[5]
											,	fdate[6].format(this.format) === curdate.format(this.format) ? "currday" : foff[6]
											);

						if (di !== fweek){
							if (	Number(fdate[0].format("dd"))	===	lday
								||	Number(fdate[1].format("dd"))	===	lday
								||	Number(fdate[2].format("dd"))	===	lday
								||	Number(fdate[3].format("dd"))	===	lday
								||	Number(fdate[4].format("dd"))	===	lday
								||	Number(fdate[5].format("dd"))	===	lday
								||	Number(fdate[6].format("dd"))	===	lday){
								break;
							}
						}
						
					}
					
					//--**	calendar show
					calobj	=	$hD("#Cal2");
					if ($U.isNull(calobj)){
						chtml	=	$U.format( this.tframe, $U.format(this.thead, hbody, new Date().format(this.format)));
						templatesection	=	$U.isNullOrEmpty(IMS_config.templateloadsection) ? document.body : $hD("#"+IMS_config.templateloadsection);
						$U.insertHTML(templatesection, "beforeend", chtml);
						
					} else {
						$U.inHTML($hD("tbody", calobj), hbody);
						$hD("#cdate", calobj).innerHTML	=	new Date().format(this.format);
					
					}
					
					//--**	년도 월 선택 강조
					selobj	=	$hD("#Cal2 select");
					for (var xx=0,soo; soo=selobj.options[xx]; xx+=1){
						if (cyear === Number(soo.value)){
							soo.selected = true;
							break;
						}
					}
					$U.each($hA("#Cal2 span"),function(sooo){
						$U.set(sooo,"class","");
					});
					$hA("#Cal2 span")[cmonth-1].className = "on";
					
					if (!$U.isNull(obj)){
						pos	=	$U.getposition(obj);
						pos.x	=	(pos.x + $hD("#Cal2").offsetWidth ) > screen.width ?  screen.width - $hD("#Cal2").offsetWidth - 5 : pos.x ;
						$hD("#Cal2").style.cssText	=	$U.format("position:absolute;z-index:9999999;display:block;left:{0}px;top:{1}px;", pos.x, pos.y + pos.h - 1);
					}

					//--**	window event
					$U.eventbind(document, "onmousedown",	function(e){
						if ($hD("#Cal2").style.display === "block"){
							var ev = window.event || e;
							if ((ev.which||ev.keyCode) === 27){
								Cal2.close();
							}
							if (!$U.rectinchk($hD("#Cal2"), {x:_MOUSE_POSITION.x,y:_MOUSE_POSITION.y})){
								Cal2.close();
							}
						}
					});
					
				} catch(e){
					alert("Cal2 -> show : " + e);
					
				} finally {
						cdate	=	null
					,	curdate	=	null
					,	cyear	=	null
					,	cmonth	=	null
					,	cday	=	null
					,	lday	=	null
					,	fweek	=	null
					,	cfdate	=	null
					,	cwfday	=	null
					,	hbody	=	null
					,	fdate	=	null
					,	calobj	=	null
					,	chtml	=	null
					,	selobj	=	null
					,	pos		=	null
					,	foff	=	null
					,	coff	=	null
					,	targetvalue	=	null
					,	templatesection	=	null;	
					
				}

			}
	
	//-------------------------------------------------------
	//	date 를 구한다.
	//-------------------------------------------------------
	,	getdate	:
			function(v){
				//--**	date validate
				var chk	=	new Date(v);
				if (!(chk.getTime() === chk.getTime())){
					return new Date();
				}
				vrr		=	v.split(this.datediv);
				vrr[1] 	=	vrr[1] -1 ;
				return new Date(vrr[0],vrr[1],vrr[2]);
			}
	
	//-------------------------------------------------------
	//	last day 를 구한다.
	//-------------------------------------------------------
	,	getlastday	:
			function(cyear,cmonth){
				var rv = 0;
				switch(cmonth){
				case 1	:	
				case 3	:	
				case 5	:	
				case 7	:	
				case 8	:	
				case 12	:	
					rv	=	31;	
					break;
				case 4	:	
				case 6	:	
				case 9	:	
				case 10	:	
				case 11	:	
					rv	=	30;	
					break;
				case 2	:	
					rv	=	((cyear % 4 === 0 && cyear % 100 !== 0) || cyear % 400 === 0 )	?	29	:	28;	
					break;
				}	
				return rv;
			}
	
	//-------------------------------------------------------
	//	주차를 구한다
	//-------------------------------------------------------
	,	getweek	:
			function(tdt){
				var dayn = (tdt.getDay() + 6) % 7; 
				tdt.setDate(tdt.getDate() - dayn + 3); 
				var firstThursday = tdt.valueOf(); 
				tdt.setMonth(0, 1); 
				if (tdt.getDay() !== 4) { 
					tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7); 
				} 
				return 1 + Math.ceil((firstThursday - tdt) / 604800000);
			}	
	
	//-------------------------------------------------------
	//	년, 월, 현재 날자로 변경시
	//-------------------------------------------------------
	,	change	:
			function(opt,obj){
				var cdate	=	$U.isNullOrEmpty(this.tvalue) ? new Date() : this.getdate(this.tvalue); 
				var cyear	=	cdate.getFullYear();	
				var cmonth	=	cdate.getMonth() + 1;
				var cday	=	cdate.getDate();
				switch(opt){
				case 1	:	//--	변도 변경
					this.tvalue			=	new Date(obj.options[obj.selectedIndex].value, cmonth-1, cday);
					break;
				case 2	:	//--	월 변경
					this.tvalue			=	new Date(cyear, Number(obj.innerHTML)-1, cday);
					break;
				case 3	:	//--	현재 날자로 변경 
					this.tvalue			=	this.getdate(obj.innerHTML);
					if (this.target.tagName.toUpperCase() === "INPUT"){
						this.target.value		=	this.tvalue.format(this.format);
					} else {
						this.target.innerHTML	=	this.tvalue.format(this.format);
					}	
					if (!$U.isNull(this.callback)){
						this.callback(this.tvalue.format(this.format));
					}
					this.close();
					break;
				}
				
				if (opt === 3){
					return false;
				}
				
				this.tvalue.format(this.format);
				cyear	=	this.tvalue.getFullYear();	
				cmonth	=	this.tvalue.getMonth() + 1;
				cday	=	this.tvalue.getDate();
				
				cmonth	=	cmonth < 10 ? "0" + cmonth : cmonth;  
				cday	=	cday < 10 ? "0" + cday : cday;
				
				this.tvalue	=	cyear	+	this.datediv
							+	cmonth	+	this.datediv
							+	cday	;
				
				this.show();
			}
	
	//-------------------------------------------------------
	//	선택시
	//-------------------------------------------------------
	,	select	:
			function(obj){
				if (this.target.tagName.toUpperCase() === "INPUT"){
					this.target.value		=	$U.get(obj, "val");
				} else {
					this.target.innerHTML	=	$U.get(obj, "val");
				}	
				
				if (!$U.isNull(this.callback)){
					this.callback($U.get(obj, "val"));
				}
				
				this.close();
			}
	
	//-------------------------------------------------------
	//	close
	//-------------------------------------------------------
	,	close	:
			function(){
				$hD("#Cal2").style.display	=	"none";
			}
}


