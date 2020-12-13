/**
 * 
 */
package ims.component.socket;

/**
 * @author iamfreeguy
 * @date 2017. 3. 11.
 * @type_name WebSocketUserVo
 * @description
 *
 */
public class WebSocketUserVo {

	private String id;
	private String name;
	private String character;
	private String grade;
	private String team;
	private String dept;
	private String userDefine;
	private String userConnect;

	public String getTeam() {
		return team;
	}

	public void setTeam(String team) {
		this.team = team;
	}

	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getUserConnect() {
		return userConnect;
	}

	public void setUserConnect(String userConnect) {
		this.userConnect = userConnect;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCharacter() {
		return character;
	}

	public void setCharacter(String character) {
		this.character = character;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public String getUserDefine() {
		return userDefine;
	}

	public void setUserDefine(String userDefine) {
		this.userDefine = userDefine;
	}

}
