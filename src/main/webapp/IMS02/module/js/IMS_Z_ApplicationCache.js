/*=================================================================================
 *	파 일 명		: IMS_Z_ApplicationCache.js
 *	작성목적		: Application cache 처리
 *	작 성 자		: 이상준
 *	최초작성일		: 2020.03.11
 *	최종작성일		:
 *	수정내역		:
 *				2020-03-11		이상준		최초 작성
 *				
=================================================================================*/

try{
	
	window.addEventListener('load', function(e) {
		if (!window.applicationCache && window.applicationCache !== undefined){
			window.applicationCache.addEventListener('updateready', function(e) {
				if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
					window.applicationCache.swapCache();
		            window.location.reload();
		        } 
			},false);
		}
	},false);
	
} catch(e){
	
}
