/*=================================================================================
 *	파 일 명		: IMS_$U.js
 *	작성목적		: 공통 $U 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.08.04
 *	최종작성일	:
 *	수정내역		:
 *				2014-03-31		이상준		함수 수정 및 추가
 *				2015			이상준		함수 수정 및 추가
 *				2016-11			이상준		함수 수정 및 추가	
=================================================================================*/


var _GLOVAL_READY_TIMEOUT_CHK	=	null;
var _GLOVAL_READY_COUNT_CHK		=	0;
var _MOUSE_POSITION	=	{x:0,y:0};

var $U = {
		
	//-------------------------------------------------------
	//		object 의 readystate 체크 및 콜백
	//-------------------------------------------------------
		ready :	
			function(obj, callback){
				if (obj === document || obj === window){
					if ( document.addEventListener ) {
						window.addEventListener( "load", callback, false );
					} else {
						window.attachEvent( "onload", callback );
					}	
				} else {
					if ($U.isNull(obj) && _GLOVAL_READY_COUNT_CHK < 10){
						_GLOVAL_READY_COUNT_CHK	+= 1;
						clearTimeout(_GLOVAL_READY_TIMEOUT_CHK);
						_GLOVAL_READY_TIMEOUT_CHK = setTimeout(function(){
							$U.ready(obj,callback);
						},1);
						return;
					}
					
					_GLOVAL_READY_COUNT_CHK	=	0;
					callback();
				
				}
	}

	//-------------------------------------------------------
	//		object 의 getAttribute
	//-------------------------------------------------------
	,	get :	
			function(obj, attr){
				if ($U.isNull(obj)) return null;
				if (obj.nodeType === 3) return "";
				return (typeof(obj) === "string" ? $D(obj) : (obj === document ? document.body : obj) ).getAttribute(attr);
			}
	
	//-------------------------------------------------------
	//		object 의 setAttribute
	//-------------------------------------------------------
	,	set :	
			function(obj, attr, val){
				if ($U.isNull(obj)) return;
				if (obj.nodeType === 3) return;
				(typeof(obj) === "string" ? $D(obj) : (obj === document ? document.body : obj)).setAttribute(attr, val);
			}
	
	//-------------------------------------------------------
	//		object 의 removeAttribute
	//-------------------------------------------------------
	,	del :	
			function(obj, attr){
				if (IDV_BROWSER.NAME === "IE" && IDV_BROWSER.VER < 9){
					var oaoo = (typeof(obj) === "string" ? $D(obj) : (obj === document ? document.body : obj)).getAttribute(attr);
					oaoo	=	null;
				} else {
					(typeof(obj) === "string" ? $D(obj) : (obj === document ? document.body : obj)).removeAttribute(attr);
				}

			}
	
	//-------------------------------------------------------
	//		문자치환, C#의 String.format 구현
	//-------------------------------------------------------
	,	format :	
			function(){
				var argVal		=	arguments;
				if (argVal.length	===	0)	return "";
				if (argVal.length	===	1)	return argVal[0];
				var sReturn	=	argVal[0];
				var re			=	"";
				for(var i=1,j=argVal.length;i<j; i+=1){
					re = new RegExp("\\{"+(i-1)+"\\}","g");
					sReturn = sReturn.replace(re,argVal[i]);
				}
				return sReturn;
			}
	
	//-------------------------------------------------------
	//	empty 여부 알아내기
	//-------------------------------------------------------
	,	isEmpty		:	
			function(obj){
				if ($U.isNull(obj)){
					return "";
				}
				if (typeof obj === "string"){
					return $U.trim(obj) === "";
				} else {
					
					var	vvval	=	"";
					var tagname	=	!$U.isNull(obj.tagName) ? obj.tagName.toUpperCase()	: 	"NONE";
					tagname 	=	(tagname === "NONE" && typeof obj === "object") 	? 	"OBJECT"	:	tagname;	//--**	체크 순서 바꾸지 말것
					tagname 	=	(tagname === "NONE" && typeof obj === "function") 	? 	"FUNCTION"	:	tagname;
					tagname 	=	((tagname === "NONE" || tagname === "OBJECT") && !$U.isNull(obj.length)) ? 	"ARRAY"	: tagname;
							
					if (tagname === "INPUT"){
						
						switch($U.get(obj,"type")){
						case "date" 	:
						case "email" 	:
						case "number" 	:
						case "tel" 		:
						case "password" :
						case "hidden" 	:
						case "text"		:
							vvval	=	$U.trim(obj.value);	
							break;
						case "select" 	:
							vvval	=	$hA("option:checked" , obj).length > 0 ? $hA("option:checked" , obj)[0].value : ""; 
							break;
						case "radio" :
						case "checkbox" :
							if (!$U.isNull(obj.name)){
								vvval	=	$hA("input[name="+obj.name+"]:checked").length > 0 ? $hA("input[name="+obj.name+"]:checked")[0].value : ""; 
							} else if (!$U.isNull(obj.id)){
								vvval	=	$hA("#"+obj.id+":checked").length > 0 ? $hA("#"+obj.id+":checked")[0].value : ""; 
							} 
							break;
						}
					
					} else if (tagname === "SELECT"){
						vvval	=	$hA("option:checked" , obj).length > 0 ? $hA("option:checked" , obj)[0].value : ""; 
					
					} else if (tagname === "TEXTAREA"){
						vvval	=	$U.trim(obj.value);	
						
					} else if (tagname === "SPAN"){
						vvval	=	$U.trim(obj.innerHTML);	
						
					} else if (tagname === "ARRAY" ){
						vvval	= 	obj.length ===	0 ? "" : "OK";

					} else {
						vvval	= 	$U.isNull(obj) ? "" : "OK";
					}
					
					return vvval === "";
				}

			}

	//-------------------------------------------------------
	//	null 여부 알아내기
	//-------------------------------------------------------
	,	isNull	:	
			function(obj){
				return obj === null || typeof(obj) === "undefined" || obj === "undefined" || obj === undefined;
			}
	
	//-------------------------------------------------------
	//	number 여부 알아내기
	//-------------------------------------------------------
	,	isNumber	:	
			function(obj){
				if ($U.isNull(obj)){
					return null;
				}
				return !isNaN(Number(obj));
			}
	
	//-------------------------------------------------------
	//	null or empty 여부 알아내기
	//-------------------------------------------------------
	,	isNullOrEmpty		:	
			function(obj){
				return $U.isNull(obj)||$U.isEmpty(obj);
			}
	
	//-------------------------------------------------------
	//	null to value 
	//-------------------------------------------------------
	,	nvl	:	
			function(obj,cobj){
				return $U.isNull(obj) ? ( $U.isNull(cobj) ? "" : cobj ) : obj;
			}

	//-------------------------------------------------------
	//  주어진 문자열의 길이를 byte로 체크
	//-------------------------------------------------------
	,	byteLen	:	
			function(bstr){
				len = bstr.length;
				for (var ii=0; ii<bstr.length; ii++){
					xx = bstr.substr(ii,1).charCodeAt(0);
					if (xx > 127)	len++; 
				}
				return len;
			}
	
	//-------------------------------------------------------
	//  UTF-8의 경우 한글을 3Byte로 인식		
	//-------------------------------------------------------
	,	byteLenU8	:	
			function(bstr){
				len = bstr.length;
				for (var ii=0; ii<bstr.length; ii++){
					xx = bstr.substr(ii,1).charCodeAt(0);
					if (xx > 127)	len += 2; 
				}
				return len;
			}
		
	//-------------------------------------------------------
	//	서식 가진 숫자이나 그냥 숫자인경우 서로 더하기 
	//-------------------------------------------------------
	,	plus	:		
			function (a,b){
				a	=	a === "" ? 0 : a.toString().replace(/,/g,"");
				b	=	b === "" ? 0 : b.toString().replace(/,/g,"");
				try{
					a	=	Number(a);
				} catch(e){
					try{
						a	=	parseInt(a);
					} catch(e){
						a	=	0;
					}
				}
				try{
					b	=	Number(b);
				} catch(e){
					try{
						b	=	parseInt(b);
					} catch(e){
						b	=	0;
					}
				}
				return (isNaN(a) ? 0 : a )+(isNaN(b) ? 0 : b );
			}
	
	//-------------------------------------------------------
	//	수치 여부 확인 - 문자전체
	//-------------------------------------------------------
	,	isNum	:		
			function (src){
				return (/^[0-9]+$/).test(src) ? true : false;
			}
	//-------------------------------------------------------
	//	한글 확인 - 문자전체
	//-------------------------------------------------------
	,	isKor:
			function(src){
				return (/^[가-힣]+$/).test(src) ? true : false;
			}
	
	//-------------------------------------------------------
	//	영어 확인 - 문자전체
	//-------------------------------------------------------
	,	isEng:
			function(src){
				return (/^[a-zA-Z]+$/).test(src) ? true : false;
			}

	//-------------------------------------------------------
	//	수치 여부 확인 - event.keycode  .. 48 ~ 57
	//-------------------------------------------------------
	,	isNumKey	:		
			function (c){
				return (c > 47 && c <58 ) ? true : false;
			}
	//-------------------------------------------------------
	//	한글 확인 - event.keycode .. 
	//				가 ~ 힣 45032 ~ 55203, 
	//				자음 12593 ~ 12622
	//				모음 12623 ~ 12643
	//-------------------------------------------------------
	,	isKorKey:
			function(c){
				return ( ( c > 45031 && c < 55204) || ( c > 12592 && c < 12644)) ? true : false;
			}
	
	//-------------------------------------------------------
	//	영어 확인 - event.keycode
	//				대문자 : 65~90
	//				소문자 : 97 ~ 122
	//-------------------------------------------------------
	,	isEngKey:
			function(c){
				return ( ( c > 64 && c < 91) || ( c > 96 && c < 123)) ? true : false;
			}

	//-------------------------------------------------------
	//	정수문자열을 xxx,xxx,xxx,xxx 형식으로 변환
	//-------------------------------------------------------
	,	tocurrency	:
			function(num){
				var deg;
				try{
					num = typeof num ===  "number" ? num.toString() : num ;
					num	= num.replace(/,|-/g,"");
					num = typeof(num) === "string" ? Number(num) : num ;
					if (num.toString().indexOf(".")>-1){
						deg	=	"." + num.toString().split(".")[1];
					} else {
						deg =	"";
					}
					return num.toLocaleString().split(".")[0] + deg;
					
				} catch(e){
					alert("[tocurrency]" + e);
				} finally{
					deg	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	문자열을 date format 으로 변경
	//-------------------------------------------------------
	,	todateformat :
			function(val,e){
		
				//--**	backspace 인 경우
				var ev = e || window.event;
				if ((ev.which||ev.keyCode) === 8){
					return val;
				}
		
		
				try{
					if ( val.length > 10 ){
						return val.substr(0,10);
					}
					val = typeof val ===  "number" ? val.toString() : val ;
					val = val.replace(/[^0-9]/g,"");
					
					switch(val.length){
						case 0 :	
						case 1 :
						case 2 :
						case 3 :	return val;	break;
						case 4 :	return val.substr(0,4) + IMS_config.calendardiv;	break;
						case 5 :	return val.substr(0,4) + IMS_config.calendardiv + val.substr(4,1);	break;
						case 6 :	return val.substr(0,4) + IMS_config.calendardiv + val.substr(4,2) + IMS_config.calendardiv;	break;
						case 7 :	return val.substr(0,4) + IMS_config.calendardiv + val.substr(4,2) + IMS_config.calendardiv + val.substr(6,1) ;	break;
						case 8 :	return val.substr(0,4) + IMS_config.calendardiv + val.substr(4,2) + IMS_config.calendardiv + val.substr(6,2) ;	break;
					}
				} catch(e){
					alert("[todatedormat]" + e);
				} finally{
				}
			}

	//-------------------------------------------------------
	//  OBJECT 위치 찾기...	
	//-------------------------------------------------------
	,	getposition	:	
			function(o,opt){
				
				if ($U.isNull(o)) {
					return {x:0, y:0, w:0, h:0};
				}
				
				var rect,iLeft,iTop,iWidth,iHeight;
				try{
					try{
						rect	=	o.getBoundingClientRect();
						iLeft	=	rect.left	+	document.body.scrollLeft || document.documentElement.scrollLeft;
						iTop	=	rect.top	+	document.body.scrollTop || document.documentElement.scrollTop;
						iWidth	=	rect.right	-	rect.left;
						iHeight	=	rect.bottom	-	rect.top;
					
					} catch(e){
						rect	=	document.getBoxObjectFor(o);	//	FireFox 지원 안함, prototyp.js 에서 선언
						iLeft	=	rect.x;
						iTop	=	rect.y;
						iWidth	=	rect.width;
						iHeight	=	rect.height;
					}
					
					return {x:iLeft, y:iTop, w:iWidth, h:iHeight};		
					
				} catch(e){
					
				} finally{
					rect	=	null;
					iLeft	=	null;
					iTop	=	null;
					iWidth	=	null;
					iHeight	=	null;
				}
			}
	//-------------------------------------------------------
	//  OBJECT rect
	//-------------------------------------------------------
	,	getrect	:	
			function(oObj){
				var pos = $U.getposition(oObj);
				return {left:pos.x, top:pos.y, right:pos.x + pos.w, bottom:pos.y + pos.h};
			}
	
	//-------------------------------------------------------
	//  OBJECT rect in chk
	//-------------------------------------------------------
	,	rectinchk	:	
			function(o,p){
				var pos	=	null;
				try {
					pos 	= 	$U.getrect(o);
					return ((p.x > pos.left && p.x < pos.right) && (p.y > pos.top && p.y < pos.bottom)); 
				} finally{
					pos	=	null;
				}
			}
		
	//-------------------------------------------------------
	//	Trim	
	//-------------------------------------------------------
	,	trim	:	
			function(str) {
			    return $U.rtrim($U.ltrim(str));
			}

	//-------------------------------------------------------
	//	Left Trim
	//-------------------------------------------------------
	,	ltrim 	:	 
			function(str) {
		    	return str.replace(/^\s+/g,"");
			}

	//-------------------------------------------------------
	//	Right Trim
	//-------------------------------------------------------
	,	rtrim 	:	
			function(str) {
		    	return str.replace(/\s+$/g,"");
			}
	
	//-------------------------------------------------------
	//	Style 읽기
	//-------------------------------------------------------
	,	getstyle	:
			function (obj, jsprop, cssprop) {
	        	if (obj.currentStyle) {
	        		return obj.currentStyle[jsprop];
	        		
	        	} else if (window.getComputedStyle) {
	        		return document.defaultView.getComputedStyle(obj, null).getPropertyValue(cssprop);
	
	        	} else {
	        		return null;
	        	}
			}
	
	//-------------------------------------------------------
	//	Object 복사하기	--	오브젝트내 var 만 복사됨
	//-------------------------------------------------------
	,	clone	:
			function (obj) {
				if ($U.isNull(obj)) return obj;
				return JSON.parse(JSON.stringify(obj));
			}
	//-------------------------------------------------------
	//	Object 복사하기	--	오브젝트내 함수등까지 모두 복사
	//-------------------------------------------------------
	,	cloneext	:
			function (obj) {
				if ($U.isNull(obj)) return obj;
				var co = {};
				for (var attr in obj) {
					if (!obj.hasOwnProperty(attr)) continue;
					if (typeof obj[attr] === "function"){
						co[attr] = new Function('return ' + obj[attr].toString())();
					} else {
		                co[attr] = obj[attr];
					}
					
				}
				return co;
			}
	
	//-------------------------------------------------------
	//	event bind
	//	ex) $U.eventbind(window,"onresize",chart_common.draw);
	//-------------------------------------------------------
	,	eventbind	:
			function (obj, vEvent, vFunction) {
				if ($U.isNull(obj)) return;
				if ($U.isNullOrEmpty(vFunction)) return;
				if ($U.isNull(obj.length) || obj.length === 0){
					if (obj.addEventListener){
						obj.addEventListener(vEvent.substring(2), vFunction, false );
					} else {
						if (obj[vEvent]){
							obj.attachEvent(vEvent, vFunction);
						} else {
							obj[vEvent]	=	vFunction;
						}
					}
				} else {
					for (var q=0,eoobj;eoobj=obj[q];q+=1){
						if (eoobj.addEventListener){
							eoobj.addEventListener(vEvent.substring(2), vFunction, false );
						} else {
							if (eoobj[vEvent]){
								eoobj.attachEvent(vEvent, vFunction);
							} else {
								eoobj[vEvent]	=	vFunction;
							}
						}
					}
				}
			}
	
	//-------------------------------------------------------
	//	event unbind
	//		addEvent 시 리턴받은 토큰이나 function Name 로 사용시
	//-------------------------------------------------------
	,	eventunbind	:
			function (obj, vEvent, vFunction) {
				if ($U.isNull(obj)) return;
				if ($U.isNull(obj.length) || obj.length === 0){
					if (obj.removeEventListener){
						obj.removeEventListener(vEvent.substring(2),vFunction, false );
					} else {
						if (obj[vEvent]){
							obj[vEvent]	=	null;
						} else {
							try{
								obj.detachEvent(vEvent, vFunction);
							} catch(e){
							}
						} 
					}
				} else {
					for (var q=0,eoobj;eoobj=obj[q];q+=1){
						if (eoobj.removeEventListener){
							eoobj.removeEventListener(vEvent.substring(2),vFunction, false );
						} else {
							if (eoobj[vEvent]){
								eoobj[vEvent]	=	null;
							} else {
								try{
									eoobj.detachEvent(vEvent, vFunction);
								} catch(e){
								}
							} 
						}
					}	
				}
			}
	
	//-------------------------------------------------------
	//	select box change
	//		-	obj			:	target
	//		-	jdata		:	json 형태의 data	rows=[{id:"",title:""}]
	//		-	selvalue	:	selected value
	//		-	foptdelbool	:	첫번째 option 삭제여부 , 
	//-------------------------------------------------------
	,	selboxchange	:
			function (obj, jdata, selvalue, foptdelbool) {
				if ($U.isNull(obj)) return;
				for (var i=obj.options.length-1,j=-1; i>j; i-=1){
					if (foptdelbool !== true && i === 0 ) break; 
					obj.options.remove(i);
				}
				if ($U.isNull(jdata)) return;
				var jooo = $U.isNull(jdata.rows) ? jdata : jdata.rows;
				var noption = null;
				for (var i=0,j=jooo.length; i<j; i+=1){
					if ($U.isNull(jooo[i].id) || $U.isNull(jooo[i].title)) continue;
					noption	=	document.createElement("option");
					noption.value = jooo[i].id;
					noption.innerHTML	=	jooo[i].title;
					if (jooo[i].title === $U.nvl(selvalue,null)){
						noption.selected	=	"selected";
					}
					obj.options.add(noption);
				};
			}

	//-------------------------------------------------------
	//	animate
	//		-	obj	:	target
	//		-	vtype	:	position, width, height, rect 등	
	//		-	vopt	:	case 별 옵션
	//						width 	인경우 :	amount, limitx
	//						height 	인경우 :	amount, limity
	//						loading 인경우 : amount, limitx, limity 
	//-------------------------------------------------------
	,	animate:
			function (obj, vtype, vopt) {
				setTimeout(function(){
					switch(vtype){
					case "position" 	: 
						break;
					case "width" 		: 
						var vWidth		=	(($U.isNullOrEmpty(obj.style.width) ? obj.offsetWidth : parseInt(obj.style.width,10)) 	+ vopt.amount ) ;
						if (vWidth   < vopt.limitx ){
							if ( vWidth < 0){
								obj.style.width	=	"0px";
								if (parseInt(obj.style.height,10) === 0) obj.style.display	=	"none";
								return;
							}
							obj.style.width  	=  vWidth	+ "px";
						} else {
							return;
						}
						break;
					case "height" 	: 
						var vHeight	=	(($U.isNullOrEmpty(obj.style.height) ? obj.offsetHeight : parseInt(obj.style.height,10)) 	+ vopt.amount ) ;
						if (vHeight   < vopt.limity ){
							if ( vHeight < 0){
								obj.style.height =	"0px";
								if (parseInt(obj.style.width,10) === 0) obj.style.display	=	"none";
								return;
							}
							obj.style.height  	=  vHeight	+ "px";
						} else {
							return;
						}
						break;
					case "rect" : 
						break;
					case "loading" : 
						var vWidth	=	(($U.isNullOrEmpty(obj.style.width) ? obj.offsetWidth    - (obj.offsetLeft*2) : parseInt(obj.style.width,10)) 	+ vopt.amount ) ;
						var vHeight	=	(($U.isNullOrEmpty(obj.style.height) ? obj.offsetHeight  - (obj.offsetTop*2) : parseInt(obj.style.height,10)) + vopt.amount );
						if (vWidth   > vopt.limitx ){
							obj.style.width  	=  vWidth	+ "px";
							obj.style.left		=	(($U.isNullOrEmpty(obj.style.left) ? obj.offsetLeft*2 : parseInt(obj.style.left,10)) - (vopt.amount / 2 )) + "px";		
						}
						if (vHeight  > vopt.limity ) {
							obj.style.height 	=  vHeight	+ "px";
							obj.style.top		=	(($U.isNullOrEmpty(obj.style.top) ? obj.offsetTop*2 : parseInt(obj.style.top,10)) - (vopt.amount / 2) ) + "px";		
						}
						if (vWidth  <= vopt.limitx  && vHeight  <= vopt.limity){
							obj.style.display	=	"none";
							return;
						}
						break;
					}
					$U.animate(obj, vtype, vopt);
				},5);
			}

	//-------------------------------------------------------
	//	현재 화면 닫기
	//-------------------------------------------------------
	,	wintabclose:
			function(){
				alert("현재 화면(탭)을 닫습니다.\n------------------------\nScreen is closed.");
				window.open("about:blank","_top").close();
			}
	
	//-------------------------------------------------------
	//	정해진 시간동안 잠시 멈추기
	//-------------------------------------------------------
	, 	sleep:
			function (num){	//[1/1000초]
		 		var now = new Date();
		 		var stop = now.getTime() + num;
		 		while(true){
		 			now = new Date();
		 			if(now.getTime() > stop){
		 				return;
		 			}
		 		}
			}	

	//-------------------------------------------------------
	//	innerText 는 표준이 아님
	//-------------------------------------------------------
	, 	text:
			function (o){	
				return this.nvl(o.innerText, "") || this.nvl(o.textContent, "");
			}
	
	, 	settext:
			function (o,v){	
				if (!this.isNull(o.innerText)){
					o.innerText		=	v;
				} else {
					o.textContent	=	v;
				}
			}
	
	//-------------------------------------------------------
	//	html 등 파일 로드
	//-------------------------------------------------------
	,	load:
			function (url, callback){
		
				var xmlhttp = null;
				//IE인경우
				if(window.ActiveXObject){
					xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
				
				} else {
					xmlhttp = new XMLHttpRequest();
					xmlhttp.overrideMimeType('text/xml');
				}   
				
				xmlhttp.open("GET", url);
				xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded" );
				
				xmlhttp.onreadystatechange = function() {
					
					if(xmlhttp.readyState === 4){
						
						switch (xmlhttp.status){
					     	case 200 :
								if (callback){
									callback(xmlhttp.responseText);
								} else {
									$U.insertHTML(document.body, "beforeend", xmlhttp.responseText);
								}
					     		break;
						}
					}
				};	
				
				xmlhttp.send();
			}
	
	//-------------------------------------------------------
	//	html 구현
	//-------------------------------------------------------
	, 	html:
			function(o, textd, callback){
				if (typeof(o) !== "object" && typeof(textd) !== "sting") return;
				
				//2016.03.07 IE11에서 o가 null로 들어 오는 경우가 있음.
				if(o === null) return;
				
				while(o.hasChildNodes()){
					o.removeChild(o.firstChild);
				}
				
				//	data 가 넘어올때 text 로만 넘어옴...
				//	script 구문을 찾아 변경처리할것
				//	hdata의 script 
				//	script 구문을 찾는다
				var sidx	=	-1;
				var eidx	=	-1;
				var attrnm	=	"";
				var attrval	=	"";
				var starti	=	-1;
				var endi	=	-1;
				var sscript	=	"";
				var arrscript	=	new Array();
				var scriptattr	=	"";
				var so 	=	"";
				var sstyle	=	"";
				var arrstyle	=	new Array();
				var styleattr	=	"";
				
				try{
					/*script*/
					while(1===1){
						sidx	=	textd.toLowerCase().search("<script");
						eidx	=	textd.toLowerCase().search("</script");
						if (sidx > -1){
							sscript	=	textd.substring(sidx,eidx+9);
							textd		=	textd.replace(sscript,"");
							so			= 	document.createElement("script");
							
							//	script tag 의 attribute 처리
							scriptattr	=	sscript.substring(0, sscript.search(">")+1);
							for (var a=7,s=scriptattr.length;a<s;a+=1){
								if (scriptattr[a] === " " || scriptattr[a] === ">"){
									if (attrnm !== "" && attrval !== ""){
										so.setAttribute(attrnm,attrval);
										attrnm	=	"";
										attrval	=	"";
									} else if (attrnm !== ""){
										so.setAttribute(attrnm,attrnm);			
										attrnm	=	"";
										attrval	=	"";
									}
								
								} else if (scriptattr[a] === "="){
									a++;
									
									if (scriptattr[a] === "\""){
										starti = a + 1;
										while(1===1){
											a++;
											if (scriptattr[a] === "\""){
												endi = a;
												break;
											}
										}
										attrval	=	scriptattr.substring(starti, endi);	
									} else if (scriptattr[a] === "'"){
										starti = a + 1;
										while(1===1){
											a++;
											if (scriptattr[a] === "'"){
												endi = a;
												break;
											}
										}
										attrval	=	scriptattr.substring(starti+1, endi-1);	
									} else {
										starti = a;
										while(1===1){
											a++;
											if (scriptattr[a] === " "){
												endi = a;
												break;
											}
										}
										attrval	=	scriptattr.substring(starti+1, endi-1);
										a--;
									}
								} else {
									attrnm	+=	scriptattr[a];		
								}
							}		
							
							so.text		=	sscript.replace(scriptattr,"").replace("</script>","");
							arrscript.push(so);
							continue;
						} 
						break;
					}
					
					/*style*/
					while(1===1){
						sidx	=	textd.toLowerCase().search("<style");
						eidx	=	textd.toLowerCase().search("</style");
						if (sidx > -1){
							sstyle	=	textd.substring(sidx,eidx+8);
							textd	=	textd.replace(sstyle,"");
							so 	= 	document.createElement("style");
							
							//	style tag 의 attribute 처리
							styleattr	=	sstyle.substring(0, sstyle.search(">")+1);
							for (var a=6,s=styleattr.length;a<s;a+=1){
								if (styleattr[a] === " " || styleattr[a] === ">"){
									if (attrnm !== "" && attrval !== ""){
										so.setAttribute(attrnm,attrval);
										attrnm	=	"";
										attrval	=	"";
									} else if (attrnm !== ""){
										so.setAttribute(attrnm,attrnm);			
										attrnm	=	"";
										attrval	=	"";
									}
								
								} else if (styleattr[a] === "="){
									a++;
									
									if (styleattr[a] === "\""){
										starti = a + 1;
										while(1===1){
											a++;
											if (styleattr[a] === "\""){
												endi = a;
												break;
											}
										}
										attrval	=	styleattr.substring(starti, endi);	
									} else if (styleattr[a] === "'"){
										starti = a + 1;
										while(1===1){
											a++;
											if (styleattr[a] === "'"){
												endi = a;
												break;
											}
										}
										attrval	=	styleattr.substring(starti+1, endi-1);	
									} else {
										starti = a;
										while(1===1){
											a++;
											if (styleattr[a] === " "){
												endi = a;
												break;
											}
										}
										attrval	=	styleattr.substring(starti+1, endi-1);
										a--;
									}
								} else {
									attrnm	+=	styleattr[a];		
								}
							}		
							so.text		=	sstyle.replace(styleattr,"").replace("</style>","");
							arrstyle.push(so);
							continue;
						} 
						break;
					}
					
					o	=	$U.inHTML(o, textd);
					
					for (var z=arrstyle.length-1,x=-1; z>x; z-=1){
						o.appendChild(arrstyle[z]);
					}
					for (var z=arrscript.length-1,x=-1; z>x; z-=1){
						o.appendChild(arrscript[z]);
					}
					return true;
					
				} finally {
					
					if (!$U.isNull(callback)){
						callback();
					}
					
					var sidx		=	null;
					var eidx		=	null;
					var attrnm	=	null;
					var attrval	=	null;
					var starti	=	null;
					var endi		=	null;
					var sscript	=	null;
					var arrscript	=	null;
					var scriptattr	=	null;
					var so 		=	null;
					var sstyle	=	null;
					var arrstyle	=	null;
					var styleattr	=	null;
				}
				
			}
	
	//-------------------------------------------------------
	//	innerHTML	IE8 등에서 innerHTML이 오류나는 현상 처리
	//-------------------------------------------------------
	,	inHTML	:
			function(robj, shtml){
				
				var rooo, prooo;
				
				try{

					//--**	IE인경우 tbody,COL, COLGROUP, FRAMESET, HEAD, HTML, STYLE, TABLE, TBODY, TFOOT, THEAD, TITLE, TR 이 readonly 인경우 발생
					if (IDV_BROWSER.NAME === "IE" && IDV_BROWSER.VER < 10){
					
						rooo = null;
						prooo = null;
						
						switch(robj.tagName){
						case "TBODY"	:
							rooo	=	document.createElement("tbody");
							prooo	=	robj.parentElement;
							$U.remove(robj);
							rooo.innerHTML	=	"<table><tbody>" + shtml + "</tbody></table>";
							prooo.appendChild(rooo);
							prooo.replaceChild($hD("tbody table tbody",prooo), $hD("tbody",prooo));
							robj	=	rooo;
							break;
						
						default	:
							robj.innerHTML	=	shtml;
							break;
						};
						
						
					} else {
						robj.innerHTML = shtml;
					
					}
					
				} catch(e){
					alert(" [ IMS $U > inHTML ] " + e);
				
				} finally{
					rooo = null;
					prooo = null;
				}
				
				return robj;
			}

	//-------------------------------------------------------
	//	insertHTML	IE8, IE9 등에서  insertAdjacentHTML 처리
	//-------------------------------------------------------
	,	insertHTML	:
			function(sobj, opt, shtml){
				
				if ($U.isNull(sobj)){
					return;
				}
				
				var v=[];
				try{
					//--**	IE 10 이하인 경우 innerHTML 처리 
					if (IDV_BROWSER.NAME === "IE" && IDV_BROWSER.VER < 10){
						
						var snode = this.createElementFromHTML(shtml);
						switch(opt){
						case "beforebegin"	:
						case "beforeend"		:
							document.body.appendChild(snode);
							break;
						case "afterbegin"	:	
						case "beforeend"	:	
							sobj.appendChild(snode);
							break;
						}
						this.remove($hD("#_U_createElementFrom_div"));
						
					} else {
						sobj.insertAdjacentHTML(opt, shtml)
					}
					
				} catch(e){
					alert(" [ IMS $U > insertHTML ] " + e);
				
				} finally{
					v	=	null;
				}
				
			}

	//-------------------------------------------------------
	//	html to node
	//-------------------------------------------------------
	,	createElementFromHTML	:
			function(htmlString) {
			  var div 	=	document.createElement('div');
			  div.id	=	"_U_createElementFrom_div";
			  div.innerHTML = htmlString.trim();
			  return div.firstChild; 
			}	
	
	//-------------------------------------------------------
	//	camel type convert
	//-------------------------------------------------------
	,	UnderToCamel:
			function(str){
				return str.toLowerCase().replace(/(\_[a-z])/g, function(arg){
			        return arg.toUpperCase().replace('_','');
			    });		
			}
	,	CamelToUnder:
			function(str){
			    return str.replace(/([A-Z])/g, function(arg){
			        return "_"+arg.toLowerCase();
			    }).toUpperCase();
			}
	
	//-------------------------------------------------------
	//	object 에서 해당 key 로 맞는 데이타를 찾아 전송
	//-------------------------------------------------------
	,	find:
			function(src,key,val){
				var bv = null;
				for (var zx=0,sooz;sooz=src[zx];zx+=1){
					bv = $U.isNull(sooz[key]) ? $U.get(sooz,key) : sooz[key];
					if ( bv === val){
						return sooz;
					}
				}
				return null;
			}
	
	//-------------------------------------------------------
	//	object 에서 해당 key 로 맞는 데이타를 찾아 전송
	//-------------------------------------------------------
	,	findval:
			function(src,chkval){
				var bv = null;
				for (var zx=0,sooz;sooz=src[zx];zx+=1){
					bv = sooz.value;
					if ( bv === chkval){
						return sooz;
					}
				}
				return null;
			}

	//-------------------------------------------------------
	//	tag remove
	//-------------------------------------------------------
	,	remove:
			function(obj){
				if ($U.isNull(obj)) return;
				if ($U.isNull(obj.parentNode)) return;
				obj.parentNode.removeChild(obj);
			}
	//-------------------------------------------------------
	//	each 구현
	//-------------------------------------------------------
	,	each:
			function(obj,func){
				if ($U.isNull(obj) || obj.length === 0) return;
				for (var za=0,ouop; ouop=obj[za]; za+=1){
					if (func(ouop) === "break"){
						break;
					};
				}
			}
	//-------------------------------------------------------
	//	viewport 
	//-------------------------------------------------------
	,	viewport:
			function(){
				
				var ww,hh;
		  
				try{
					//--** the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
					if (typeof window.innerWidth != 'undefined'){
						ww	= 	window.innerWidth,
						hh 	= 	window.innerHeight
					
					//--** IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
					} else if (	typeof document.documentElement != 'undefined'	
							&& 	typeof document.documentElement.clientWidth != 'undefined' 
							&& 	document.documentElement.clientWidth != 0){
						ww 	= 	document.documentElement.clientWidth,
						hh 	=	document.documentElement.clientHeight
					
					//--**	older versions of IE
					} else {
						ww 	=	document.getElementsByTagName('body')[0].clientWidth,
						hh	= 	document.getElementsByTagName('body')[0].clientHeight		
					}
					
					return {w:ww,h:hh};
					
				} catch(e){
					alert(" [ IMS $U > viewport ] " + e);
				} finally{
					ww	=	null;
					hh	=	null;
				}
			}

	//-------------------------------------------------------
	//	check box value 구하기
	//-------------------------------------------------------
	, 	getcheckvalue:
			function (o){	
				var v	=	[];
				try{
					v.val	=	"";
					v.ooo	=	(typeof o === "string" || typeof o === "STRING") ? $hA("input[name="+o+"]") : o;  
					for (var zx=0,xoo;xoo=v.ooo[zx];zx+=1){
						if (xoo.checked){
							v.val	+=	(v.val === "" ? "" : IMS_config.seperator ) + xoo.value;
						}
					}
					return v.val;
				} catch(e){
					alert("[ $U -> getcheckvalue ]" + e);
				} finally{
					v	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	randow 구하기
	//-------------------------------------------------------
	, 	randowm	:
			function (min,max){
				return Math.floor(Math.random()*(max-min+1)) + min;
			}

	//-------------------------------------------------------
	//	공류일  구하기
	//	--**	서버 ImsURLConnector 이용할것
	//-------------------------------------------------------
	, 	getholiday	:
			function (y,m){
		
				/*
				var xhr = new XMLHttpRequest();
				var url = 'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getSundryDayInfo'; 
				var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+IMS_config.gov_key_holiday; 
				queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent('2015'); 
				queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent('10'); 
				xhr.open('GET', url + queryParams);
				xhr.onreadystatechange = function () {
				    if (this.readyState == 4) {
				        alert('Status: '+this.status+' Headers: '+JSON.stringify(this.getAllResponseHeaders())+' Body: '+this.responseText);
				    }
				};
		
				xhr.send('');		
				
				*/
				
				//--**	has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource
				//--**	오류 발생함 
				//--**	자바 url connector 를 사용하던지 아니면  jsonp 방식을 사용할것
				//--**	공공포탈 api 를 이용하여 공휴일 정보를 구한다
				
				/*
				var v = [];
				try{
					v.p	=	encodeURIComponent("ServiceKey")		+	"="	+	IMS_config.gov_key_holiday
						+	"&"+	encodeURIComponent("solYear") 	+ 	"="	+	encodeURIComponent(y)
						+	"&"+	encodeURIComponent("solMonth")	+ 	"="	+	encodeURIComponent(m);

					var script = document.createElement("script");
				    script.type = "text/javascript";
				    script.src = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getSundryDayInfo?"+ v.p;
				    document.body.appendChild(script);

					
					console.log(v.p);
					//http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getSundryDayInfo?ServiceKey=FkQoD3PimwnQrj6%2F%2F8M%2FFwIQHkAfLf7Wnb2t4pupT6DDBK%2BmU0hVvdyMspHCzg8LbujYynPV7CXP%2BhxbpMz6oA%3D%3D&solYear=2020&solMonth=04
					
					$A.call({url:"http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getSundryDayInfo",param:v.p,ptype:"string"},function(d){
						console.log(d);
					});
					
				} catch(e) 	{ 	alert("[ $U > getholiday ]" + e) 
				} finally	{	v	=	null	}
				*/ 	
			}
	

};	

$U.eventbind(document,"onmousemove", function(e){
	var ev	=	e || window.event;
	var x = 0; // 마우스 포인터의 좌측 위치 
	var y = 0; // 마우스 포인터의 위쪽 위치 
	if ( IDV_BROWSER.IE === "Y" && Number(IDV_BROWSER.VER) < 7 ) { // 인터넷 익스플로러 (ie) 6 이하 버전일 경우 적용될 내용 
		x = ev.offsetX; 
		y = ev.offsetY; 
	} else if ( ev.pageX ) { // pageX & pageY를 사용할 수 있는 브라우저일 경우 
		x = ev.pageX; 
		y = ev.pageY; 
	} else { // 그외 브라우저용 
		x = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		y = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	_MOUSE_POSITION.x	=	x;
	_MOUSE_POSITION.y	=	y;

});
