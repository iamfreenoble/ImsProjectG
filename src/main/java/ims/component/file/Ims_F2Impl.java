package ims.component.file;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ims.common.Convert;
import ims.common.ImsServiceBaseImpl;

@Service("Ims_F2Impl")
public class Ims_F2Impl extends ImsServiceBaseImpl {

	/**
	 * s Logger
	 */
	static final Logger logger = LoggerFactory.getLogger(Ims_F2Impl.class);

	private String mapper = "ims.f2";

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 11. 19.
	 * @description group key 로 파일정보를 읽어온다
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	@Transactional(readOnly = true)
	public Object list2(HashMap<String, Object> hm) throws Exception {
		return sqlSession.selectList(mapper + ".list2", hm);
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 10. 13.
	 * @description 그룹 Key 를 조회한다
	 * @param hm
	 * @return
	 * @throws Exception
	 *
	 */
	public Long getgroupkey(HashMap<String, Object> hm) throws Exception {
		sqlSession.insert(mapper + ".getgroupkey", hm);
		return (Long) hm.get("f2_group_key");
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 10. 13.
	 * @description 사용여부를 업데이트 한다
	 * @param hm
	 * @throws Exception
	 *
	 */
	public void updateuseyn(HashMap<String, Object> hm) throws Exception {
		sqlSession.update(mapper + ".updateuseyn", hm);
	}

	/**
	 * 
	 * @author : LiSangJun
	 * @date : 2019. 10. 13.
	 * @description 삭제대기 값을 삭제로 변경함 메타데이터 저장시 call
	 * @param hm
	 * @throws Exception
	 *
	 */
	public void updateuseynall(HashMap<String, Object> hm) throws Exception {
		hm.put("list", Convert.mapToList(hm, new String[] { "f2_group_key" }));
		sqlSession.update(mapper + ".updateuseynall", hm);
	}
}
