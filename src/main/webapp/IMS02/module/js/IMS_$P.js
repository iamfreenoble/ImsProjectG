/*=================================================================================
 *	파 일 명		: IMS_$P.js
 *	작성목적		: 공통 Layerpopup 함수
 *	작 성 자		: 이상준
 *	최초작성일		: 2018.03.23
 *	최종작성일		:
 *	수정내역		:
 *
=================================================================================*/

function $P(vattr, vopt, vid){
		
	//-------------------------------------------------------
	//	layer open 
	//-------------------------------------------------------
	this.open = function(){
			
		var oc=0,b,l,ww,hh,ww2,hh2,poXY,ohead,vv;
		try{
			
			//	실행전
			if (!$U.isNull(this.attr.beforeOpen)){
				this.attr.beforeOpen();
			}

			//	현재 레이어 팝업 오픈 개수 
			$T_each(["div",document],function(o){
				if (!$U.isNull(o.LAYERPOPUP)){
					oc	++;
				}
			});	
			
			//--**	모바일인경우 아닌경우로 변경
			if (IDV_MOBILE.NAME !== "NOMOBILE"){	//--**	모바일
				ww	=	this.opt.mw;
				hh	=	this.opt.mh;
			} else {	//--**	PC
				ww	=	this.opt.w;
				hh	=	this.opt.h;
			}
			
			//--**	window viewport 
			vv	=	$U.viewport();
			ww2	=	vv.w-20;	//Math.max(document.body.scrollWidth,	document.documentElement.scrollWidth);
			hh2	=	vv.h-20; 	//Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
			
			//--**	요청 크기가 viewport 보다 클겨우 screen 크기로 조정
			ww = ww > ww2 ? ww2 : ww;
			hh = hh > hh2 ? hh2 : hh;
			
			//--**	레이어팝업의 크기가 화면크기보다 넓거나 높을 경우 백그라운드 이미지의 크기를 100 만큼 넓힌다.
			if ((ww + 100) > ww2 ){
				ww2	=	ww2	+	100;
			}
			if ((hh + 100) > hh2 ){
				hh2	=	hh2	+	100;
			}
			
			//	background 
			b	=	document.createElement("div");
			b.style.cssText		=	$U.format("position:fixed;z-index:{0};background:#d8d8d8;filter:alpha(opacity=60);opacity:0.6;top:0;left:0;right:0;bottom:0",999990+(oc*2));
			b.LAYERBACKPOPUP	=	"Y";    
			if (this.opt.back === "N") b.style.display	=	"none";
			$U.set(b, "id", "_IMS_LAYERBACKPOPUP");
			$U.set(b, "name", "_IMS_LAYERBACKPOPUP");
			document.body.appendChild(b);
			
			//	레이어 화면
			l	=	document.createElement("div");
			l.LAYERPOPUP		=	"Y";
			$U.set(l, "id", "_IMS_LAYERPOPUP");
			$U.set(l, "name", "_IMS_LAYERPOPUP");
			l.funcobj			=	this.attr;
			l.style.cssText		=	$U.format("overflow:hidden;border:1px outset #cdcdcd;position:absolute;z-index:{0};background:#fff;top:50%;left:50%;width:{1}px;height:{2}px",999990+(oc*2+1), ww, hh );
			document.body.appendChild(l);
			$U.html(l, $hD("#"+this.id).innerHTML);
			
			l.style.marginLeft	=	-1 * ww/2 + "px";
			l.style.marginTop	=	-1 * hh/2 + "px";
			
			//--**		레이어 팝업의 위치가 높이가 0보다 작거나 왼쪽이 0보다 작은 경우 처리
			poXY =	$U.getposition(l);
			if (poXY.y < 0 ){
				l.style.ltop	=	(Math.abs(parseInt(l.style.marginTop)) + 50 ) + "px";
			}
			if (poXY.x < 0 ){
				l.style.left	=	(Math.abs(parseInt(l.style.marginLeft)) + 50 ) + "px";
			}
			
			this.olayer	=	l;
			this.oback	=	b;
			
			var ooo	=	this;
			
			ohead	=	$hD("header", this.olayer);
			
			ohead.onmousedown =	function(ev){
				var e = ev || window.event,p,pos;
				try{
					
					document.body.style.cursor	=	"move";
					p	=	ooo.olayer;
					pos	=	$U.getposition(p);
					p.LAYERDRAG_STARTX	=	_MOUSE_POSITION.x;
					p.LAYERDRAG_STARTY	=	_MOUSE_POSITION.y;
					p.style.left	=	( pos.x	-  parseInt(p.style.marginLeft)  )  +	"px";		//	layer 가 서브프레임인경우 보정함
					
					// 2016.01.12 스크롤 이동 후 팝업창 이동시 스크롤 간격만큼 마우스 커서와 벌어져서 수정.
					// p.style.top	=	( pos.y	-  parseInt(p.style.marginTop) )	+	"px";		//	layer 가 서브프레임인경우 보정함
					p.style.top	=	( p.getBoundingClientRect().top	-  parseInt(p.style.marginTop) )	+	"px";		//	layer 가 서브프레임인경우 보정함
					
					$P_movehandler	=	function(){ ooo.move(); };
					$P_uphandler	=	function(){ ooo.up(); };
					
					$U.eventbind(document, "onmousemove",	$P_movehandler );
					$U.eventbind(document, "onmouseup", 	$P_uphandler );
					
				} finally {
					e.preventDefault();
					e	=	null;
					p	=	null;
					pos	=	null;
				}
			};
			
			//--**	button 처리
			this.button();
			
			//--**	custombutton 처리
			this.custombutton();
			
			//--**	Focus
			this.olayer.tabIndex	=	-1;
			this.olayer.focus();
			
			//--** template 처리
			if (!$U.isNull(this.attr.template)){
				$U.html($hD(".common_pop_template_body",this.olayer),$hD(this.attr.template).innerHTML );					
			}
			
			//--** title 처리
			if (!$U.isNull(this.attr.title)){
				$hD(".common_pop_template header h2", this.olayer).innerHTML = this.attr.title;					
			}
			
			//	실행후
			if (!$U.isNull(this.attr.afterOpen)){
				this.attr.afterOpen(this);
			}

			//--**	close event binding
			$U.eventbind($hD(".common_pop_template header a", this.olayer), "onclick",	function() { ooo.close(); } );
			
			//--**	all event binding
			XEvent.bind();
		
		} catch(e){
			
			alert("[ IMS_$P > open, open2 ] " + e);
		
		} finally {
			oc	=	null;
			b	=	null;
			l	=	null;
			ww	=	null;
			hh	=	null;
			ww2	=	null;
			hh2	=	null;
			poXY	=	null;
			ohead	=	null;
			vv	=	null;
		}

	}
	
	//-------------------------------------------------------
	//	title update
	//-------------------------------------------------------
	this.titleupdate	=	function(title){
		$hD(".common_pop_template header h2", this.olayer).innerHTML = title;					
	}
	
	//-------------------------------------------------------
	//	layer drag move
	//-------------------------------------------------------
	this.move	=	function(ev){
		var e,xo;
		try{
			e	=	(window.event || ev);
			xo	=	this.olayer;
			if ($U.isNull(xo)) return;
			xo.style.left		=	(parseInt(xo.style.left) + (e.clientX	-	Number(xo.LAYERDRAG_STARTX))) + "px";
			xo.style.top		=	(parseInt(xo.style.top)  + (e.clientY	-	Number(xo.LAYERDRAG_STARTY))) + "px";
			xo.LAYERDRAG_STARTX	=	_MOUSE_POSITION.x;
			xo.LAYERDRAG_STARTY	=	_MOUSE_POSITION.y;
		}finally{
			e.preventDefault();
			e	=	null;
			xo	=	null;
		}
		return false;
	}
	
	//-------------------------------------------------------
	//	layer drap end 
	//-------------------------------------------------------
	this.up	= function(){
		document.body.style.cursor	=	"default";
		$U.eventunbind(document, "onmousemove",	$P_movehandler );
		$U.eventunbind(document, "onmouseup", 	$P_uphandler );
		return false;
	}
	
	//-------------------------------------------------------
	//	button 처리
	//-------------------------------------------------------
	this.button  =	function(){
		
		if ( $U.isNullOrEmpty(this.attr.button)){
			return;
		}
		
		var b,s="";
		try{
			
			b = ($U.nvl(this.attr.button,"")).split(",");
			for (var i=0,ob;ob=b[i];i+=1){
				switch(ob){
				case "Save"		:	s += "<span name='SaveButton'><i class='far fa-save'></i>&nbsp;&nbsp;Save</span>";	break;
				case "Delete"	:	s += "<span name='DeleteButton'><i class='far fa-trash-alt'></i>&nbsp;&nbsp;Delete</span>";	break;
				case "Confirm"	:	s += "<span name='ConfirmButton'><i class='fas fa-check'></i>&nbsp;&nbsp;Confirm</span>";	break;
				case "Select"	:	s += "<span name='SelectButton'><i class='fas fa-list-ul'></i>&nbsp;&nbsp;Select</span>";	break;
				case "Search"	:	s += "<span name='SearchButton'><i class='fas fa-search'></i>&nbsp;&nbsp;Search</span>";	break;
				case "Cancel"	:	s += "<span name='CancelButton'><i class='fas fa-ban'></i>&nbsp;&nbsp;Cancel</span>";	break;
				}
			}
			
			$hD("footer #defaultButtonArea",this.olayer).innerHTML	=	s;
			
			this.buttonobj["Save"]		=	$hD("footer span[name=SaveButton]", this.olayer);
			this.buttonobj["Delete"]	=	$hD("footer span[name=DeleteButton]", this.olayer);
			this.buttonobj["Confirm"]	=	$hD("footer span[name=ConfirmButton]", this.olayer);
			this.buttonobj["Select"]	=	$hD("footer span[name=SelectButton]", this.olayer);
			this.buttonobj["Search"]	=	$hD("footer span[name=SearchButton]", this.olayer);
			this.buttonobj["Cancel"]	=	$hD("footer span[name=CancelButton]", this.olayer);
			
		} catch(e){
			alert("[ XGrid > button ]" + e);
		} finally {
			b	=	null;
			s	=	null;
		}
		
	}
	//-------------------------------------------------------
	//	custombutton 처리
	//-------------------------------------------------------
	this.custombutton  =	function(){
		
		if ( $U.isNullOrEmpty(this.attr.custombutton)){
			return;
		}
		
		var b,s="";
		try{
			
			b = ($U.nvl(this.attr.custombutton,"")).split(",");
			for (var i=0,ob;ob=b[i];i+=1){
				switch(ob){
				case "button01"	:	s += "<span name='button01'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button02"	:	s += "<span name='button02'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button03"	:	s += "<span name='button03'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button04"	:	s += "<span name='button04'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button05"	:	s += "<span name='button05'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button06"	:	s += "<span name='button06'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button07"	:	s += "<span name='button07'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button08"	:	s += "<span name='button08'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button09"	:	s += "<span name='button09'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				case "button10"	:	s += "<span name='button10'><i class='fas fa-user-check'></i>&nbsp;&nbsp;<a></a></span>";	break;
				}
			}
			
			$hD("footer #customButtonArea",this.olayer).innerHTML	=	s;
			
			this.custombuttonobj["button01"]	=	$hD("footer span[name='button01']", this.olayer);
			this.custombuttonobj["button02"]	=	$hD("footer span[name='button02']", this.olayer);
			this.custombuttonobj["button03"]	=	$hD("footer span[name='button03']", this.olayer);
			this.custombuttonobj["button04"]	=	$hD("footer span[name='button04']", this.olayer);
			this.custombuttonobj["button05"]	=	$hD("footer span[name='button05']", this.olayer);
			this.custombuttonobj["button06"]	=	$hD("footer span[name='button06']", this.olayer);
			this.custombuttonobj["button07"]	=	$hD("footer span[name='button07']", this.olayer);
			this.custombuttonobj["button08"]	=	$hD("footer span[name='button08']", this.olayer);
			this.custombuttonobj["button09"]	=	$hD("footer span[name='button09']", this.olayer);
			this.custombuttonobj["button10"]	=	$hD("footer span[name='button10']", this.olayer);
			
		} catch(e){
			alert("[ XGrid > custombutton ]" + e);
		} finally {
			b	=	null;
			s	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	layer close
	//-------------------------------------------------------
	this.close 	=	function(){
		var l,b,dl,db,f;
		try{
			
			dl	=	this.olayer;
			bl	=	this.oback;
			f	=	$U.isNull(dl) || $U.isNull(dl.funcobj) ? null : dl.funcobj;
			
			if (!$U.isNull(f) && !$U.isNull(f.beforeClose)) f.beforeClose();
			
			if (!$U.isNull(dl)){
				while(dl.hasChildNodes()){
					dl.removeChild(dl.firstChild);
				}
				(dl.parentElement).removeChild(dl);
			}
			
			if (!$U.isNull(bl)){
				while(bl.hasChildNodes()){
					bl.removeChild(bl.firstChild);
				}
				(bl.parentElement).removeChild(bl);
			}
			
			if (!$U.isNull(f) && !$U.isNull(f.afterClose)) f.afterClose();
			
			//--**	레이어 정보 clear...
			$G.removeall();
			
		} finally{
			l	=	null;
			b	=	null;
			dl	=	null;
			bb	=	null;
			f	=	null;
			
			this.release();
		}
	};

	//-------------------------------------------------------
	//	layer release
	//-------------------------------------------------------
	this.release 	=	function(){
		this.attr	=	null;
		this.opt	=	null;
		this.id		=	null;
		this.olayer	=	null;
		this.oback	=	null;
		this.buttonobj =  null;
		this.custombuttonobj =  null;
	}
	
	//-------------------------------------------------------
	//	variable
	//-------------------------------------------------------
	this.attr	=	vattr;
	this.opt	=	vopt;
	this.id		=	$U.isNull(vid) ? "template_pop_frame" : vid;
	this.olayer	=	null;
	this.oback	=	null;
	this.buttonobj	=	{"Save":null,"Delete":null,"Confirm":null,"Select":null,"Search":null,"Cancel":null};
	this.custombuttonobj	=	{"button01":null,"button02":null,"button03":null,"button04":null,"button05":null
								,"button06":null,"button07":null,"button08":null,"button09":null,"button10":null};

	this.open();
	
	return this;
	
};	


var $P_movehandler	=	null;
var $P_uphandler	=	null;
