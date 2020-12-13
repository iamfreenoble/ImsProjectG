/*=================================================================================
 *	파 일 명	: IMS_Z_EventBinding.js
 *	작성목적	: 영구적인 이벤트 처리 공통함수 
 *	작 성 자	: 이상준
 *	수정내역	:
=================================================================================*/
$U.ready(document,function(){
	XEvent.bind();
})

var XEvent = {
		
	//-------------------------------------------------------
	//	all bind
	//-------------------------------------------------------
		bind :
			function(){
				this._checkbox();
				this._radio();
			}

	//-------------------------------------------------------
	//	checkbox
	//-------------------------------------------------------
	,	_checkbox :
			function(){
				$U.eventbind($hA("input[type=checkbox]"),"onchange",function(){ this.checked === true ? $U.set(this,"checked","checked") : $U.del(this,"checked"); });
			}	
	
	//-------------------------------------------------------
	//	radio
	//-------------------------------------------------------
	,	_radio :
			function(){
				$U.eventbind($hA("input[type=radio]"),"onchange",function(){ ( this.checked === true ? $U.set(this,"checked","checked") : $U.del(this,"checked")); });
			}	
		
}
