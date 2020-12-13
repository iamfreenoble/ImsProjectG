package ims.component.grid;

/**
 * 
 * @author : "iamfreeguy-이상준"
 * @description XGrid 사용에 필요한 Vo
 *
 */
public class G2Vo {

	private String page; // --** 현재 Page
	private String pageRowCnt; // --** pageRow Count
	private String sort; // --** sort
	private String filter; // --** filter
	private String keycheck; // --** 검색 key
	private String getdata; // --** 가져올 데이타
	private String groupby; // --** 그룹바이 처리
	private String g2check; // --** checked
	private String g2total; // --** 총계

	public String getGetdata() {
		return getdata;
	}

	public void setGetdata(String getdata) {
		this.getdata = getdata;
	}

	public String getGroupby() {
		return groupby;
	}

	public void setGroupby(String groupby) {
		this.groupby = groupby;
	}

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public String getPageRowCnt() {
		return pageRowCnt;
	}

	public void setPageRowCnt(String pageRowCnt) {
		this.pageRowCnt = pageRowCnt;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getFilter() {
		return filter;
	}

	public void setFilter(String filter) {
		this.filter = filter;
	}

	public String getKeycheck() {
		return keycheck;
	}

	public void setKeycheck(String keycheck) {
		this.keycheck = keycheck;
	}

	public String getG2check() {
		return g2check;
	}

	public void setG2check(String g2check) {
		this.g2check = g2check;
	}

	public String getG2total() {
		return g2total;
	}

	public void setG2total(String g2total) {
		this.g2total = g2total;
	}

}
