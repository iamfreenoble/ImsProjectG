/*=================================================================================
 *	파 일 명		: IMS_Grid_extend.js
 *	작성목적	: Grid 사용자 처리 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.08.23
 *	최종작성일	:
 *	수정내역		:
 *				2014-03-28		이상준		함수 추가 및 수정
=================================================================================*/

//-------------------------------------------------------
//		Grid 확장
//-------------------------------------------------------
var Gridext	=	{
		
	//-------------------------------------------------------
	//	데이타 처리시나 그리드 로딩시 	
	//-------------------------------------------------------
		loading	:	
			function(iOpt){
				switch(iOpt){
					case 1 :	//	load start
						LoadingControl.start();
						break;
					case 2 :	//	load 완료	
						LoadingControl.end();
						break;
				}
			}

	//-------------------------------------------------------
	//	HEADER 가 chaeckbox 인 경우 check 처리 	
	//-------------------------------------------------------
	,	headChboxClick	:
			function(obj){
				var pid		=	$U.get(obj.parentElement,"pid");
				var icidx	=	Number($U.get(obj,"CHECKINDEX"));
				var vcolid	= 	$U.get(pid, "HEADID").split(",")[icidx];	
				var data	=	Griddata.dataset.get(pid);
				for (var h=0,j= data.rows.length; h<j; h+=1){
					Griddata.update(pid,h+1,icidx, $U.nvl(data.rows[h][vcolid],""),obj.checked);
				}
			}
	
	//-------------------------------------------------------
	//	mode 변경
	//-------------------------------------------------------
	,	modechange	:
			function(id,vmode){
				$U.set($D(id),"MODE",vmode);
				Grid.reload(id);
			}
	
	//-------------------------------------------------------
	//	mode 변경	->	cell 
	//		데이타 자체에 edit 모드를 담을수 없으므로
	//		edit 불가 데이타 버퍼를 이용하여 처리한다.
	//		grid 가 edit 이고 셀이 edit 인경우에만 처리 가능
	//-------------------------------------------------------
	,	cellmodechange	:
			function(vid,vmode,ridx,cidx){
				Grid.noeditcell.set(vid+"="+ridx+"="+cidx,vmode);
			}
	
	//-------------------------------------------------------
	//	colname get
	//-------------------------------------------------------
	,	getcolname	:
			function(id,icellidx){
				return $U.get(id, "HEADID").split(",")[icellidx];	
			}
	
	//-------------------------------------------------------
	//	colindex get
	//-------------------------------------------------------
	,	getcolindex	:
			function(id,cellname){
				return $U.get(id, "HEADID").split(",").match(cellname);
			}
	
	//-------------------------------------------------------
	//	Row 추가 	
	//		id	:	추가할 그리드
	//		idx	:	추가할 cell pos null 이면 맨 처음에 추가한다.
	//-------------------------------------------------------
	,	rowadd	:
			function(id,idx,callback,rd){
				var data 		= 	Griddata.dataset.get(id);
				var emptyData	=	{};
				var arrHead		=	$U.get(id, "HEADID").split(",");
				for (var i=0,j=arrHead.length; i<j; i+=1){
					emptyData[arrHead[i]] = arrHead[i] === "STATUS" ? "A" : ( $U.isNull(rd) ? "" : $U.nvl(rd[arrHead[i]],""));
				}
				if ($U.isNull(idx)){
					if ($U.isNull(data)){
						data	= {"records":0, "rows":[emptyData]};
					} else {
						data.rows.unshift(emptyData);
					}
				} else {
					data.rows.splice(idx,0,emptyData);
				}
				data.records = data.records + 1;
				Griddata.dataset.set(id,data);
				Grid.reload(id);
				if (!$U.isNull(callback)){
					callback(id,idx);
				}
			}
	
	//-------------------------------------------------------
	//	Row 삭제
	//-------------------------------------------------------
	,	rowdel	:
			function(id,idx,callback){
				var data	=	Griddata.dataset.get(id);
				var deldata	=	Griddata.deldataset.get(id);
				if (deldata === null){
					Griddata.deldataset.set(id, {rows:[]});
					deldata	=	Griddata.deldataset.get(id);
				}
				if ($U.isNull(idx)){
					data.rows[0].STATUS = "D";
					deldata.rows.push(data.rows[0]);
					data.rows.shift();
				} else {
					data.rows[idx].STATUS = "D";
					deldata.rows.push(data.rows[idx]);
					data.rows.splice(idx,1);
				}
				data.records = data.records - 1;
				Griddata.dataset.set(id,data);
				Grid.reload(id);
				if (!$U.isNull(callback)){
					callback(id,idx);
				}
			}

	//-------------------------------------------------------
	//	to excel
	//-------------------------------------------------------
	,	toexcel	:
			function(id,t){
				var p,f,title,data,header,headerrowcnt,input_t,input_d,input_h,input_hc;
				try{
					title	=	encodeURIComponent(t)
					data	=	encodeURIComponent(JSON.stringify(Griddata.dataset.get(id)))
					header	=	encodeURIComponent($U.get($hD("#"+id),"HEADER"));
					headerrowcnt =	encodeURIComponent($U.get($hD("#"+id),"HEADERROWCNT"));
					
					f	=	$hD("#_IMS_GRID_TOEXCEL_FORM");
					
					if ($U.isNull(f)){
						f	=	document.createElement("form");
						f.action	=	"/ImsExcel";
						f.method	=	"post";
						f.target	=	"_self";
						f.id		=	"_IMS_GRID_TOEXCEL_FORM";
						
						input_t			=	document.createElement("input");
						input_t.type	=	"hidden";
						input_t.name	=	"_IMS_GRID_TOEXCEL_TITLE";
						input_t.id		=	"_IMS_GRID_TOEXCEL_TITLE";
						
						input_d			=	document.createElement("input");
						input_d.type	=	"hidden";
						input_d.name	=	"_IMS_GRID_TOEXCEL_DATA";
						input_d.id		=	"_IMS_GRID_TOEXCEL_DATA";
						
						input_h			=	document.createElement("input");
						input_h.type	=	"hidden";
						input_h.name	=	"_IMS_GRID_TOEXCEL_HEADER";
						input_h.id		=	"_IMS_GRID_TOEXCEL_HEADER";
						
						input_hc		=	document.createElement("input");
						input_hc.type	=	"hidden";
						input_hc.name	=	"_IMS_GRID_TOEXCEL_HEADER_ROWCNT";
						input_hc.id		=	"_IMS_GRID_TOEXCEL_HEADER_ROWCNT";
						
						f.appendChild(input_t);						
						f.appendChild(input_d);						
						f.appendChild(input_h);						
						f.appendChild(input_hc);						
						
						document.body.appendChild(f);
						
					}
					
					$hD("#_IMS_GRID_TOEXCEL_TITLE").value	=	title;
					$hD("#_IMS_GRID_TOEXCEL_DATA").value	=	data;
					$hD("#_IMS_GRID_TOEXCEL_HEADER").value	=	header;
					$hD("#_IMS_GRID_TOEXCEL_HEADER_ROWCNT").value	=	headerrowcnt;
					
					f.submit();
					
				} catch(e){
					alert("[GRIDEXT TOEXCEL] " + e);
				} finally {
					p	=	null;
					f	=	null;
					title	=	null;
					data	=	null;
					header	=	null;
					headerrowcnt	=	null;
					input_t	=	null;
					input_d	=	null;
					input_h	=	null;
					input_hc	=	null;
				}
			}
};