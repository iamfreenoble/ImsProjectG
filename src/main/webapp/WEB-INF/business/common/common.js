/*=================================================================================
 *	[ description ]	
 *		-	2018.11.02	이상준 	IRB 공통 스크립트
=================================================================================*/

//-------------------------------------------
//--**	placeholder set...
function gfnPlaceholderSet(fnm){
	$U.each($hA("input",$hD("form[name="+fnm+"]")), function(o){
		switch($U.get(o,"type")){
		case "tel" :
			$U.set(o,"placeholder", "ex) 010-4454-4002");
			break;
		case "email" :
			$U.set(o,"placeholder", "ex) iamsky@irb.net");
			break;
		}
	});
}

//-------------------------------------------
//--**	radio 박스인 경우 값 가져오기
function gfnGetRadiobox(rn){
	var robj = $hA("input[name="+rn+"]");
	for (var zz=0,rooo; rooo=robj[zz]; zz+=1){
		if (rooo.checked){
			return rooo.value;
		}
	}
	return null;
}


//-------------------------------------------
//--**	selectbox set...
//--**	obj		->	target object 
//--**	tp		->	irb_code_tbl 의 code_gubun
//--**	dval	->	초기 선택할 값
function gfnSelectboxSet(obj,tp,dval){
	$A.call({url:"/code/codelist.do",ptype:"string",param:"gubun="+tp},function(d){
		$U.selboxchange(obj, d, dval, false);
	});
}

//-------------------------------------------
//--**	content 태그 변경...
//--**	c		->	contents
function gfnHtmlTagToString(c){
	var r = c; // decodeURIComponent(c).replace(/\%24/g,"%");
	r = r.replace(/\&amp;/g, "＆");
	r = r.replace(/&lt;/g,	"〈");
	r = r.replace(/&gt;/g,	"〉");
	return r;
}
function gfnTagToString(c){
	var r = c; // decodeURIComponent(c).replace(/\%24/g,"%");
	r = r.replace(/\&/g, "[^AMP^]");
	r = r.replace(/\%/g, "[^PERCENT^]");
	return r;
}
function gfnChangeStringToTag(c){
	var r = c; // decodeURIComponent(c).replace(/\%24/g,"%");
	r = r.replace(/&lt;/g,	"<");
	r = r.replace(/&gt;/g,	">");
	r = r.replace(/〈/g, "<");
	r = r.replace(/〉/g, ">");
	r = r.replace(/\[\^AMP\^\]/g, "&");
	r = r.replace(/\[\^PERCENT\^\]/g, "%");
	return r;
}

//-------------------------------------------
//--**	tab 처리...
//--**	obj 	->	클릭한 탭
//--**	opt		->	탭 클릭시 open 할 화면 index
function gfnOpentab(obj, opt, callback){
	$U.each($hA("button", obj.parentElement), function(o){
		if (o.className !== "none"){
			$U.set(o,"class",(o === obj ? "on" : ""));
		}
	});
	var cnt = 1;
	var ooo = obj.parentElement.nextSibling;
	while ( ooo = ooo.nextSibling ){
		if ($U.isNull(ooo.tagName)) continue;
		if ($U.get(ooo, "name") === "nonetab") continue;	//	예외
		$U.set(ooo, "class", cnt === opt ? "block" : "none" ); 
		cnt++;
	}
	
	//--**	callback이 있는 경우 수행
	if (!$U.isNull(callback)){
		callback();
	}
}

//-------------------------------------------
//--**	알림 처리...
//--**	obj		->	timer 처리할 object
//--**	callback ->	callback function
var _ALRIM_INTERVAL	=	null;
var _ALRIM_TEMP		=	"<a href=\"#\" onclick=\"{0}('{1}','{2}','{3}','{4}')\">{5}[ {6} ]</a>&nbsp;<i class=\"far fa-trash-alt\" style=\"cursor:pointer\" onclick=\"gfnAlrimDelete('{7}')\"></i><br>";
function gfnAlirim(obj, callback){
	clearInterval(_ALRIM_INTERVAL);
	gfnAlirimSetInterval(obj, callback);
}
function gfnAlirimSetInterval(obj,callback){
	_ALRIM_INTERVAL	=	setInterval(function(){
		
		var v = $U.get(obj, "val");
		if (v === "0" || v === 0){
			v	=	600 ;
			gfnAlrimCallback(callback)
		} else {
			v	=	v - 1;
		}
		$U.set(obj, "val", v );
		var m = Math.floor(v / 60) + " 분 ";
		var s = v % 60 + " 초";
		obj.innerHTML = m + s ;
		
	}, 1000);
}
function gfnAlirimSet(obj){
	var ooo = $hA("span", obj.parentNode||obj.parentElement)[0];
	$U.set(ooo, "val", 2 )
}
function gfnAlrimCallback(callback){
	$A.call({url:"/messageque/listbyuser.do", ptype:"string", param:"user_id=" },function(d){
		if (!$U.isNull(callback)){
			callback(d);
		}
	});
}
function gfnAlrimDelete(id){
	$A.call({url:"/messageque/remove.do", ptype:"json", param:"id=" + id },function(d){
		gfnAlirimSet($hD("#alrim_refresh"));
	});
}

//-------------------------------------------
//--**	div 내 데이타 sync
//--**	did		->	div id 
//--**	d 		->	data	
function gfnDivInDataSync(did, d){
	var foo = $hLD("#"+did);
	var doo = $hLA("div", foo);
	var nm	=	"";
	$U.each(doo, function(ooo){
		if (!$U.isNull($U.get(ooo,"id"))){
			nm	=	$U.get(ooo,"id");
			if (nm !== "selectUserFrame"){
				ooo.innerHTML = $U.isNull(d[nm]) ? "" : d[nm];
			}
		} 
	});
}

//--**	textarea keyup에 따라 화면 높이 자동 조절
function gfnTextareaAutoheight(){
	$U.each($hA("textarea"),function(o){
		$U.eventbind(o,"onkeyup",function(e){
			var ev 	= 	(window.event || e) ;
			var too	=	(ev.target||ev.srcElement);
			too.style.height =  "10px";
			if (too.offsetHeight < too.scrollHeight){
				too.style.height = too.scrollHeight + "px";
			}
		});
	});
	setTimeout(function(){
		$U.each($hA("textarea"),function(o){
			var too	= o;
			too.style.height =  "10px";
			if (too.offsetHeight < too.scrollHeight){
				too.style.height = too.scrollHeight + "px";
			}
		});
	},3000);
}

//--**	buttom template
var gvButtonTemp	=	"<span class=\"{2}\" {3} onclick=\"{0}\">{1}</span>";
