/*=================================================================================
 *	파 일 명		: IMS_Grid.js
 *	작성목적		: Grid 관련 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.08.04
 *	최종작성일	:
 *	수정내역		:
 *				2014-03-29		이상준		함수 수정 및 추가
=================================================================================*/

document.write("<script type=\"text/javascript\" src=\""+	IMS_config.path	+"/WebIMS/js/IMS_Prototype.js\"></script>");  

var	_GRID_CHECKDIVIDE	=	"♭";
var	_GRID_SCROLL_BOX 	=	0; 	

//---*	GRID memory free
if (!$U.isNull(Grid)) Grid.final();

//===================================================================
//	Grid 
//===================================================================
var Grid = {
		
	//-------------------------------------------------------
	//	grid top, bottom row index : data 값 계산을 위해 필요
	//	leftcolindex,	rightcolindex	컬럼이 많은 경우 가변처리 위해	
	//-------------------------------------------------------
		toprowindex		:	[]
	,	bottomrowindex	:	[]
	,	leftcolindex	:	[]
	,	rightcolindex	:	[]
	
	//-------------------------------------------------------
	//	event 처리를 위한 변수
	//-------------------------------------------------------
	,	eventchk		:	false
	
	//-------------------------------------------------------
	//	reload 처리를 위한 변수
	//-------------------------------------------------------
	,	reloadchk		:	true
	
	//-------------------------------------------------------
	//	dblclick event 처리 check
	//-------------------------------------------------------
	,	dblclickchk		:	false
	
	//-------------------------------------------------------
	//	Elapsed Time 
	//-------------------------------------------------------
	,	starttime		:	""
	,	timerecordchk	:	false
	
	//-------------------------------------------------------
	//	대용량 데이타의 경우 스크롤 엔드 처리를 위한 변수
	//-------------------------------------------------------
	,	oScrollHTimeout		:	null
	,	oScrollWTimeout		:	null
	,	vscrollstopaction	:	[]
	,	gridscrollvalue		:	[]

	//-------------------------------------------------------
	//	grid header
	//-------------------------------------------------------
	,	header	:	[]
	
	//-------------------------------------------------------
	//	grid group
	//-------------------------------------------------------
	,	group	:	[]
	
	//-------------------------------------------------------
	//	grid subgroup 01
	//-------------------------------------------------------
	,	subgroup_01	:	[]
	
	//-------------------------------------------------------
	//	grid subgroup 02
	//-------------------------------------------------------
	,	subgroup_02	:	[]
	
	//-------------------------------------------------------
	//	grid footer
	//-------------------------------------------------------
	,	footer	:	[]
		
	//-------------------------------------------------------
	//	grid selected row
	//-------------------------------------------------------
	,	selectrow	:	[]
	
	//-------------------------------------------------------
	//	필터 Object
	//-------------------------------------------------------
	,	filterobj	:	null

	//-------------------------------------------------------
	//	edit 불가 필드 저장
	//-------------------------------------------------------
	,	noeditcell	:	[]
	
	//-------------------------------------------------------
	//	ALL GRID array
	//-------------------------------------------------------
	,	allgrid	:	[]
	
	//-------------------------------------------------------
	//	param type
	//-------------------------------------------------------
	,	ptype	:	[]
	
	//-------------------------------------------------------
	//	focusin cell object
	//-------------------------------------------------------
	,	focusincell	:	null
	
	//-------------------------------------------------------
	//	grid 초기화
	//-------------------------------------------------------
	,	init :
			function(id){
				
				if ($U.isNull($hD("#"+id))) return;
				
				Grid.allgrid.push(id);
				
 				//---*	pgup, pgdn, up, dn key 처리위해
    			$U.eventbind(document,"onkeyup", Grid.directionkeychk );
    			$U.eventbind(window,"onunload", Grid.finalunload );
	        	
    			//---*	Grid resize 처리
	        	Grid.resizebind(id);
		    	if (IDV_BROWSER.NAME === "firefox"){
		    		$D(id + "_FIXED_DIV").addEventListener ("DOMMouseScroll", Grid.mousewheel, false);
		        	$D(id + "_NFIXED_DIV").addEventListener ("DOMMouseScroll", Grid.mousewheel, false);
		    	}
			}

	//-------------------------------------------------------
	//	event 처리
	//-------------------------------------------------------
	,	raiseevent :
			function(id,event,data){
				var vEvent	=	$U.get(id,event);
				if (vEvent !== "" && !$U.isNull(vEvent)){
					window[vEvent](id,data);	
				}
			}
	
	//-------------------------------------------------------
	//	getdatarowindex	data의 rowindex
	//-------------------------------------------------------
	,	getdatarowindex :
			function(id,obj){
				return Number($U.get(obj,"ROWINDEX"));
			}

	//-------------------------------------------------------
	//	getscreenrowindex	화면의 rowindex
	//-------------------------------------------------------
	,	getscreenrowindex :
			function(id,obj,irow){
				if (this.toprowindex.match(id) < 0 ) return -1;
				var iTop	=	this.toprowindex[this.toprowindex.match(id)].value;
				return ($U.isNull(irow) ?  Number($U.get(obj,"ROWINDEX")) : irow) - iTop  ;
			}
	
	//-------------------------------------------------------
	//	getcell cell obj를 얻는다 	
	//-------------------------------------------------------
	,	getcell	:
			function(id,irow,icell){
				var iscrrow	=	Grid.getscreenrowindex(id, null, irow);
				var ifixcnt	=	$U.get($D(id),"FIXCNT");
				if (Number(ifixcnt) > Number(icell)){
					return $D(id+"_FIXED_DIV").childNodes[iscrrow-1].childNodes[icell];
				} else {
					return $D(id+"_NFIXED_DIV").childNodes[0].childNodes[iscrrow-1].childNodes[icell-ifixcnt];
				}
			}

	//-------------------------------------------------------
	//	grid cell set
	//		check, radio 인 경우 	=	data +	"♭" + checked 로 구성
	//-------------------------------------------------------
	,	setcell :
			function(pmode, obj, data, status){
		
				var cobj	=	obj.childNodes[0];	
				if ($U.get(obj,"CELLTYPE") === "S"){	//	STATUS 값을 나타낸다
					cobj.innerHTML	=	status;
				
				} else if (	$U.get(obj,"CELLTYPE") === "C"  || 
							$U.get(obj,"CELLTYPE") === "R"  ||
							$U.get(obj,"CELLTYPE") === "RC" ||
							$U.get(obj,"CELLTYPE") === "RR" ){	//	CheckBox, Radio , Reserved CheckBox, Reserved Radio
					
					var arrData	=	$U.nvl(data).toString().split(_GRID_CHECKDIVIDE);
					if (arrData[1] === "checked"){ 
						$U.set(cobj,"checked",true);
					} else {
						$U.del(cobj,"checked");
					}
					if ($U.get(obj,"CELLTYPE") === "RC" || $U.get(obj,"CELLTYPE") === "RR"){	//	Reserved 인 경우 항상 체크가 가능하도록
						cobj.disabled	=	false;
					} else {
						cobj.disabled	=	$U.get(obj,"edit") !== "Y" || pmode === "view";
					}
					
					obj.innerHTML	=	cobj.outerHTML + "<span name='CELLDATA'>" + arrData[0] +"</span>";
					
				} else {
					//	edit 인경우 contentEditable true
					if (pmode === "edit" && $U.get(obj,"edit") === "Y"){
						//cobj.contentEditable	=	true;	//---*	클릭시 에디팅 모드로 변환하도록 변경
						cobj.className			=	"edit";
					} else {
						cobj.contentEditable	=	false;
						cobj.className			=	"";
						
					}
					$U.set(cobj,"DEFAULTVALUE",$U.nvl(data));
					cobj.innerHTML	=	$U.nvl(data).toString().replace(/\r|\n/g,"<br>");
				}
			}

	//-------------------------------------------------------
	//	grid cell keyup
	//-------------------------------------------------------
	,	cellkeyup :
			function(ev,obj){
				//	LIMITLEN Check
				var limit 		=	$U.get(obj,"LIMITLEN");
				if (!$U.isNull(limit) && $U.byteLenU8($U.text(obj)) > limit){
					$U.settext(obj,$U.text(obj).substring(0,limit));
					alert("Limit value is " + limit);
					obj.focus();
					return false; 
				}
				var pobj		=	obj.parentElement;
				var id			=	$U.get(pobj.parentElement,"pid");
				var irowidx		=	$U.get(pobj,	"ROWINDEX");
				var icellidx	=	$U.get(pobj,	"CELLINDEX");
				Griddata.update(	id,
									irowidx,
									icellidx,
									$U.text(obj),
									obj.checked,
									true);
			}
	//-------------------------------------------------------
	//	grid cell keydown
	//-------------------------------------------------------
	,	cellkeydown :
			function(ev,obj){
				var e 	=	(window.event || ev);
				if ( e.which  === 13 || e.keyCode === 13){  
					if ($U.get(obj, "contenteditable") === "true"){
						Grid.cellheightsync($U.get(obj.parentElement.parentElement,"pid"),obj);
						return true;
					}
					var venter		=	obj.getAttribute("ENTERFUNC");
					if ($U.isNull(venter)) return true;
					var pobj		=	obj.parentElement;
					var id			=	$U.get(pobj.parentElement,"pid");
					var irowidx		=	$U.get(pobj,	"ROWINDEX");
					var icellidx	=	$U.get(pobj,	"CELLINDEX");
					var data		=	Griddata.dataset.get(id);
					setTimeout(function(){
						window[venter](id,data.rows[irowidx-1],irowidx,icellidx,obj);
					},100);
					e.preventDefault(); 
					e.stopPropagation(); 
					return false; 
				}
				return true;
			}
	//-------------------------------------------------------
	//	grid cell keypress
	//-------------------------------------------------------
	,	cellkeypress :
			function(ev,obj){
				var pobj		=	obj.parentElement;
				var id			=	$U.get(pobj.parentElement,"pid");
				var irowidx		=	$U.get(pobj,	"ROWINDEX");
				var icellidx	=	$U.get(pobj,	"CELLINDEX");
				var vkeypress	=	obj.getAttribute("KEYPRESSFUNC");
				if ($U.isNull(vkeypress)) return;
				var data		=	Griddata.dataset.get(id);
				setTimeout(function(){
					window[vkeypress](id,data.rows[irowidx-1],irowidx,icellidx,obj);
				},100);
			}
	
	//-------------------------------------------------------
	//	grid cell focusout
	//-------------------------------------------------------
	,	cellfocusout :
			function(ev,obj){
				var pobj		=	obj.parentElement;
				var id			=	$U.get(pobj.parentElement,"pid");
				var irowidx		=	$U.get(pobj,	"ROWINDEX");
				var icellidx	=	$U.get(pobj,	"CELLINDEX");
				var data		=	Griddata.dataset.get(id);
				
				var vformatter	=	pobj.getAttribute("FORMATTER");
				if (!$U.isNullOrEmpty(vformatter)){
					obj.innerHTML	=	window[vformatter]((data.rows[irowidx-1])[Gridext.getcolname(id,icellidx)],irowidx,icellidx,Gridext.getcolname(id,icellidx), pobj, data.rows[irowidx-1])
				}
				
				var vfocusout	=	obj.getAttribute("CELLCHANGEFUNC");
				if ($U.isNull(vfocusout)) return;
				
				if (obj.innerHTML !== $U.get(obj,"DEFAULTVALUE").toString()){
					$hD("#test2").innerHTML	=	$U.get(pobj,"FORMATTER");
					setTimeout(function(){
						window[vfocusout](id,data.rows[irowidx-1],irowidx,icellidx,obj);
					},100);
				}
			}
	
	//-------------------------------------------------------
	//	grid cell focusin
	//-------------------------------------------------------
	,	cellfocusin :
			function(ev,obj){
				Grid.focusincell	=	obj;
			}
	
	//-------------------------------------------------------
	//	grid data set
	//-------------------------------------------------------
	,	setdata :
			function(id,fObj,nObj,arrList,arrId,idx,irowidx,iFixCnt){
				if ($U.isNull(fObj) || $U.isNull(nObj)) return;
				$U.set(fObj,	"ROWINDEX",	irowidx+1);
				$U.set(nObj, 	"ROWINDEX",	irowidx+1);
				var fLI		=	$T("LI",fObj);
				var nfLI	=	$T("LI",nObj);	
				var vobj	=	null;
				var vdata	=	"";
				var vStatus	=	$U.nvl(arrList[idx]["STATUS"],"N");	
				var vmode	=	$U.get($D(id),"MODE");
				var cellheight	=	$U.get($D(id),"CELLHEIGHT");
				
				iFixCnt		=	Number(iFixCnt);
				for (var x=0,y=iFixCnt; x<y; x+=1){
					vobj	=	fLI[x];
					vobj.style.height	=	cellheight + "px";
					vobj.parentElement.style.height	=	Number(cellheight) + GridRowSpan.rowspanCorrectValue + "px";
					
					if ($U.isNull(arrList[idx][arrId[x]])){
						vdata	=	"";
					} else {
						if ($U.get(vobj,"FORMATTER") !== "" && $U.isNull(window[$U.get(vobj,"FORMATTER")])){
							alert($U.get(vobj,"FORMATTER") + " is not defined !!!");
							break;
						}
						vdata	=	($U.get(vobj,"FORMATTER") === "") ? 	
									arrList[idx][arrId[x]] : 
									window[$U.get(vobj,"FORMATTER")](arrList[idx][arrId[x]],(irowidx+1),$U.get(vobj,"CELLINDEX"),$U.get(vobj,"CELLID"), vobj, arrList[idx]);
					}
					Grid.setcell( vmode, vobj, vdata, vStatus);
					$U.set(vobj,"ROWINDEX",irowidx+1);
				}
				
				var iLeft	=	this.leftcolindex.match(id) === -1 ? iFixCnt : this.leftcolindex[this.leftcolindex.match(id)].value;
				var iRight	=	this.rightcolindex.match(id) === -1 ? arrId.length : this.rightcolindex[this.rightcolindex.match(id)].value;
				
				for (var x=iLeft,y=iRight; x<y; x+=1){
					if (iFixCnt > x) continue;
					if (nfLI.length === (x-iFixCnt)) break;
					vobj	=	nfLI[x-iFixCnt];
					vobj.style.height	=	cellheight + "px";
					vobj.parentElement.style.height	=	Number(cellheight) + GridRowSpan.rowspanCorrectValue + "px";
					
					if ($U.isNull(arrList[idx][arrId[x]])){
						vdata	=	"";
					} else {
						if ($U.get(vobj,"FORMATTER") !== "" && $U.isNull(window[$U.get(vobj,"FORMATTER")])){
							alert($U.get(vobj,"FORMATTER") + "is not defined !!!");
							break;
						}
						vdata	=	($U.get(vobj,"FORMATTER") === "") ? 	
									arrList[idx][arrId[x]] : 
									window[$U.get(vobj,"FORMATTER")](arrList[idx][arrId[x]],(irowidx+1),$U.get(vobj,"CELLINDEX"),$U.get(vobj,"CELLID"), vobj, arrList[idx]);
					}
					Grid.setcell( vmode, vobj, vdata, vStatus);
					$U.set(vobj,"ROWINDEX",irowidx+1);
				}
				arrList[idx]["STATUS"]	=	vStatus;
			}
	
	//-------------------------------------------------------
	//	grid null data set
	//-------------------------------------------------------
	,	setnulldata :
			function(fObj,nObj,arrList,arrId,idx,irowidx,iFixCnt){
				$U.set(fObj, 	"ROWINDEX",	irowidx+1);
				$U.set(nObj, 	"ROWINDEX",	irowidx+1);
				var fLI		=	$T("LI",fObj);
				var nfLI		=	$T("LI",nObj);	
				for (var x=0,y=arrId.length; x<y; x+=1){
					Grid.setcell( "view", (iFixCnt > x ? fLI[x] : nfLI[x-iFixCnt]), "");
				}
			}

	//-------------------------------------------------------
	//	grid cell update
	//-------------------------------------------------------
	,	update :
			function(id, irow, icell, data){
				var lobj	=	Grid.getcell(id, irow, icell);
				var rowdata	=	$U.isNull(Griddata.dataset.get(id)) ||  $U.isNull(Griddata.dataset.get(id).rows) ? null : Griddata.dataset.get(id).rows[irow-1][$U.get(lobj,"CELLID")];
				var vdata	=	$U.get(lobj,"FORMATTER") === "" ? data : window[$U.get(lobj,"FORMATTER")](data,irow,icell,$U.get(lobj,"CELLID"),lobj.parentElement,rowdata);
				Grid.setcell($U.get($D(id),"MODE"), lobj, vdata, data);
			}
	
	//-------------------------------------------------------
	//	grid header set
	//-------------------------------------------------------
	,	headerset :
			function(id){
				var vHeader	=	$U.get(id,"HEADER").replace(/{/g,"").toString().split("}");
				this.header.set(id,vHeader);
			}

	//-------------------------------------------------------
	//	grid call
	//-------------------------------------------------------
	,	call :
			function(id,params,pdata,ptype){
				
				//---*	Ajax paramtype
				Grid.ptype.set(id, $U.nvl(ptype,"string"));
		
				//	left col index, right col index 가 없는 경우 처리	2014-04-12		
				if (this.leftcolindex.match(id) !== -1) this.leftcolindex.splice(this.leftcolindex.match(id), 1);
				if (this.rightcolindex.match(id) !== -1) this.rightcolindex.splice(this.rightcolindex.match(id), 1);
		
				Grid.eventchk	=	false;
		
				//	Loading  처리
				setTimeout( function(){	Gridext.loading(1);	},	1);
				
				//	Call Before Event  처리
				Grid.raiseevent(id, "oncallbefore", null);
				
				var gObj =	$D(id);
				if ($U.get(gObj,"AUTORESIZE") === "Y") Grid.resize(id,gObj.parentElement.offsetWidth,gObj.parentElement.offsetHeight,false);
	 			if ($U.isNull(gObj)){
	 				Grid.eventchk	=	true;
	 				Grid.afterevent(id);
	 				return;
	 			}
				
	 			this.starttime	=	new Date().getTime(); 
	 			var arrparam	=	new Array();
	 			var vparams		=	Griddata.paramset.get(id);
	 			if (!$U.isNull(vparams)){
	 				var arrparam2	=	vparams.toString().split("&");
	 				if ($U.isNull(params)){
		 				for (var n=0,m=arrparam2.length; n<m; n+=1){
		 					if (	arrparam2[n].indexOf("page=") 		!== -1 
		 						||	arrparam2[n].indexOf("limit=") 		!== -1 
		 						||	arrparam2[n].indexOf("PAGENAVIYN=") !== -1 ) continue;
		 					arrparam.push(arrparam2[n]);
		 				}
		 				params	=	arrparam.join("&");	
	 				} else {
		 				for (var n=0,m=arrparam2.length; n<m; n+=1){
		 					if (	arrparam2[n].indexOf("page=") 		!== -1 
		 						||	arrparam2[n].indexOf("limit=") 		!== -1 
		 						||	arrparam2[n].indexOf("PAGENAVIYN=") !== -1 ) continue;
		 					if ( params.indexOf(arrparam2[n].toString().split("=")[0])	!== -1 ) continue;
		 					arrparam.push(arrparam2[n]);
		 				}
		 				params += "&" + arrparam.join("&");	
	 				}
	 			}
	 			
	 			if ($U.isNull(params)){
		 			params = $U.format("page={0}&limit={1}&PAGENAVIYN={2}",1,$U.get(gObj,"PAGEROWCNT"),$U.get(gObj,"PAGENAVIYN") );
	 			} else {
	 				if (params.indexOf("page=") 	=== -1 ) params += "&page=1";
	 				if (params.indexOf("limit=") 	=== -1 ) params += "&limit=" + $U.get(gObj,"PAGEROWCNT");
	 				if (params.indexOf("PAGENAVIYN=") 	=== -1 ) params += "&PAGENAVIYN=" + $U.get(gObj,"PAGENAVIYN");
	 			}
	 			
	 			this.vscrollstopaction.set(id, $U.get(id,"VSCROLLSTOPACTION"));
	 			Griddata.paramset.set(id,params);
	 			Grid.headerset(id);
	 			
	 			var arrParam	=	params.toString().split("&");
	 			for (var idx in arrParam){
	 				if (arrParam[idx].indexOf("page=") > -1){
	 					$U.set(gObj,"CURRENTPAGE",arrParam[idx].replace(/page=/g,""));
	 					break;
	 				}
	 			}
	 			
	 			var vgridscrollvalue	=	20;
	 			
	 			if ($U.isNull(pdata)){
					$A.call({url:$U.get(gObj,"URL"),param:params,ptype:Grid.ptype.get(id)},function(data){
						
						//	Grid 의 data 가 있으나 records 정보가 없는 경우
						if (!$U.isNull(data) && !$U.isNull(data.rows)){
							if ($U.isNull(data.records)){
								data.records	=	data.rows.length;	
							}
						}
						
						//	소계가 있는경우
						if (!$U.isNullOrEmpty($U.get(gObj,	"group"))){
							data.rows 		=	Grid.computegroup(id,data.rows,gObj);
							data.records	=	data.rows.length;
							data.total		=	data.rows.length;
						}
						
						//	서브소계 01 가 있는경우
						if (!$U.isNullOrEmpty($U.get(gObj,	"subgroup_01"))){
							data.rows 		=	Grid.computesubgroup("01", id,data.rows,gObj);
							data.records	=	data.rows.length;
							data.total		=	data.rows.length;
						}
						
						//	서브소계 02 있는경우
						if (!$U.isNullOrEmpty($U.get(gObj,	"subgroup_02"))){
							data.rows 		=	Grid.computesubgroup("02", id,data.rows,gObj);
							data.records	=	data.rows.length;
							data.total		=	data.rows.length;
						}
						
						Grid.timerecordchk	=	true;
						Grid.eventchk	=	Grid.setdataforall(id,data,0);
						var idviewcnt	=	Number($U.get(gObj,	"DATAVIEWCNT"));			//	화면에 나오는 로우수
						var totalcnt	=	Number($U.get(gObj,	"PAGENAVIYN") === "Y" ? data.limit : data.records); 
						var nsObj 		= 	$D(id + "_NONESCROLL");	//	위치 잡기
						
						if (idviewcnt !==0){
							nsObj.style.display		=	idviewcnt >= totalcnt ? "none" : "block";
							nsObj.style.top			=	(Number($U.get(id,"HEADERHEIGHT")) * Number($U.get(id,"HEADERROWCNT"))) + "px";	
							nsObj.style.height		=	($D(id+"_NFIXED_DIV").offsetHeight -_GRID_SCROLL_BOX) + "px";
							vgridscrollvalue 		=	Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value;
							nsObj.childNodes[0].style.height	=	(totalcnt  * vgridscrollvalue)				//	총건수
																+	(Math.floor( (totalcnt  * vgridscrollvalue ) / (idviewcnt-1) ))
																+ 	(nsObj.offsetHeight - Math.floor( (totalcnt  * vgridscrollvalue ) / (idviewcnt-1)))	//	nsObj.offsetHeight -> 스크롤바 높이 
																-	((idviewcnt-1) * vgridscrollvalue)
																+ 	"px";
							//console.log("CHECK="+ nsObj.childNodes[0].offsetHeight + "=" + nsObj.offsetHeight);
							nsObj.style.overflowY	=	nsObj.childNodes[0].offsetHeight > nsObj.offsetHeight ? "scroll" : "auto";
							//	화면상 편집시 데이타 처리를 위해 저장한다.
							data.rows	=	$U.nvl(data.rows,[]);
							
							//---* EXT-ROWINDEX 값을 설정한다
							for (var z=0,doo;doo=data.rows[z];z+=1){
								doo["EXT-ROWINDEX"] = z+1;
							}
							
							Griddata.dataset.set(id,data);
							setTimeout(function(){Griddata.origindataset.set(id,$U.clone(data));},1);	//	sort, filter, mass 시 사용.....
							Grid.cellheightsync(id);
							GridRowSpan.make(id);
							
						} else {
							nsObj.style.display		=	"none";
							nsObj.style.overflowY	=	"auto";
						}
						
						//	After Event  처리
						Grid.afterevent(id);
						
						//	Mass Grid Event  처리
						Grid.massgrid(id, $U.isNull(data) || $U.isNull(data._GRID_MASS_KEY) ? "" : data._GRID_MASS_KEY );
						
					});
					
	 			} else {
					
					//	Grid 의 data 가 있으나 records 정보가 없는 경우
					if (!$U.isNull(pdata) && !$U.isNull(pdata.rows)){
						if ($U.isNull(pdata.records)){
							pdata.records	=	pdata.rows.length;	
						}
					}
					
					//	소계가 있는경우
					if (!$U.isNull($U.get(gObj,	"group"))){
						pdata.rows 		=	Grid.computegroup(id,pdata.rows,gObj);
						pdata.records	=	pdata.rows.length;
						pdata.total		=	pdata.rows.length;
					}
					
					//	서브소계 01 가 있는경우
					if (!$U.isNullOrEmpty($U.get(gObj,	"subgroup_01"))){
						pdata.rows 		=	Grid.computesubgroup("01", id,pdata.rows,gObj);
						pdata.records	=	pdata.rows.length;
						pdata.total		=	pdata.rows.length;
					}
					
					//	서브소계 02 가 있는경우
					if (!$U.isNullOrEmpty($U.get(gObj,	"subgroup_02"))){
						pdata.rows 		=	Grid.computesubgroup("02", id,pdata.rows,gObj);
						pdata.records	=	pdata.rows.length;
						pdata.total		=	pdata.rows.length;
					}
					
					Grid.timerecordchk	=	true;
	 				Grid.eventchk		=	Grid.setdataforall(id,pdata,0);
					var idviewcnt		=	Number($U.get(gObj, 	"DATAVIEWCNT"));			//	화면에 나오는 로우수
					var totalcnt		=	Number($U.get(gObj,	"PAGENAVIYN") === "Y" ? pdata.limit : pdata.records); 
					
					var nsObj 			= 	$D(id + "_NONESCROLL");	//	위치 잡기
					if (idviewcnt !==0){
						nsObj.style.display	=	idviewcnt >= totalcnt ? "none" : "block";
						nsObj.style.top		=	(Number($U.get(id,"HEADERHEIGHT")) * Number($U.get(id,"HEADERROWCNT"))) + "px";	
						nsObj.style.height	=	($D(id+"_NFIXED_DIV").offsetHeight -_GRID_SCROLL_BOX) + "px";
						vgridscrollvalue 	=	Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value;
						nsObj.childNodes[0].style.height	=	(totalcnt  * vgridscrollvalue ) 				//	총건수
															+	(Math.floor( (totalcnt  * vgridscrollvalue ) / (idviewcnt-1) ))
															+ 	(nsObj.offsetHeight - Math.floor( (totalcnt  * vgridscrollvalue ) / (idviewcnt-1)))	//	nsObj.offsetHeight -> 스크롤바 높이 
															-	((idviewcnt-1)	*	vgridscrollvalue)
															+ 	"px";
						nsObj.style.overflowY	=	nsObj.childNodes[0].offsetHeight > nsObj.offsetHeight ? "scroll" : "auto";
						pdata.rows	=	$U.nvl(pdata.rows,[]);
						//---* EXT-ROWINDEX 값을 설정한다
						for (var z=0,doo;doo=pdata.rows[z];z+=1){
							doo["EXT-ROWINDEX"] = z+1;
						}
						//	화면상 편집시 데이타 처리를 위해 저장한다.
						Griddata.dataset.set(id,pdata);
						setTimeout(function(){Griddata.origindataset.set(id,$U.clone(pdata));},1);	//	sort, filter, mass 시 사용.....
						Grid.cellheightsync(id);
						GridRowSpan.make(id);
					} else {
						nsObj.style.display		=	"none";
						nsObj.style.overflowY	=	"auto";
					}
					
					//	After Event  처리
					Grid.afterevent(id);
					
					//	Mass Grid Event  처리
					Grid.massgrid(id, $U.isNull(pdata) || $U.isNull(pdata._GRID_MASS_KEY) ? "" : pdata._GRID_MASS_KEY );
	 			}
					
				//	unload 및 onscroll binding
				//Grid.resizebind(id);
				/*if (window.addEventListener){
		        	window.addEventListener ("onunload", Grid.finalattach, false);
		        	if (IDV_BROWSER.NAME === "firefox"){
		            	$D(id + "_FIXED_DIV").addEventListener ("DOMMouseScroll", Grid.mousewheel, false);
		            	$D(id + "_NFIXED_DIV").addEventListener ("DOMMouseScroll", Grid.mousewheel, false);
		        	}
				} else {
					if (window.onunload){
						window.attachEvent("onunload", Grid.finalattach);
					} else {
						window.onunload	=	Grid.finalunload;
					}
				}*/
				
			}

	//-------------------------------------------------------
	//	grid mass Grid 처리
	//-------------------------------------------------------
	,	massgrid :
			function(id,sk){
				if ($U.get($D(id),"MASSYN") === "Y"){
					var mu	=	$U.get($D(id),"MASSURL");
					var d		=	Griddata.dataset.get(id);
					setTimeout(function(){ 
			 				this.starttime	=	new Date().getTime(); 
							Grid.massgridcall(id,mu,sk, d); 
					}, 3000);
				}
			}
	,	massgridcall :
			function(id,mu,sk, d){
				
				$A.call({url:mu,param:"key="+sk,ptype:Grid.ptype.get(id),loading:false},function(data){
					if (data.records !== 0){
						
						if ($U.isNull(d)){
							d	= {"records":0, "rows":[data.rows]};
						} else {
							for (var q=0,w=data.rows.length; q<w; q+=1){
								d.rows.unshift(data.rows[q]);
							}
						}
						d.records = d.rows.length;
						
						var mt = $U.isNull(data.masstotal) ? "" :  "/" + $U.tocurrency(data.masstotal);
						var divPage	=	$D(id).childNodes[2];
						var arrSpan	=	$T("span",divPage.childNodes[0]);
						arrSpan[0].innerHTML	=	"<a>Total&nbsp;:&nbsp;</a>" 	+ 	$U.tocurrency(d.records) + mt ;
						arrSpan[2].innerHTML	=	"<a>ElapsedTime&nbsp;:&nbsp;</a>"	+	((new Date().getTime() - this.starttime) /1000) + "s" ;
						
						setTimeout(function(){ Grid.massgridcall(id,mu,sk,d); }, 1);
					} else {
						
						Griddata.dataset.set(id,d);
						setTimeout(function(){Griddata.origindataset.set(id,$U.clone(d));},1);	//	sort, filter, mass 시 사용.....
						Grid.reload(id);
					}
				});
			}
	
	//-------------------------------------------------------
	//	grid after event
	//-------------------------------------------------------
	,	afterevent :
			function(id){
				if (Grid.eventchk === true) {
					
					//console.log("AFTEREVENT............");
					
					
					Grid.raiseevent(id, "onsuccess", null);
					Grid.raiseevent(id, "oncallafter", null);
					setTimeout(function(){Gridext.loading(2);},100);
					Grid.eventchk	=	false;
					
				} else {
					setTimeout(function(){Grid.afterevent(id);},1000);
				}
	
			}
	
	//-------------------------------------------------------
	//	grid reload
	//-------------------------------------------------------
	,	reload :
			function(id){
				
				// console.log("RELOAD..............");
				
				Grid.eventchk =  false;
				
				var gObj =	$D(id);
				if ($U.get(gObj,"AUTORESIZE") === "Y") Grid.resize(id,gObj.parentElement.offsetWidth,gObj.parentElement.offsetHeight,false);
				
				var data	= 	Griddata.dataset.get(id);
				if (!$U.isNull(data)){

					Grid.eventchk	=	Grid.setdataforall(id,data,this.toprowindex.match(id) === -1 ? 0 : this.toprowindex[this.toprowindex.match(id)].value);
					var idviewcnt	=	Number($U.get(gObj, 	"DATAVIEWCNT"));			//	화면에 나오는 로우수
					var totalcnt	=	Number($U.get(gObj,	"PAGENAVIYN") === "Y" ? data.limit : data.rows.length); //---*	Filter 등 처리를 위해 rows.length 로 변경
					var nsObj 			= 	$D(id + "_NONESCROLL");	//	위치 잡기
					
					if (idviewcnt !== 0){
						nsObj.style.display	=	idviewcnt >= totalcnt ? "none" : "block";
						nsObj.style.top		=	(Number($U.get(id,"HEADERHEIGHT")) * Number($U.get(id,"HEADERROWCNT"))) + "px";	
						nsObj.style.height	=	($D(id+"_NFIXED_DIV").offsetHeight -_GRID_SCROLL_BOX) + "px";
						var vgridscrollvalue	=	Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value;
						nsObj.childNodes[0].style.height	=	(totalcnt  * vgridscrollvalue ) 				//	총건수
															+	(Math.floor( (totalcnt  * vgridscrollvalue ) / (idviewcnt-1) ))
															+ 	(nsObj.offsetHeight - Math.floor( (totalcnt  * vgridscrollvalue ) / (idviewcnt-1)))	//	nsObj.offsetHeight -> 스크롤바 높이 
															-	((idviewcnt-1)	*	vgridscrollvalue)
															+ 	"px";
						nsObj.style.overflowY	=	nsObj.childNodes[0].offsetHeight > nsObj.offsetHeight ? "scroll" : "auto";
						Grid.cellheightsync(id);
						GridRowSpan.make(id);
					
					} else {
						nsObj.style.display		=	"none";
						nsObj.style.overflowY	=	"auto";
					}
					
					
				} else {
					Grid.eventchk	=	true;
				}
				
				//	after event 처리
				this.afterevent(id);
				Grid.select(id,1);
			}
	
	//-------------------------------------------------------
	//	page move
	//-------------------------------------------------------
	,	move :
			function(id,opt){
				var page = opt;
				if (page === "FIRST"){
					page = 1;
				
				} else if (page === "BACK"){
					page = $D(id).getAttribute("CURRENTPAGE");
					page = Number(page) - 11 < 1 ? 1 : Number(page) - 11;
					
				} else if (page === "NEXT"){
					page = $D(id).getAttribute("CURRENTPAGE");
					page = Number(page) + 11 > Number($D(id).getAttribute("PAGETOTAL")) ? $D(id).getAttribute("PAGETOTAL") : Number(page) + 11;
				
				} else if (page === "LAST"){
					page = $D(id).getAttribute("PAGETOTAL");
				}
				
				var params = "page=" + page;
				Grid.call(id,params);
			
			}
	
	//-------------------------------------------------------
	//		page row cnt change
	//-------------------------------------------------------
	,	rowcntchange :
			function(id,obj){
				$D(id).setAttribute("PAGEROWCNT",obj.options[obj.selectedIndex].value);
				Grid.move(id,"FIRST");
			}
	
	//-------------------------------------------------------
	//	page 바로가기
	//-------------------------------------------------------
	,	godirect :
			function(id,obj,e){
				if(e.keyCode === 13){ 
					var params = "page=" + (Number(obj.value) > Number($D(id).getAttribute("PAGETOTAL")) ? $D(id).getAttribute("PAGETOTAL") : obj.value);
					Grid.call(id,params);
				}
			}
	
	//-------------------------------------------------------
	//	소계 계산하기
	//-------------------------------------------------------
	,	computegroup :
			function(id,data,obj){
				
				var h,g,base,cntcolid,colname,drow,cdrow,crondrow,ccnt,rowindex,basetype,coltype;
				try{
					g	=	obj.getAttribute("group").toString().split(",");
					for (var i=0,o; o=g[i]; i+=1){
						if (o.indexOf("basecolid=")>-1){ base=o.replace(/basecolid=/,"") };
						if (o.indexOf("countcolid=")>-1){ cntcolid=o.replace(/countcolid=/,"") };
						if (o.indexOf("colname=")>-1){ colname=o.replace(/colname=/,"").toString().split("||"); };
						if (o.indexOf("basetype=")>-1){ basetype=o.replace(/basetype=/,""); };
						if (o.indexOf("coltype=")>-1){ coltype=o.replace(/coltype=/,""); };
					}
					
					drow	=	[];	
					h		=	obj.getAttribute("HEADID").toString().split(",");
					cdrow	=	{no:null,rowidx:0,cnt:0,val:{}};
					for (var i=0,o;o=h[i];i+=1){
						cdrow.val[o]	=	"";
					}
					cdrow.val["STATUS"]	=	"GROUP";
					cronrow		=	$U.clone(cdrow);
					cronrow.no	=	0;
					cronrow.rowidx	=	0;
					cronrow.val[base]	=	data.length > 0 ? data[0][base] : 0;
					ccnt		=	0;
					rowindex	=	1;
					for (var i=0,o; o=data[i]; i+=1){
						if ( cronrow.val[base] !== o[base]){
							cronrow.val[base]		=	"● <font class='groupcss'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>";
							cronrow.val[cntcolid]	=	"<font class='groupcss'>총  " + ccnt + " 건</font>";
							cronrow.cnt	=	ccnt;
							drow.push(cronrow);
							cronrow	=	$U.clone(cdrow);
							cronrow.no	=	i;
							cronrow.rowidx	=	(rowindex++);
							cronrow.val[base]	=	o[base];
							ccnt		=	0;
						} 
						ccnt++;
						rowindex++;
					}
					
					if (drow.length > 0){
						if ( ("◈ <font class='groupcss'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>") !== drow[drow.length-1].val[base]){
							cronrow.val[base]		=	"● <font class='groupcss'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>";
							cronrow.val[cntcolid]	=	"<font class='groupcss'>총  " + ccnt + " 건</font>";
							cronrow.cnt	=	ccnt;
							drow.push(cronrow);
						} 
					}
					
					Grid.group.set(id, drow);
					
					//	return 값에 소계값을 삽입한다.
					for (var i=drow.length-1,o;o=drow[i];i-=1){
						data.splice(o.no,0,o.val);
					}
					
					setTimeout(function(){
						Grid.computegroupdetail("GROUP", id,data,obj);
					},1)
						
				} catch(e){
					alert("[computegroup]" + e);
				}finally{
					h		=	null;
					g		=	null;
					base	=	null;
					colname	=	null;
					cdrow	=	null;
					crondrow	=	null;
					ccnt	=	null;
					rowindex	=	null;
					basetype	=	null;
					coltype	=	null;
				}	
				return data;
			}

	,	computesubgroup :
			function(idx,id,data,obj){
				
				var h,g,base,cntcolid,colname,drow,cdrow,crondrow,ccnt,rowindex,basetype,coltype,chkstatus,endchk,istart;
				try{
					g	=	obj.getAttribute("subgroup_"+idx).toString().split(",");
					for (var i=0,o; o=g[i]; i+=1){
						if (o.indexOf("basecolid=")>-1){ base=o.replace(/basecolid=/,"") };
						if (o.indexOf("countcolid=")>-1){ cntcolid=o.replace(/countcolid=/,"") };
						if (o.indexOf("colname=")>-1){ colname=o.replace(/colname=/,"").toString().split("||"); };
						if (o.indexOf("basetype=")>-1){ basetype=o.replace(/basetype=/,""); };
						if (o.indexOf("coltype=")>-1){ coltype=o.replace(/coltype=/,""); };
					}
					
					drow	=	[];	
					h		=	obj.getAttribute("HEADID").toString().split(",");
					cdrow	=	{no:null,rowidx:0,cnt:0,val:{}};
					for (var i=0,o;o=h[i];i+=1){
						cdrow.val[o]	=	"";
					}
					cdrow.val["STATUS"]	=	"GROUP_"+idx;
					chkstatus	=	idx === "01" ? "GROUP" : "GROUP_01";
					endchk	=	false;
					
					//---*	idx	가 01 인경우 data STSTUS 가 GROUP 에서 GROUP인 로우를 대상으로 한다
					//---*	idx	가 02 인경우 data STSTUS 가 GROUP_01 에서 GROUP_01인 로우를 대상으로 한다
					for (var i=0,o; o=data[i]; i+=1){
						if (o["STATUS"] === chkstatus && endchk === true){
							endchk		=	false;
							
							//console.log("ISTART====i===" + istart + "===" + i );
							
							ccnt		=	0;
							rowindex	=	istart;
							for (var q=istart,wo;wo=data[q];q+=1){
								if (q > i) break;
								if ( cronrow.val[base] !== wo[base]){
									cronrow.val[base]		=	"◎ <font class='groupcss_sub'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>";
									cronrow.val[cntcolid]	=	"<font class='groupcss_sub'>총  " + ccnt + " 건</font>";
									cronrow.cnt	=	ccnt;
									drow.push(cronrow);
									cronrow	=	$U.clone(cdrow);
									cronrow.no	=	q;
									cronrow.rowidx	=	(rowindex++);
									cronrow.val[base]	=	wo[base];
									ccnt		=	0;
								} 
								ccnt++;
								rowindex++;
							}
						
						} 
						if (o["STATUS"] === chkstatus && endchk === false){
							istart		=	i+1;
							cronrow		=	$U.clone(cdrow);
							cronrow.no	=	istart;
							cronrow.rowidx	=	istart;
							cronrow.val[base]	=	data[istart][base];
							endchk	=	true;
						} 
					}
					
					if (drow.length > 0){
						ccnt		=	0;
						rowindex	=	istart;
						for (var q=istart,wo;wo=data[q];q+=1){
							if ( cronrow.val[base] !== wo[base]){
								cronrow.val[base]		=	"◎ <font class='groupcss_sub'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>";
								cronrow.val[cntcolid]	=	"<font class='groupcss_sub'>총  " + ccnt + " 건</font>";
								cronrow.cnt	=	ccnt;
								drow.push(cronrow);
								cronrow	=	$U.clone(cdrow);
								cronrow.no	=	q;
								cronrow.rowidx	=	(rowindex++);
								cronrow.val[base]	=	wo[base];
								ccnt		=	0;
							} 
							ccnt++;
							rowindex++;
						}
						if ( ("◈ <font class='groupcss_sub'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>") !== drow[drow.length-1].val[base]){
							cronrow.val[base]		=	"◎ <font class='groupcss_sub'>" + Gridformatter.formatter(cronrow.val[base],basetype) + "</font>";
							cronrow.val[cntcolid]	=	"<font class='groupcss_sub'>총  " + ccnt + " 건</font>";
							cronrow.cnt	=	ccnt;
							drow.push(cronrow);
						} 
					}
					
					if (idx === "01") Grid.subgroup_01.set(id, drow);
					if (idx === "02") Grid.subgroup_02.set(id, drow);
					
					//	return 값에 소계값을 삽입한다.
					for (var i=drow.length-1,o;o=drow[i];i-=1){
						data.splice(o.no,0,o.val);
					}
					
					setTimeout(function(){
						Grid.computegroupdetail("GROUP_"+idx, id,data,obj);
					},1)
						
				} catch(e){
					alert("[computesubgroup]" + e);
				}finally{
						h		=	null
					,	g		=	null
					,	base	=	null
					,	colname	=	null
					,	cdrow	=	null
					,	crondrow	=	null
					,	ccnt	=	null
					,	rowindex	=	null
					,	basetype	=	null
					,	coltype	=	null
					,	chkstatus	=	null
					,	endchk	=	null
					,	istart	=	null;
				}	
				return data;
			}
	
	
	,	computegroupdetail :
			function(chkkey,id,data,obj){
				
				var h,g,colname,eno,drow,cdrow,cronrow,coltype,icnt,chkclass;
				try{
					
					//---*	위치값 재세팅
					if (chkkey === "GROUP"){				
						drow 	= 	Grid.group.get(id);	
						g		=	obj.getAttribute("group").toString().split(",");
					}	else if (chkkey === "GROUP_01"){	
						drow 	= 	Grid.subgroup_01.get(id);	
						g		=	obj.getAttribute("subgroup_01").toString().split(",");
					}	else if (chkkey === "GROUP_02"){	
						drow 	= 	Grid.subgroup_02.get(id);	
						g		=	obj.getAttribute("subgroup_02").toString().split(",");
					}
					for (var i=0,o; o=g[i]; i+=1){
						if (o.indexOf("colname=")>-1){ colname=o.replace(/colname=/,"").toString().split("||"); };
						if (o.indexOf("coltype=")>-1){ coltype=o.replace(/coltype=/,""); };
					}
					
					chkclass	=	chkkey === "GROUP"	?	"groupcss"	:	"groupcss_sub";
					
					icnt	=	0;
					for (var i=0,o;o=data[i];i+=1){
						if (o["STATUS"] === chkkey){
							drow[icnt].rowidx	=	i;
							icnt++;
						}
					}
					
					h		=	obj.getAttribute("HEADID").toString().split(",");
					cdrow	=	{no:null,val:{}};
					for (var i=0,o;o=h[i];i+=1){
						cdrow.val[o]	=	"";
					}
					
					for (var i=0,o; o=drow[i]; i+=1){
						eno	=	( $U.isNull(drow[i+1]) ? data.length-1 : drow[i+1].rowidx ) - o.rowidx;
						cronrow	=	$U.clone(cdrow);
						for (var k=o.rowidx,j=o.rowidx+eno; k<j; k+=1){
							for (var x=0,co;co=colname[x];x+=1){
								cronrow.val[co]	=	$U.plus(cronrow.val[co],data[k][co]);
							}
						}
						for (var x=0,co;co=colname[x];x+=1){
							Griddata.update(id, o.rowidx+1, Gridext.getcolindex(id,co),"<font class='"+chkclass+"'>" +Gridformatter.formatter(cronrow.val[co],coltype) + "</font>",null,null);
						}
					}
						
				} catch(e){
					alert("[computegroupdetail]" + e);
				} finally{
						h		=	null
					,	g		=	null
					,	colname	=	null
					,	eno		=	null
					,	drow	=	null
					,	cdrow	=	null
					,	crondrow	=	null
					,	coltype	=	null
					,	icnt	=	null
					,	chkclass	=	null;
				}	
			}
	
	//-------------------------------------------------------
	//	data setting all : 화면 디스플레이 - 통합
	//-------------------------------------------------------
	,	setdataforall	:
			function(id,data,iFirst){
				
				if ($U.isNull(data)){
					data	=	{"total":0,"limit":999999,"records":0,"page":1};
				}
		
				var obj			=	$D(id);
				var NoDisArea	=	obj.childNodes[1].childNodes[0];
				var fixArea		=	$D(id+"_FIXED_DIV");
				var nfixArea	=	$D(id+"_NFIXED_DIV").childNodes[0];
				var ULCnt		=	$T("UL",nfixArea).length;					//	현재 리스트의 갯수를 구한다.
				var arrList		=	$U.isNull(data.rows) ? [] : data.rows;	
				var iEnd		=	Math.ceil(fixArea.offsetHeight /(Number(obj.getAttribute("CELLHEIGHT")) + GridRowSpan.rowspanCorrectValue - 2 ));	
				arrList			=	arrList.slice(iFirst,iFirst+iEnd - 1 - (nfixArea.offsetWidth > $D(id+"_NFIXED_DIV").offsetWidth ? 1 : 0) );
				
				if (this.toprowindex.match(id) === -1){
					this.toprowindex.push({id:id,value:iFirst});
					this.bottomrowindex.push({id:id,value:iFirst+arrList.length});
				} else {
					this.toprowindex[this.toprowindex.match(id)].value	=	iFirst;
					this.bottomrowindex[this.bottomrowindex.match(id)].value	=	iFirst+arrList.length;
				}

				if (this.gridscrollvalue.match(id) === -1){
					this.gridscrollvalue.push({id:id,value:(data.records > 50000 ? 1 : 20)});
				} else {
					this.gridscrollvalue[this.gridscrollvalue.match(id)].value	=	(data.records > 50000 ? 1 : 20);
				}
				
				data.limit	=	$U.isNull(data.limit) ? data.records : data.limit;
				
				//$U.set(obj, "PAGEROWCNT",	 data.limit);
				$U.set(obj, "DATAVIEWCNT", 	( $U.get(obj,"PAGENAVIYN") === "Y" ? iEnd : arrList.length) );
				
				NoDisArea.style.height	=	(obj.offsetHeight - 20) + "px";
				NoDisArea.style.display	=	(data.records === 0 ? "block" : "none");
				if (arrList.length !== 0){
					for (var i=0,j=ULCnt; i<j; i+=1){
						fixArea.childNodes[i].style.display		=	"block";
						nfixArea.childNodes[i].style.display	=	"block";
					};
				}
				
				var iFixCnt	=	obj.getAttribute("FIXCNT");
				var arrId	=	obj.getAttribute("HEADID").toString().split(",");
				
				//console.log("DATA RENDERING...............");
				
				//---------------------------------------------------------
				//	ULCnt = arrList 인 경우 setdata
				//	ULCnt > arrList 인 경우 나머지 ULCnt 는 제거한다.
				//	ULCnt < arrList 인 경우 나머지 ULCnt 를 생성한다.
				//---------------------------------------------------------
				if (ULCnt === arrList.length){
					for (var i=0,j=arrList.length; i<j; i+=10){
						(function(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt){ 
							setTimeout( function(){ 
								if (i+0 < j) Grid.setdata( id, fixArea.childNodes[i+0], nfixArea.childNodes[i+0], arrList, arrId, i+0, iFirst+i+0, iFixCnt); 
								if (i+1 < j) Grid.setdata( id, fixArea.childNodes[i+1], nfixArea.childNodes[i+1], arrList, arrId, i+1, iFirst+i+1, iFixCnt); 
								if (i+2 < j) Grid.setdata( id, fixArea.childNodes[i+2], nfixArea.childNodes[i+2], arrList, arrId, i+2, iFirst+i+2, iFixCnt); 
								if (i+3 < j) Grid.setdata( id, fixArea.childNodes[i+3], nfixArea.childNodes[i+3], arrList, arrId, i+3, iFirst+i+3, iFixCnt); 
								if (i+4 < j) Grid.setdata( id, fixArea.childNodes[i+4], nfixArea.childNodes[i+4], arrList, arrId, i+4, iFirst+i+4, iFixCnt); 
								if (i+5 < j) Grid.setdata( id, fixArea.childNodes[i+5], nfixArea.childNodes[i+5], arrList, arrId, i+5, iFirst+i+5, iFixCnt); 
								if (i+6 < j) Grid.setdata( id, fixArea.childNodes[i+6], nfixArea.childNodes[i+6], arrList, arrId, i+6, iFirst+i+6, iFixCnt); 
								if (i+7 < j) Grid.setdata( id, fixArea.childNodes[i+7], nfixArea.childNodes[i+7], arrList, arrId, i+7, iFirst+i+7, iFixCnt); 
								if (i+8 < j) Grid.setdata( id, fixArea.childNodes[i+8], nfixArea.childNodes[i+8], arrList, arrId, i+8, iFirst+i+8, iFixCnt); 
								if (i+9 < j) Grid.setdata( id, fixArea.childNodes[i+9], nfixArea.childNodes[i+9], arrList, arrId, i+9, iFirst+i+9, iFixCnt); 
							}, 0); 
						}(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt));				
					}
				
				} else if (ULCnt > arrList.length){
					for (var i=0,j=arrList.length; i<j; i+=10){
						(function(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt){ 
							setTimeout( function(){ 
								if (i+0 < j) Grid.setdata( id, fixArea.childNodes[i+0], nfixArea.childNodes[i+0], arrList, arrId, i+0, iFirst+i+0, iFixCnt); 	
								if (i+1 < j) Grid.setdata( id, fixArea.childNodes[i+1], nfixArea.childNodes[i+1], arrList, arrId, i+1, iFirst+i+1, iFixCnt); 
								if (i+2 < j) Grid.setdata( id, fixArea.childNodes[i+2], nfixArea.childNodes[i+2], arrList, arrId, i+2, iFirst+i+2, iFixCnt); 
								if (i+3 < j) Grid.setdata( id, fixArea.childNodes[i+3], nfixArea.childNodes[i+3], arrList, arrId, i+3, iFirst+i+3, iFixCnt); 
								if (i+4 < j) Grid.setdata( id, fixArea.childNodes[i+4], nfixArea.childNodes[i+4], arrList, arrId, i+4, iFirst+i+4, iFixCnt); 
								if (i+5 < j) Grid.setdata( id, fixArea.childNodes[i+5], nfixArea.childNodes[i+5], arrList, arrId, i+5, iFirst+i+5, iFixCnt); 
								if (i+6 < j) Grid.setdata( id, fixArea.childNodes[i+6], nfixArea.childNodes[i+6], arrList, arrId, i+6, iFirst+i+6, iFixCnt); 
								if (i+7 < j) Grid.setdata( id, fixArea.childNodes[i+7], nfixArea.childNodes[i+7], arrList, arrId, i+7, iFirst+i+7, iFixCnt); 
								if (i+8 < j) Grid.setdata( id, fixArea.childNodes[i+8], nfixArea.childNodes[i+8], arrList, arrId, i+8, iFirst+i+8, iFixCnt); 
								if (i+9 < j) Grid.setdata( id, fixArea.childNodes[i+9], nfixArea.childNodes[i+9], arrList, arrId, i+9, iFirst+i+9, iFixCnt); 
							}, 0); 
						}(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt));				
					}
					
					for (var i=ULCnt-1,j=(arrList.length-1); i>j; i-=1){
						if (i===0){
							Grid.setnulldata( fixArea.childNodes[i], nfixArea.childNodes[i], arrList, arrId, i, iFirst+i, iFixCnt);
							
						} else {
							fixArea.childNodes[i].parentNode.removeChild(fixArea.childNodes[i]);
							nfixArea.childNodes[i].parentNode.removeChild(nfixArea.childNodes[i]);
						}
					}
					
				} else {
					
					for (var i=0,j=ULCnt; i<j; i+=1){
						(function(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt){ 
							setTimeout( function(){ 
								Grid.setdata( id, fixArea.childNodes[i], nfixArea.childNodes[i], arrList, arrId, i, iFirst+i, iFixCnt);
							}, 0); 
						}(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt));				
					}

					for (var i=0,j=ULCnt.length; i<j; i+=10){
						(function(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt){ 
							setTimeout( function(){ 
								if (i+0 < j) Grid.setdata( id, fixArea.childNodes[i+0], nfixArea.childNodes[i+0], arrList, arrId, i+0, iFirst+i+0, iFixCnt); 
								if (i+1 < j) Grid.setdata( id, fixArea.childNodes[i+1], nfixArea.childNodes[i+1], arrList, arrId, i+1, iFirst+i+1, iFixCnt); 
								if (i+2 < j) Grid.setdata( id, fixArea.childNodes[i+2], nfixArea.childNodes[i+2], arrList, arrId, i+2, iFirst+i+2, iFixCnt); 
								if (i+3 < j) Grid.setdata( id, fixArea.childNodes[i+3], nfixArea.childNodes[i+3], arrList, arrId, i+3, iFirst+i+3, iFixCnt); 
								if (i+4 < j) Grid.setdata( id, fixArea.childNodes[i+4], nfixArea.childNodes[i+4], arrList, arrId, i+4, iFirst+i+4, iFixCnt); 
								if (i+5 < j) Grid.setdata( id, fixArea.childNodes[i+5], nfixArea.childNodes[i+5], arrList, arrId, i+5, iFirst+i+5, iFixCnt); 
								if (i+6 < j) Grid.setdata( id, fixArea.childNodes[i+6], nfixArea.childNodes[i+6], arrList, arrId, i+6, iFirst+i+6, iFixCnt); 
								if (i+7 < j) Grid.setdata( id, fixArea.childNodes[i+7], nfixArea.childNodes[i+7], arrList, arrId, i+7, iFirst+i+7, iFixCnt); 
								if (i+8 < j) Grid.setdata( id, fixArea.childNodes[i+8], nfixArea.childNodes[i+8], arrList, arrId, i+8, iFirst+i+8, iFixCnt); 
								if (i+9 < j) Grid.setdata( id, fixArea.childNodes[i+9], nfixArea.childNodes[i+9], arrList, arrId, i+9, iFirst+i+9, iFixCnt); 
							}, 0); 
						}(id,fixArea,i,j,nfixArea,arrList,arrId,iFirst,iFixCnt));				
					}
					
					var cloneFixUL	=	fixArea.childNodes[0].cloneNode(true);
					var cloneNFixUL	=	nfixArea.childNodes[0].cloneNode(true);
					cloneFixUL.className	=	"dataframeout";
					cloneNFixUL.className	=	"dataframeout";
					
					for (var i=ULCnt,j=arrList.length; i<j; i+=1){
						Grid.setdata( id, cloneFixUL, cloneNFixUL, arrList, arrId, i, iFirst+i, iFixCnt);
						fixArea.appendChild(cloneFixUL.cloneNode(true));	
						nfixArea.appendChild(cloneNFixUL.cloneNode(true));	
						
					}
				}
				
				//---------------------------------------------------------
				//	GRID page 관련 세팅
				//---------------------------------------------------------
				$U.set(obj,	"PAGETOTAL",	data.pagetotal);
				$U.set(obj,	"TOTAL",		data.total);
				
				//---------------------------------------------------------
				//	information 처리
				//---------------------------------------------------------
				var divPage	=	obj.childNodes[2];
				var arrDD	=	$T("dfn",divPage.childNodes[0]);
				arrDD[0].innerHTML	=	"Total <a>" 	+ 	$U.tocurrency(($U.isNull(data.total) ? 0 : data.total)) + "</a>&nbsp;";
				arrDD[1].innerHTML	=	"Current <a>"	+	(iFirst+1) + "</a>&nbsp;";
				if (this.timerecordchk){
					arrDD[2].innerHTML	=	"Elapsed <a>"	+	((new Date().getTime() - this.starttime)/1000) + "</a>&nbsp;s" ;
					this.timerecordchk	=	false;
				}
				
				divPage.childNodes[0].style.display	=	(!$U.isNullOrEmpty($U.get(obj,"footer"))) ? "none" : ""; 
				
				//---------------------------------------------------------
				//	page 처리
				//---------------------------------------------------------
				if ($U.get(obj,"PAGENAVIYN")	===	"Y"){
					//---------------------------------------------------------
					//	pagenavi page 처리
					//---------------------------------------------------------
					data.records	=	Number(data.records);
					data.page		=	Number(data.page);
					data.pagetotal	=	Number(data.pagetotal);
					
					var pageSpan 	=	$T("span",divPage.childNodes[2])[1];
					var strPageNum	=	"";
					
					var iStart		=	data.page - 5 < 1 ? 1 :  data.page - 5;
					var iEnd		=	data.page + 5 > data.pagetotal ? data.pagetotal : data.page + 5;
					
					for (var q=iStart,w=iEnd+1; q<w; q+=1){
						strPageNum	+=	$U.format("<a class=\"{2}\" onclick=\"javascript:Grid.move('{0}','{1}')\">{1}</a>",id,q,(q===data.page?"pageMoveCurr":"pageMove"));
					}
					pageSpan.innerHTML	=	strPageNum;
					
					$T("input",divPage.childNodes[1])[0].value	=	data.page;
					$T_each(["option",divPage.childNodes[1]],function(oObj){
						if (Number(oObj.value) === Number(data.limit)){
							oObj.selected	=	true;
							return ["break"];
						}
					});
					
				} 

				//---------------------------------------------------------
				//	footer 처리  
				//---------------------------------------------------------
				if (!$U.isNullOrEmpty($U.get(obj,"footer"))){
					var fd 	=	divPage.childNodes[3];
					var lw	=	(divPage.childNodes[0].offsetWidth + 2);
					var rw	=	$U.get(obj,"PAGENAVIYN")	===	"Y" ? ((divPage.childNodes[1].offsetWidth + divPage.childNodes[2].offsetWidth) + 30) : 0;
					var ow	=	obj.parentElement.offsetWidth;	//	(lw+rw+fd.offsetWidth-10)
					fd.style.cssText	=	"display:block;top:2px;bottom:3px;left:" + lw + "px;right:"+ rw + "px;";
					$hA("div",fd)[0].style.cssText	=	"position:relative;top:5px;left:-" + (lw+35) + "px;width:"+ ow +"px";
					$U.set($hA("div",fd)[0],"_ORGINLEFT",lw+35);
					setTimeout(function(){
						Grid.footerdetail(id);
					},1000);
				} 
				
				return true;
				
			}
	
	//-------------------------------------------------------
	//	footer 계산 및 처리
	//-------------------------------------------------------
	,	footerdetail	:
			function(id){
				if ($U.isNullOrEmpty($D(id).getAttribute("footer"))) return;
		
				var h,f,ddo,d,title,titlecol,align,colname,cdrow,data,cobj,baserow,cpos,bpos;
				try{
					
					f	=	$D(id).getAttribute("footer").toString().split(",");
					for (var i=0,o; o=f[i]; i+=1){
						if (o.indexOf("title=")>-1){ title=o.replace(/title=/,"") };
						if (o.indexOf("titlecol=")>-1){ titlecol=o.replace(/titlecol=/,"") };
						if (o.indexOf("colname=")>-1){ colname=o.replace(/colname=/,"").toString().split("||"); };
					}
					
					ddo 	= 	$D(id).childNodes[2].childNodes[3].childNodes[0];
					h		=	$D(id).getAttribute("HEADID").toString().split(",");
					
					//	계산
					cdrow	=	{val:{}};
					
					if ($U.isNullOrEmpty(Grid.footer.get(id))){
						for (var i=0,o;o=h[i];i+=1){
							cdrow.val[o]	=	"";
						}
						data	=	Griddata.dataset.get(id);
						if (!$U.isNull(data) && !$U.isNull(data.rows)){
							for (var i=0,o;o=data.rows[i]; i+=1){
								for (var x=0,co;co=colname[x];x+=1){
									if ($U.isNull(co)) break;
									co	=	$U.trim(co);
									if (o[co].toString().indexOf("groupcss") > -1) continue;
									cdrow.val[co]	=	$U.plus(cdrow.val[co],o[co]);
								}
							}
						}
						Grid.footer.set(id,cdrow)
					} else {
						cdrow	=	Grid.footer.get(id);
					}
					bpos	=	$U.getposition($D(id));
					baserow	=	Number($T("a",$T("dfn",$D(id).childNodes[2].childNodes[0])[1])[0].innerHTML);
					cobj 	= 	Grid.getcell(id,baserow, $U.isNullOrEmpty(titlecol) ? Gridext.getcolindex(id,co) : Gridext.getcolindex(id,titlecol));
					cpos	=	$U.getposition(cobj);
					d		=	$U.format("<span style='font-weight:bolder;display:inline-block;text-align:right;position:absolute;left:{1}px;width:{2}px'><a>{0}</a>&nbsp;|</span>",title,cpos.x - bpos.x + 35,cpos.w);
					for (var x=0,co;co=colname[x];x+=1){
						if ($U.isNull(co)) break;
						co		=	$U.trim(co);
						cobj 	= 	Grid.getcell(id,baserow,Gridext.getcolindex(id,co));
						cpos	=	$U.getposition(cobj);
						d		+=	$U.format("<span class='footervalue' style='position:absolute;width:{1}px;left:{2}px'><a>{0}</a>&nbsp;|</span>",Gridformatter.tonumeric(cdrow.val[co]),cpos.w,cpos.x - bpos.x + 35); 
					}	
					
					ddo.innerHTML	=	d;
					
					
				} catch(e){
					alert("[footerdetail] " + e);
				} finally{
					h	=	null;
					f	=	null;
					ddo	=	null;
					d	=	null;
					title	=	null;
					titlecol=	null;
					align	=	null;
					colname	=	null;
					cdrow	=	null;
					data	=	null;
					cobj	=	null;
					baserow	=	null;
					cpos	=	null;
				}
			}
	//-------------------------------------------------------
	//	scrollbynonepure : 스크롤 이벤트시..
	//-------------------------------------------------------
	,	scrollbynonepure	:
			function(id,iPos){
				clearTimeout(this.oScrollHTimeout);
				this.oScrollHTimeout	=	setTimeout(function(){
					//console.log("POS="+ (iPos / Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value) + "=" + Math.floor(iPos / Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value));
					Grid.scrollbynone(id, Math.floor(iPos / Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value));
				},(this.vscrollstopaction.get(id) === "on" ? 100 : 1));
			}
	
	//-------------------------------------------------------
	//	scrollbynone : 페이지 네비 없을시
	//-------------------------------------------------------
	,	scrollbynone	:	
			function(id,iPos){
				//console.log("SCROLLBYNONE......");
				clearTimeout(this.oScrollHTimeout);
				this.oScrollHTimeout	=	setTimeout(function(){
					Grid.select(id,2);
					$D(id+"_FIXED_DIV").style.top	=	($D(id+"_NFIXED_DIV").scrollTop * (-1)) + "px";	
					Grid.setdataforall(id,Griddata.dataset.get(id),iPos);;
					Grid.cellheightsync(id);
					setTimeout(function(){
						GridRowSpan.remake(id);
					},100)
					Grid.select(id,1);
					Grid.raiseevent(id, "onscroll", null);
				},(this.vscrollstopaction.get(id) === "on" ? 100 : 1));
			}
	
	//-------------------------------------------------------
	//	cell click 시
	//		pid		:	parent id
	//		id		:	id
	//		obj		:	event object
	//		vrowidx	:	row index	-> 사용안함
	//-------------------------------------------------------
	,	cellclick	:	
			function(pid,id,obj,vrowidx){
				setTimeout(function(){
					if (this.dblclickchk) return;
					var vclick		=	obj.getAttribute("CLICKFUNC");
					if ($U.isNull(vclick)) return;
					var irowidx		=	$U.isNull(obj.parentElement) ? vrowidx : Number($U.get(obj.parentElement,"ROWINDEX"));
					var icellidx	=	$U.isNull(obj.parentElement) ? -1 : Number($U.get(obj.parentElement,"CELLINDEX"));
					var data		=	Griddata.dataset.get(pid);
					setTimeout(function(){
						window[vclick](pid,data.rows[irowidx-1],irowidx,icellidx,obj);
						setTimeout(function(){
							obj.focus();
						},100);
					},100);
				},500);
			}
	
	//-------------------------------------------------------
	//	cell dblclick 시
	//		pid		:	parent id
	//		id		:	id
	//		obj		:	event object
	//		vrowidx	:	row index	-> 사용안함
	//-------------------------------------------------------
	,	celldblclick	:	
			function(pid,id,obj,vrowidx){
				setTimeout(function(){
					var vdblclick	=	obj.getAttribute("DBLCLICKFUNC");
					if ($U.isNull(vdblclick)) return;
					this.dblclickchk	=	true;
					var irowidx		=	$U.isNull(obj.parentElement) ? vrowidx : Number($U.get(obj.parentElement,"ROWINDEX"));
					var icellidx	=	$U.isNull(obj.parentElement) ? -1 : Number($U.get(obj.parentElement,"CELLINDEX"));
					var data		=	Griddata.dataset.get(pid);
					setTimeout(function(){
						window[vdblclick](pid,data.rows[irowidx-1],irowidx,icellidx,obj);
					},100);
					setTimeout(function(){
						this.dblclickchk	=	false;
					},3000);
				},1);
			}
	
	//-------------------------------------------------------
	//	c,cr,r,rrr cell click 시
	//		type	:	C -> c,cr, R -> r,rr
	//		pid	:	parent id
	//		id		:	id
	//		obj	:	event object
	//		vrowidx	:	row index	-> 사용안함
	//-------------------------------------------------------
	,	crcellclick	:	
			function(type,pid,id,obj,vrowidx){
				vrowidx	=	Number($U.get(obj.parentElement,"ROWINDEX"));
				if (type === "C"){
					Griddata.checkupdate(obj);
				} else {
					Griddata.radioupdate(obj);
				}
				this.cellclick(pid, id, obj, vrowidx);
			}
	
	//-------------------------------------------------------
	//	cell click ex 스팬 에리어에서 클릭시
	//		id			:	id
	//		irowidx		:	rowindex
	//		vclick		:	click func
	//-------------------------------------------------------
	,	cellclickex	:	
			function(id,irowidx,vclick){
				setTimeout(function(){
					if (vclick === "") return; 
					var data	=	Griddata.dataset.get(id);
					setTimeout(function(){
						window[vclick](id,irowidx,data.rows[irowidx]);
					},100);
				},500);
			}
	
	//-------------------------------------------------------
	//	cell dbl click ex 스팬 에리어에서 클릭시
	//		id			:	id
	//		irowidx		:	rowindex
	//		vclick		:	click func
	//-------------------------------------------------------
	,	celldblclickex	:	
			function(id,irowidx,vdblclick){
				setTimeout(function(){
					if (vdblclick === "") return; 
					this.dblclickchk	=	true;
					var data	=	Griddata.dataset.get(id);
					setTimeout(function(){
						window[vdblclick](id,irowidx,data.rows[irowidx]);
					},100);
					setTimeout(function(){
						this.dblclickchk	=	false;
					},3000);
				},1);
			}
	
	//-------------------------------------------------------
	//	rowmove		:	주어진 rowidx 로 스크롤 이동
	//-------------------------------------------------------
	,	rowmove	:	
			function(id,irowidx){
				Grid.selectrow.set(id, irowidx);
				$D(id+"_NONESCROLL").scrollTop	=	(irowidx - 1)	*	Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value;
				Grid.scrollbynone(id, Math.ceil($D(id+"_NONESCROLL").scrollTop / Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value));
			}
	//-------------------------------------------------------
	//	mousewheel : 페이지 네비 없을시
	//-------------------------------------------------------
	,	mousewheel	:	
			function(e){
				var obj	=	e.srcElement||e.target;
				var pid	=	$U.get(obj.parentElement,"pid") || $U.get(obj.parentElement.parentElement,"pid");
				if ($U.isNull(Griddata.dataset.get(pid))) return;
	    		var totalCnt	=	Griddata.dataset.get(pid).rows.length;
    			if ((e.wheelDelta || -40 * e.detail) >=120 ){	//	wheel 올림
	    			$D(pid+"_NONESCROLL").scrollTop	-= 10 * 5;//Math.ceil($D(pid+"_NONESCROLL").offsetHeight / totalCnt) * 20;		
	    		} else if ((e.wheelDelta || -40 * e.detail) <=- 120) {	//	wheel 내림
	    			$D(pid+"_NONESCROLL").scrollTop	+= 10 * 5;//Math.ceil($D(pid+"_NONESCROLL").offsetHeight / totalCnt) * 20;		
	    		}
    			clearTimeout(Grid.oScrollHTimeout);
	    		Grid.oScrollHTimeout	=	setTimeout(function(){
					Grid.scrollbynone(pid,Math.ceil($D(pid+"_NONESCROLL").scrollTop / Grid.gridscrollvalue[Grid.gridscrollvalue.match(pid)].value ));
					Grid.select(pid,1);
				},(Grid.vscrollstopaction.get(pid) === "on" ? 100 : 1));
			
			}
	//-------------------------------------------------------
	//	directionkeychk : 방향키, 페이지 키 check
	//-------------------------------------------------------
	,	directionkeychk	:
			function(e){
				
				//---*	grid 와 마우스를 확인...
				var id	=	null;
				for (var i=0,oid; oid=Grid.allgrid[i]; i+=1){
					if ($U.rectinchk($D(oid),_MOUSE_POSITION)){
						id	=	oid;
						break;
					}				
				}
				if ($U.isNull(id)) return;
				
				var ev 	=	(window.event || e);
				var to	=	(ev.target||ev.srcElement);
				if ($U.get(to, "contenteditable") === "true"){
					Grid.cellheightsync($U.get(to.parentElement.parentElement,"pid"),to);
					return true;
				}
				
				switch((ev.which||ev.keyCode)){
				case 33 :	//	pgup
					Grid.directionkeymove(e,4,id);
					break;
				case 34 :	//	pgdn
					Grid.directionkeymove(e,3,id);
					break;
				case 38 :	//	up
					Grid.directionkeymove(e,2,id);
					break;
				case 37 :	//	left
					break;
				case 39 :	//	right
					break;
				case 40 :	//	down
					Grid.directionkeymove(e,1,id);
					break;
				}
			} 
	//-------------------------------------------------------
	//	cellheightsync : 멀티텍스트 사용시 row height 저리 필요
	//-------------------------------------------------------
	,	cellheightsync	:	
			function(id,o){
				setTimeout(function(){
					var lo,ridx,so,mx,ful,nful,uo,bchk,hh;
					try{
						
						hh	=	$U.get($hD("#"+id),"CELLHEIGHT");
						
						//---* o 가 널인경우 전체 UL 에 대해 처리한다
						if ($U.isNull(o)){
							
							ful		=	$hA("UL[name=FIXED_UL]",$hD("#" + id+"_FIXED_DIV"));
							nful	=	$hA("UL[name=NFIXED_UL]",$hD("#" + id+"_NFIXED_DIV"));
							
							for (var n=0,mmo;mmo=nful[n];n+=1){
								ridx	=	$U.get(mmo,"ROWINDEX");
								ridx	=	Grid.getscreenrowindex(id,mmo,ridx)-1;
								mx		=	0;
								//---* 전체 span 중에서 scrollheight 가 가장 큰것을 선택
								for (var q=0,w=2; q<w; q+=1){
									uo	=	(q===0? ful[ridx] : nful[ridx]);	
									if ($U.isNull(uo)) continue;
									so	=	$hA("span",uo);
									for (var i=0,oo;oo=so[i];i+=1){
										bchk = oo.innerHTML.split("<div>").length;
										if (bchk === 1){
											bchk = oo.innerHTML.split("<br>").length;
										}
										if (bchk === 1){
											bchk = oo.innerHTML.replace(/\r|\n/g,"$13$").split("$13$").length;
										}
										//	console.log("BCHK="+bchk + "=" + oo.innerHTML);
										mx	=	mx	< bchk * hh ? (bchk * hh) : mx;	
									}
								}
								
								//---* ul,li height 조정
								for (var q=0,w=2; q<w; q+=1){
									uo	=	(q===0? ful[ridx] : nful[ridx]);	
									if ($U.isNull(uo)) continue;
									lo	=	$hA("li",uo);
									uo.style.height	=	Number(mx) + GridRowSpan.rowspanCorrectValue + "px";
									for (var i=0,oo;oo=lo[i];i+=1){
										oo.style.height	= mx + "px";
									}
								}
							}
							
						} else {
							ridx	=	$U.get(o.parentElement.parentElement,"ROWINDEX");
							ridx	=	Grid.getscreenrowindex(id,o.parentElement.parentElement,ridx)-1;
							ful		=	$hA("UL[name=FIXED_UL]",$hD("#" + id+"_FIXED_DIV")) ;
							nful	=	$hA("UL[name=NFIXED_UL]",$hD("#" + id+"_NFIXED_DIV"));
							mx		=	0;
							
							//---* 전체 span 중에서 scrollheight 가 가장 큰것을 선택
							for (var q=0,w=2; q<w; q+=1){
								uo	=	(q===0? ful[ridx] : nful[ridx]);	
								
								if ($U.isNull(uo)) continue;
								so	=	$hA("span",uo);
								for (var i=0,oo;oo=so[i];i+=1){
									bchk = oo.innerHTML.split("<div>").length;
									if (bchk === 1){
										bchk = oo.innerHTML.split("<br>").length;
									}
									if (bchk === 1){
										bchk = oo.innerHTML.replace(/\r|\n/g,"$13$").split("$13$").length;
									}
									//console.log("BCHK="+bchk + "=" + oo.innerHTML);
									mx	=	mx	< bchk * hh ? (bchk * hh) : mx;	
								}
							}
							
							//---* ul,li height 조정
							for (var q=0,w=2; q<w; q+=1){
								uo	=	(q===0? ful[ridx] : nful[ridx]);	
								if ($U.isNull(uo)) continue;
								lo	=	$hA("li",uo);
								uo.style.height	=	Number(mx) + GridRowSpan.rowspanCorrectValue + "px";
								for (var i=0,oo;oo=lo[i];i+=1){
									oo.style.height	= mx + "px";
								}
							}
						}
						
					} catch(e){
						alert("[IMSGRID cellheightsync] "+e);
					} finally{
						lo	=	null;
						ridx	=	null;
						so	=	null;
						mx	=	null;
						ful	=	null;
						nful	=	null;
						uo	=	null;
						bchk	=	null;
						hh	=	null;
					}
				},1);
			}
	
	//-------------------------------------------------------
	//	directionkeymove : 페이지 네비 없을시
	//-------------------------------------------------------
	,	directionkeymove	:	
			function(e,mu,id){
				if ($U.isNull(Griddata.dataset.get(id))) return;
	    		var totalCnt	=	Griddata.dataset.get(id).rows.length;
	    		var a = 0;
	    		var b = 0;
	    		if (mu === 1) { a = 20; b = 2; }; 
	    		if (mu === 2) { a = -20; b = 0; }; 
	    		if (mu === 3) { a = 100; b = 6; }; 
	    		if (mu === 4) { a = -100; b = -4; }; 
    			$D(id+"_NONESCROLL").scrollTop	+= a ;		
	    		if (Number(Griddata.getselectedrowidx(id)) + b < 1) return;
	    		if (Number(Griddata.getselectedrowidx(id)) + b > totalCnt) return;
    			Grid.select(id,2);
				Grid.selectrow.set(id, Griddata.getselectedrowidx(id) + b );
				Grid.scrollbynone(id,Math.ceil($D(id+"_NONESCROLL").scrollTop / Grid.gridscrollvalue[Grid.gridscrollvalue.match(id)].value ));
			}
	//-------------------------------------------------------
	//	scroll
	//-------------------------------------------------------
	,	scroll	:	
			function(obj){
				obj.parentElement.childNodes[1].style.top	=	(obj.scrollTop *(-1)) + "px";
				var objLeft	=	obj.parentElement.parentElement.childNodes[0];
				var vpid	=	$U.get(obj,"pid");
				objLeft.childNodes[1].style.left	= (objLeft.childNodes[0].offsetWidth - obj.scrollLeft ) + "px";
				
				if (!$U.isNullOrEmpty($U.get($D(vpid),"footer"))){
					var ddo = $D(vpid).childNodes[2].childNodes[3].childNodes[0];
					ddo.style.left	=	((-1 * Number($U.get(ddo, "_ORGINLEFT"))) + parseInt(objLeft.childNodes[1].style.left)) + "px";	
				}
				
				var arrHeaderLI	=	$T("li", objLeft.childNodes[1]);
				if (arrHeaderLI.length > 50){
					var iLeft,iRight = 0;
					clearTimeout(this.oScrollWTimeout);
					this.oScrollWTimeout	=	setTimeout(function(){
						iLeft	=	0;
						iRight	=	arrHeaderLI.length -1;
						for (var n=0, m=arrHeaderLI.length-1; n<m; n+=1){
							if (arrHeaderLI[n].offsetLeft > obj.scrollLeft){
								iLeft	=	Number($U.get(arrHeaderLI[n],"CELLINDEX"));
								iLeft	=	(iLeft	- 3 < 0 ? 0 : iLeft -3 );
								break;
							}
						}
						for (var n=iLeft+1, m=arrHeaderLI.length-1; n<m; n+=1){
							if (arrHeaderLI[n].offsetLeft > obj.scrollLeft+obj.offsetWidth){
								iRight	=	Number($U.get(arrHeaderLI[n],"CELLINDEX"));
								iRight	=	(iRight + 3 > arrHeaderLI.length-1 ? arrHeaderLI.length -1 : iRight + 3);
								break;
							}
						}
						if (Grid.leftcolindex.match(vpid) === -1){
							Grid.leftcolindex.push({id:vpid,value:iLeft});
							Grid.rightcolindex.push({id:vpid,value:iRight});
						} else {
							Grid.leftcolindex[Grid.leftcolindex.match(vpid)].value		=	iLeft;
							Grid.rightcolindex[Grid.rightcolindex.match(vpid)].value	=	iRight;
						}
						Grid.scrollbynone(vpid,Math.ceil($D(vpid+"_NONESCROLL").scrollTop / ( Grid.gridscrollvalue.match(vpid) === -1 ? 20 : Grid.gridscrollvalue[Grid.gridscrollvalue.match(vpid)].value )));
						
					},(this.vscrollstopaction.get(vpid) === "on" ? 100 : 1));
				}
			}

	//-------------------------------------------------------
	//	mouse over , out 처리
	//-------------------------------------------------------
	,	over	:	
			function(obj,opt){
				var vpid		=	$U.get(obj,"pid");	 
				var vROWIDX		=	this.getscreenrowindex(vpid,obj);
				if ($U.isNull(vROWIDX)) return;
				var dObj		=	($U.get(obj,"name") === "FIXED_UL") ? $D(vpid+"_NFIXED_DIV").childNodes[0] : $D(vpid+"_FIXED_DIV");
				var dObj2		=	($U.get(obj,"name") === "FIXED_UL") ? $D(vpid+"_FIXED_DIV") : $D(vpid+"_NFIXED_DIV").childNodes[0] ;
				var dUL			=	$T("ul",dObj)[vROWIDX-1];
				var dULArr01	=	$T("ul",dObj);
				var dULArr02	=	$T("ul",dObj2);
				//	over clear
				for (var i=0,j=dULArr01.length; i<j; i+=1){
					if (Number(this.selectrow.get(vpid)) !== Number($U.get(dULArr02[i], "ROWINDEX"))){
					  dULArr01[i].className	=	"dataframeout";
					  dULArr02[i].className	=	"dataframeout";
					}
				}
				
				if (!$U.isNull(dUL)){
					if (	dUL.className	===	""	
						|| 	dUL.className	===	"dataframesel"	
						||	dUL.className	===	"dataframeover"
						||	dUL.className	===	"dataframeout"){
						if (Number(this.selectrow.get(vpid)) === Number($U.get(obj, "ROWINDEX"))){
							dUL.className		=	"dataframesel";
						} else {
							dUL.className		=	opt ===1 ? "dataframeover" : "dataframeout";
						}
						
					} else {
						if (Number(this.selectrow.get(vpid)) === Number($U.get(obj, "ROWINDEX"))){
							dUL.className		=	"dataframesel";
						}
					}
					$T("ul",dObj2)[vROWIDX-1].className	=	dUL.className;
				}
				
				GridRowSpan.UpdateRowSpanMouseManage(vpid,vROWIDX,opt);				
			}
	
	//-------------------------------------------------------
	//	click 선택된 셀을 표현
	//-------------------------------------------------------
	,	click	:	
			function(obj){
				
				var vid,dobj,dLI,vridx,ridx,vROWIDX,ospan,data;
				try{
					vid 	= 	$U.get(obj, "pid");
					vridx	=	Number($U.get(obj, "ROWINDEX"));
					ridx	=	this.getscreenrowindex(vid, null, vridx);	
					vROWIDX	=	this.getscreenrowindex(vid, null, Number(this.selectrow.get(vid)));
					data	=	Griddata.dataset.get(vid);

					//---*	Grip 가 edit 모드이고 row 의 cell 이 edit 인경우 실제 에디팅 가능하도록 변경
					//---*	data STATUS 가 'GROUP' 인경우 skip 
					if (!$U.isNull(data.rows[vridx-1]["STATUS"]) && data.rows[vridx-1]["STATUS"].indexOf("GROUP") > -1){
						//--**	skip
					} else {	
						if ($U.get($D(vid),"MODE") === "edit"){
							if (vROWIDX > 0){
								for (var a=0,s=2;a<s;a+=1){
									dObj	=	a===0 ? $D(vid+"_NFIXED_DIV").childNodes[0] : $D(vid+"_FIXED_DIV");
									dLI		=	$T("li",$T("ul",dObj)[vROWIDX-1]);
									if ($U.isNull(dLI)) break;
									for (var i=0,o;o=dLI[i];i+=1){
										if ($U.get(o,"EDIT") === "Y" || $U.get(o,"EDIT") === "y"){
											$T("span",o)[0].className	=	"edit";
											$U.set($T("span",o)[0], "contenteditable", false);
										} 
									}
								}	
							}
							for (var a=0,s=2;a<s;a+=1){
								dObj	=	a===0 ? $D(vid+"_NFIXED_DIV").childNodes[0] : $D(vid+"_FIXED_DIV");
								dLI		=	$T("li",$T("ul",dObj)[ridx-1]);
								for (var i=0,o;o=dLI[i];i+=1){
									if ($U.get(o,"EDIT") === "Y" || $U.get(o,"EDIT") === "y"){
										ospan	=	$T("span",o)[0];
										
										/*if ($U.get(o,"ROWINDEX") === "3" && $U.get(o,"CELLINDEX") === "10") 
											console.log( Grid.noeditcell.get(vid+"="+$U.get(o,"ROWINDEX")+"="+$U.get(o,"CELLINDEX")) );*/
										if (Grid.noeditcell.get(vid+"="+$U.get(o,"ROWINDEX")+"="+$U.get(o,"CELLINDEX")) === "view"){
											ospan.className	=	"";
											$U.set(ospan, "contenteditable", false);
										} else {
											ospan.className	=	"editon";
											$U.set(ospan, "contenteditable", true);
										}
									} 
								}
							}
							
							setTimeout(function(){
								if (!$U.isNull(Grid.focusincell)) Grid.focusincell.focus();							
							},100);
							
						}
					}
					
					if (this.select(vid,2)){
						this.selectrow.set(vid, vridx);
						this.over(obj, 1);
					}
					
					//---*	ROw click 이벤트 처리
					Grid.raiseevent(vid, "onrowclick", (Griddata.dataset.get(vid)).rows[vridx-1]);
					
				} catch(e){
					alert("[IMS_Grid click] " + e);
				} finally {
					vid	=	null;
					dobj =	null;
					dLI	=	null;
					vridx	=	null;
					ridx	=	null;
					vROWIDX	=	null;
					ospan	=	null;
				}
				
			}
	
	//-------------------------------------------------------
	//	select 선택된 셀을 표현 및 지우기
	//-------------------------------------------------------
	,	select	:	
			function(id, opt){
				if (!$U.isNull(this.selectrow.get(id))){
					var vROWIDX	=	this.getscreenrowindex(id, null, Number(this.selectrow.get(id)));
					var dObj	=	$D(id+"_NFIXED_DIV").childNodes[0];
					var dUL		=	$T("ul",dObj)[vROWIDX-1];
					if ($U.isNull(dUL)) return true;
					$T("ul",dObj)[vROWIDX-1].className	=	dUL.className	=	(opt ===1 ? "dataframesel" : "");	
					dObj		=	$D(id+"_FIXED_DIV");
					dUL			=	$T("ul",dObj)[vROWIDX-1];
					$T("ul",dObj)[vROWIDX-1].className	=	dUL.className	=	(opt ===1 ? "dataframesel" : "");	
				}
				return true;
			}
	
	//-------------------------------------------------------
	//	resize
	//-------------------------------------------------------
	,	resize	:	
			function(id,vWidth,vHeight,bReloadChk){
				
				//console.log("RESIZE="+Grid.reloadchk);
		
				if (bReloadChk && Grid.reloadchk){
					Grid.reloadchk	=	false;
					setTimeout(function(){
						Grid.reload(id);
						setTimeout(function(){
							Grid.reloadchk	=	true;
						},1000);
					},1000);
				
				} else {
					
					var obj	=	$D(id);
					try{
						if (!$U.isNull(obj)){
							obj.style.width	=	vWidth	+	"px";
							obj.childNodes[1].childNodes[2].style.width	=	(vWidth	-	obj.childNodes[1].childNodes[1].offsetWidth	) + "px";
							
							//--**	2017.08.05	페이지 네비게이션 동작시 limit 값에 따라 화면 높이 조정함
							if ($U.get(obj,"PAGENAVIYN")	===	"Y"){
								
								var lv	= 	obj.getAttribute("PAGEROWCNT");
								var ch 	= 	obj.getAttribute("cellheight");
								var hc 	= 	obj.getAttribute("headerrowcnt");
								var hh 	= 	obj.getAttribute("headerheight");
								var h  	= 	Number(lv) * (Number(ch) + 8) 			//--**	row height 
										+ 	Number(hc) * Number(hh) 				//--**	header height
										+  (Number(ch) + 8)							//--**	scroll 
										+	$hD(".pageNaviDiv",obj).offsetHeight;	//--**	page navigation height
								
								obj.style.height	=	h   +	"px";
								obj.childNodes[1].style.height	=	(Number(lv) * (Number(ch) + 8) + (Number(ch) + 8)) + "px";
							
							} else {
								obj.style.height	=	(vHeight	-	Number(IMS_config.resizeCorrectValue)) +	"px";
								obj.childNodes[1].style.height	=	(vHeight - Number(IMS_config.resizeCorrectValue) -	obj.childNodes[0].offsetHeight - obj.childNodes[2].offsetHeight ) + "px";
							} 
							
							var ido = $hA(".innerDiv",obj.childNodes[1]);
							ido[0].style.height = obj.childNodes[1].style.height;
							ido[1].style.height = obj.childNodes[1].style.height;
							
						}
					
					} catch(e){
					}
					
					try{
						$D(id+"_NFIXED_DIV").scrollLeft	=	0;
						this.scroll($D(id+"_NFIXED_DIV"));
					} catch(e){
					}
					try{
						GridRowSpan.remake(id);
					} catch(e){
					}
				}
			}
	
	//-------------------------------------------------------
	//	resize bind
	//-------------------------------------------------------
	,	resizebind	:
			function(id){
				Grid.raiseevent(id,"onloadcomplete",null);
				var obj = $D(id);
				if ($U.get(obj, "AUTORESIZE") === "Y"){
					Grid.resize($U.get(obj, "id"), obj.parentElement.offsetWidth, obj.parentElement.offsetHeight);
					$U.eventbind(window, "onresize", function(){
						Grid.resize($U.get(obj, "id"), obj.parentElement.offsetWidth, obj.parentElement.offsetHeight,true);
					});
				}
			}		
	
	//-------------------------------------------------------
	//	mouse over
	//-------------------------------------------------------
	,	mouseover	:	
			function(obj){
				GridDragObj.create(obj);
			}
	
	//-------------------------------------------------------
	//	drag start, over, end
	//-------------------------------------------------------
	,	dragover	:	
			function(obj,e){
				var ev = e || window.event;
				if ($U.isNull(GridDragObj.target)) return;
				if ((ev.pageX||ev.clientX) > GridDragObj.targetRect.right - 5 &&  (ev.pageX||ev.clientX) < GridDragObj.targetRect.right){
					GridDragObj.target.style.cursor	=	"col-resize";
					GridDragObj.start	=	true;
				} else {
					GridDragObj.target.style.cursor	=	"";
				}
			}
	
	,	dragstart	:	
			function(obj,e){
				var ev = e || window.event;
				if (GridDragObj.start){
					GridDragObj.start	=	false;
					var pid		=	GridDragObj.pid;
					var pobj	=	$D(pid);
					var dObj	=	$D(GridDragObj.pid + "_DRAGDROP");
					var iCIdx	=	$U.get(GridDragObj.target, "CELLINDEX");
					var iLeft	=	0;
					var arrLi	=	$T("LI",pobj.childNodes[0]);
					for (var z=0,x=arrLi.length; z<x; z+=1){
						if (!$U.isNull($U.get(arrLi[z],"ORGINWIDTH"))) continue;
						if (Number($U.get(arrLi[z],"CELLINDEX")) > iCIdx ) break;
						iLeft	+=	 arrLi[z].offsetWidth;
					}
					iLeft	-=	pobj.childNodes[1].childNodes[2].scrollLeft;
					dObj.style.top		=	((-1) * (pobj.offsetHeight + 10))	+	"px";
					dObj.style.left		=	(iLeft - 92) + "px";
					dObj.style.height	=	pobj.offsetHeight - 32 + "px";
					dObj.style.display	=	"block";
					GridDragObj.moveobjOrginLeft	=	ev.pageX||ev.clientX;
					GridDragObj.begin(ev.pageX||ev.clientX);
					$U.set(dObj,"draggable", true);
					try{ ev.target = dObj;} catch(e){ };
				}
			}
	
	,	dragend	:	
			function(obj,e){
				var pos = $U.getposition(obj);
				obj.style.display	=	"none";
				/*if (IDV_BROWSER.NAME === "safari"){
					GridDragObj.movex	=	(((e || window.event).pageX || (e || window.event).clientX) - GridDragObj.startX) - GridDragObj.startX;	
				} else {
					GridDragObj.movex	=	((e || window.event).pageX || (e || window.event).clientX) - GridDragObj.startX;	
				}*/
				GridDragObj.movex	=	(pos.x + pos.w /2 ) - GridDragObj.startX;	
				GridDragObj.destroy(); 
				$D(GridDragObj.pid+"_NFIXED_DIV").scrollLeft	=	$D(GridDragObj.pid+"_NFIXED_DIV").scrollLeft + 1;
				this.scroll($D(GridDragObj.pid+"_NFIXED_DIV"));
			}
	
	//-------------------------------------------------------
	//	sort
	//-------------------------------------------------------
	,	sort	:	
			function(obj){
				var pobj	=	obj.parentElement;
				var pid		=	$U.get(pobj,"pid");
				
				if ($U.isNull(Griddata.dataset.get(pid))) return;
				
				var icolidx	=	$U.get(pobj,"CELLINDEX");
				var colname	=	Gridext.getcolname(pid,icolidx);
				var sortdata	=	Griddata.sortdataset.get(pid);
				if (sortdata === null){
					Griddata.sortdataset.set(pid, "");
					sortdata	=	"";
				}
				
				switch ($U.text(obj)){
					case "↑"	:	
						sortdata	=	sortdata.replace("," + colname + " ASC",	"")
												.replace(colname + " ASC,",			"")
												.replace(colname + " ASC",			"")
												.replace(/,,/g,",");
						obj.innerHTML	=	"↓";	
						break;
					case "↓"	:	
						sortdata	=	sortdata.replace("," + colname + " DESC",	"")
												.replace(colname + " DESC,",		"")
												.replace(colname + " DESC",			"")
												.replace(/,,/g,",");
						obj.innerHTML	=	"O";	
						break;
					case "O"	:	
						obj.innerHTML	=	"↑";	
						break;
				}		
				
				switch ($U.text(obj)){
					case "↑"	:	
						sortdata	+=	(sortdata === "" ? "" : ",") + colname + " ASC";
						break;
					case "↓"	:	
						sortdata	+=	(sortdata === "" ? "" : ",") + colname + " DESC";
						break;
					case "O"	:	
						break;
				}	
				
				//	Filter data 존재여부 확인
				var filterdata	=	"";
				$N_each([pid + "_FILTER_SPAN"],function(fo){
					if (fo.style.color.toUpperCase() === "WHITE"){
						filterdata	=	"EXIST";
						return ["break"];
					}
				});
				
				//	Sort Click  처리
				Griddata.sortdataset.set(pid, sortdata);
				Grid.sortclick(pid, sortdata, filterdata);
				Grid.raiseevent(pid, "onsortclick", sortdata);
		
			}
	
	,	sortclick	:
			function(id,sortdata, filterdata){
				
				var data	= 	Griddata.dataset.get(id);
				
				if (sortdata === "" && filterdata === ""){
					Griddata.dataset.set(id,$U.clone(Griddata.origindataset.get(id)));
					data	= 	Griddata.dataset.get(id);
					
				} else {
					var sda	=	sortdata.toString().split(",");
					var kva	=	null;
					for (var i=sda.length-1,s; s=sda[i]; i-=1){
						kva = s.toString().split(" ");
						if (kva[1] === "ASC"){
							data.rows.sort(function(a,b){
								return a[kva[0]] < b[kva[0]] ? -1 :  (a[kva[0]] > b[kva[0]] ? 1 : 0 );
							});
							
						} else {
							data.rows.sort(function(a,b){
								return a[kva[0]] < b[kva[0]] ? 1 :  (a[kva[0]] > b[kva[0]] ? -1 : 0 );
							});
							
						}
					}
					
				}
				Grid.reload(id);
			}

	//-------------------------------------------------------
	//	filter
	//-------------------------------------------------------
	,	filter	:	
			function(obj){
		
				this.filterobj	=	obj;
				var pobj		=	obj.parentElement;
				var pid			=	$U.get(pobj,"pid");
				
				if ($U.isNull(Griddata.dataset.get(pid))) return;
				
				var icolidx		=	$U.get(pobj,"CELLINDEX");
				var colname		=	Gridext.getcolname(pid,icolidx);
				
				//---*	filter count chk 
				//---*	filter 가 1개라도 있을경우 data, filter 가 없는 경우 origin data 사용 
				//---*	filter 가 1개인데 그 필터와 클릭한 필터가 같은 경우 origin data
				var filtercnt	=	0;
				$N_each([pid + "_FILTER_SPAN"],function(ffo){
					if (ffo.style.color.toUpperCase() === "RED"){
						if (obj !== ffo) filtercnt++;
					}
				});
				
				var data	=	filtercnt > 0 ? Griddata.dataset.get(pid) : Griddata.origindataset.get(pid);	
				
				//	filter div 를 생성한다.
				var fo		=	$D("_IMSGRID_FILTER_DIV");
				var pos		=	$U.getposition(obj.parentElement);	
				if ($U.isNull(fo)){
					
					fo = document.createElement("div");
					fo.id	=	"_IMSGRID_FILTER_DIV";
					fo.style.cssText	=	$U.format( "font-size:12px; z-index:99999999; display:block; padding:5px; border:1px solid black; background-color: white; position:absolute;left:{0}px;top:{1}px;width:{2}px; min-width:140px; max-height:400px",
														pos.x,
														pos.y+(Number($U.get(pid,"HEADERHEIGHT")) * Number($U.get(pid,"HEADERROWCNT"))),
														pos.w);
					
					var fs = document.createElement("div");
					fs.style.cssText	=	"background-color: #fff; width:100%; height:25px; margin-bottom:2px; overflow:hidden;";
					fs.innerHTML		=	"<label style='float:left'>Key&nbsp;</label><input style='font-size:11px;padding:2px;margin-top:0;float:left;width:70%;border:1px solid #999' type='text' value='' id='_IMSGRID_FILTER_KEY'>";
					
					var dd = document.createElement("div");
					dd.style.cssText	=	"border:1px solid #cdcdcd; background-color: #efefef; width:100%; max-height:250px; margin-bottom:5px; overflow:auto;";
					
					var b = document.createElement("div");
					b.style.cssText	= "cursor:pointer;float:left;background:url("+IMS_config.path+"/WebIMS/images/confirm.jpg) no-repeat;width:26px;height:16px";
					b.id		=	"_IMSGRID_FILTER_BUTTON";
					b.title		=	"confirm!!";
					b.onclick	=	function(){ 
						Grid.filterclick(pid, fo);	//	filter Click  처리
					};
					
					var ba = document.createElement("div");
					ba.style.cssText	= "cursor:pointer;float:left;background:url("+IMS_config.path+"/WebIMS/images/return.jpg) no-repeat;width:26px;height:16px";
					ba.title	=	"restore!!";
					ba.onclick	=	function(){ 
						$T_each(["input",fo],function(io){
							io.checked	=	false;
						});
						Grid.filterclick(pid, fo, true);	//	filter cancel Click  처리
					};
					
					var bb = document.createElement("div");
					bb.style.cssText	= "cursor:pointer;float:right;background:url("+IMS_config.path+"/WebIMS/images/close.png) no-repeat;width:16px;height:16px";
					bb.title		=	"close!!";
					bb.onclick	=	function(){  fo.style.display	=	"none"; };
					
					fo.appendChild(fs);
					fo.appendChild(dd);
					fo.appendChild(b);
					fo.appendChild(ba);
					fo.appendChild(bb);
					document.body.appendChild(fo);
					
				} else {
					fo.style.cssText	=	$U.format( "font-size:12px; z-index:99999999; display:block; padding:5px; border:1px solid black; background-color: white; position:absolute;left:{0}px;top:{1}px;width:{2}px; min-width:140px; max-height:300px",
														pos.x,
														pos.y+(Number($U.get(pid,"HEADERHEIGHT")) * Number($U.get(pid,"HEADERROWCNT"))),
														pos.w);
					$D("_IMSGRID_FILTER_BUTTON").onclick	=	function(){ 
						//	filter Click  처리
						Grid.filterclick(pid, fo);
					};	
				}
				
				$T("input",fo)[0].value		=	"";
				$T("div",fo)[1].innerHTML	=	"";
				
				setTimeout(function(){
					//	data	리스트 처리..
					var fod		=	$T("div",fo)[1];
					var arrd	=	new Array();
					for (var i=0,ao;ao=data.rows[i];i+=1){
						if (!$U.isNull(ao[colname])  && arrd.match(ao[colname]) === -1){
							arrd.push(ao[colname]);
						}
					}
					
					//	filter 값은 obj의 attribute에 기록한다.
					$T("input",fo)[0].value	= $U.nvl($U.get(obj, "filterkey"),"");	
					var filterdata	=	$U.nvl($U.get(obj, "filter"),"NULL");
					var vstr		=	"";
					var filterarr	=	filterdata === "NUll" ? ["8fhudfgdft6d67ftdfdfff394u34"] : filterdata.toString().split(_GRID_CHECKDIVIDE);
					var ao		=	"";
					for (var i=0,j=arrd.length;i<j; i+=1){
						ao		=	arrd[i];
						vstr	+=	"<input type='checkbox' "+(  filterarr.match(ao.toString()) > -1 ? "checked" : "" )+" value=\""+ao+"\" style='margin-right:5px'>" + ao + "<br/>";
					}
					fod.innerHTML	=	vstr;
				},100);
		
			}
	
	,	filterclick	:
			function(id, fo, cchk){
				var o = this.filterobj;	
				var sFilterkey	=	"";
				if (cchk){
					o.removeAttribute("filterkey");
					o.removeAttribute("filter");
					o.style.color	=	"#ffff00";
				} else {
					//	span attribute에 선택값을 필터값으로 등록한다.
					var ioarr	=	new Array();
					$T_each(["input",fo],function(io){
						if (io.type === "text"){
							if (!$U.isNullOrEmpty(io.value)) sFilterkey = io.value;
						} else if (io.checked){
							ioarr.push(io.value);
						}
					});
					$U.set(o,"filterkey", sFilterkey);
					$U.set(o,"filter",ioarr.join(_GRID_CHECKDIVIDE));
					o.style.color	=	( ioarr.length > 0 || !$U.isNullOrEmpty(sFilterkey)) ? "red" : "#ffff00";
				}
				
				//	sort data 여부 확인
				var sortdata =	Griddata.sortdataset.get(id);
				if (sortdata === null){
					Griddata.sortdataset.set(id, "");
					sortdata	=	"";
				}

				//	filter data 여부 확인
				var filterdatachk	=	"";
				$N_each([id + "_FILTER_SPAN"],function(ffo){
					if (ffo.style.color.toUpperCase() === "RED"){
						filterdatachk	=	"EXIST";
						return ["break"];
					}
				});
				
				//	필터의 대상은 항상 origindata이다.
				//	그래서 data 처리시 항상 origindata 를 dataset에 복사후 필터를 수행한다.
				Griddata.dataset.set(id,$U.clone(Griddata.origindataset.get(id)));
				
				if (filterdatachk === "" && sortdata === ""){
				
				} else {
					
					var data	=	Griddata.dataset.get(id);	
					
					//	filter 값을 가진 col과 그 값을 구한다.
					var fvalarr	=	new Array();
					var fv		=	"";
					var fvkey	=	"";
					var icolidx	=	"";
					var colname	=	"";
					$N_each([id + "_FILTER_SPAN"],function(ffo){
						icolidx	=	$U.get(ffo.parentElement,"CELLINDEX");
						colname	=	Gridext.getcolname(id,icolidx);
						fv		=	$U.get(ffo,"filter");
						fvkey	=	$U.get(ffo,"filterkey");
						if (!$U.isNull(fv)){
							fvalarr.set(colname, [fv,fvkey]);
						}
					});
					
					var icnt 	=	-1;
					var frows 	= 	[];
					var vcval	=	"";
					var vckeyval	=	"";
					var addchk	=	false;
					var fvo		=	null;
					var dt		=	"";
					
					while (!$U.isNull(data.rows[++icnt])){
						
						addchk	=	true;
						for (var i=0,j=fvalarr.length; i<j; i+=1){
							fvo			=	fvalarr[i];
							vcval		=	fvo.value[0];
							vckeyval	=	fvo.value[1];
							
							if ($U.isNullOrEmpty(data.rows[icnt][fvo.id])){
								if (vcval === "" || vcval.search(_GRID_CHECKDIVIDE+_GRID_CHECKDIVIDE) > -1 || vcval.substring(0,1) === _GRID_CHECKDIVIDE){
								} else {
									addchk	=	false;
									break;
								}
								
							} else {
								dt	=	(data.rows[icnt][fvo.id]).toString();
								if ((vcval === ($U.nvl(dt,"§ㄴㅇㄴㅇㅇㄹㄹ88ㅇ로ㅓㅇ로얼나닝ㄹ인§")).replace(/\+/g,"")) || 
									((_GRID_CHECKDIVIDE + vcval + _GRID_CHECKDIVIDE).indexOf(
									 ($U.nvl(_GRID_CHECKDIVIDE + dt + _GRID_CHECKDIVIDE  ,"§ㄴㅇㄴㅇㅇㄹㄹ88ㅇ로ㅓㅇ로얼나닝ㄹ인§")).replace(/\+/g,"")) > -1) ||
									(!$U.isNullOrEmpty(vckeyval) && dt.indexOf(vckeyval) > -1)){	//---*	검색어 입력 추가
								} else {
									addchk	=	false;
									break;
								}
							}
						}
						if (addchk) frows.push(data.rows[icnt]);
					}
					
					data.rows		=	frows	;
					data.records	=	frows.length;
					Grid.raiseevent(id, "onfilterclick", null);
					
				}
				
				Grid.rowmove(id,0);
				Grid.reload(id);
				fo.style.display	=	"none";
				
				//---*	footer 가 있는 경우 계산
				if (!$U.isNullOrEmpty($U.get($hD("#"+id),"footer"))){
					setTimeout(function(){
						Grid.footer.set(id,null);
						Grid.footerdetail(id);
					},100);
				} 
				
			}

	//-------------------------------------------------------
	//	inner search data중에서 입력된 값을 가진 정보를 찾는다	 
	//-------------------------------------------------------
	,	innersearch	:
			function(id, colname, val){

				var data,icnt=-1,frows=[],vcval="";
				try{
					//---*	origindata 를 dataset에 복사후 innersearch를 수행한다.
					Griddata.dataset.set(id,$U.clone(Griddata.origindataset.get(id)));
					data	=	Griddata.dataset.get(id);	
					
					//---*	검색값이 없으면 모든값 조회
					if ($U.trim(val) === ""){
						frows	=	data.rows;
					} else {
						while (!$U.isNull(data.rows[++icnt])){
							vcval	=	data.rows[icnt][colname];
							if (vcval === ""){
							} else {
								if ((($U.nvl(vcval,"§ㄴㅇㄴㅇㅇㄹㄹ88ㅇ로ㅓㅇ로얼나닝ㄹ인§")).toString().replace(/\+/g,"")).indexOf(val) > -1 ){
									frows.push(data.rows[icnt])
								} 
							}
						}
					}
					
					data.rows		=	frows	;
					data.records	=	frows.length;
					Grid.rowmove(id,0);
					Grid.reload(id);
				
				} catch(e){
					alert("[IMSGRID innersearch] "+e);
				} finally{
					data	=	null;
					icnt	=	null;
					frows	=	null;
					vcval	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	Memory release
	//-------------------------------------------------------
	,	final	:
			function(){
				this.toprowindex		=	null;
				this.bottomrowindex		=	null;
				this.leftcolindex		=	null;
				this.rightcolindex		=	null;
				this.eventchk			=	null;
				this.oScrollHTimeout	=	null;
				this.oScrollWTimeout	=	null;
				this.vscrollstopaction	=	null;
				this.header				=	null;
				this.selectrow			=	null;
				this.reloadchk			=	null;
				this.dblclickchk		=	null;
				this.starttime			=	null;
				this.timerecordchk		=	null;
				this.gridscrollvalue	=	null;
				this.group				=	null;
				this.subgroup_01		=	null;
				this.subgroup_02		=	null;
				this.footer				=	null;
				this.selectrow			=	null;
				this.filterobj			=	null;
				this.noeditcell			=	null;
				this.allgrid			=	null;
				this.ptype				=	null;
			}
	,	finalunload	:
			function(){
				Grid.final();
				Griddata.final();
				GridRowSpan.final();
				GridDragObj.final();
    			$U.eventunbind(document,"onkeyup", Grid.directionkeychk );
    			$U.eventunbind(window,"unload", Grid.finalattach );
				this.self	=	null;
			}
	,	finalattach	:
			function(){
				Grid.finalunload();
			}

};	

//===================================================================
//	Grid Drag Obj
//===================================================================
var GridDragObj	=	{
		start		:	false
	,	target		:	null
	,	parent		:	null
	,	divobj		:	null
	,	nfixobj		:	null
	,	nfixhobj	:	null
	,	targetRect			:	null
	,	targetOrginWidth	:	0
	,	parentOrginWidth	:	0
	,	devobjOrginWidth	:	0
	,	moveobjOrginLeft	:	0
	,	fixedCnt	:	-1
	,	fixed		:	""
	,	pid			:	""
	,	colli		:	new Array()
	,	hColli		:	new Array()	//	Group 범위내
	,	h2Colli		:	new Array()	//	Group 범위 후 인경우
	,	rowCol		:	new Array()	//	Row Span
	,	rowNCol		:	new Array()	//	Next Row Span
	,	startX		:	0
	,	movex		:	-1
	
	//-------------------------------------------------------
	//	drag start
	//-------------------------------------------------------
	,	begin	:	
			function(vX){
				this.startX	=	vX;
			}
	
	//-------------------------------------------------------
	//	drag move
	//-------------------------------------------------------
	,	move	:	
			function(obj, mx){
				var imx	=	mx	-	this.moveobjOrginLeft;
				obj.style.left	=	(parseInt(obj.style.left,10) + imx) + "px";
				this.moveobjOrginLeft	=	mx;
			}
	
	//-------------------------------------------------------
	//	drag start 시 object create
	//-------------------------------------------------------
	,	create	:	
			function(vObj){
				this.movex		=	0;
				this.pid		=	$U.get(vObj,"pid");
				this.fixedCnt	=	Number($U.get($D(this.pid),"FIXCNT"));
				this.target		=	vObj;
				this.targetRect	=	$U.getrect(vObj);
				this.parent		=	vObj.parentElement;
				this.fixed		=	$U.get(vObj,"FIXED");
				
				//	FIXED CELL 인경우 아닌경우
				if (this.fixed === "Y"){
					this.divobj		=	$D(this.pid+"_FIXED_DIV");
					this.nfixobj	=	$D(this.pid+"_NFIXED_DIV");
					this.nfixhobj	=	vObj.parentElement.parentElement.childNodes[1];
			
				} else {
					this.divobj	=	$D(this.pid+"_NFIXED_DIV").childNodes[0];
				}

				this.targetOrginWidth	=	vObj.offsetWidth;
				this.parentOrginWidth	=	this.parent.offsetWidth;
				this.divobjOrginWidth	=	this.divobj.offsetWidth;
				this.target.style.cursor	=	"col-resize";
				this.target.onmouseout	=	new Function("GridDragObj.destroy()");
				var cCellIdx	=	vObj.getAttribute("CELLINDEX");
				
				//	하위셀
				var vColli	=	new Array();
				$T_each(["li",$D(this.pid).childNodes[1]],function(lObj){
					if (cCellIdx === $U.get(lObj,"CELLINDEX")) vColli.push(lObj);
				});
				this.colli	=	vColli;
				
				//	해당, Next Row Span 
				var vColli01	=	new Array();
				var vColli02	=	new Array();
				$T_each(["label",$D(this.pid)],function(lObj){
					if (cCellIdx === $U.get(lObj,"CELLINDEX")){
						vColli01.push(lObj);
					} else if (Number(cCellIdx) < Number($U.get(lObj,"CELLINDEX"))){
						vColli02.push(lObj);
					}
				});
				this.rowCol		=	vColli01;
				this.rowNCol	=	vColli02;
				
				//	Group By 인 경우 처리
				var vHColli		=	new Array();
				var vH2Colli	=	new Array();
				var strVal		=	null;
				$T_each(["li",$D(this.pid).childNodes[0]],function(lObj){
					if (!$U.isNull($U.get(lObj,"ORGINWIDTH"))){ 
						strVal	=	$U.get(lObj,"CELLINDEX").toString().split(":");
						if ( 	cCellIdx === strVal[0] 
							||	cCellIdx === strVal[1] 
							||	( Number(cCellIdx) > Number(strVal[0]) && Number(cCellIdx) < Number(strVal[1]))) 
							vHColli.push(lObj);
						if ( 	Number(cCellIdx) < Number(strVal[0])) vH2Colli.push(lObj);
					}
				});
				this.hColli		=	vHColli;
				this.h2Colli	=	vH2Colli;
			}
	
	//-------------------------------------------------------
	//	drag end 시 object 처리
	//-------------------------------------------------------
	,	destroy	:	
			function(){
				this.start	=	false;
				if (!$U.isNull(this.target) && this.movex !== 0){
					if ( Math.abs(this.movex) < 20) {
						alert("넓이 조절값이 유효하지 않습니다");
					} else {
						this.target.style.width	= (this.targetOrginWidth	+	this.movex ) + "px";	
						this.parent.style.width	= (this.parentOrginWidth 	+	this.movex + 9) + "px";	
						
						if (this.fixed === "Y"){
							this.divobj.style.width		= (parseInt(this.divobj.style.width,10) 	+	this.movex	+ 9) 	+ "px";
							this.nfixobj.style.left 	= (parseInt(this.nfixobj.style.left,10)  	+ 	this.movex	+ 9) 	+ "px";
							this.nfixobj.style.width	= (parseInt(this.nfixobj.style.width,10)	- 	this.movex  - 9)	+ "px";
							this.nfixhobj.style.left	= (parseInt(this.nfixhobj.style.left,10) 	+	this.movex  + 9) 	+ "px";

						} else {
							this.divobj.style.width	= (this.divobjOrginWidth +	this.movex + 10) + "px";
						}
						
						//	CELL
						for (var q=0,w=this.colli.length; q<w; q+=1){
							this.colli[q].style.width	=	this.target.style.width;
						}
						
						//	Row Span
						for (var q=0,w=this.rowCol.length; q<w; q+=1){
							this.rowCol[q].style.width	=	this.target.style.width;
						}
						
						var cellpos	=	$T("li",$D(this.pid).childNodes[0]);
						for (var q=0,w=this.rowNCol.length; q<w; q+=1){
							this.rowNCol[q].style.left	=	cellpos[Number($U.get(this.rowNCol[q],"CELLINDEX"))].offsetLeft + "px";
						}
						
						//	그룹 범위내
						for (var q=0,w=this.hColli.length; q<w; q+=1){
							this.hColli[q].style.width = (Number($U.get(this.hColli[q],"ORGINWIDTH")) + this.movex + 9) + "px";
							$U.set(this.hColli[q],"ORGINWIDTH",parseInt(this.hColli[q].style.width,10));
						}
						
						//	그룹 범위 이후 
						var strVal = null;
						for (var q=0,w=this.h2Colli.length; q<w; q+=1){
							strVal	=	$U.get(this.h2Colli[q],"CELLINDEX").toString().split(":");
							if ((this.fixed === "Y") && ( this.fixedCnt <=  Number(strVal[0]))){
								continue;
							}
							this.h2Colli[q].style.left = (parseInt(this.h2Colli[q].style.left,10) + this.movex + 9 ) + "px";
						}
						
						
						var vpid = this.pid;
						if (	Grid.gridscrollvalue.length !== 0 
							&&	!$U.isNull(Grid.gridscrollvalue.match(vpid))
							&&	Grid.gridscrollvalue.match(vpid) !== -1
							&&	!$U.isNull(Grid.gridscrollvalue[Grid.gridscrollvalue.match(vpid)].value)){
							setTimeout(function(){Grid.scrollbynone(vpid,Math.ceil($D(vpid+"_NONESCROLL").scrollTop / Grid.gridscrollvalue[Grid.gridscrollvalue.match(vpid)].value));},1);
						}
							
					}
					this.target.style.cursor	=	"";
				}
			}
	
	//-------------------------------------------------------
	//	Memory Release
	//-------------------------------------------------------
	,	final	:
			function(){
				this.target		=	null;
				this.parent		=	null;
				this.divobj		=	null;
				this.nfixobj	=	null;
				this.nfixhobj	=	null;
				this.targetRect	=	null;
				this.targetOrginWidth	=	null;
				this.parentOrginWidth	=	null;
				this.devobjOrginWidth	=	null;
				this.moveobjOrginLeft	=	null;
				this.fixedCnt	=	null;
				this.fixed		=	null;
				this.pid		=	null;
				this.colli		=	null;
				this.hColli		=	null;
				this.h2Colli	=	null;
				this.rowCol		=	null;
				this.rowNCol	=	null;
				this.startX		=	null;
				this.movex		=	null;
				this.self		=	null;
			}
};


//===================================================================
//	Grid Row Span
//===================================================================
var GridRowSpan	=	{
		
		rowspanCorrectValue	:	0	
			
	//-------------------------------------------------------
	//	RowSpan 해당 라인 여부 체크
	//-------------------------------------------------------
	,	RowSpanCheck	:
			function (sSpan,iChk){
				return ( (","+sSpan+",").indexOf(","+ iChk +",") > -1) ;
			}
	
	//-------------------------------------------------------
	//	RowSpan 처리 label을 생성
	//-------------------------------------------------------
	,	MakeRowSpanLabel	:
			function (i,x,Obj,NObj,ColumnWidth){
				var rowLabel	=	document.createElement("dt");
				var vCssTxt		=	$U.format("position:absolute;top:{0}px;left:{1}px;width:{2}px;height:{3}px;text-align:{4};",
												i * (parseInt(Obj.parentElement.style.height,10)+IMS_config.rowspanCorrectValue), 
												ColumnWidth,
												parseInt(Obj.parentElement.style.width,10),
												parseInt(Obj.parentElement.style.height,10) + parseInt(NObj.parentElement.style.height,10) + IMS_config.rowspanCorrectValue,
												Obj.parentElement.style.textAlign);
				
				rowLabel.style.cssText	=	vCssTxt;
				rowLabel.className		=	"data";
				rowLabel.name			=	"ROW_LABEL";
				rowLabel.onmouseout		=	new Function("javascript:GridRowSpan.UpdateRowSpanMouseManage($U.get(this,'pid'),-1);");
				
				var iCellIndex			=	Obj.parentElement.getAttribute("CELLINDEX");
				var iRowIndex			=	Grid.getdatarowindex(Obj.parentElement.parentElement.getAttribute("pid"), Obj.parentElement);
				var pid					=	Obj.parentElement.parentElement.getAttribute("pid");
				
				$U.set(rowLabel, "CELLINDEX",	iCellIndex);
				$U.set(rowLabel, "ROWINDEX",	iRowIndex);
				$U.set(rowLabel, "pid",		pid	);
				
				var vInnerHTML			=	Obj.parentElement.innerHTML;
				if (vInnerHTML.indexOf("Griddata.checkupdate(this)") > -1){
					vInnerHTML			=	vInnerHTML.replace(	"Griddata.checkupdate(this)", "Griddata.spancheckupdate(this,'"+pid+"',"+iRowIndex+","+iCellIndex+")");
				}
				
				rowLabel.innerHTML		=	$U.format("<a CELLINDEX=\"{4}\" ROWINDEX=\"{5}\" style=\"cursor:hand\" title=\"{0}\" onclick=\"{2}\" CLICKFUNC=\"{3}\" ondblclick=\"{6}\" DBLCLICKFUNC=\"{7}\">{1}</a>",
														$U.text(Obj),
														vInnerHTML,
														$U.format("Grid.cellclickex('{0}',{1},'{2}')",pid,iRowIndex,$U.nvl($U.get(Obj,"CLICKFUNC"))),
														$U.nvl($U.get(Obj,"CLICKFUNC")),
														iCellIndex,
														iRowIndex,
														$U.format("Grid.celldblclickex('{0}',{1},'{2}')",pid,iRowIndex,$U.nvl($U.get(Obj,"DBLCLICKFUNC"))),
														$U.nvl($U.get(Obj,"DBLCLICKFUNC")));
				
				Obj.parentElement.parentElement.appendChild(rowLabel);
				
				/*$D("dddd").value	=	$U.text(Obj);//rowLabel.outerHTML;
*/				
				return rowLabel;
			}
	
	//-------------------------------------------------------
	//	RowSpan 처리 label 높이 수정
	//-------------------------------------------------------
	,	UpdateRowSpanLabel	:
			function (LabelObj,NObj,vId){
				LabelObj.style.height	= (	parseInt(LabelObj.style.height === "" ? $U.get(vId, "CELLHEIGHT") : LabelObj.style.height ,10 )	
										+	parseInt(NObj.parentElement.style.height === "" ? $U.get(vId, "CELLHEIGHT") : NObj.parentElement.style.height,10) 
										+ 	IMS_config.rowspanCorrectValue 	) + "px";
			}
	
	//-------------------------------------------------------
	//	RowSpan label 넓이를 수정
	//-------------------------------------------------------
	,	UpdateRowSpanLabelWidth	:
			function (obj){
				if ($U.isNull(obj)) return;
				var labelObj	= 	$T("dt",obj.parentElement.parentElement);
				var iChai		=	0;
				for (var i=0,j=labelObj.length; i<j; i+=1){
					if (labelObj[i].getAttribute("CELLINDEX") === obj.getAttribute("CELLINDEX")){
						iChai	=	parseInt(obj.style.width,10) - parseInt(labelObj[i].style.width,10);
						labelObj[i].style.width	=	obj.style.width;
					}
					if (iChai !== 0	&& parseInt(labelObj[i].getAttribute("CELLINDEX"),10) > parseInt(obj.getAttribute("CELLINDEX"),10)){
						labelObj[i].style.left	=	( parseInt(labelObj[i].style.left,10) + iChai ) + "px";
					}
				}
			}	
	
	//-------------------------------------------------------
	//	RowSpan 마우스 오버시 처리
	//-------------------------------------------------------
	,	UpdateRowSpanMouseManage	:
			function (id,iRowIdx,iopt){
				if ($U.isNull(id)) return;
				if ($U.get(id,"ROWSPAN") === "") return;
				var labelObj 	= 	$T("dt",$D(id));
				for (var i=0,j=labelObj.length; i<j; i+=1){
					labelObj[i].className 	=	(Grid.getscreenrowindex(id,labelObj[i]) === parseInt(iRowIdx,10) && iopt === 1) ? "dataOver" : "data";
				}		
			}	
		
	//-------------------------------------------------------
	//	RowSpan 처리	-	make
	//-------------------------------------------------------
	,	make	:
			function (id){
				setTimeout(function(){
					GridRowSpan.call(id,1);
				},10);
			}
	
	//-------------------------------------------------------
	//	RowSpan 처리	-	release
	//-------------------------------------------------------
	,	release	:
			function (id){
				GridRowSpan.call(id,-1);
			}
	
	//-------------------------------------------------------
	//	RowSpan 처리	-	remake
	//-------------------------------------------------------
	,	remake	:
			function (id){
				setTimeout(function(){
					GridRowSpan.call(id,-1);
					GridRowSpan.call(id,1);
				},10);
			}
	
	//-------------------------------------------------------
	//	RowSpan 처리
	//		-	opt :	-1	릴리즈 그외 생성
	//-------------------------------------------------------
	,	call	:
			function (id,opt){
		
				if ($U.isNull($hD("#"+id))) return;
				
				//-----*	RowSpan 값확인
				if ($U.get(id,"ROWSPAN") === "") return;
				
				//-----*	변수세팅
				var sRowSpan	=	$U.get(id,"ROWSPAN");
				var divObj		=	$T("div",	$D(id));
				var labelObj	=	$T("dt",	$D(id));
				var fixedCnt	=	$T("li",	divObj[6].childNodes[0]).length;
				var NfixedCnt	=	$T("li",	divObj[7].childNodes[0].childNodes[0]).length;
				var pageRowCnt	=	$U.get(id,"DATAVIEWCNT");
				
				if ($U.isNull(pageRowCnt)){
					if ($U.isNull(Griddata.dataset.get(id))) return;
					pageRowCnt = Griddata.dataset.get(id).records;
				}
				
				//-----*	NONE DATA 처리
				if (divObj[5].style.display	===	"block") return ;
				
				//-----*	Column Get
				var FixColumnObj	=	$T("li",divObj[1]);
				var NFixColumnObj	=	$T("li",divObj[3]);
				
				//-----*	내부 dt 값 모두 해제
				for (var x=labelObj.length-1,y=-1; x>y; x-=1){
					labelObj[x].parentNode.removeChild(labelObj[x]);
				}	
				
				//-----*	Release 여부 확인
				if (opt === -1) return;
				
				var iWidth		=	0;
				var LObj		=	null;
				var beforeLine	=	-1;
				
				//-----*	Fixed Row 처리
				var fixObj		=	null;
				var fixNObj		=	null;
				var blObjValue	=	null;
				var blObjNValue	=	null;
				
				for (var x=0,y=fixedCnt; x<y; x+=1){
					
					iWidth	+=	(x === 0 ? 0 : (FixColumnObj[x-1].style.display !== "none" ? parseInt(FixColumnObj[x-1].style.width,10) + IMS_config.rowspanCorrectValue + 1 : 0 ));	
	
					//-----*	RowSpan 라인만 처리
					if (this.RowSpanCheck(sRowSpan,x)){
			
						for(var i=0,j=pageRowCnt;i<j; i+=1){
							try{ fixObj	=	$T("span",$T("li",divObj[6].childNodes[i])[x])[0]; } catch(e){ break; };
							if ($U.isNull(fixObj)) break;
							
							blObjValue	=	beforeLine === -1 ? null : $T("span",$T("li",divObj[6].childNodes[i])[beforeLine])[0];	
							LObj		=	null;
							for(var q=(i+1),w=pageRowCnt;q<w; q+=1){
								
								try{ fixNObj	=	$T("span",$T("li",divObj[6].childNodes[q])[x])[0]; } catch(e){ break; };
								if ($U.isNull(fixNObj)) break;
								if (this.RowSpanCheck(sRowSpan,beforeLine) && blObjValue !== null){
									blObjNValue	=	$T("span",$T("li",divObj[6].childNodes[q])[beforeLine])[0];	
									if ($U.text(blObjNValue) !== "" && $U.text(blObjNValue)	!== $U.text(blObjValue)) break;
								}
								
								if ($U.text(fixObj) !== "" && $U.text(fixObj) === $U.text(fixNObj)){
									if (LObj === null){
										LObj = this.MakeRowSpanLabel(i,x,fixObj,fixNObj,iWidth);
									} else {
										this.UpdateRowSpanLabel(LObj,fixNObj,id);
									}
									i++;
									continue;
								}
								break;
							}
						}
					}
					beforeLine	=	FixColumnObj[x].style.display !== "none" ? x : beforeLine;
					
				}	
			
				//-----*	Non Fixed Row 처리
				var NfixObj		=	null;
				var NfixNObj	=	null;
				iWidth			=	0;
				
				for (var x=fixedCnt,y=fixedCnt+NfixedCnt; x<y; x+=1){
					
					iWidth	+=	(x === fixedCnt ? 0 : (NFixColumnObj[x-fixedCnt-1].style.display !== "none" ? parseInt(NFixColumnObj[x-fixedCnt-1].style.width,10) + IMS_config.rowspanCorrectValue + 1 : 0) );	
					
					//-----*	RowSpan 라인만 처리
					if (this.RowSpanCheck(sRowSpan,x)) {
						
						for(var i=0,j=pageRowCnt;i<j; i+=1){
							try { NfixObj	=	$T("span",$T("li",divObj[7].childNodes[0].childNodes[i])[x-fixedCnt])[0]; } catch(e){ break; };
							if ($U.isNull(NfixObj)) break;
							
							blObjValue	=	beforeLine === -1 ? null : 
										(	x === fixedCnt ? 
													$T("span",$T("li",divObj[6].childNodes[i])[beforeLine])[0] 
												: 	$T("span",$T("li",divObj[7].childNodes[0].childNodes[i])[beforeLine-fixedCnt])[0]);
												
							
							LObj		=	null;
							for(var q=(i+1),w=pageRowCnt;q<w; q+=1){
								
								try { NfixNObj	=	$T("span",$T("li",divObj[7].childNodes[0].childNodes[q])[x-fixedCnt])[0]; } catch(e){ break; };
								if ($U.isNull(NfixNObj)) break;
								if (this.RowSpanCheck(sRowSpan,beforeLine) && blObjValue !== null){
									blObjNValue	=	x === fixedCnt ? 
															$T("span",$T("li",divObj[6].childNodes[q])[beforeLine])[0]
														:	$T("span",$T("li",divObj[7].childNodes[0].childNodes[q])[beforeLine-fixedCnt])[0];	
									if ($U.text(blObjNValue) !== "" && $U.text(blObjNValue) !==	$U.text(blObjValue)) break;
								}
								
								if ($U.text(NfixObj) !== "" && $U.text(NfixObj) === $U.text(NfixNObj)){
									if (LObj === null){
										LObj = this.MakeRowSpanLabel(i,x-fixedCnt,NfixObj,NfixNObj,iWidth);
									} else {
										this.UpdateRowSpanLabel(LObj,NfixNObj,id);
									}
									i++;
									continue;
								}
								break;
							}
						}
					}
					beforeLine	=	NFixColumnObj[x-fixedCnt].style.display !== "none" ? x : beforeLine;
				}	
			}

	//-------------------------------------------------------
	//	Memory release
	//-------------------------------------------------------
	,	final	:
			function (){
				this.self	=	null;
			}

};


