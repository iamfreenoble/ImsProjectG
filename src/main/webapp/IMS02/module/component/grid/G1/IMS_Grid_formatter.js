/*=================================================================================
 *	파 일 명		: IMS_Grid_formatter.js
 *	작성목적		: Grid 사용자 처리 함수 - 포맷터 관련
 *	작 성 자		: 이상준
 *	최초작성일	: 2016.10.15
 *	최종작성일	:
 *	수정내역		:
=================================================================================*/

//-------------------------------------------------------
//		Grid formatter
//-------------------------------------------------------
var Gridformatter	=	{
		
	//-------------------------------------------------------
	//	포맷 지정
	//-------------------------------------------------------
		formatter	:
			function(val,tp){
				var r;
				try{
					switch(tp){
						case "numeric" 	: r	=	this.tonumeric(val);	break;	
						case "calendar" : r	=	this.tocalendar(val);	break;	
						default :	r	=	val;
					}
					return r;
				} finally {
					r	=	null;
				}
			}
	//-------------------------------------------------------
	//	숫자 형식 포맷
	//-------------------------------------------------------
	,	tonumeric	:
			function(val,iRow,iCell,vCellNm){
				if (val.toString().indexOf("groupcss") > -1){
					return val;
				}
				return ( $U.isNum(Number(val)) ? $U.tocurrency(Number(val)) : $U.tocurrency(Number(val.replace(/,/g,""))));
			}
	//-------------------------------------------------------
	//	날자 형식 포맷
	//-------------------------------------------------------
	,	tocalendar	:
			function(val,iRow,iCell,vCellNm){
				if (val.toString().indexOf("groupcss") > -1){
					return val;
				}
				if ($U.isNum(val)){
					val = val.toString();
					return 		val.substring(0,4) + IMS_config.calendardiv	
							+ 	val.substring(4,6) + IMS_config.calendardiv	
							+	val.substring(6,8);	
				} else {
					val = val.toString().replace(IMS_config.calendardiv,"").replace(IMS_config.calendardiv,"");
					return 		val.substring(0,4) + IMS_config.calendardiv	
							+ 	val.substring(4,6) + IMS_config.calendardiv	
							+	val.substring(6,8);	
					
				}
			}
	
};

//	formatter 선언
function Gridformatter_tonumeric(val,iRow,iCell,vCellNm){
	return Gridformatter.tonumeric(val,iRow,iCell,vCellNm);
}
function Gridformatter_tocalendar(val,iRow,iCell,vCellNm){
	return Gridformatter.tocalendar(val,iRow,iCell,vCellNm);
}