package ims.extend;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import ims.basic.bean.ImsProperty;
import ims.common.Util;

/**
 * 
 * @author : iamfreeguy-LiSangjun
 * @description G2 그리드 엑셀 다운로드
 *
 */
public class ImsExcel extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public ImsExcel() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doPost(request, response);

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// header,headergroup,data,title setting
		String header		=	URLDecoder.decode((String)request.getParameter("_IMS_GRID_TOEXCEL_HEADER"), "UTF-8");
		String headergroup	=	URLDecoder.decode(request.getParameter("_IMS_GRID_TOEXCEL_HEADERGROUP"),	"UTF-8");
		String title 		= 	URLDecoder.decode(request.getParameter("_IMS_GRID_TOEXCEL_TITLE"), 			"UTF-8");
		String headerrowcnt =	URLDecoder.decode(request.getParameter("_IMS_GRID_TOEXCEL_HEADER_ROWCNT"), 	"UTF-8");
		String sdata 		= 	request.getParameter("_IMS_GRID_TOEXCEL_DATA");
		String surl 		= 	request.getParameter("_IMS_GRID_TOEXCEL_URL");
		String sparam 		= 	request.getParameter("_IMS_GRID_TOEXCEL_PARAM");
		String sfirst 		= 	request.getParameter("_IMS_GRID_TOEXCEL_FIRST_LINE");
		String slast 		= 	request.getParameter("_IMS_GRID_TOEXCEL_LAST_LINE");
		String spage		=	slast;
		String ssort 		= 	request.getParameter("_IMS_GRID_TOEXCEL_SORT");
		String sfilter 		= 	request.getParameter("_IMS_GRID_TOEXCEL_FILTER");
		String skeycheck	= 	request.getParameter("_IMS_GRID_TOEXCEL_KEYCHECK");
		
		sdata	= 	sdata	== null ? 	null : URLDecoder.decode(sdata, 	"UTF-8");
		surl 	= 	surl 	== null ?	null : URLDecoder.decode(surl,		"UTF-8");
		sparam 	= 	sparam 	== null ?	null : URLDecoder.decode(sparam,	"UTF-8");
		sfirst 	= 	sfirst 	== null ?	null : URLDecoder.decode(sfirst,	"UTF-8");
		slast 	= 	slast 	== null ?	null : URLDecoder.decode(slast,		"UTF-8");
		sfirst	=	sfirst 	== null ?	null : Integer.toString(Integer.parseInt(sfirst) - 1); 
		spage	=	slast 	== null ?	null : Integer.toString(Integer.parseInt(slast) - Integer.parseInt(sfirst)); 
		ssort 	= 	ssort 	== null ?	null : URLDecoder.decode(ssort,		"UTF-8");
		sfilter	= 	sfilter	== null ?	null : URLDecoder.decode(sfilter,	"UTF-8");
		skeycheck = skeycheck == null ?	null : URLDecoder.decode(skeycheck,	"UTF-8");
		
		// --** 타이틀 엑셀 사용불가 특수 문자 변경 처리
		// --** :,\,/,?,*,[,]'
		String regex = ".*[\\[\\][:]\\\\/?[*]'].*";
		if (title.matches(regex)) {
			title = title.replaceAll("[\\\\[\\\\][:]\\\\\\\\/?[*]']", "");
		}

		// --** 타이틀 만들기 id + 날자 + 시간
		String sf = "yyyy-MM-dd HHmmss";
		SimpleDateFormat formatter = new SimpleDateFormat(sf);
		title = title + "_" + formatter.format(new Date());

		// --** 헤더 맵
		JSONArray hjson = getJSONObject(header);
		JSONArray hgjson = getJSONObject(headergroup);

		JSONObject data	=	null;
		// data parsing
		if (sdata == null) {
			
			JSONObject result	=	null;
			ImsURLConnector iuc =	new ImsURLConnector();
			try {
				iuc.setUrl(ImsProperty.getInstance().getProperty("IMS.G2.url") + surl);
				HashMap<String,String> pmap = new HashMap<String,String>();
				if (!"".equals(sparam)) {
					String[] sparams = sparam.split("&");
					for (String sp : sparams) {
						String[] ssp = sp.split("=");
						pmap.put(ssp[0],(ssp.length == 2 ? ssp[1] : ""));
					}
				}
				pmap.put("rowFirst",	sfirst);
				pmap.put("rowLast",		slast);
				pmap.put("pageRowCnt",	spage);
				pmap.put("sort",		ssort);
				pmap.put("filter",		sfilter);
				pmap.put("keycheck",	skeycheck);
				HttpSession session = request.getSession(false);
				if (session != null) {

					// --** 세션 attribute 세팅
					String sKey = "";
					Object o = null;
					Enumeration<String> ie = session.getAttributeNames();
					while (ie.hasMoreElements()) {
						sKey = ie.nextElement().toString();
						// --** 이미 맵에 정보가 있는 경우 Skip
						if (pmap.get(sKey) == null) {
							o = session.getAttribute(sKey);
							if (o instanceof Integer) {
								pmap.put(sKey, Integer.toString((int)o));
							} else if (o instanceof String) {
								pmap.put(sKey, (String)o);
							}	
						}
					}

				}
				
				iuc.open();
				result = (JSONObject)iuc.run(pmap);
				
			} catch (Exception e) {
				throw new ServletException("Ims Excel URLConnector ERROR !!!");
				
			} finally {
				iuc.close();
			}
			
			data	=	result;
			
		} else {
			Object od = JSONValue.parse(sdata);
			data = (JSONObject) od;
			
		}
		
		Workbook wb = null;

		// Excel Create
		try {
			wb = new XSSFWorkbook(); // Excel 2007 이상
			Sheet s = wb.createSheet(title);

			// header style 선언
			Font headerfont = wb.createFont();
			headerfont.setBold(true);
			headerfont.setFontHeightInPoints((short) 12);
			CellStyle headerstyle = wb.createCellStyle();
			headerstyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
			headerstyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			headerstyle.setBorderTop(BorderStyle.MEDIUM);
			headerstyle.setBorderRight(BorderStyle.MEDIUM);
			headerstyle.setBorderBottom(BorderStyle.MEDIUM);
			headerstyle.setBorderLeft(BorderStyle.MEDIUM);
			headerstyle.setTopBorderColor(HSSFColor.HSSFColorPredefined.BLACK.getIndex());
			headerstyle.setRightBorderColor(HSSFColor.HSSFColorPredefined.BLACK.getIndex());
			headerstyle.setBottomBorderColor(HSSFColor.HSSFColorPredefined.BLACK.getIndex());
			headerstyle.setLeftBorderColor(HSSFColor.HSSFColorPredefined.BLACK.getIndex());
			headerstyle.setAlignment(HorizontalAlignment.CENTER);
			headerstyle.setVerticalAlignment(VerticalAlignment.CENTER);
			headerstyle.setFont(headerfont);
			headerstyle.setWrapText(true); // text wrap

			// Header
			short c = 0;
			short r = 0;
			Cell cell = null;
			Row row = null;

			// --** FONT 선언
			Font cellfont = wb.createFont();
			cellfont.setBold(false);
			cellfont.setFontHeightInPoints((short) 10);

			// --** Cell Style
			CellStyle cellstyle = wb.createCellStyle();
			cellstyle.setBorderTop(BorderStyle.THIN);
			cellstyle.setBorderRight(BorderStyle.THIN);
			cellstyle.setBorderBottom(BorderStyle.THIN);
			cellstyle.setBorderLeft(BorderStyle.THIN);
			cellstyle.setAlignment(HorizontalAlignment.CENTER);
			cellstyle.setVerticalAlignment(VerticalAlignment.CENTER);
			cellstyle.setFont(cellfont);

			CellStyle cellstyleL = wb.createCellStyle(); // --** alignment left
			CellStyle cellstyleR = wb.createCellStyle(); // --** alignment right

			cellstyleL.cloneStyleFrom(cellstyle);
			cellstyleL.setAlignment(HorizontalAlignment.LEFT);
			cellstyleR.cloneStyleFrom(cellstyle);
			cellstyleR.setAlignment(HorizontalAlignment.RIGHT);

			row = s.createRow(r++);

			// --** HEADER
			if ("1".equals(headerrowcnt)) {
				c = 0;
				row = s.createRow(r++);
				for (int z = 0; z < hjson.size(); z++) {
					JSONObject map = (JSONObject) hjson.get(z);
					if ("Y".equals(map.get("hiddenYN")))
						continue;
					cell = row.createCell(c++);
					cell.setCellStyle(headerstyle);
					cell.setCellValue(map.get("title").toString());
				}

			} else {

				for (int pp = 0; pp < Integer.parseInt(headerrowcnt); pp++) {
					c = 0;
					row = s.createRow(r++);
					for (int z = 0; z < hjson.size(); z++) {
						JSONObject map = (JSONObject) hjson.get(z);
						if ("Y".equals(map.get("hiddenYN")))
							continue;
						cell = row.createCell(c++);
						cell.setCellStyle(headerstyle);
						cell.setCellValue(map.get("title").toString());
					}
				}

				// --** 헤더 병합
				int rstart = r - Integer.parseInt(headerrowcnt);
				int frow = -1;
				int erow = -1;
				int fcell = -1;
				int ecell = -1;
				Cell cell2 = null;
				Row row2 = null;

				for (int z = 0; z < hgjson.size(); z++) {
					JSONObject map = (JSONObject) hgjson.get(z);
					frow = Integer.parseInt(map.get("row").toString()) + rstart;
					erow = frow + (map.get("rowspan") == null ? 0 : Integer.parseInt(map.get("rowspan").toString()));
					fcell = Integer.parseInt(map.get("cell").toString());
					ecell = fcell - 1
							+ (map.get("colspan") == null ? 0 : Integer.parseInt(map.get("colspan").toString()));
					row2 = s.getRow(frow);
					cell2 = row2.getCell(fcell);
					cell2.setCellValue(Util.NVL(map.get("title"), ""));
					s.addMergedRegion(new CellRangeAddress(frow, erow, fcell, ecell));
				}

				// --** 나머지 row 중 위, 아래 비교하여 같은 값을 가진 경우 병합
				String sv2 = "";
				String sv3 = "";
				Cell cell3 = null;
				Row row3 = null;
				for (int z = 0; z < hjson.size(); z++) {
					JSONObject map = (JSONObject) hjson.get(z);
					if ("Y".equals(map.get("hiddenYN")))
						continue;
					for (int qq = 1; qq < Integer.parseInt(headerrowcnt); qq++) {
						row2 = s.getRow(qq);
						cell2 = row2.getCell(z);
						sv2 = cell2.getStringCellValue();
						erow = -1;
						for (int pp = qq + 1; pp < Integer.parseInt(headerrowcnt) + 1; pp++) {
							row3 = s.getRow(pp);
							cell3 = row3.getCell(z);
							sv3 = cell3.getStringCellValue();
							if (sv2.equals(sv3)) {
								erow = pp;
							}
						}
						if (erow != -1) {
							try {
								s.addMergedRegion(new CellRangeAddress(qq, erow, z, z));
							} catch (Exception e) {

							}
						}
					}
				}
			}

			// --** ROW
			JSONArray rdata = (JSONArray) data.get("rows");
			String val = "";
			String align = "";
			for (int x = 0, y = rdata.size(); x < y; x++) {

				JSONObject jooo = (JSONObject) rdata.get(x);
				c = 0;
				row = s.createRow(r++);
				for (int z = 0; z < hjson.size(); z++) {
					JSONObject map = (JSONObject) hjson.get(z);
					if ("Y".equals(map.get("hiddenYN")))
						continue;
					cell = row.createCell(c++);
					align = Util.NVL(map.get("align"), "center").toLowerCase();
					if ("center".equals(align)) {
						cell.setCellStyle(cellstyle);
					} else if ("left".equals(align)) {
						cell.setCellStyle(cellstyleL);
					} else if ("right".equals(align)) {
						cell.setCellStyle(cellstyleR);
					}
					val = Util.NVL(jooo.get(map.get("id")), "");
					cell.setCellValue(val);
				}

			}

			// --** 셀 리사이즈
			c = 0;
			for (int z = 0; z < hjson.size(); z++) {
				JSONObject map = (JSONObject) hjson.get(z);
				if ("Y".equals(map.get("hiddenYN")))
					continue;
				val = Util.NVL(map.get("width"), "50");
				int w = Integer.parseInt(val) * 40;
				s.setColumnWidth(c++, w);
			}

			ByteArrayOutputStream outByteStream = new ByteArrayOutputStream();
			wb.write(outByteStream);
			byte[] outArray = outByteStream.toByteArray();
			response.setContentType("Application/Msexcel");
			response.setContentLength(outArray.length);
			response.setHeader("Expires:", "0"); // eliminates browser caching
			response.setHeader("Content-Disposition",
					"ATTachment; Filename=" + URLEncoder.encode(title, "UTF-8") + ".xlsx");
			OutputStream outStream = response.getOutputStream();
			outStream.write(outArray);
			outStream.flush();
		
		} catch (Exception e) {
			throw new ServletException("Ims Excel ERROR !!!");
			
		} finally {
			wb.close();
		}
	}

	/**
	 * 
	 * @author : iamfreeguy-LiSangjun
	 * @date : 2019. 4. 12.
	 * @description JSON
	 * @param h
	 * @return
	 * @throws ParseException
	 *
	 */
	private JSONArray getJSONObject(String h) {

		JSONArray r = null;
		JSONParser jp = new JSONParser();
		try {
			r = (JSONArray) jp.parse(h);
		} catch (ParseException e) {
		}
		return r;

	}

	/*
	 * private void getHeaderGroup(String h){
	 * 
	 * this.arrayHeaderGroup.clear(); StringTokenizer st=new StringTokenizer(h,
	 * "}"); while(st.hasMoreTokens()){ String[] arrayAttr =
	 * st.nextToken().replace("{", "").split(","); if (arrayAttr.length == 1 &&
	 * "".equals(arrayAttr[0].trim())) continue; ImsMap<String,String> hMap = new
	 * ImsMap<String,String>(); for(int i=0; i<arrayAttr.length; i++){ String[]
	 * arrVal = arrayAttr[i].split("="); if (arrVal.length == 1){
	 * hMap.put(arrVal[0].trim(), (arrVal[0].trim().toUpperCase().equals("WIDTH") ?
	 * "0" : "") ); } else { hMap.put(arrVal[0].trim(), arrVal[1].trim()); } } if
	 * (Util.isNull(hMap.get("width"))) hMap.put("width", "50");
	 * this.arrayHeaderGroup.add(hMap); } }
	 */

}
