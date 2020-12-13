package ims.common;

import java.util.HashMap;

import org.springframework.stereotype.Service;

@Service
public interface ImsServiceBase {

	public Object list(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object view(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object insert(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object update(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object delete(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object delete2(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object remove(String mapper, HashMap<String, Object> hm) throws Exception;

	public Object remove2(String mapper, HashMap<String, Object> hm) throws Exception;

}
