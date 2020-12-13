/*=================================================================================
 *	파 일 명		: IMS_XR_LocalStorage.js
 *	작성목적		: HTML5 localStorage 확장 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2017.06
 *	최종작성일	:
 *	수정내역		:
=================================================================================*/

var localStorageEx	=	{
		
		//-------------------------------------------------------
		//		가져오기
		//-------------------------------------------------------
			get :	
				function(name){
					try{
						if (window.content.localStorage){
							return window.content.localStorage.getItem(name); 
						};
					} catch(e){
					}
					try{
						if (window.localStorage){
							return window.localStorage.getItem(name); 
						};
					} catch(e){
					}
					try{
						if (localStorage){
							return localStorage.getItem(name); 
						};
					} catch(e){
					}
					try{
						if (window["localStorage"]){
							return window["localStorage"].getItem(name); 
						};
					} catch(e){
					}
					return null;
				}
	
		//-------------------------------------------------------
		//		세팅하기
		//-------------------------------------------------------
		,	set :	
				function(name, value){
					try{
						if (window.content.localStorage){
							window.content.localStorage.setItem(name,value); 
							window.content.localStorage[name] = value; 
							return;
						};
					} catch(e){
					}
					try{
						if (window.localStorage){
							window.localStorage.setItem(name,value); 
							window.localStorage[name] = value; 
							return;
						};
					} catch(e){
					}
					try{
						if (localStorage){
							localStorage.setItem(name,value); 
							localStorage[name] = value; 
							return;
						};
					} catch(e){
					}
					try{
						if (window["localStorage"]){
							window["localStorage"].setItem(name,value); 
							window["localStorage"][name] = value; 
							return;
						};
					} catch(e){
						
					}
				}

		//-------------------------------------------------------
		//		삭제하기
		//-------------------------------------------------------
		,	del :	
				function(name){
					localStorageX.set(name,null); 
				}

};