/*=================================================================================
 *	파 일 명	: IMS_$V.js
 *	작성목적	: validate  
 *	작 성 자	: 이상준
 *	Description	
 *				기본적으로 form 정보의 인자중 커스텀 태그를 사용하여 검증
 *				인자	:	form
 *				태그	:	validate	
 *							check 	-> 	검증 여부 true인경우에만 검증 ( 사용안함 )
 *							type	->	notnull, max, min, number, calendar, notnumber 등으로 사용 , 로 멀티 처리
 *							length 	->	max, min 시    		
 *						
 *	수정내역	:
=================================================================================*/


var $V = {

		//-------------------------------------------------------
		//	validate 수행 
		//-------------------------------------------------------
		validate	:	
			function(ooo){
				var v=[];
				
				try{
					v.form 	= 	typeof(ooo) === "string" ? $hD("form[name="+ooo+"]") : ooo;
					
					//--**	검증
					if ($U.isNull(v.form)){
						alert("검증 대상이 NULL입니다.검증대상을 확인하세요\r\nThe verification target is NULL. Check the verification target.");
						return false;
					}
					
					//--**	validate 태그가 있는 경우 validate 수행
					v.t	=	$hA("*",v.form);
					for (var i=0,ozooo; ozooo=v.t[i]; i+=1){
						if ($U.isNull($U.get(ozooo,"validate"))) continue;	//--**	검증여부 확인
						if (!this.validatecheck(ozooo)){
							return false;
						}
					}
					return true;
					
				} catch(e){
					alert("[ $V > validate ]" + e);
				} finally {
					v	=	null;
				}
			}

	//-------------------------------------------------------
	//	validate check 수행
	//-------------------------------------------------------
	,	validatecheck	:	
			function(o){
				var t,v,vv,tp,oform,otype,regExp,vtitle;
				
				try{
					
					vv	=	$U.get(o,"validate");
					vv	=	vv.replace(/{/g,"{\"").replace(/:/g,"\":\"").replace(/,/g,"\",\"").replace(/}/g,"\"}");
					vv	=	JSON.parse(vv);
					
					//--**	타입별로 값을 가져온다
					tp = $U.get(o,"type");
					switch(o.tagName){
					case "INPUT"  :
						
						switch(tp){
						case "text"		:
						case "hidden"	:	
						case "password"	:	
						case "tel"		:	
						case "email"	:	
						case "number"	:	
						case "date"		:	
							v	=	o.value;
							break;
						case "checkbox"	:	
						case "radio"	:
							v	=	$U.isNull($hD("input[name="+o.name+"]:checked")) ? "" : $hD("input[name="+o.name+"]:checked").value;
							break;
						}
						break;
					case "TEXTAREA"  :
						v	=	o.value;
						break;
					case "SELECT"  :
						v	=	o.options[o.selectedIndex].value;
						break;
					case "DIV"  :
						v	=	o.innerHTML;
						break;
					}
					
					//--**	validate 분석
					otype 	=	vv.type.toLowerCase().split("&");
					vtitle	=	vv.title ;
					for (var aaa=0,tooo; tooo=otype[aaa]; aaa+=1){
						switch(tooo){
						case "notnull"	:	//	null 여부 검증	
							if ($U.isNullOrEmpty(v)){
								alert("[ "+vtitle+" ] 값이 널이거나 빈값일수 없습니다\r\nThe value of [ "+vtitle+" ] cannot be null or empty.");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						case "max"	:	//	최대값
							if (vv.length > v.length){
								alert("[ "+vtitle+" ] 값은 최대값이  "+vv.length+" 입니다.\r\nThe value of [ "+vtitle+" ] has a maximum value of "+vv.length+".");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						case "min"	:	//	최소값
							if (vv.length < v.length){
								alert("[ "+vtitle+" ] 값은 최소값이  "+vv.length+" 입니다.\r\nThe value of [ "+vtitle+" ] has a minimum value of "+vv.length+".");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						case "number"	:	//	숫자
							if (!$U.isNumber(v)){
								alert("[ "+vtitle+" ] 값은 숫자여야 합니다\r\nThe value of [ "+vtitle+" ] must be numeric.");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						}
					}
					
					//--**	특수 타입인 경우 validate 체크
					switch(o.tagName){
					case "INPUT"  :
						switch(tp){
						case "tel"		:		
							regExp	=	/^\d{2,3}-\d{3,4}-\d{4}$/;	//	일반전화번호 	.. 휴대폰인 경우 /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
							if (!regExp.test(v)){
								alert("["+vtitle+" ] 전화번호 양식이 틀립니다.");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						case "email"	:		
							regExp	=	/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; 
							if (!regExp.test(v)){
								alert("["+vtitle+" ] 이메일 양식이 틀립니다.");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						case "number"	:	
							regExp	=	/^[0-9]+$/;
							if (!regExp.test(v)){
								alert("["+vtitle+" ] 숫자만 입력되어야 합니다.");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						case "date"		:		
							regExp	=	/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
							if (!regExp.test(v)){
								alert("["+vtitle+" ] 날자 형식이 틀립니다.");
								o.focus();
								try{ o.select(); } catch(e){};
								try{ o.parentElement.scrollIntoView(); } catch(e){};
								return false;
							}
							break;
						}
						break;
					}
					
					return true;
					
				} catch(e){
					alert("[ $V > validate check]" + e);
				} finally {
					t	=	null;
					v	=	null;
					vv	=	null;
					tp	=	null;
					oform	=	null;
					otype	=	null;
					regExp	=	null;
					vtitle	=	null;
				}
			
			}

	//-------------------------------------------------------
	//	validate check 를 단독으로 수행시
	//-------------------------------------------------------
	,	validatecheckext	:
			function(ptitle,pobj){
				
				//--**	대상이 널인경우 패스
				if ($U.isNull(pobj)){	
					return true;
				}
				$U.set(pobj,"validate","{title:"+ptitle+",type:notnull}");
				var vreturn = this.validatecheck(pobj);
				$U.del(pobj,"validate");
				return vreturn; 
				
			}
	
	
}
