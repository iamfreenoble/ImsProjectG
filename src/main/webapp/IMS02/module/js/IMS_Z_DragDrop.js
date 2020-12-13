/*=================================================================================
 *	파 일 명	: IMS_XR_DragDrop.js
 *	작성목적	: HTML5 Drag & Drop 관련 함수
 *	작 성 자	: 이상준
 *	최초작성일	: 2018.03.09
 *	최종작성일	:
 *	수정내역	:
 *				2020-03-17	최소 사이즈를 정해서 그 이하로는 resize 안되도록 처리함	30px		
 *				
=================================================================================*/

//===================================================================
//	DragDrop 
//===================================================================
var XDropDrag = {
		
		StartX		:	0
	,	StartY		:	0	
	,	idx			:	0	
	,	target		:	null
	,	gubun		:	null
	,	callback	:	null
	,	fidx		:	null
		
	//-------------------------------------------------------
	//	drag
	//-------------------------------------------------------
	,	drag	:
			function(ev,g,idx,callback,fidx){
				var e = ev || window.event;
				try{
					$U.eventbind(document, "onmousemove",	XDropDrag.over );
					$U.eventbind(document, "onmouseup", 	XDropDrag.drop );
					XDropDrag.gubun		=	g;
					XDropDrag.idx		=	idx;
					XDropDrag.StartX	=	_MOUSE_POSITION.x;	
					XDropDrag.StartY	=	_MOUSE_POSITION.y;	
					XDropDrag.target	=	(e.srcElement||e.target).parentElement;
					XDropDrag.callback	=	callback;
					XDropDrag.fidx		=	fidx;
				
				} catch(e){
					console.log("[ XDropDrag || drag ] " + e);
				} finally{
					e.preventDefault();
					e	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	over
	//-------------------------------------------------------
	,	over	:
			function(ev){
				
				var w,w2,w3,w4,wo,tao,dio,val,e = ev || window.event,v=[];
				try{
					
					w	=	parseInt(XDropDrag.target.style.width)||XDropDrag.target.offsetWidth;
					
					//--**	구분별 처리 
					//--**	G2_HEAD_RESIZE	->	G2 헤더 사이즈 조정
					switch(XDropDrag.gubun){
						case "G2_HEAD_RESIZE"	:	
							tao	=	XDropDrag.target.parentElement.parentElement.parentElement;
							dio	=	tao.parentElement;
							foo	=	dio.parentElement;
							wo	=	$hA("colgroup col", tao)[XDropDrag.idx];
							w	=	parseInt(wo.style.width)||wo.offsetWidth;
							w2	=	parseInt(tao.style.width)||tao.offsetWidth;
							w3	=	parseInt(dio.style.width)||dio.offsetWidth;
							document.body.style.cursor	=	"w-resize";
							val	=	e.clientX -	XDropDrag.StartX;
							//--**	최소 넓이를 30 으로 유지
							if (w + val < 30){
								val	=	30 - w;
							}
							
							if ( IDV_BROWSER.NAME === "edge" && IDV_BROWSER.RELEASE === "2" ){
								v.chai	=	1;
							} else {
								v.chai	=	0; 
							}
							
							wo.style.borderTop	=	"1px solid red";	
							wo.style.width	=	( w 	+	val ) + "px";
							tao.style.width	=	( w2 	+	val ) + "px";	
							dio.style.width	=	( w3 	+	val ) + "px";
							foo.style.width	=	( $hD("div[name=FixedDiv]", foo).offsetWidth + $hD("div[name=NonFixedDiv]", foo).offsetWidth + v.chai) + "px";
							_G2_dragdrop_hhcorrect($U.get(foo,"G2ID"), XDropDrag.fidx);
							break;
					}
					
					XDropDrag.StartX	=	_MOUSE_POSITION.x;	
					XDropDrag.StartY	=	_MOUSE_POSITION.y;	
					
					if (!$U.isNull(XDropDrag.callback)){
						window[XDropDrag.callback]();
					}
					
				} catch(e){
					console.log("[ XDropDrag || over ] " + e);
				} finally{
					e.preventDefault();
					w	=	null;
					w2	=	null;
					w3	=	null;
					w4	=	null;
					e	=	null;
					wo	=	null;
					tao	=	null;
					dio	=	null;
					foo	=	null;
					val	=	null;
					e	=	null;
					v	=	null;
				}
				
			}
		
	//-------------------------------------------------------
	//	drag
	//-------------------------------------------------------
	,	drop	:
			function(ev){
				$U.eventunbind(document, "onmousemove",	XDropDrag.over );
				$U.eventunbind(document, "onmouseup", 	XDropDrag.drop );
				document.body.style.cursor	=	"";
				
			}
		
};	

