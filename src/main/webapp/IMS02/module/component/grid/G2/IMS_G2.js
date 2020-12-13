/*=================================================================================
 *	파 일 명		: IMS_G2.js
 *	작성목적		: G2 관련 함수
 *	작 성 자		: 이상준
 *	최초작성일		: 2018.03.08
 *	최종작성일		:
 *	수정내역		:
 *				2018-03-08		이상준		기존 IMS_Grid 를 테이블 기반으로 재개발
 *				2020-02-28		이상준		datasetting 부분 개선
 *				2020-03-02		이상준		title 관련 부분 개선
 *				2020-03-04		이상준		그리드 렌더링 개선
 *				2020-03-05		이상준		그리드 렌더링 개선	-	1.	휠 사용시 위라래로 5개씩 스크롤되도록 처리
 *																2.	현재 화면의 데이타를 위아래로 이동시키고
 *																	tr 을 이동하도록 수정	 	
 *				2020-03-16		이상준		그리드 렌더링 수정	-	1.	휠 사용시 위라래로 5개씩 스크롤되도록 처리
 *																2.	tr 이동시 속도에 따라 비정상동작으로 인해
 *                                                          		데이타를 렌더링하는 쪽으로 변경함 	
 *				2020-03-25		이상준		message 다국어화
 *				2020-04-04		이상준		information 중첩 처리 수정
 *											datatype 추가	->	data type 이 "local" 인경우 로컬 데이타로 소트, 필터, 검색 수행 
 *				2020-04-07		이상준		lineHeight 추가 
 *				2020-04-27		이상준		view row count 가변화 처리 
 *				2020-08-05		이상준		case sensitive 처리 
 *				2020-12-05		이상준		1.	drag&drop 으로 항목을 좁힌후 window.resize 시 화면 깨짐 오류 수정
 *											2.	localcall 시 like 검색 수행 안되는 문제 수정    
 *											3.	엑셀이 1 페이지만 나오는 문제 수정 .. 엑셀 팝업 처리함
 *											4.	리스트 쿼리시 page, pagerowcnt, rowfirst, rowlast, getdata, sort, filter 인자값이 아닐경우 default 처리함
 *											5.	필터 500개로 줄이고 라인 피드 처리함    
 *	--------------------------------------------------------------------------------
 *	
 *	IMS_G2.txt 	사용법 참조
 * 	
=================================================================================*/

var G2Object	=	[];
var G2_FRAME_TEMPLATE 		=	null;
var G2_KEYCHECK_TEMPLATE	=	"<span class='keycheck' name='{0}' field='{1}' keycheck='{2}'>"
													+	"{3}&nbsp;&nbsp;"
													+	"{4}&nbsp;&nbsp;"
													+	"<a onclick='$U.remove(this.parentNode)'><i class='far fa-times-circle'></i></a>"
													+	"</span>";
var G2_SORT_TEMPLATE			=	"<span class='sort' name='{0}' field='{1}' sort='{2}'>"
													+	"{3}&nbsp;&nbsp;"
													+	"<a onclick='_sort_change(this)'>{4}</a>&nbsp;&nbsp;"
													+	"<a onclick='$U.remove(this.parentNode)'><i class='far fa-times-circle'></i></a>"
													+	"</span>";
var G2_FILTER_TEMPLATE		=	"<span class='filter' name='{0}' field='{1}' filter='{2}'>"
													+	"[<font>{5}</font>]&nbsp;&nbsp;"
													+	"{3}&nbsp;&nbsp;"
													+	"{4}&nbsp;&nbsp;"
													+	"<a onclick='$U.remove(this.parentNode)'><i class='far fa-times-circle'></i></a>"
													+	"</span>";

//--**	G2 템플릿 초기화
function G2_begin(){
	if ($U.isNull(G2_FRAME_TEMPLATE)){
		$U.load(IMS_config.path +"/IMS02/module/template/grid/G2_frame.html", function(d){ G2_FRAME_TEMPLATE = d; });
		$U.load(IMS_config.path +"/IMS02/module/template/frame/frame_$P.html");
		$U.load(IMS_config.path +"/IMS02/module/template/grid/G2_popup.html");
		$U.load(IMS_config.path +"/IMS02/module/template/grid/G2_excel.html");
	}
}

//--**	G2 삭제하고 다시 생성시
function G2_remake(g2obj,xnm,option,param,initoption){
	if (!$U.isNull(g2obj)){
		g2obj.remove();
	}
	var robj =	new G2($hD("#"+xnm),option,param,initoption); 
	return	robj;
}

//--**	G2 그리드 오브젝트
function G2(xoo,option,param,initoption){
	
	//-------------------------------------------------------
	//	loading
	//-------------------------------------------------------
	this.loading = function(v){
		if (v === true){
			this.loader.style.display =	"block";
		} else {
			var ooo = this;
			setTimeout(function(){	
				ooo.loader.style.display =	"none";
				ooo = null;
			},100);
		}
	}
	
	//-------------------------------------------------------
	//	headergroup 설정
	//-------------------------------------------------------
	this.headergroupset = function(s){
		var r="",v,sv ;
		v	=	s.split("}");
		for (var i=0,o;o=v[i];i+=1){
			if ( $U.isNullOrEmpty(o)) continue;
			o	=	o.substring(o.indexOf("{")+1);
			sv	=	o.split(",");
			for (var j=0,oo;oo=sv[j];j+=1){
				r	+=	(j===0 ? "{" : "") + '"' + oo.replace("=",'":"') + '",';
			}	
			r	+= 	"},";
		}
		
		r	=	"[" + r.substring(0,r.length-1) + "]";
		r	=	r.replace(/",}/g,'"}');
		r	=	r.replace(/ "|" /g,'"');
		return r;
	}
	
	//-------------------------------------------------------
	//	header 설정
	//-------------------------------------------------------
	this.headerset = function(s){
		
		//--**	기본 헤더 삽입
		s	=	"{ title=, id=g2check, width=25, align=center, type=G2checkbox }" + s;
		return this.headergroupset(s);
		
	}
	
	//-------------------------------------------------------
	//	create
	//-------------------------------------------------------
	this.create	=	function(){
		
		var f01="", f02="", f03="", f04="", f05="", f06="", f07="", f08="", f09="", f10="", f11="";
		var fftd="", fnftd="", fmin=0, fmin2=0, fh=[], ho, fdivw=0, ftitle;
		var temptd	=	"<td style=\"{0}height:{1}px;line-height:{9}px;text-align:{2};color:{8}\" click='{3}' class='{4}' colidx='{5}' colname='{6}'>{7}</td>";
		var tempcol	=	"<col style=\"width:{0};\">";
		var tempth	=	"<th xg-field=\"{0}\" style=\"height:{1}px;line-height:{1}px;{2};\">"
					+	"{3}<div class='resize' onmousedown=\"XDropDrag.drag(event,'G2_HEAD_RESIZE',{4},null,{5})\">"
					+	"</th>";
		var	v	=	[];
		try{
			
			var oooo	=	this;
			
			//--**	다국어 처리
			ftitle	=	IMS_config.language	===	"kor"	?	"title"	:	IMS_config.language + "_title";	
			
			//--**	IE 11 이하인 경우
			v.total01	=	0;
			v.total02	=	0;
			v.total03	=	0;
			v.ho		=	null;
			v.firstw	=	0;
			v.calval	=	1;
			
			if (IDV_BROWSER.IE === "Y"){
				
				//--**	IE new Edge 가 아닌경우
				if ( IDV_BROWSER.NAME === "edge" && IDV_BROWSER.RELEASE === "2" ){
					v.firstw	=	this.header[Number(this.fixCnt)]["width"];
				} else {
					
					for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
						v.ho		=	this.header[i];
						v.total01	+=	$U.isNull(v.ho["width"]) ? 0 : Number(v.ho["width"]);	
					}		
					for (var i=Number(this.fixCnt),j=this.header.length; i<j; i+=1){
						v.ho		=	this.header[i];
						v.total02	+=	$U.isNull(v.ho["width"]) ? 0 : Number(v.ho["width"]);	
					}		
					v.calval	=	(this.G2o.parentElement.offsetWidth - v.total01 ) / v.total02;
					
					if (v.calval > 1){
						for (var i=Number(this.fixCnt)+1,j=this.header.length; i<j; i+=1){
							v.ho		=	this.header[i];
							v.total03	+=	$U.isNull(v.ho["width"]) ? 0 : Number(v.ho["width"]) * v.calval;	
						}		
						v.firstw	=	(this.G2o.parentElement.offsetWidth - v.total01 - v.total03) + 2;
					} else {
						v.calval	=	1;
						v.firstw	=	this.header[Number(this.fixCnt)]["width"];
					}
				}
				
			} else {
				v.firstw	=	this.header[Number(this.fixCnt)]["width"];
			}
			
			//--**	thead
			for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
				ho	=	this.header[i];
				fh.push( ho["hiddenYN"] );
				fmin += Number(fh[i] === "Y" ? "0" : ho["width"] );
				f02	+=  $U.format(tempcol, (fh[i] === "Y" ? "0; display:none" : ho["width"] + "px" ));
				f03	+=	$U.format(tempth, 	ho["id"]
										, 	this.headerHeight
										, 	(fh[i] === "Y" ? "display:none" : "")
										, 	this.setvalue({type:ho["type"],data:"<span title='검색,소트,필터 기능을 사용할수 있습니다\r\nSearch, sort, and filter functions are available'>" + ho[ftitle] + "</span>"})
										,	i
										,	i);
				fdivw	+=	(ho["hiddenYN"] === "Y" ? 0 : Number(ho["width"])); 	
			}
			for (var i=Number(this.fixCnt),j= this.header.length; i<j; i+=1){
				ho	=	this.header[i];
				fh.push( ho["hiddenYN"] );
				fmin2 += Number(fh[i] === "Y" ? "0" : ho["width"] );
				f06	+=  $U.format(tempcol, (fh[i] === "Y" ? "0; display:none" : ( i === Number(this.fixCnt) ? v.firstw : (Number(ho["width"]) * v.calval)) + "px" ));
				f07	+=	$U.format(tempth, 	ho["id"]
										, 	this.headerHeight
										, 	(fh[i] === "Y" ? "display:none" : "")
										, 	this.setvalue({type:ho["type"],data:"<span title='검색,소트,필터 기능을 사용할수 있습니다\r\nSearch, sort, and filter functions are available'>" + ho[ftitle] + "</span>"})
										,	i-Number(this.fixCnt)
										,	i);
			}
			
			//--**	tbody
			f01	=	(Number(this.fixCnt) === 0 ? "nondisplay" : "");
			
			for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
				ho	=	this.header[i];
				fftd	+=	$U.format(temptd
											,	(fh[i] === "Y" ? "display:none;" : "")
											, 	this.rowHeight
											, 	$U.nvl(ho["align"],"center")
											,	$U.isNullOrEmpty(ho["click"]) ? "" : ho["click"]
											,	$U.isNullOrEmpty(ho["click"]) ? "" : "clickstyle" 
											,	i
											,	ho["id"]
											, 	this.setvalue({	type:ho["type"], data:"&nbsp;" })
											,	$U.nvl(ho["color"],"")
											,	this.lineHeight);
			}
			for (var i=Number(this.fixCnt),j= this.header.length; i<j; i+=1){
				ho	=	this.header[i];
				fnftd	+=	$U.format(temptd, 	(fh[i] === "Y" ? "display:none;" : "")
											, 	this.rowHeight
											, 	$U.nvl(ho["align"],"center")
											,	$U.isNullOrEmpty(ho["click"]) ? "" : ho["click"]
											,	$U.isNullOrEmpty(ho["click"]) ? "" : "clickstyle"
											,	i
											,	ho["id"]
											, 	this.setvalue({type:ho["type"],data:"&nbsp;"}) 
											,	$U.nvl(ho["color"],"")
											,	this.lineHeight);
			}

			for (var i=0,j= Number(this.viewRowCnt) ; i<j; i+=1){
				f05	+=	$U.format("<tr idx='{0}'>{1}</tr>",i,fftd);
				f09	+=	$U.format("<tr idx='{0}'>{1}</tr>",i,fnftd);
			}
			
			//--**	headgroup	
			if (this.headerRowCnt !== 1){
				for (var xxx=0,yyy=this.headerRowCnt-1; xxx<yyy; xxx+=1){
					f10 += "<tr>"+ f03 +"</tr>"; 
					f11 += "<tr>"+ f07 +"</tr>"; 
				}
			}
			
			var GOOO	=	this;
			$U.html(	this.G2o.parentElement
					, 	$U.format(	G2_FRAME_TEMPLATE, this.id, f01, f02, f10, f03, f04, f05, f06, f11, f07, f08, f09)
					,	function(){
							GOOO.createcallback(fdivw,fmin2);
					});
		
			
		} catch(e){
			alert("[ G2 || create ]" + e);
		
		} finally {

			f01	=	null;
			f02	=	null;
			f03	=	null;
			f04	=	null;
			f05	=	null;
			f06	=	null;
			f07	=	null;
			f08	=	null;
			f09	=	null;
			f10	=	null;
			f11	=	null;
			fftd	=	null;
			fnftd	=	null;
			fmin  	= 	null;
			fmin2  	= 	null;
			fh		=	null;
			ho 		=	null;
			fdivw	=	null;
			temptd	=	null;
			tempcol	=	null;
			tempth	=	null;
			ftitle	=	null;
			v	=	null;
		
		}

	}

	//-------------------------------------------------------
	//	colobj setting	
	//-------------------------------------------------------
	this.colobjsetting	=	function(){
		var v = [];
		try{
			this.ftbody		=	$hD("table tbody", 		this.fdiv);
			this.nftbody	=	$hD("table tbody", 		this.nfdiv);
			this.ftrobj		=	$hA("table tbody tr",	this.ftbody);
			this.nftrobj	=	$hA("table tbody tr", 	this.nftbody);
			v.colobj01		=	null;
			v.colobj02		=	null;
			this.colobj		=	new Array();
			var oooo		=	this;
			
			for (var ri=0,rj=this.viewRowCnt; ri<rj; ri+=1){
				
				$U.set(this.ftrobj[ri],		"idx",	ri);
				$U.set(this.nftrobj[ri],	"idx",	ri);
				$U.set(this.ftrobj[ri], 	"class",	"out");
				$U.set(this.nftrobj[ri], 	"class", 	"out");
				
				v.ftdobj	=	$hA("td", this.ftrobj[ri]);
				v.nftdobj	=	$hA("td", this.nftrobj[ri])
				
				$U.eventbind( (v.ftdobj.length === 0 ? v.nftdobj[0] : v.ftdobj[0]),	"onclick",	function(){	oooo.G2checkboxclick(this); });
				
				v.colobj01	=	Array.prototype.slice.call(v.ftdobj);	
				v.colobj02	=	Array.prototype.slice.call(v.nftdobj);
				v.colobj01.push.apply(v.colobj01,	v.colobj02);
				this.colobj.push.apply(this.colobj, v.colobj01);
			}
		} catch(e){
			alert("[ G2 || colobjsetting ]" + e);
		
		} finally {
			v	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	create callback
	//-------------------------------------------------------
	this.createcallback	=	function(fdivw,fmin2){
		
		var f01="", f02="", f03="", f04="", fh=[], ho,	ftitle;
		
		try{
			
			//--**	오브젝트 세팅
			this.G2o	=	$hD("#" + this.id);	
			this.fdiv	=	$hD("div[name='FixedDiv']", 	this.G2o);
			this.nfdiv	=	$hD("div[name='NonFixedDiv']", 	this.G2o);
			this.ffdiv	=	$hD("div[name='FrameDiv']", 	this.G2o);
			this.loader	=	$hD("div[name='G2_loader']",	this.G2o);
			this.footer	=	$hD("table[name='G2_footer']",	this.G2o);
			this.scroller 		=	$hD("div[name='G2_scroll']",	this.G2o);
			this.funcdiv  		= 	$hD("div[name='FunctionDiv']",	this.G2o);	
			this.functionarea	=	$hD("div[name='FunctionArea']",	this.G2o);	
			this.fdiv.style.width	=	fdivw + "px";	
			
			//--**	event 세팅
			var ooo = this;
			$U.eventbind( $hD("div[name='FunctionArea']", this.funcdiv), "onclick", function(evt){ evt = evt || window.event; if (this === (evt.target || evt.srcElement)) { ooo.call(ooo.param); }});	
			$U.eventbind( $hD("a[name='excelexec']",	this.funcdiv), "onclick", function(){ ooo.excelpopup(); });	
			$U.eventbind( $hA("th span", this.fdiv), "onclick", function(){ ooo.popup(this); });	
			$U.eventbind( $hA("th span", this.nfdiv), "onclick", function(){ ooo.popup(this); });	
			$U.eventbind( this.fdiv, "onmousewheel", function(e){ ooo.mousewheel(e); });	
			$U.eventbind( this.nfdiv, "onmousewheel", function(e){ ooo.mousewheel(e); });	
			if (IDV_BROWSER.NAME === "firefox"){
				$U.eventbind( this.fdiv, "onDOMMouseScroll", function(e){ ooo.mousewheel(e); });	
				$U.eventbind( this.nfdiv, "onDOMMouseScroll", function(e){ ooo.mousewheel(e); });	
	    	}
			$U.eventbind( $hA("table tbody tr", this.fdiv), "onmouseover", function(){ ooo.trmouseover(this); });
			$U.eventbind( $hA("table tbody tr", this.nfdiv), "onmouseover", function(){ ooo.trmouseover(this); });
			$U.eventbind( $hA("table tbody tr", this.fdiv), "onmouseout", function(){ ooo.trmouseout(this); });
			$U.eventbind( $hA("table tbody tr", this.nfdiv), "onmouseout", function(){ ooo.trmouseout(this); });
	
			$U.eventbind( $hA("table thead .G2checkbox", this.fdiv), "onchange", function(e){ ooo.G2checkboxheadclick(this,e); });
			$U.eventbind( $hA("table thead .G2checkbox", this.nfdiv), "onchange", function(e){ ooo.G2checkboxheadclick(this,e); });
			
			$U.eventbind( $hA("table tbody tr td", this.fdiv), 	"onclick", function(){ ooo.tdclick(this); });
			$U.eventbind( $hA("table tbody tr td", this.nfdiv), "onclick", function(){ ooo.tdclick(this); });
			$U.eventbind( $hA("table tbody tr td", this.fdiv), 	"onmouseover",	function(){ ooo.tdmouseover(this); });
			$U.eventbind( $hA("table tbody tr td", this.nfdiv), "onmouseover", 	function(){ ooo.tdmouseover(this); });
			
			//$hD("table[name='NonFixedTable']", this.G2o).style.minWidth = fmin2 + "px"; 
			$U.set(this.ffdiv,	"G2ID",	this.id); 
	
			//--**	다국어 처리
			ftitle	=	IMS_config.language	===	"kor"	?	"title"	:	IMS_config.language + "_title";	
	
			//--**	header group 세팅	
			if (this.headergroup.length > 0){
				
				for (var i=0,j=this.headergroup.length; i<j; i+=1){
					ho = this.headergroup[i];
					
					//--**	colspan,row,cell 은 필수, rowspan 은 선택
					if ($U.isNull(ho["colspan"])){
						alert("colspan attribute necessary!!!");
						break;
					}
					if ($U.isNull(ho["row"])){
						alert("row attribute necessary!!!");
						break;
					}
					if ($U.isNull(ho["cell"])){
						alert("cell attribute necessary!!!");
						break;
					}
					
					//--**　	대상선정
					//--**	시작 cell 의 위치에 따라 대상 선정
					f03	=	Number(ho["cell"]) < Number(this.fixCnt) ? Number(ho["cell"]) : Number(ho["cell"]) - Number(this.fixCnt);
					fh	=	Number(ho["cell"]) < Number(this.fixCnt) ? this.fdiv : this.nfdiv;
					f01	=	$hA("table thead tr", fh)[Number(ho["row"])];
					f02	=	$hA("th", f01);
					f04	=	f03 + Number(ho["colspan"]) > f02.length ?  f02.length - f03 : ho["colspan"];
					$U.set(f02[f03],"colspan", f04 );
					$U.settext(f02[f03],ho[ftitle]);
					
					//--**	중복되는 cell 의 display 를 none 으로 처리
					for (var aaa=f03+1,bbb=f03+Number(f04); aaa<bbb; aaa+=1){
						$U.set(f02[aaa],"style", "display:none");
					}
				}
				
				//--**	하위 같은 로우끼리 처리 할것
				for (var eee=0; eee<2; eee+=1){
					f01 = 	$hA("table thead tr th", (eee===0 ? this.fdiv : this.nfdiv));
					f02	=	(f01.length/Number(this.headerRowCnt));
					for (var xxx=0,yyy=f01.length-f02; xxx<yyy; xxx+=1){
						if (f01[xxx].style.display	===	"none") continue;
						for (var kkk=1,ggg=(this.headerRowCnt - (xxx / f02)); kkk<ggg; kkk+=1){
							if ( $U.text(f01[xxx]) ===  $U.text(f01[kkk*f02+xxx])){
								f01[kkk*f02+xxx].style.display = "none";
								f04 = $U.nvl($U.get(f01[xxx],"rowspan"),1);
								$U.set(f01[xxx],"rowspan",f04+1);
							} 
						}
					}
				}
			}
			
			G2Object.push(this);
		
		} catch(e){
			alert("[ G2 || createcallback ]" + e);
		
		} finally {
	
			f01	=	null;
			f02	=	null;
			f03	=	null;
			f04	=	null;
			fh	=	null;
			ho	=	null;
			ftitle	=	null;
		
		}
		
	}
	
	//-------------------------------------------------------
	//	resize
	//-------------------------------------------------------
	this.resize	=	function( vidx ){
		
		if ($U.isNull(this.G2o)){ 
			return;
		}
		
		var v = [];
		
		try{
			
			//--**	IE new Edge 값 차이
			if ( IDV_BROWSER.NAME === "edge" && IDV_BROWSER.RELEASE === "2" ){
				v.chai	=	2;
				v.chai2	=	1;
			} else {
				v.chai	=	0; 
				v.chai2	=	0;	
			}
		
			this.ffdiv.style.width		=	"";
			this.nfdiv.style.width		=	( this.G2o.parentElement.offsetWidth - this.fdiv.offsetWidth + 2) + "px";
			this.nfdiv.style.maxWidth	=	this.nfdiv.style.width;
//			this.ffdiv.style.width 		=	( this.fdiv.offsetWidth + this.nfdiv.offsetWidth + v.chai) + "px"; 
			
			//--**	scroller 위치 조정
			this.scroller.style.top		= $U.getposition(this.funcdiv).h + $U.getposition($hD("table thead", this.nfdiv)).h  + v.chai2 + "px";	
			this.scroller.style.height	= $U.getposition($hD("table tbody", this.nfdiv)).h - (1 + v.chai2) + "px";	//--**	w scroller 감안	
			this.scroller.style.right	= "-1px"; //(1 + v.chai) + "px";	//--**	w scroller 감안	
			
			//--**	head height 보정
			this.hhcorrect( vidx );
			
		} catch(e){
			alert("[ XGid || resize ]" + e);
		} finally {
			v	=	null;
		}
	}

	//-------------------------------------------------------
	//	head height correction
	//-------------------------------------------------------
	this.hhcorrect	=	function( vidx ){
		
		var v = [];
		try{
			
			//--**	fixdiv thead tr 과 nfixdiv thead tr sync
			if (this.fixCnt > 0){
				v.vidx		=	$U.nvl(vidx,-1);	
				v.ftrobj	=	$hA("table thead tr", this.fdiv);
				v.nftrobj	=	$hA("table thead tr", this.nfdiv);
				for (let qq=0,ww=this.headerRowCnt; qq<ww; qq+=1){
					if (v.vidx === -1){
						if (v.ftrobj[qq].offsetHeight > v.nftrobj[qq].offsetHeight){		v.nftrobj[qq].style.height	=	v.ftrobj[qq].offsetHeight + "px";
						} else if (v.ftrobj[qq].offsetHeight < v.nftrobj[qq].offsetHeight){	v.ftrobj[qq].style.height	=	v.nftrobj[qq].offsetHeight + "px";
						}
					} else {
						if (v.vidx < this.fixCnt){	v.nftrobj[qq].style.height	=	v.ftrobj[qq].offsetHeight + "px";
						} else {					v.ftrobj[qq].style.height	=	v.nftrobj[qq].offsetHeight + "px";
						}
					}
					
				}
			}
			
		} catch(e){	alert("[ XGid || hhcorrect ]" + e);
		} finally {	v	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	excel 템플릿 오픈
	//-------------------------------------------------------
	this.excelpopup = function(o){
		
		var ooo = this;
		new $P({	target		:	ooo
				,	template	:	"#template_G2_excel"
				,	title		:	"G2 Excel Download"
				,	button		:	"Cancel"		//	Save, Delete, Confirm, Select, Search, Cancel	중 선택
				,	custombutton  :	"button01"						//	button01 ~ button10 중 선택
				,	afterOpen	:	function(poo){

						$hD("input[name=g2ExcelFirstLine]").value	=	"1";
						$hD("input[name=g2ExcelLastLine]").value	=	ooo.data.total;
					
						$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
						$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ 	
																								let fval = $hD("input[name=g2ExcelFirstLine]").value;
																								let lval = $hD("input[name=g2ExcelLastLine]").value;
																								
																								//--** validate
																								if (!$U.isNumber(fval) || $U.isNullOrEmpty(fval)){
																									alert("숫자만 가능합니다\r\nOnly numbers are allowed.");
																									$hD("input[name=g2ExcelFirstLine]").select();
																									return false;
																								}
																								if (Number(fval) < 0){
																									alert("0 보다 커야 합니다\r\nMust be greater than zero.");
																									$hD("input[name=g2ExcelFirstLine]").select();
																									return false;
																								}
																								if (!$U.isNumber(lval) || $U.isNullOrEmpty(lval)){
																									alert("숫자만 가능합니다\r\nOnly numbers are allowed.");
																									$hD("input[name=g2ExcelLastLine]").select();
																									return false;
																								}
																								if (Number(lval) < 0){
																									alert("0 보다 커야 합니다\r\nMust be greater than zero.");
																									$hD("input[name=g2ExcelLastLine]").select();
																									return false;
																								}
																								if (fval > lval){
																									alert("First Line은 Last Line보다 작아야 합니다\r\nFirst Line must be smaller than Last Line.");
																									$hD("input[name=g2ExcelFirstLine]").select();
																									return false;
																								}
																								
																								poo.attr.target.excel(fval,lval); 
																								poo.close();
																							});
						$hD("a",poo.custombuttonobj["button01"]).innerHTML = "Excel Download";
				
				}	
			},{w:400,h:200,mw:400,mh:200}
		);
		
	}
	
	//-------------------------------------------------------
	//	excel download
	//-------------------------------------------------------
	this.excel	=	function(vfval,vlval){

		var v = [];
		
		try{
			
			v.title		=	encodeURIComponent(this.id);
			v.url		=	encodeURIComponent(this.url);
			v.param 	=	encodeURIComponent($U.isNullOrEmpty(this.param) ? "" : this.param);
			v.header	=	encodeURIComponent(JSON.stringify(this.header));
			v.headergroup	=	encodeURIComponent(JSON.stringify(this.headergroup));
			v.headerrowcnt	=	encodeURIComponent(this.headerRowCnt);
			
			v.evsort		=	encodeURIComponent(this.sortset());
			v.evfilter		=	encodeURIComponent(this.filterset());
			v.evkeycheck	=	encodeURIComponent(this.keycheckset());
			
			v.frame	= $hD("#_IMS_GRID_G2_TOEXCEL_TARGET_FRAME");
			if ($U.isNull(v.frame)){
				v.f	=	document.createElement("iframe");
				v.f.id	=	"_IMS_GRID_G2_TOEXCEL_TARGET_FRAME";
				v.f.name	=	"_IMS_GRID_G2_TOEXCEL_TARGET_FRAME";
				v.f.style.display	= "none";
				document.body.appendChild(v.f);
				v.frame	= $hD("#_IMS_GRID_G2_TOEXCEL_TARGET_FRAME");
			}
			
			v.form = $hD("#_IMS_GRID_G2_TOEXCEL_FORM");
			if ($U.isNull(v.form)){
				v.f	=	document.createElement("form");
				v.f.action	=	"/ImsExcel";
				v.f.method	=	"post";
				v.f.target	=	"_IMS_GRID_G2_TOEXCEL_TARGET_FRAME";
				v.f.id		=	"_IMS_GRID_G2_TOEXCEL_FORM";
				
				v.input_t				=	document.createElement("input");
				v.input_t.type	=	"hidden";
				v.input_t.name	=	"_IMS_GRID_TOEXCEL_TITLE";
				v.input_t.id	=	"_IMS_GRID_TOEXCEL_TITLE";
				
				v.input_u		=	document.createElement("input");
				v.input_u.type	=	"hidden";
				v.input_u.name	=	"_IMS_GRID_TOEXCEL_URL";
				v.input_u.id	=	"_IMS_GRID_TOEXCEL_URL";
				
				v.input_p		=	document.createElement("input");
				v.input_p.type	=	"hidden";
				v.input_p.name	=	"_IMS_GRID_TOEXCEL_PARAM";
				v.input_p.id	=	"_IMS_GRID_TOEXCEL_PARAM";
				
				v.input_h		=	document.createElement("input");
				v.input_h.type	=	"hidden";
				v.input_h.name	=	"_IMS_GRID_TOEXCEL_HEADER";
				v.input_h.id	=	"_IMS_GRID_TOEXCEL_HEADER";
				
				v.input_hg		=	document.createElement("input");
				v.input_hg.type	=	"hidden";
				v.input_hg.name	=	"_IMS_GRID_TOEXCEL_HEADERGROUP";
				v.input_hg.id	=	"_IMS_GRID_TOEXCEL_HEADERGROUP";
				
				v.input_hc		=	document.createElement("input");
				v.input_hc.type	=	"hidden";
				v.input_hc.name	=	"_IMS_GRID_TOEXCEL_HEADER_ROWCNT";
				v.input_hc.id	=	"_IMS_GRID_TOEXCEL_HEADER_ROWCNT";

				v.input_fline		=	document.createElement("input");
				v.input_fline.type	=	"hidden";
				v.input_fline.name	=	"_IMS_GRID_TOEXCEL_FIRST_LINE";
				v.input_fline.id	=	"_IMS_GRID_TOEXCEL_FIRST_LINE";

				v.input_lline		=	document.createElement("input");
				v.input_lline.type	=	"hidden";
				v.input_lline.name	=	"_IMS_GRID_TOEXCEL_LAST_LINE";
				v.input_lline.id	=	"_IMS_GRID_TOEXCEL_LAST_LINE";

				v.input_sort		=	document.createElement("input");
				v.input_sort.type	=	"hidden";
				v.input_sort.name	=	"_IMS_GRID_TOEXCEL_SORT";
				v.input_sort.id		=	"_IMS_GRID_TOEXCEL_SORT";

				v.input_filter		=	document.createElement("input");
				v.input_filter.type	=	"hidden";
				v.input_filter.name	=	"_IMS_GRID_TOEXCEL_FILTER";
				v.input_filter.id	=	"_IMS_GRID_TOEXCEL_FILTER";
				
				v.input_keycheck		=	document.createElement("input");
				v.input_keycheck.type	=	"hidden";
				v.input_keycheck.name	=	"_IMS_GRID_TOEXCEL_KEYCHECK";
				v.input_keycheck.id		=	"_IMS_GRID_TOEXCEL_KEYCHECK";
				
				v.f.appendChild(v.input_t);						
				v.f.appendChild(v.input_u);						
				v.f.appendChild(v.input_p);						
				v.f.appendChild(v.input_h);						
				v.f.appendChild(v.input_hg);						
				v.f.appendChild(v.input_hc);						
				v.f.appendChild(v.input_fline);						
				v.f.appendChild(v.input_lline);						
				v.f.appendChild(v.input_sort);						
				v.f.appendChild(v.input_filter);						
				v.f.appendChild(v.input_keycheck);						
				
				document.body.appendChild(v.f);
				
				v.form = $hD("#_IMS_GRID_G2_TOEXCEL_FORM");
				
			}
			
			$hD("#_IMS_GRID_TOEXCEL_TITLE", 	v.form).value	=	v.title;
			$hD("#_IMS_GRID_TOEXCEL_URL",  		v.form).value	=	v.url;
			$hD("#_IMS_GRID_TOEXCEL_PARAM",  	v.form).value	=	v.param;
			$hD("#_IMS_GRID_TOEXCEL_HEADER", 	v.form).value	=	v.header;
			$hD("#_IMS_GRID_TOEXCEL_HEADERGROUP", 	v.form).value	=	v.headergroup;
			$hD("#_IMS_GRID_TOEXCEL_HEADER_ROWCNT", v.form).value	=	v.headerrowcnt;
			$hD("#_IMS_GRID_TOEXCEL_FIRST_LINE", 	v.form).value	=	vfval;
			$hD("#_IMS_GRID_TOEXCEL_LAST_LINE", 	v.form).value	=	vlval;
			$hD("#_IMS_GRID_TOEXCEL_SORT", 		v.form).value	=	v.evsort;
			$hD("#_IMS_GRID_TOEXCEL_FILTER", 	v.form).value	=	v.evfilter;
			$hD("#_IMS_GRID_TOEXCEL_KEYCHECK", 	v.form).value	=	v.evkeycheck;

			v.form.submit();
			
		} catch(e){
			alert("[G2 > TOEXCEL] " + e);
		
		} finally {
			v	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	Data Call
	//-------------------------------------------------------
	this.call	=	function(param){
		
 		//--**	검색 시작 Time
		this.stime	=	new Date().getTime();
		
		this.loading(true);
		
		this.rowFirst	=	((parseInt(this.page)-1) * parseInt(this.pageRowCnt));
		this.rowLast	=	((parseInt(this.page) * parseInt(this.pageRowCnt)));
		this.topRow		=	1;
		this.param		=	param;
		
		var p 	=	"page=" 		+ 	this.page 
				+	"&pageRowCnt=" 	+	this.pageRowCnt
				+	"&rowFirst=" 	+	this.rowFirst 
				+	"&rowLast=" 	+ 	this.rowLast
				+	"&sort="		+	this.sortset()
				+	"&filter="		+	this.filterset()
				+	"&keycheck="	+	this.keycheckset()
				+	"&getdata=*"	
				+	"&groupby="		
				+	"&"+ this.param;
		
		var ooo = this;
		this.nfdiv.style.overflowX	=	"hidden";	
		
		this.callprocess(p,	function(data){
				
			ooo.data	=	data;	//--**	data set
			ooo.paging();			//--**	paging 처리
			ooo.setting();			//--**	데이타 처리
			ooo.etime	=	new Date().getTime();		//--**	종료시간
			ooo.loading(false);		//--**	로딩 닫기
			ooo.information("search-time", ((ooo.etime - ooo.stime) /1000));	//--**	information display
			ooo.nfdiv.style.overflowX	=	"auto";		//--**	overflow	
			ooo.success();			//--**	success
			ooo.resize();			//--**	resize
			
			//--**	임시
			//ooo.datatype	=	"local";
			//ooo.origindataset(data);
			
		} , function(){ 
			
			ooo.loading(false); 
			ooo.information("search-error"); 
			ooo.nfdiv.style.overflowX	=	"auto";		//--**	overflow	
			ooo.fail();				//--**	fail
			ooo.resize();			//--**	resize			
		});
		
	}

	//-------------------------------------------------------
	//	Data Call process
	//-------------------------------------------------------
	this.callprocess	=	function(vparam, vcallback, veerorcallback){
		
		if (this.datatype	===	"server"){
			$A.call({url:this.url,param:vparam,ptype:"string"}, vcallback , veerorcallback);
		
		} else if (this.datatype	===	"local"){
			this.localcall(vparam, vcallback , veerorcallback);
		
		}
	}
	
	//-------------------------------------------------------
	//	Data local Call
	//-------------------------------------------------------
	this.localcall	=	function(vparam, vcallback, veerorcallback){
		
		/*
		console.log(vparam);
		vparam	=	"page=1&pageRowCnt=100&rowFirst=0&rowLast=100&"
				+	"sort=ORDER BY p_approve ASC&"
				+	"filter= "
				//+	"AND NVL(school,'NULL') NOT IN ( '가천대길병원','(주)파마크로') " 
				//+	"AND NVL(pos,'NULL') IN ( '사원','교수') "
				//+	"AND NVL(hp1,'NULL') IN ( '010-4472-4003') " 
				//+	"AND NVL(school,'NULL') ims_g2_less-than '가천대길병원' " 
				//+	"AND NVL(pos,'NULL') BETWEEN '기관' AND '클립스(주)' "	 
				//+	"AND NVL(pos,'NULL') ims_g2_greater-than-equal '과장' "
				//+	"&keycheck= AND NVL(pos,'NULL') LIKE '##연구##' "	  
				//+	"AND NVL(school,'NULL') LIKE '##가천##'" 
				+	"&getdata=*&groupby=&undefined";
			
			AND NVL(school,'NULL') IN ( '가천대길병원','(주)파마크로') 
			AND NVL(pos,'NULL') IN ( '사원','교수') 
			AND NVL(hp1,'NULL') IN ( '010-4472-4003') 
			AND NVL(school,'NULL') ims_g2_greater-than '회사명' 
			AND NVL(aff,'NULL') BETWEEN '부서.....'	AND 'eIRB' 
			AND NVL(pos,'NULL') ims_g2_greater-than-equal '과장'  
			AND NVL(aff,'NULL') LIKE '##부서##' 
			AND NVL(school,'NULL') LIKE '##소속##'			
		*/

		if ($U.isNull(this.origindataget())){
			this.locading(false);
			return;
		}
		
		var v = [];
		try{
			v.sptval	=	vparam.split("&");
			v.chkval	=	"";
			v.chkval2	=	"";
			for (let x=0,oo; oo=v.sptval[x]; x+=1){
				if (oo.indexOf("filter=")>-1){
					v.chkval	+=	oo.replace(/filter\=/g,"");	
				}
				if (oo.indexOf("keycheck=")>-1){
					v.chkval	+=	oo.replace(/keycheck\=/g,"");	
				}
				if (oo.indexOf("sort=")>-1){
					v.chkval2	+=	oo.replace(/sort\=/g,"");	
				}
			}
			
			v.upperchar	=	IMS_config.dbupperType.split("(")[0];
			v.nullchar	=	IMS_config.dbnullType.split("(")[0];
			v.rexp1		=	new RegExp(v.upperchar+"\\(","g");
			v.rexp2		=	new RegExp("\\)\\,","g");
			v.rexp3		=	new RegExp("\\)\\|","g");
			v.chkval	=	v.chkval.replace(v.rexp1,"").replace(v.rexp2,",").replace(v.rexp3,"|");	
			v.chkval2	=	v.chkval2.replace(v.rexp1,"").replace(v.rexp2,",").replace(v.rexp3,"|");	
			
			//console.log(v.chkval);
			v.sptval	=	v.chkval.split(v.nullchar+"(");
			v.field		=	"";
			v.val01		=	"";
			v.rows		=	this.origindataget().rows;
			v.rdata		=	[];
			
			for (let x=0,oo; oo=v.sptval[x]; x+=1){
				v.field	=	oo.substring(0,oo.indexOf(","));
				if (oo.indexOf(" NOT IN ") > -1){
					v.val01	=	oo.substring(oo.indexOf(" NOT IN ")+9).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						v.rdata	=	[];
						zoo	=	zoo.trim().substring(1);
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] !== zoo){
								v.rdata.push(qoo);
							}
						}
						v.rows	=	v.rdata;
					}
					
				} else if (oo.indexOf(" IN ") > -1){
					v.val01	=	oo.substring(oo.indexOf(" IN ")+5).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						zoo	=	zoo.trim().substring(1);
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] === zoo){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
				
				} else if (oo.indexOf(" LIKE ") > -1){
					
					v.rexp1	=	new RegExp("CONCAT\\('##'\\,|\\,'##'\\)","g");
					v.rexp2	=	new RegExp("'##'|\\|\\|","g");
					v.xoo	=	oo.replace(v.rexp1,"").replace(v.rexp2,"");
					
					v.val01	=	v.xoo.substring(oo.indexOf(" LIKE ")+7).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field].indexOf(zoo) > -1){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
					
				} else if (oo.indexOf(" BETWEEN ") > -1){
					
					v.val01	=	oo.substring(oo.indexOf(" BETWEEN ")+10).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						if (zoo === ""){
							continue;
						}
						v.val02	=	zoo.split("'  '");
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] >= v.val02[0] && qoo[v.field] <= v.val02[1]){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
					
					
				} else if (oo.indexOf(" ims_g2_greater-than-equal ") > -1){

					v.val01	=	oo.substring(oo.indexOf(" ims_g2_greater-than-equal ")+28).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] >= zoo){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
				
				} else if (oo.indexOf(" ims_g2_greater-than ") > -1){

					v.val01	=	oo.substring(oo.indexOf(" ims_g2_greater-than ")+22).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] > zoo){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
				
				
				} else if (oo.indexOf(" ims_g2_less-than-equal ") > -1){
					
					v.val01	=	oo.substring(oo.indexOf(" ims_g2_less-than-equal ")+25).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] <= zoo){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
					
				} else if (oo.indexOf(" ims_g2_less-than ") > -1){
					
					v.val01	=	oo.substring(oo.indexOf(" ims_g2_less-than ")+19).replace(/AND/g,"");
					v.val01	=	(v.val01.substring(0,v.val01.lastIndexOf("'")+1)+",").split("',");
					v.rdata	=	[];
					for (let z=0,zoo;zoo=v.val01[z];z+=1){
						if (zoo === ""){
							continue;
						}
						for (let q=0,qoo;qoo=v.rows[q];q+=1){
							if (qoo[v.field] < zoo){
								v.rdata.push(qoo);
							}
						}
					}
					v.rows	=	v.rdata;
				
				}
			}
			
			//--**	sort 처리
			if (v.chkval2 !== ""){
				
				v.sptval	=	v.chkval2.replace(/ORDER BY /g,"").split(",");
				v.field		=	"";
				v.val01		=	null;
				for (let z=0,zoo;zoo=v.sptval[z];z+=1){
					v.val01	=	zoo.split(" ");
					v.rows.sort(function(a,b){
						lvv = a[v.val01[0].toLowerCase()]||a[v.val01[0].toUpperCase()];
						uvv = b[v.val01[0].toLowerCase()]||b[v.val01[0].toUpperCase()];
						if (v.val01[1] === "DESC"){
							return lvv > uvv;
						} else {
							return lvv < uvv;
						}
					});
					v.rows.sort();
					
				}
			}
			
			vcallback({pagetotal:1, total:v.rows.length, page:1, rows:v.rows});
			
		} catch(e){	alert("[ G2 > localcall ]" + e);	veerorcallback();
		} finally {	v	=	null;
		}	
		
	}
	
	//-------------------------------------------------------
	//	Data load 데이타만 재수행
	//-------------------------------------------------------
	this.load	=	function(data){
		
		this.loading(true);
		try{
			this.nfdiv.style.overflowX	=	"hidden";	
			this.stime	=	new Date().getTime();
			this.loading(false);
			this.data	=	$U.isNull(data) ? this.data : data;
			this.data.total	=	this.data.rows.length;
			this.data.pagetotal	=	(this.data.rows.length / this.pageRowCnt) + 1;
			this.data.page	=	1;
			this.paging();
			this.setting();
			this.etime	=	new Date().getTime();
			this.information("search-time",((this.etime - this.stime) /1000));
			this.nfdiv.style.overflowX	=	"auto";	
			this.success();
		
		} catch(e){
			this.information("search-error"); 
			this.fail();
			
		} finally{
			this.loading(false);
			
		}
		
	}
	
	//-------------------------------------------------------
	//	reload	검색만 재수행
	//-------------------------------------------------------
	this.reload	=	function(){
		this.call(this.param)
	}

	//-------------------------------------------------------
	//	redraw	상수값등이 변경시 그리드 다시 그림
	//-------------------------------------------------------
	this.redraw	=	function(){
	
		//--**	생성 수행
		//--**	사이즈 조정
		//--**	rendering object setting
		//--**	초기 key 값이 있을경우 처리		{keyid:,keyvalue: }
		//--**	초기 sort 값이 있을경우 처리 		{sortid:,sorttype:}
		//--**	초기 filter 값이 있을경우 처리	{filterid:,filter:}
		//--**	초기검색인 경우 검색 수행
		
		this.create();
		this.resize();
		this.colobjsetting();
		if (!$U.isNull(this.initkey)){
			this.initkeymake();
		}
		if (!$U.isNull(this.initsort)){
			this.initsortmake();
		}
		
		if (!$U.isNull(this.initfilter)){
			this.initfiltermake();
		}
		
		if (option.InitialSearch){
			this.call(this.param);
		} 
	
	}
	
	//-------------------------------------------------------
	//	Paging 처리
	//-------------------------------------------------------
	this.paging	=	function(){
		
		var pt,cbp2,cbp1,cp,cap1,cap2,emoo;
		try{
			
			//--**	paging 처리
			cp		=	parseInt(this.data.page);
			cbp2	=	cp - 2 < 1 ? "" : "<span name='no'>" + (cp - 2) + "</span>&nbsp;" ; 
			cbp1	=	cp - 1 < 1 ? "" : "<span name='no'>"+ (cp - 1) + "</span>&nbsp;" ;
			cap1	=	cp + 1 > parseInt(this.data.pagetotal) ? "" : "&nbsp;<span name='no'>" + (cp + 1) + "</span>&nbsp;";
			cap2	=	cp + 2 > parseInt(this.data.pagetotal) ? "" : "<span name='no'>" + (cp + 2) + "</span>";
			
			//--**	통 갯수가 rowLast 보다 작을 경우 rowLast 값을 변경
			this.rowLast	=	Number(this.data.total) < Number(this.rowLast) ? this.data.total : this.rowLast;
			
			emoo	=	$hA("em", this.footer);
			emoo[0].innerHTML	=	$U.tocurrency(this.data.total);
			emoo[1].innerHTML	=	this.rowFirst + "-" + this.rowLast;
			emoo[2].innerHTML	=	cbp2 + cbp1 + "<font>" + cp + "</font>" + cap1 + cap2;
			emoo[3].innerHTML	=	parseInt(this.data.pagetotal) > 1 ? "1-" + this.data.pagetotal : "1";
			$hD("input[name=viewcount]",	this.footer).value	=	this.pageRowCnt;	
			$hD("input[name=viewrowcount]",	this.footer).value	=	this.viewRowCnt;	
			$hD("input[name=gopage]",		this.footer).value	=	cp;	
			
			var ooo = this;
			
			$hD("input[name=viewcount]",	this.footer).onchange 	= 	function(){ ooo.pageRowCnt = this.value };
			$hD("input[name=viewrowcount]",	this.footer).onchange	= 	function(){ ooo.viewRowCnt = this.value };
			$hD("input[name=gopage]",		this.footer).onchange	=	function(){ ooo.page = Number(ooo.data.pagetotal) < Number(this.value) ? ooo.data.pagetotal : this.value; };
			$hA("a",this.footer)[0].onclick	=	function(){ ooo.call(ooo.param); };
			$hA("a",this.footer)[1].onclick	=	function(){ ooo.page = 1; ooo.call(ooo.param); };
			$hA("a",this.footer)[2].onclick	=	function(){ ooo.page = parseInt(ooo.page) - 1 < 1 ? 1 : parseInt(ooo.page) - 1; ooo.call(ooo.param); };
			$hA("a",this.footer)[3].onclick	=	function(){ ooo.page = parseInt(ooo.page) + 1 > ooo.data.pagetotal ? ooo.data.pagetotal : parseInt(ooo.page) + 1; ooo.call(ooo.param); };
			$hA("a",this.footer)[4].onclick	=	function(){ ooo.page = ooo.data.pagetotal; ooo.call(ooo.param); };
			$hA("a",this.footer)[5].onclick	=	function(){ ooo.call(ooo.param); 	};
			$hD(".viewrowinfo span",this.footer).onclick	=	function(){ ooo.redraw(); 			};
			$U.each($hA("span[name=no]",this.footer), function(soooo){
				soooo.onclick	=	function(){ ooo.page = this.innerHTML; ooo.call(ooo.param); };
			})
			
			this.G2info	=	$hD("div[name=G2info]", this.G2o);
			
		}catch(e){
			alert("[ G2 > paging ]" + e);
		}finally{
			pt		=	null;
			cbp2	=	null;
			cbp1	=	null;
			cp		=	null;
			cap1	=	null;
			cap2	=	null;
			emoo	=	null;
		}
		
	}

	//-------------------------------------------------------
	//	G2 의 정보 display
	//-------------------------------------------------------
	this.information =	function(opt,p1){

		if ($U.isNull(this.G2info)) return;
		var s	=	"";
		
		if (IMS_config.language	===	"kor"){
			switch(opt){
			case "no-data"		:	s	=	"이 조건에 해당하는 데이터가 없습니다...";	break;
			case "search-time"	:	s	=	"검색에 " + p1 + "초가 소요되었습니다...";	break;
			case "search-error"	:	s	=	"검색시  오류가 발생하였습니다...";			break;
			}
			
		} else {
			switch(opt){
			case "no-data"		:	s	=	"No data found then this condition...";	break;
			case "search-time"	:	s	=	"this search took " + p1 + " seconds...";	break;
			case "search-error"	:	s	=	"An error occurred when searching....";			break;
			}
		}
		
		this.G2info.innerHTML	=	this.G2info.innerHTML === "" ? s : ( this.infotype === opt ? s : this.G2info.innerHTML +"&nbsp;&nbsp;&nbsp;"+s );
		this.infotype			=	opt;
		
		//--**	5초후 information 삭제
		var oinfo = this.G2info;
		setTimeout(function(){ oinfo.innerHTML	=	""; },3000);
		
	}
	
	//-------------------------------------------------------
	//	스크롤바 , data 처리
	//-------------------------------------------------------
	this.setting =	function(){
		
		this.scrollsetting();
		this.datasetting();
		
	}
	
	//-------------------------------------------------------
	//	스크롤바  처리
	//-------------------------------------------------------
	this.scrollsetting =	function(){
		
		var v=[];
		try{
			
			v.hh 			= 	$U.getposition($hD("table thead", this.nfdiv)).h; //[0].offsetHeight;	//--**	첫 헤더는 항상 선택 라인이므로 headerrowcnt 적용 안함 * this.headerRowCnt;
			this.trheight	=	$U.getposition($hA("table tbody tr td", this.nfdiv)[0]).h;
			
			//--**	가끔 0 이 발생하는 경우 처리 주로  다른 object(특히 table) 내부에 있는 경우
			if (this.trheight === 0){
				this.trheight	=	( this.nfdiv.offsetHeight -	$hA("table thead tr th", this.nfdiv)[0].offsetHeight ) / this.viewRowCnt; 
			}
			
			//--**	IE Edge 상수 변경
			v.chai	=	IDV_BROWSER.NAME === "edge" && IDV_BROWSER.RELEASE === "2"	?	2 : 0;
			v.chai2	=	IDV_BROWSER.NAME === "edge" && IDV_BROWSER.RELEASE === "2"	?	1 : 0;
			
			//--**	scroller 처리
			this.scroller.style.display	= 	this.data.rows.length > Number(this.viewRowCnt) ? "block" : "none";	
			this.scroller.style.top		= 	$U.getposition(this.funcdiv).h + v.hh  + "px";	
			this.scroller.style.height	= 	$U.getposition($hD("table tbody", this.nfdiv)).h - (1 + v.chai2) + "px";	//--**	w scroller 감안	
			this.scroller.style.right	= 	(1 + v.chai) + "px";	//--**	w scroller 감안	
			this.scrollerDetail			=	$hD("div[name=G2_scroll_detail]", this.scroller)	
			this.scrollerDetail.style.height	=	(this.trheight * this.data.rows.length ) + "px";
			
			//--**	scroll event bind.....
			var oooo = this;
			$U.eventbind(this.scroller, "onscroll", function(){ setTimeout(function(){ oooo.datasetting(true); } , 1) });
			
		}catch(e){
			alert("[ G2 > scrollsetting ]" + e);
		}finally{
			v	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	top row 정보 처리
	//-------------------------------------------------------
	this.toprowset = function(){
		
		var t,rh;
		
		try{
			
			if ($U.isNull($hD("span[name=viewtop]", this.G2o))){
				return;
			}
			
			t	=	this.scroller.scrollTop + 1;
			rh 	= 	$hA("table tbody tr td", this.nfdiv)[0].offsetHeight;
			
			//--**	가끔 0 이 발생하는 경우 처리 주로  다른 object(특히 table) 내부에 있는 경우
			if (rh === 0){
				rh	=	( this.nfdiv.offsetHeight -	$hA("table thead tr th", this.nfdiv)[0].offsetHeight ) / this.viewRowCnt; 
			}
			
			this.topRow	=	Math.ceil(t / rh);
			$U.inHTML($hD("span[name=viewtop]", this.G2o), Number(this.topRow) + Number(this.rowFirst));	
			
		}catch(e){
			alert("[ G2 > toprowset ]" + e);
		}finally{
			t	=	null;
			rh	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	value 처리
	//-------------------------------------------------------
	this.setvalue = function(v){
		var r=v.data;
		switch (v.type){
			case "G2checkbox" :	 
				r = $U.format(		"<input type='checkbox' onclick='{1}' class='G2checkbox' {0} >"
								, 	(v.data === true ? "checked" : "" )
								,	"this.parentElement.parentElement.click(this.parentElement.parentElement)");	
				break;	
			default :
				if (!$U.isNullOrEmpty(v.formatter)){
					r = window[v.formatter](v.data,v.alldata);
				}
				break;
		}
		return r;
	}

	//-------------------------------------------------------
	//	G2 header checkbox 를 클릭시..
	//-------------------------------------------------------
	this.G2checkboxheadclick = function(oo,e){
		
		try{
			for (var tt=0,ttoo;ttoo=this.data.rows[tt];tt+=1){
				ttoo["g2check"] = oo.checked === true ? true: "";
			}
			this.datasetting();
		
		} catch(e){
			alert("[ G2 > G2checkboxheadclick ]" + e);
		} finally {
		}
		
	}

	//-------------------------------------------------------
	//-------------------------------------------------------
	//--**	EVENT	
	//-------------------------------------------------------
	//-------------------------------------------------------
	
	//-------------------------------------------------------
	//	G2 checkbox 를 클릭시..
	//-------------------------------------------------------
	this.G2checkboxclick = function(oo){
		
		var v = [];
		try{
			v.didx	= 	Number($U.get(oo.parentElement, "dataidx"));
			v.rdata	=	this.data.rows[v.didx];
			v.rdata["g2check"] = v.rdata["g2check"] === true ? "" : true;
			this.datasetting();
			
		} catch(e){
			alert("[ G2 > G2checkboxclick ]" + e);
		
		} finally {
			v	=	null;
		}
		
	}
		
	//-------------------------------------------------------
	//	횔 스크롤시
	//-------------------------------------------------------
	this.mousewheel = function(e){
		
		var ev = e || window.event;
		if (ev.preventDefault){
			ev.preventDefault();
			ev.stopPropagation();
		} else {
			ev.returnValue = false;
		}
		
		//--**	5개씩 이동
		this.scroller.scrollTop += (this.trheight * IMS_config.G2_defaultscrollcnt) * ( (ev.wheelDelta || -40 * ev.detail) < 0 ? 1 : -1) -1; 
		
		//--**	scroller 의 onscroll에 이벤트 정의되어 있어 이곳에서는 datasetting 불필요
		//this.datasetting(true);

		return false;
	}	
	
	//-------------------------------------------------------
	//	tr mouseover 시 
	//-------------------------------------------------------
	this.trmouseover = function(oo){
		
		var idx = Number($U.get(oo,"idx"));
		$U.set(this.ftrobj[idx], 	"class",	"over");
		$U.set(this.nftrobj[idx], 	"class", 	"over");
		
	}	
	
	//-------------------------------------------------------
	//	tr mouseout 시 
	//-------------------------------------------------------
	this.trmouseout = function(oo){
		
		var idx = Number($U.get(oo,"idx"));
		$U.set(this.ftrobj[idx], 	"class" , 	"out");
		$U.set(this.nftrobj[idx], 	"class" , 	"out");
		
	}	
	
	//-------------------------------------------------------
	//	td click 시 
	//-------------------------------------------------------
	this.tdclick = function(oo){

		//--**	click 이벤트가 없으면 pass
		if ($U.isNullOrEmpty($U.get(oo,"click"))) return;
		
		var didx,rdata;
		try{
			
			didx = Number($U.get(oo.parentElement, "dataidx"));
			rdata =	this.data.rows[didx];
			window[$U.get(oo,"click")](rdata[$U.get(oo,"colname")], rdata);
			
		} catch(e){
			alert("[ G2 > tdclick ]" + e);
			//console.log("EE=[" + $U.get(oo,"click")  + "], error=" + e);
		} finally {
			didx	=	null;
			rdata	=	null;
		}
		
	}	
	
	//-------------------------------------------------------
	//	td mouseover 시 
	//-------------------------------------------------------
	this.tdmouseover = function(oo){
		$U.set(oo, "title", this.header[Number($U.get(oo,"colidx"))]["titleYN"] === "N" ? "" : $U.text(oo));
	}	
	
	//-------------------------------------------------------
	//-------------------------------------------------------
	//--**	EVENT END
	//-------------------------------------------------------
	//-------------------------------------------------------
	
	//-------------------------------------------------------
	//	data 처리
	//-------------------------------------------------------
	this.datasetting =	function(chk){
		this.datasettingdetail(chk);
	}
	
	//-------------------------------------------------------
	//	data 처리 detail
	//-------------------------------------------------------
	this.datasettingdetail  = function(chk){
		
		var v = [];
		try{
			
			if ($U.isNull(this.data)){
				this.cellclear(null, null, true);
				return;
			}
			
			if (this.data.rows.length === 0){
				this.cellclear(null, null, true);
				this.rowspanproc(true);
				this.information("no-data");
				return;
			}

			//--**	toprow를 구한다
			v.oldtoprow	=	this.topRow;	
			this.toprowset();

			//--**	scrolltop 이 같은 경우 skip
			
			//console.log("TOPROW=" + this.topRow + "=" + v.oldtoprow);
			
			if (chk === true && this.topRow === v.oldtoprow){
				return;
			}
			
			//--**	table tr set
			v.check		=	this.data.rows.length < this.viewRowCnt;
			v.rs		=	v.check ? this.data.rows.length : this.viewRowCnt ;
			v.hlen		=	this.header.length;
			var oooo	=	this;
			
			//--**	cell clear	
			this.cellclear(v.check, v.rs * v.hlen);

			v.firstrow	=	0;
			v.colrow	=	0;
			v.lastrow	=	v.rs;

			//--**	로우를 이동함으로써 렌더링 속도 개선
			//--**	스크롤시 viewRowCnt 이상 차이나는 경우 에는 skip
			/*
			 * 
			 *v.mcheck	=	v.oldtoprow - this.topRow;
			if (v.mcheck !== 0 && Math.abs(v.mcheck) < this.viewRowCnt){
				if ( v.mcheck < 0){	//--**	scroll down 
					
					v.tpos		=	Number(this.viewRowCnt) + 1;
					v.firstrow	=	Number(this.viewRowCnt) + Number(v.mcheck);
					v.colrow	=	v.firstrow;	
					v.lastrow	=	v.rs;
					
					for (let q=0,w=(v.mcheck*-1); q<w; q+=1){
						this.ftbody.insertBefore(	this.ftrobj[q],		this.ftrobj[v.tpos]	);
						this.nftbody.insertBefore(	this.nftrobj[q],	this.nftrobj[v.tpos]);
					} 
					
				} else {			//--**	scroll up
					
					v.tpos		=	0;
					v.firstrow	=	0;
					v.colrow	=	(Number(this.viewRowCnt) - Number(v.mcheck)) * -1;
					v.lastrow	=	Number(v.mcheck);
					
					for (let q=0,w=v.mcheck; q<w; q+=1){
						this.ftbody.insertBefore(	this.ftrobj[q+(v.colrow * -1)],		this.ftrobj[v.tpos]	);
						this.nftbody.insertBefore(	this.nftrobj[q+(v.colrow * -1)],	this.nftrobj[v.tpos]);
					} 
					
				}
			}
			*/
			//console.log("ROW=" + v.firstrow + "=" + v.lastrow);
			
			//--**	데이타를 화면에 write 한다.
			for (var qq=v.firstrow,ww=v.lastrow; qq<ww; qq+=1){

				v.endrowidx	= this.colobj.length - 1 < (qq * v.hlen) + (v.hlen - 1) ? this.colobj.length - 1 : (qq * v.hlen) + (v.hlen - 1);   	 	
				$U.set(this.colobj[qq *	v.hlen].parentElement,"dataidx",this.topRow+qq-1);
				$U.set(this.colobj[v.endrowidx].parentElement,"dataidx",this.topRow+qq-1);
				
				(function(v,oooo,qq){ 
					setTimeout( function(){ 
						var vii	=	0;	
						var vci	=	(qq - v.colrow) *	v.hlen; 
						var vrdata 	=	oooo.data.rows[Number(oooo.topRow)+qq-1];
						if ($U.isNullOrEmpty(vrdata)){
							return;
						} 

						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	

						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	

						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	

						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
						oooo.datasettingdetaildetail(oooo.header[vii], oooo.colobj[vci++], vrdata, qq);	if (++vii === v.hlen){ return; }; // else { v.ci++; };	
					
					}, 0); 
				}(v,oooo,qq));				

				//--**	row draw end 
				if (qq === ww-1){
					setTimeout(function(){
						oooo.rowspanproc(); 
						oooo.drawafter();
					},10)
					break;
				}
				
			}
		
		}catch(e){
			alert("[ G2 > datasettingdetail ]" + e);
		
		}finally{
			v	=	null;
		}
		
	}

	//-------------------------------------------------------
	//	data 처리 detail 반복 처리 구문
	//-------------------------------------------------------
	this.datasettingdetaildetail  = function(pho,potd,prdata,qidx){
		potd.innerHTML	=	this.setvalue(	{ 	type		:	pho["type"]
											,	data		:	$U.nvl(prdata[pho["id"]],"")
											,	alldata		:	prdata
											,	formatter	:	pho["formatter"]});
	}
	
	//-------------------------------------------------------
	//	rowspan 처리
	//-------------------------------------------------------
	this.rowspanproc = function(cchk){
		
		if (this.rowSpan === ""){
			return;
		}
		
		var p, ra;
		try{
			p 	=	new Array();
			ra	=	this.rowSpan.split(",");
			for (var rr=0,rroo; rroo=ra[rr]; rr+=1){
				if (Number(rroo) >= this.fixCnt){
					p.push({"tab": $hD("table tbody", this.nfdiv), "col" : Number(rroo) - this.fixCnt });	
				} else {
					p.push({"tab": $hD("table tbody", this.fdiv), "col" : Number(rroo) });	
				}
			}
			
			yTableRowSpanSetForMulti( p, 0, cchk );	
			
		} catch(e){
			alert("[ G2 > rowspanproc ]" + e);
		
		} finally {
				p	=	null
			,	ra	=	null;
		}
	}	
	
	//-------------------------------------------------------
	//	cell clear
	//-------------------------------------------------------
	this.cellclear = function(vcheck, vstart, allchk){
		
		try{
			
			//--**	all clear
			if (allchk === true){
				for (var icc=0,tdoo; tdoo=this.colobj[icc]; icc+=1){
					tdoo.innerHTML	=	"";
				}
				return;
			}
			if (allchk === true){
				for (var icc=0,tdoo; tdoo=this.colobj[icc]; icc+=1){
					tdoo.innerHTML	=	"";
				}
				return;
			}
			
			//--**	row clear
			if (!vcheck){
				return;
			}
			
			for (var icc=vstart,tdoo; tdoo=this.colobj[icc]; icc+=1){
				tdoo.innerHTML	=	"";
			}
			
		}catch(e){
			alert("[ G2 > cellclear ]" + e);
		
		}finally{
		}
		
	}
	
	//-------------------------------------------------------
	//	sort, filter 템플릿 오픈
	//-------------------------------------------------------
	this.popup = function(o){
		
		var fv = $U.get(o.parentElement,"xg-field");
		var ooo = this;
		
		new $P({	target		:	ooo
				,	template	:	"#template_G2_sortfilter"
				,	title		:	"G2 Sort / Filter"
				,	button		:	"Search,Cancel"		//	Save, Delet	e, Confirm, Select, Search, Cancel	중 선택
				,	afterOpen	:	function(poo){
						
						var fao,fd,p,ao,s,lvv,uvv,foo;
						try{
							
							//--**	button event binding
							//$U.eventbind(poo.buttonobj["Confirm"], "onclick", function(){ poo.close(); });
							$U.eventbind(poo.buttonobj["Search"], "onclick", function(){ poo.attr.target.call(poo.attr.target.param); poo.close(); });
							$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
							$U.eventbind($hA("section[name=G2_popup_sortarea] span a", poo.olayer), "onclick" , function(){ poo.attr.target.popupsortclick(this,fv); });
							$U.eventbind($hA("section[name=G2_popup_keycheckarea] input[name=keycheckvalue]", poo.olayer), "onkeyup" , function(){ poo.attr.target.popupkeycheckup(this,fv); });
							$U.eventbind($hA("section[name=G2_popup_keycheckarea] input[name=casecheckvalue]", poo.olayer), "onchange" , function(){ poo.attr.target.popupcasecheckup(this, poo.attr.target); });
							$hD("input[name=casecheckvalue]",poo.olayer).checked	=	poo.attr.target.casecheckvalue;
							
							//--**	keycheck 여부를 확인
							fao = $U.find($hA("span",poo.attr.target.functionarea),"name","keycheck_"+fv);
							if (!$U.isNull(fao)){
								ao 	= 	$hA("a",fao)[0];
								$hD("input[name=keycheckvalue]",poo.olayer).value		=   ao.innerHTML;
							}
							
							//--**	sort 여부를 확인
							fao = $U.find($hA("span",poo.attr.target.functionarea),"name","sort_"+fv);
							if (!$U.isNull(fao)){
								if ($U.get(fao,"sort") === "ASC"){
									$hD("a[name=sortdown]",poo.olayer).className	=	"sel";
								} else {
									$hD("a[name=sortup]",poo.olayer).className	=	"sel";
								}
							}
							
							//--**	filter 여부를 확인
							fao = $U.find($hA("span",poo.attr.target.functionarea),"name","filter_"+fv);
							if (!$U.isNull(fao)){
								ao 	= 	$hA("a",fao);
								foo	=	$hD("font",fao);
								s	=	"";
								for (var op=0,ol=ao.length-1;op<ol;op+=1){
									s	+=	ao[op].outerHTML;
								}
								$hD("div[name=filtercaption]",poo.olayer).innerHTML	= s;
								$U.eventbind($hA("div[name=filtercaption] a", poo.olayer), "onclick", function(){ $U.remove(this); poo.attr.target.popupfilterreset(poo.olayer,fv); } )
								poo.attr.target.popupfilteroptionset( $hA("div[name=filtercaption] a", poo.olayer).length, foo.innerHTML,fv);
							
							} else {
								poo.attr.target.popupfilteroptionset( 0, "equal", null);
							
							}
							
							//--**	call process
							ooo.popupcall(poo,o,fv,function(data){

								//console.log(data);
								
								if (data.rows.length > 500){
									//alert("Filter 항목이 500개를 초과합니다.\r\n1000개 까지만 Filter 처리가 가능합니다");
									$hD("div[name=filterarea]",poo.olayer).innerHTML	=	"Filter 항목이 500개를 초과합니다.<br>"
																						+	"500개 까지만 Filter 처리가 가능합니다<br>"
																						+	"조회기능을 이용하세요<br>"
																						+	"The number of filter items exceeds 500.<br>"
																						+	"Up to 500 filters can be processed.<br>"
																						+	"Please use the inquiry function.";
									$hD("div[name=filtercount]",poo.olayer).innerHTML 	=	"total : - " ;
								} else {
									var s;
									try{
										
										data.rows.sort(function(a,b){
											lvv = a[fv.toLowerCase()]||a[fv.toUpperCase()];
											uvv = b[fv.toLowerCase()]||b[fv.toUpperCase()];
											return lvv > uvv;
										});
										
										data.rows.sort();
										
										s	=	"";
										for (var f=0,goo;goo=data.rows[f];f+=1){
											lvv = goo[fv.toLowerCase()]||goo[fv.toUpperCase()];
											if ($U.isNullOrEmpty(lvv)){
												if (s.indexOf("NULL") > -1) {
													continue;
												}
												lvv	=	"NULL";
											}
											s	+=	"<a>"+ lvv + "</a><br>";
										}
										
										$hD("div[name=filterarea]",poo.olayer).innerHTML =	s;
										$hD("div[name=filtercount]",poo.olayer).innerHTML =	"total : " + data.rows.length;
										$U.eventbind($hA("div[name=filterarea] a", poo.olayer), "onclick" , function(){ poo.attr.target.popupfilterclick(this,fv); });
										$U.eventbind($hA("section[name=G2_popup_filter_option_area] a", poo.olayer), "onclick" , function(){ poo.attr.target.popupfilteroptionclick(this,fv); });
										
									} finally{
										s	=	null;
									}
								}
								
							})
							
						} catch(e){
							alert("[ G2 > popup ]" + e);
						} finally {
							fao	=	null;
							fd	=	null;
							p	=	null;
							ao	=	null;
							s	=	null;
							lvv	=	null;
							uvv	=	null;
							foo	=	null;	
						}	
					
					}	
				},{w:680,h:560,mw:300,mh:300}
		);
		
	}

	//-------------------------------------------------------
	//	popup call process
	//-------------------------------------------------------
	this.popupcall = function(vpoo,vo,vfv,vcallback){
	
		$hD("article h3", vpoo.olayer).innerHTML	=	vo.innerHTML;
		var p 	=	"page=" 		+	"1" 
				+	"&pageRowCnt="	+	"100000000"
				+	"&rowFirst=" 	+	"0" 
				+	"&rowLast=" 	+	"100000000"
				+	"&sort="		
				+	"&filter="		
				+	"&keycheck="		
				+	"&getdata="		+	"g2total," + vfv
				+	"&groupby="		+	"GROUP BY g2total," + vfv 
				+	"&"+ this.param;
		
		//--**	server data 를 이용하여 필터,소트, 검색 처리를 한다	
		if (this.datatype	===	"server"){
			
			$A.call({url:vpoo.attr.target.url,param:p,ptype:"string"}, vcallback);
		
		//--**	local data 를 이용하여 필터,소트, 검색 처리를 한다	
		} else if (this.datatype	===	"local"){
			
			this.localpopupcall(vfv,vcallback);
		
		}
	
	}	

	//-------------------------------------------------------
	//	local popup call process
	//-------------------------------------------------------
	this.localpopupcall	= function(vfv,vcallback){
		var v = [];
		try{
		
			v.rdata	=	"";
			v.odata	=	this.data.rows;
			v.val	=	"";
			v.total	=	0;
			for (let x=0,oo; oo=v.odata[x]; x+=1){
				v.val = oo[vfv];
				if (v.rdata.indexOf("\""+vfv+"\":\""+v.val+"\"}") > -1){
					continue;
				}
				v.rdata	+=	(v.rdata === "" ? "" : ",") +  "{\"g2total\":$VVV$,\""+vfv+"\":\""+v.val+"\"}";
				v.total	++;
			}
			
			v.rdata	=	"[" + v.rdata.replace(/\$VVV\$/g,v.total) + "]";
			vcallback({rows:JSON.parse(v.rdata)});
			
		} catch(e){	alert("[ G2 -> local.popupcall ]" + e);
		} finally {	v	=	null;
		}
	}	
	
	//-------------------------------------------------------
	//	popup keycheck keyup
	//-------------------------------------------------------
	this.popupkeycheckup = function(koo,fv){
		
		var obj,o;
		try{
			//--**	G2에 세팅
			o = $U.find(this.header,"id",fv);
			$U.remove($U.find($hA("span",this.functionarea),"name","keycheck_" + fv));
			this.functionarea.innerHTML += $U.format(G2_KEYCHECK_TEMPLATE, "keycheck_" +fv, o.id, "", o.title, "<a>" + koo.value + "</a>");
			$U.eventbind($hA(".keycheck > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
			
		} catch(e){	
			alert("[ G2 > keycheck ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
		}
		
	}

	//-------------------------------------------------------
	//	popup casecheck keyup
	//-------------------------------------------------------
	this.popupcasecheckup = function(coo, too){
		try{
			too.casecheckvalue	=	coo.checked	?	"checked" : "";	
		
		} catch(e){	
			alert("[ G2 > casecheck ] " + e);
		} finally {
		}
	}
	
	//-------------------------------------------------------
	//	init key make
	//-------------------------------------------------------
	this.initkeymake = function(){
		
		var obj,o;
		try{

			//--**	G2에 세팅
			if ($U.isNull(this.initkey.length)){
				
				o = $U.find(this.header,"id",this.initkey.keyid);
				this.functionarea.innerHTML += $U.format(G2_KEYCHECK_TEMPLATE, "keycheck_" +this.initkey.keyid, o.id, "", o.title, "<a>" + this.initkey.keyvalue + "</a>");
				$U.eventbind($hA(".keycheck > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
			} else {
				for (var i=0,jsono; jsono=this.initkey[i]; i+=1){
					
					o = $U.find(this.header,"id",jsono.keyid);
					this.functionarea.innerHTML += $U.format(G2_KEYCHECK_TEMPLATE, "keycheck_" +jsono.keyid, o.id, "", o.title, "<a>" + jsono.keyvalue + "</a>");
					$U.eventbind($hA(".keycheck > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
				}	
			}
			
		} catch(e){
			alert("[ G2 > initkeymake ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	popup sortclick
	//-------------------------------------------------------
	this.popupsortclick = function(soo,fv){
		
		var obj,o,stype,itag;
		try{
			$U.remove($U.find($hA("span",this.functionarea),"name","sort_" + fv));
			if (soo.className === "nosel"){
				$hA("a",soo.parentElement)[0].className = "nosel";
				$hA("a",soo.parentElement)[1].className = "nosel";
				soo.className	=	"sel";
				o = $U.find(this.header,"id",fv);
				if (soo.name === "sortdown"){
					stype	=	"ASC";
					itag	=	"<i class='fas fa-sort-alpha-down'></i>";					
				} else {
					stype	=	"DESC";
					itag	=	"<i class='fas fa-sort-alpha-up'></i>";					
				}
				this.functionarea.innerHTML += $U.format(G2_SORT_TEMPLATE, "sort_" + fv, o.id, stype, o.title, itag);
				
			} else {
				soo.className	=	"nosel";
			}
			
		} catch(e){
			alert("[ G2 > popupsortclick ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
			stype	=	null;
			itag	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	init sort make
	//-------------------------------------------------------
	this.initsortmake = function(){
		
		var obj,o,stype,itag,jsono;
		try{
			
			if ($U.isNull(this.initsort.length)){
				
				o = $U.find(this.header,"id",this.initsort.sortid);
				if (this.initsort.sorttype.toUpperCase() === "ASC"){
					stype	=	"ASC";
					itag	=	"<i class='fas fa-sort-alpha-down'></i>";					
				} else {
					stype	=	"DESC";
					itag	=	"<i class='fas fa-sort-alpha-up'></i>";					
				}
				this.functionarea.innerHTML += $U.format(G2_SORT_TEMPLATE, "sort_" + this.initsort.sortid, o.id, stype, o.title, itag);
				
			} else {

				for (var i=0,jsono; jsono=this.initsort[i]; i+=1){
					o = $U.find(this.header,"id",jsono.sortid);
					if (jsono.sorttype.toUpperCase() === "ASC"){
						stype	=	"ASC";
						itag	=	"<i class='fas fa-sort-alpha-down'></i>";					
					} else {
						stype	=	"DESC";
						itag	=	"<i class='fas fa-sort-alpha-up'></i>";					
					}
					this.functionarea.innerHTML += $U.format(G2_SORT_TEMPLATE, "sort_" + jsono.sortid, o.id, stype, o.title, itag);
				}
			};
				
		} catch(e){
			alert("[ G2 > initsortmake ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
			stype	=	null;
			itag	=	null;
			jsono	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	popup filterclick
	//-------------------------------------------------------
	this.popupfilterclick = function(foo,fv){
		
		var obj,txt,oxo,o;
		try{
			
			//--**	popup 화면에 세팅
			obj = foo.parentElement.parentElement;
			txt	= foo.innerHTML;	
			oxo = $U.find($hA("div[name=filtercaption] a", obj),"name",txt);
			if (!$U.isNull(oxo)){
				$U.remove(oxo);
			}
			
			$hD("div[name=filtercaption]", obj).innerHTML += $U.format("<a name='{0}'>{0}</a>", txt);
			
			var ooo = this;
			$U.eventbind($hA("div[name=filtercaption] a", obj), "onclick", function(){ $U.remove(this); ooo.popupfilterreset(foo.parentElement.parentElement, fv); } )
			
			//--**	G2에 세팅
			o = $U.find(this.header,"id",fv);
			$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + fv));
			this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" +fv, o.id, "", o.title, $hD("div[name=filtercaption]", obj).innerHTML, $U.get(foo.parentElement,"option"));
			$U.eventbind($hA(".filter a", this.functionarea), "onclick", function(){ $U.remove(this); } );
			
			//--**	filter option setting
			this.popupfilteroptionset($hA("div[name=filtercaption] a", obj.parentElement).length,null,fv);
			
		} catch(e){
			alert("[ G2 > popupfilterclick ] " + e);
		} finally {
			obj	=	null;
			txt	=	null;
			oxo	=	null;
			o	=	null;
		}
	
	}

	//-------------------------------------------------------
	//	popup filter option click
	//-------------------------------------------------------
	this.popupfilteroptionclick = function(fopoo,fv){
		
		var v=[];
		try{
			
			//--**	popup 화면에 세팅
			v.obj = fopoo.parentElement.parentElement;
			$U.each($hA("a",v.obj),	function(asooo){
				asooo.className	=	"nosel";
			});
			fopoo.className	=	"sel"
			$U.set($hD("div[name=filterarea]", v.obj.parentElement), "option", fopoo.name);	
			if (!$U.isNullOrEmpty(fv) && !$U.isNull($hD("span[name="+"filter_" + fv+"] font",this.functionarea))){
				$hD("span[name="+"filter_" + fv+"] font",this.functionarea).innerHTML =	fopoo.name;
			}
			
		} catch(e){
			alert("[ G2 > popupfilteroptionclick ] " + e);
		} finally {
			v	=	null;
		}
	}

	//-------------------------------------------------------
	//	popup filter option set
	//	filter caption 의 a 갯수에 따라 Filter option 조정
	//-------------------------------------------------------
	this.popupfilteroptionset = function(len,selnm,fv){
		
		var v=[];
		try{
			v.poo	=	$hD("article[name=G2_popup_temp]");
			
			if (len > 1){
				$hD("a[name=equal]", 				v.poo).style.display	=	"inline-block";
				$hD("a[name=not-equal]", 			v.poo).style.display	=	"inline-block";
				$hD("a[name=greater-than]", 		v.poo).style.display	=	"none";
				$hD("a[name=greater-than-equal]", 	v.poo).style.display	=	"none";
				$hD("a[name=less-than]", 			v.poo).style.display	=	"none";
				$hD("a[name=less-than-equal]", 		v.poo).style.display	=	"none";
				$hD("a[name=between]", 				v.poo).style.display	=	len === 2 ? "inline-block" : "none";
			
			} else {
				$hD("a[name=equal]", 				v.poo).style.display	=	"inline-block";
				$hD("a[name=not-equal]", 			v.poo).style.display	=	"inline-block";
				$hD("a[name=greater-than]", 		v.poo).style.display	=	"inline-block";
				$hD("a[name=greater-than-equal]",	v.poo).style.display	=	"inline-block";
				$hD("a[name=less-than]", 			v.poo).style.display	=	"inline-block";
				$hD("a[name=less-than-equal]", 		v.poo).style.display	=	"inline-block";
				$hD("a[name=between]", 				v.poo).style.display	=	"none";
				
			}
			
			if ($U.isNull(selnm)){
				v.cselnm	=	$hD("section[name=G2_popup_filter_option_area] .sel",v.poo).name;	
				v.cselnm	=	$U.isNullOrEmpty(v.cselnm) ? "equal" : v.cselnm;
				if (len > 1){
					if (v.cselnm.indexOf("than") > -1){
						$hD("a[name="+v.cselnm+"]",v.poo).className	=	"nosel";
						v.cselnm	=	"equal";	
					}
					if (len !== 2 && v.cselnm === "between"){
						$hD("a[name=between]",v.poo).className	=	"nosel";
						v.cselnm	=	"equal";	
					}
				} else {
					if (v.cselnm === "between"){
						$hD("a[name=between]",v.poo).className	=	"nosel";
						v.cselnm	=	"equal";	
					}
				}	
				selnm	= v.cselnm;
				
			} else {
				$hD("a[name="+selnm+"]",v.poo).className	=	"sel";
				
			}
			
			$hD("a[name="+selnm+"]",v.poo).className	=	"sel";
			if (!$U.isNullOrEmpty(fv) && !$U.isNull($hD("span[name=filter_" + fv+"] font",this.functionarea))){
				$hD("span[name=filter_" + fv+"] font",this.functionarea).innerHTML =	selnm;
			}
			
		} catch(e){
			alert("[ G2 > popupfilteroptionset ] " + e);
		} finally {
			v	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	init filter make
	//-------------------------------------------------------
	this.initfiltermake = function(){
		
		var o,aoo,foo,vopt;
		try{
			
			if ($U.isNull(this.initfilter.length)){
				
				aoo = this.initfilter.filter.toString().split("$^$");
				foo = "";
				for (var i=0,oooo;oooo=aoo[i];i+=1){
					foo += "<a name='"+oooo+"'>" + oooo + "</a>"
				}
				
				//--**	G2에 세팅
				o 		=	$U.find(this.header,"id",this.initfilter.filterid);
				vopt	=	$U.nvl(this.initfilter.filteroption,"equal"); 
				$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + this.initfilter.filterid));
				this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" + this.initfilter.filterid, o.id, "", o.title, foo, vopt );
				$U.eventbind($hA(".filter > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
			} else {
				for (var i=0,jsono; jsono=this.initfilter[i]; i+=1){

					aoo = jsono.filter.toString().split("$^$");
					foo = "";
					for (var ii=0,oooo;oooo=aoo[ii];ii+=1){
						foo += "<a name='"+oooo+"'>" + oooo + "</a>"
					}
					
					//--**	G2에 세팅
					o 		= 	$U.find(this.header,"id",jsono.filterid);
					vopt	=	$U.nvl(jsono.filteroption,"equal"); 
					$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + jsono.filterid));
					this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" + jsono.filterid, o.id, "", o.title, foo, vopt );
					$U.eventbind($hA(".filter > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
				}	
			}
			
			
		} catch(e){
			alert("[ G2 > initfiltermake ] " + e);
		} finally {
			o	=	null;
			aoo =	null;
			foo = 	null
			vopt=	null;	
		}
	
	}

	//-------------------------------------------------------
	//	popup filterreset
	//-------------------------------------------------------
	this.popupfilterreset = function(foo,fv){
		
		var obj,o;
		try{
			
			obj = foo;
			
			//--**	G2에 세팅
			o = $U.find(this.header,"id",fv);
			$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + fv));
			if ($U.isNullOrEmpty($hD("div[name=filtercaption]", obj).innerHTML)) return;
			this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" +fv, o.id, "", o.title, $hD("div[name=filtercaption]", obj).innerHTML, $U.get($hD("div[name=filterarea]", obj),"option"));
			
			//--**	filter option setting
			this.popupfilteroptionset($hA("div[name=filtercaption] a", obj).length,null,fv);
			
		} catch(e){
			alert("[ G2 > popupfilterreset ] " + e);
		} finally {
			obj	=	null;
			o	=	null;
		}
	
	}

	//-------------------------------------------------------
	//	keycheck setting
	//-------------------------------------------------------
	this.keycheckset = function(){
		var v=[];
		try{
			v.o	=	$hA(".keycheck",this.functionarea);
			if (v.o.length === 0) return "";
			v.r	=	"";
			
			
			for (var rr=0,soo;soo=v.o[rr]; rr+=1){
				//--**	database 별 upper 처리
				if (this.casecheckvalue === "checked"){
					v.r	+=	" AND "	
						+	$U.format(IMS_config.dbnullType,$U.get(soo,"field")) 
						+ 	" LIKE "		
						+	" '##" +  $hA("a",soo)[0].innerHTML + "##' " ;
				} else {
					v.r	+=	" AND "	
						+	$U.format(IMS_config.dbnullType,  	$U.format(IMS_config.dbupperType,$U.get(soo,"field")) ) 
						+ 	" LIKE "		
						+	$U.format(		IMS_config.dbconcatType
										,	"'##'"
										,	$U.format(IMS_config.dbupperType,	"'" + $hA("a",soo)[0].innerHTML + "'")
										,	"'##'") ;
					
				}
				
//				r	+=	" AND " + $U.format(IMS_config.dbnullType,$U.CamelToUnder($U.get(soo,"field"))) + " LIKE '##" +  $hA("a",soo)[0 ].innerHTML + "##' " ;
			}
			return this.dataconversion(v.r);
		
		//} catch(e){
		//	alert("[ G2 > keycheckset ]" + e)
		
		} finally {
			v	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	sort setting
	//-------------------------------------------------------
	this.sortset = function(){
		var r="",o;
		try{
			o	=	$hA(".sort",this.functionarea);
			if (o.length === 0) return "";
			r	=	"ORDER BY ";
			for (var rr=0,soo;soo=o[rr]; rr+=1){
				r	+=	(rr===0 ? "" : "," ) + $U.get(soo,"field") + " " +  $U.get(soo,"sort");
//				r	+=	(rr===0 ? "" : "," ) + $U.CamelToUnder($U.get(soo,"field")) + " " +  $U.get(soo,"sort");
			}
			return this.dataconversion(r);
		} catch(e){
			alert("[ G2 > sortset ]" + e)
		} finally {
			r	=	null;
			o	=	null;
		}
	
	}
	
	//-------------------------------------------------------
	//	filter setting
	//-------------------------------------------------------
	this.filterset = function(){
		var r,o,ao,fvo;
		try{
			o	=	$hA(".filter",this.functionarea);
			if (o.length === 0) return "";
			r	=	"";
			for (var rr=0,soo;soo=o[rr]; rr+=1){
				r	+=	" AND " + $U.format(IMS_config.dbnullType,$U.get(soo,"field")); 
//				r	+=	" AND " + $U.format(IMS_config.dbnullType,$U.CamelToUnder($U.get(soo,"field"))) 
				
				fvo	=	$hD("font",soo).innerHTML;
				switch(fvo){
				case "equal"	:
					r	+=	" IN ( ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : ",") + "'" + $U.get(ao[xx],"name") + "'";
					}
					r += ") ";
					break;
				
				case "not-equal"	:
					r	+=	" NOT IN ( ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : ",") + "'" + $U.get(ao[xx],"name") + "'";
					}
					r += ") ";
					break;
				
				case "greater-than"	:
					r	+=	" ims_g2_greater-than ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : ",") + "'" + $U.trim($U.get(ao[xx],"name")) + "'";
					}
					break;
				
				case "greater-than-equal"	:
					r	+=	" ims_g2_greater-than-equal ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : ",") + "'" + $U.trim($U.get(ao[xx],"name")) + "'";
					}
					break;
				
				case "less-than"	:
					r	+=	" ims_g2_less-than ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : ",") + "'" + $U.trim($U.get(ao[xx],"name")) + "'";
					}
					break;
				
				case "less-than-equal"	:
					r	+=	" ims_g2_less-than-equal ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : ",") + "'" + $U.trim($U.get(ao[xx],"name")) + "'";
					}
					break;
				
				case "between"	:
					r	+=	" BETWEEN ";
					ao	=	$hA("a",soo);
					for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
						r	+= (xx===0? "" : " AND ") + "'" + $U.trim($U.get(ao[xx],"name")) + "'";
					}
					break;

				}
				
			}
			
			return this.dataconversion(r);
		} catch(e){
			alert("[ G2 > filterset ]" + e)
		
		} finally {
			r	=	null;
			o	=	null;
			ao	=	null;
			fvo	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	data conversion
	//-------------------------------------------------------
	this.dataconversion = function(idata){
		idata	=	idata.replace(/&amp;/g,"^^AMP^^");
		return idata;
	}
	
	//-------------------------------------------------------
	//-------------------------------------------------------
	//--**	data external getting 
	//-------------------------------------------------------
	//-------------------------------------------------------

	//-------------------------------------------------------
	//	check data getting
	//-------------------------------------------------------
	this.getcheckdata = function(){
		var redata;
		try{
			
			redata	=	[];
			for (var i=0,ooo; ooo=this.data.rows[i]; i+=1){
				if (ooo["g2check"] === true ){
					redata.push(ooo);	
				};
			}
			return redata;
			
		} catch(e){
			alert("[ G2 > getcheckdata ]" + e);
		} finally {
			redata	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	check data setting
	//-------------------------------------------------------
	this.setcheckdata = function(obj,key){
		try{
			
			for (var x=0,okey; okey=obj[x]; x+=1){
				for (var i=0,ooo; ooo=this.data.rows[i]; i+=1){
					if (ooo[key] == okey ){	//--**	값만 비교하도록 
						ooo["g2check"] = true;
						break;
					};
				}
			}
			this.datasetting();
			
		} catch(e){
			alert("[ G2 > setcheckdata ]" + e);
		} finally {
		}
	}
	
	//-------------------------------------------------------
	//	data getting	
	//	{ keyid	:	"",	keyvalue	:	"",	targetid	:	"",	targetvalue	:	"" }		
	//	keyid		:	로우를 찾는데 사용할 KEY ID
	//	keyvalue	:	로우를 찾는데 사용할 KEY VALUE
	//	targetid	:	변경할  ID
	//	targetvalue	:	변경할  VALUE
	//-------------------------------------------------------
	this.datasetbykey = function(p){
		try{
			for (var i=0,ooo; ooo=this.data.rows[i]; i+=1){
				if (ooo[p.keyid] === p.keyvalue ){
					ooo[p.targetid]	=	p.targetvalue;
					break;
				};
			}
			this.datasetting();
		} catch(e){
			alert("[ G2 > datasetbykey ]" + e);
		} finally {
		}
	}
	
	//-------------------------------------------------------
	//	success func
	//-------------------------------------------------------
	this.success = function(){
		if ($U.isNullOrEmpty(this.option.success)) return;
		this.option.success();
	}
	
	//-------------------------------------------------------
	//	fail func
	//-------------------------------------------------------
	this.fail = function(){
		if ($U.isNullOrEmpty(this.option.fail)) return;
		this.option.fail();
	}
	
	//-------------------------------------------------------
	//	drawafter func
	//-------------------------------------------------------
	this.drawafter = function(){
		if ($U.isNullOrEmpty(this.option.drawafter)) return;
		this.option.drawafter();
	}
	
	//-------------------------------------------------------
	//	origin data get
	//-------------------------------------------------------
	this.origindataget	= 	function(){
		return this.origindata;
	}
	
	//-------------------------------------------------------
	//	origin data set
	//-------------------------------------------------------
	this.origindataset 	=	function(d){
		this.origindata	=	d;
	}
	
	//-------------------------------------------------------
	//	Memory Release
	//-------------------------------------------------------
	this.release = function(){
		this.G2o		=	null;
		this.G2frame	=	null;
		this.id			=	null;
		this.url		=	null;
		this.headerHeight	=	null;
		this.headerRowCnt	=	null;
		this.rowHeight	=	null;
		this.lineHeight	=	null;
		this.pageRowCnt	=	null;
		this.viewRowCnt	=	null;
		this.fixCnt		=	null;
		this.rowSpan	=	null;
		this.mode		=	null;
		this.headergroup	=	null;
		this.header		=	null;
		this.group		=	null;
		this.page		=	null;
		this.loader		=	null;
		this.sort		=	null;
		this.filter		=	null;
		this.rowFirst	=	null;
		this.rowLast	=	null;
		this.funcdiv	=	null;	
		this.fdiv		=	null;
		this.nfdiv		=	null;
		this.ffdiv		=	null;
		this.footer		=	null;
		this.scroller	=	null;
		this.scrollerDetail	=	null;
		this.topRow		=	null;
		this.data		=	null;
		this.orgindata	=	null;
		this.G2info		=	null;
		this.stime		=	null;
		this.etime		=	null;
		this.functionarea	=	null;
		this.param		=	null;
		this.success	=	null;
		this.fail		=	null;
		this.drawafter	=	null;
		this.option		=	null;
		this.initoption	=	null;
		this.initsort	=	null;
		this.initfilter	=	null;
		this.initkey	=	null;
		this.colobj		=	null;
		this.ftrobj		=	null;
		this.nftrobj	=	null;
		this.ftbody		=	null;
		this.nftbody	=	null;
		this.trheight	=	null;
		this.infotype	=	null;
		this.datatype	=	null;
		this.casecheckvalue	=	null;
	}
	
	//-------------------------------------------------------
	//	G2 remove
	//-------------------------------------------------------
	this.remove = function(){
		var poo = this.G2o.parentElement;
		var frame = this.G2frame;
		$U.remove(this.G2o);
		this.release();
		poo.innerHTML = frame;
	}
	
	if ($U.isNull(xoo)) return;
	
	//--**	Attribute define
	this.G2o			=	xoo;
	this.G2frame		=	xoo.outerHTML;
	this.id				=	xoo.getAttribute("id");
	this.url			=	xoo.getAttribute("url");
	this.pageNaviYN		=	xoo.getAttribute("pageNaviYN");
	this.headerHeight	=	xoo.getAttribute("headerHeight");
	this.headerRowCnt	=	xoo.getAttribute("headerRowCnt"); 
	this.rowHeight		=	xoo.getAttribute("rowHeight");
	this.lineHeight		=	$U.nvl(xoo.getAttribute("lineHeight"),this.rowHeight);
	this.pageRowCnt		=	xoo.getAttribute("pageRowCnt");
	this.viewRowCnt		=	xoo.getAttribute("viewRowCnt");
	this.fixCnt			=	xoo.getAttribute("fixCnt");
	this.rowSpan		=	xoo.getAttribute("rowSpan"); 
	this.mode			=	xoo.getAttribute("mode");
	this.headergroup	=	JSON.parse( this.headergroupset(xoo.getAttribute("headergroup").replace(/\t/g,"")) );
	this.header			=	JSON.parse( this.headerset(xoo.getAttribute("header").replace(/\t/g,"")) );
	this.group			=	xoo.getAttribute("group");
	this.page			=	xoo.getAttribute("page");
	this.datatype		=	$U.nvl(xoo.getAttribute("datatype"),"server");
	this.loader			=	null;
	this.sort			=	null;
	this.filter			=	null;
	this.rowFirst		=	null;
	this.rowLast		=	null;
	this.funcdiv		=	null;	
	this.fdiv			=	null;
	this.nfdiv			=	null;
	this.ffdiv			=	null;
	this.footer			=	null;
	this.scroller		=	null;
	this.scrollerDetail	=	null;
	this.topRow			=	null;
	this.data			=	null;
	this.origindata		=	null;
	this.G2info			=	null;
	this.stime			=	null;
	this.etime			=	null;
	this.functionarea	=	null;
	this.param			=	param;
	this.option			=	option;
	this.initoption		=	initoption;
	this.initkey		=	$U.isNull(initoption) ? null : initoption.initkey;
	this.initsort		=	$U.isNull(initoption) ? null : initoption.initsort;
	this.initfilter		=	$U.isNull(initoption) ? null : initoption.initfilter;
	this.colobj			=	null;
	this.ftrobj			=	null;
	this.nftrobj		=	null;
	this.ftbody			=	null;
	this.nftbody		=	null;
	this.trheight		=	null;
	this.infotype		=	null;
	this.casecheckvalue	=	IMS_config.defaultCase;
	
	//--**	validate
	if ($U.isNullOrEmpty(this.id)){
		alert("id is necessary !!!!");
		return;
	}
	if ($U.isNullOrEmpty(this.url)){
		alert("url is necessary !!!!");
		return;
	}
	if ($U.isNullOrEmpty(this.header)){
		alert("header info is necessary !!!!");
		return;
	}
	this.headerHeight	=	$U.isNullOrEmpty(this.headerHeight) ? "30" : this.headerHeight;
	this.headerRowCnt	=	$U.isNullOrEmpty(this.headerRowCnt) ? "1" : this.headerRowCnt;
	this.rowHeight		=	$U.isNullOrEmpty(this.rowHeight) ? "25" : this.rowHeight;
	this.lineHeight		=	$U.isNullOrEmpty(this.lineHeight) ? "25" : this.lineHeight;
	this.pageRowCnt		=	$U.isNullOrEmpty(this.pageRowCnt) ? IMS_config.G2_defaultrowcnt : this.pageRowCnt;
	this.viewRowCnt		=	$U.isNullOrEmpty(this.viewRowCnt) ? "20" : this.viewRowCnt;
	this.fixCnt			=	$U.isNullOrEmpty(this.fixCnt) ? "0" : this.fixCnt;
	this.rowSpan		=	$U.isNullOrEmpty(this.rowSpan) ? "" : this.rowSpan;
	this.mode			=	$U.isNullOrEmpty(this.mode) ? "view" : this.mode;
	this.page			=	$U.isNullOrEmpty(this.page) ? "1" : this.page;
	
	//--**	생성 수행
	this.create();
	
	//--**	사이즈 조정
	this.resize();
	
	//--**	rendering object setting
	this.colobjsetting();
	
	//--**	초기 key 값이 있을경우 처리 
	//--**	{keyid:,keyvalue: }
	if (!$U.isNull(this.initkey)){
		this.initkeymake();
	}
	
	//--**	초기 sort 값이 있을경우 처리 
	//--**	{sortid:,sorttype:}
	if (!$U.isNull(this.initsort)){
		this.initsortmake();
	}
	
	//--**	초기 filter 값이 있을경우 처리 
	//--**	{filterid:,filter:}
	if (!$U.isNull(this.initfilter)){
		this.initfiltermake();
	}
	
	//--**	초기검색인 경우 검색 수행
	if (option.InitialSearch){
		this.call(this.param);
	}
	
}

$U.eventbind( window, "onresize",	function(){
	if ($U.isNull(G2Object)) {
		return;
	}
	for (var vv=0,ooo; ooo=G2Object[vv]; vv+=1){
		ooo.resize();
	}
} );

$U.eventbind( window, "onbeforeunload",	function(){
	if ($U.isNull(G2Object)) {
		return;
	}
	for (var vv=0,ooo; ooo=G2Object[vv]; vv+=1){
		ooo.release();
		$U.remove(ooo);
	}
	G2Object	=	null;
} );


//--**	drag & drop 시  head height correct 처리를 위해 
function _G2_dragdrop_hhcorrect(id, vidx){
	if ($U.isNull(G2Object)) {
		return;
	}
	for (var vv=0,ooo; ooo=G2Object[vv]; vv+=1){
		if (ooo.id === id){
			ooo.hhcorrect(vidx);
		};
	}
} 

//--**	로컬 함수 로서 소트의 ASC DESC 변경
function _sort_change(obj){
	if ($U.get(obj.parentNode, "sort") === "ASC"){
		$U.set(obj.parentNode, "sort" ,"DESC");
		obj.innerHTML = "<i class='fas fa-sort-alpha-up'></i>";
	} else {
		$U.set(obj.parentNode, "sort" ,"ASC");
		obj.innerHTML = "<i class='fas fa-sort-alpha-down'></i>";
	}
}

