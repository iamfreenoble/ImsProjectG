/*=================================================================================
 *	파 일 명		: IMS_Cookie.js
 *	작성목적		: Cookie 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.03.31
 *	최종작성일	:
 *	수정내역		:
=================================================================================*/

var CookieEx	=	{
		
		//-------------------------------------------------------
		//		cookie 값 가져오기
		//-------------------------------------------------------
			get :	
				function(cname){
					var name = cname + "=";
				    var decodedCookie = decodeURIComponent(document.cookie);
				    var ca = decodedCookie.split(';');
				    for(var i = 0; i <ca.length; i++) {
				        var c = ca[i];
				        while (c.charAt(0) == ' ') {
				            c = c.substring(1);
				        }
				        if (c.indexOf(name) == 0) {
				            return c.substring(name.length, c.length);
				        }
				    }
				    return "";
					/*var nm	=	name + "=";
					var ca 	=	document.cookie.split(";");
					var c	=	"";
					for (var i=0,j=ca.length; i<j; i+=1){
						c	=	ca[i].trim();
						if (c.indexOf(nm) > 0){
							return c.substring(nm.length, c.length);
						};
					}*/
				}
	
		//-------------------------------------------------------
		//		cookie 값 세팅하기
		//-------------------------------------------------------
		,	set :	
				function(cname, cvalue, secure, expire ){
					var d = new Date();
					d.setTime(d.getTime() + ($U.isNull(expire) ? (24*365*60*60*1000) : Number(expire) * 1000 ));	//	1년
					var expires = "expires="+ d.toUTCString();
					document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/;" + (secure === true ? ";secure;" : "");		
					
					
					//var expiry	=	new Date((new Date()).getTime() + (24*365*5) * 60 * 60 * 1000);	//	5년
					//document.cookie	=	name	+	"="		+	value	+	";path/;expires="	+	expiry.toGMTString()		+	(secure === true ? ";secure;" : ";");
				}

		//-------------------------------------------------------
		//		cookie 값 삭제하기
		//-------------------------------------------------------
		,	del :	
				function(cname, secure){
					
					var d = new Date();
					d.setTime(d.getTime() - (48*60*60*1000));	//	-2 일전
					var expires = "expires="+ d.toUTCString();
					document.cookie = cname + "=;" + expires + ";path=/;" + (secure === true ? ";secure;" : "");		

					//var expiry	=	new Date((new Date()).getTime() - (48 * 60 * 60 * 1000));	//	2일전
					//document.cookie	=	name	+	"="		
					//						+	";expires="	+	expiry.toGMTString()
					//						+	($U.isNull(path) 		? "" 	: ";path=" 		+ path 		)
					//						+	($U.isNull(domain) 	? ""	: ";domain=" 	+ domain 	)
					//						+	($U.isNull(secure) 	? ";" 	: ";secure;" 	);
											
				}

};