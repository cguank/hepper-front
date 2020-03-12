public class VideoManageServiceImpl implements VideoManageService {
	
	@Autowired
	private Jconn jcon; // 数据库组件
	@Autowired
	HttpServletRequest request;
	@Autowired
	HttpServletResponse response;

	
	private final static String SERVER_ROOT_PATH = "/Users/jesse/VideoFile"; // 本机
	

	
	// 上传视频
	/**
	 * @param file 视频文件
	 * @param chunked 是否切片 true:切片;false:不切片
	 * @param chunk 当前切片数，不切片为空
	 * @param chunks 总切片数，不切片为空
	 * @param fileMd5 文件md5
	 * @param vid_id 视频ID
	 * @return
	 * @throws RuntimeException
	 */
	public boolean videoUpload(MultipartFile file, boolean chunked, String chunk, String chunks, String fileMd5, String vid_id) throws RuntimeException {
		String fileName = file.getOriginalFilename(); // 获得上传文件的实际名称
		String[] types = fileName.split("\\.");
		String type = types[types.length - 1];
		String videoName = getVideoName(fileName);
		type = "." + type.toLowerCase(); // 获得文件的后缀名
		String hz = UUID.randomUUID().toString();
		String targetFileName = hz + type;
		
		String root_path = SERVER_ROOT_PATH; // 绝对路径
		String opposite_path = "/" + fileMd5 ; // 相对路径
		String video_url = opposite_path + "/" + targetFileName; // 视频保存路径
		String temp_path = "/temp"; // 临时路径，用于存放切片
		String sPath =  root_path + opposite_path; 
		
		// 不切片上传
		if (!chunked) {
			if(saveVideo(file, sPath, targetFileName)) {
				// 上传成功，修改视频信息到视频表
				if(updateVideoInfoToDB(vid_id, video_url)) {
					// 数据保存成功
					return true;
				}
			} 
		} else { // 切片上传
			String chunkFileName = chunk + type;
			sPath = root_path + opposite_path + temp_path;
			// 保存切片到temp文件夹，保存切片信息到切片表
			if(saveVideo(file, sPath, chunkFileName) && insertVideoChunkInfoIntoDB(chunk, chunks, fileMd5)) {
				// 获取temp文件夹中的文件数
				File[] fileArray = new File(sPath).listFiles();
				int fileNum = 0;
				for (File file_check : fileArray) {
					if(file_check.isFile()) {
						fileNum ++;
					}
				}
				// 判断切片是否上传完毕,上传完毕合并切片
				if (fileNum == Integer.parseInt(chunks)) {
					sPath = root_path + video_url;
					File mergeFile = new File(sPath);
					List<File> fileList = Arrays.asList(fileArray);
					// 合并文件，保存到文件md5值命名的文件夹下
					mergeFile = this.mergeFile(fileList, mergeFile);
					// 删除服务器上的temp文件夹、切片表信息，并更新视频信息到视频表
					sPath = root_path + opposite_path + temp_path;
					if(deleteFile(sPath) && deleteVideoChunkInfoFromDB(fileMd5) && updateVideoInfoToDB(vid_id, video_url)) {
						// 数据保存成功
						return true;
					}
				}
				
			}
		}
		return false;
	}
	
	// 保存视频
	private boolean saveVideo(MultipartFile file, String sPath, String targetFileName) {
		File targetFile = new File(sPath, targetFileName);
		if (!targetFile.exists()) {
			targetFile.mkdirs();
		}
		try {
			file.transferTo(targetFile);// 保存文件
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	// 合并视频
    private File mergeFile(List<File> chunkFileList, File mergeFile) {
        try {
            // 有删 无创建
            if (mergeFile.exists()) {
                mergeFile.delete();
            } else {
                mergeFile.createNewFile();
            }
            // 排序
            Collections.sort(chunkFileList, new Comparator<File>() {
                @Override
                public int compare(File o1, File o2) {
            		String[] types = o1.getName().split("\\.");
            		String o1_name = types[0];
            		types = o2.getName().split("\\.");
            		String o2_name = types[0];
                    if (Integer.parseInt(o1_name) > Integer.parseInt(o2_name)) {
                        return 1;
                    }
                    return -1;
                }
            });

            byte[] b = new byte[1024];
            RandomAccessFile writeFile = new RandomAccessFile(mergeFile, "rw");
            for (File chunkFile : chunkFileList) {
                RandomAccessFile readFile = new RandomAccessFile(chunkFile, "r");
                int len = -1;
                while ((len = readFile.read(b)) != -1) {
                    writeFile.write(b, 0, len);
                }
                readFile.close();
            }
            writeFile.close();
            return mergeFile;

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    // 删除文件
    private boolean deleteFile(String path){
        File file = new File(path);
        if(!file.exists()){
            return false;
        }
        if(file.isFile()){
            return file.delete();
        }
        File[] files = file.listFiles();       
        for (File f : files) {
            if(f.isFile()){
                if(!f.delete()){
                    System.out.println(f.getAbsolutePath()+" delete error!");
                    return false;
                }
            }else{
                if(!this.deleteFile(f.getAbsolutePath())){
                    return false;
                }
            }
        }
        return file.delete();      
    }
    
    // 保存视频信息到视频表
    private boolean insertVideoInfoIntoDB(String fileName, String video_url, String fileMd5) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);
		
		String uploader_id = "";
		String uploader_nm = "";
		if(Constants.usrInfo.containsKey(request.getHeader("token"))) {
			UserSessionInfo  uinfo = Constants.usrInfo.get(request.getHeader("token"));
			uploader_id = uinfo.getUsrid();
			uploader_nm = uinfo.getUsrdesc();		
		}
		
		String id_key = jcn.getIdKey(Constants.SALE_CON);
		JSONObject json_video_info = new JSONObject();
		json_video_info.put("id_key", id_key);
		json_video_info.put("z_vid_name", fileName);
		json_video_info.put("z_vid_url", video_url);
		json_video_info.put("z_upload_date", DateUtil.getCurrentDateTime());
		json_video_info.put("z_uploader_id", uploader_id);
		json_video_info.put("z_uploader_nm", uploader_nm);
		json_video_info.put("z_vid_md5", fileMd5);
		json_video_info.put("z_vid_uploaded", "1"); // 已传完

		
		return jcn.insertJSON("zlt_vid_info", json_video_info) ? true : false;
    	
    }
    
    // 登记视频信息到视频表
    private String registerVideoInfoIntoDB(String fileName, String fileMd5) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);
		
		String uploader_id = "";
		String uploader_nm = "";
		if(Constants.usrInfo.containsKey(request.getHeader("token"))) {
			UserSessionInfo  uinfo = Constants.usrInfo.get(request.getHeader("token"));
			uploader_id = uinfo.getUsrid();
			uploader_nm = uinfo.getUsrdesc();		
		}
		
		String id_key = jcn.getIdKey(Constants.SALE_CON);
		JSONObject json_video_info = new JSONObject();
		json_video_info.put("id_key", id_key);
		json_video_info.put("z_vid_name", fileName);
		json_video_info.put("z_upload_date", DateUtil.getCurrentDateTime());
		json_video_info.put("z_uploader_id", uploader_id);
		json_video_info.put("z_uploader_nm", uploader_nm);
		json_video_info.put("z_vid_md5", fileMd5);
		json_video_info.put("z_vid_uploaded", "0"); // 未传完

		jcn.insertJSON("zlt_vid_info", json_video_info);
		return id_key;
    	
    }
    
    // 更新视频信息到视频表
    private boolean updateVideoInfoToDB(String vid_id,String video_url) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);
		
		JSONObject json_update = new JSONObject();
		json_update.put("id_key", vid_id);
		json_update.put("z_vid_url", video_url);
		json_update.put("z_upload_date", DateUtil.getCurrentDateTime());
		json_update.put("z_vid_uploaded", 1);
		String sql_update = "zlt_vid_info:id_key,z_vid_url,z_upload_date,z_vid_uploaded";
		
		return jcn.updateJson(sql_update, json_update) ? true : false;

    }
    
    
    // 保存视频切片信息到切片表
    private boolean insertVideoChunkInfoIntoDB(String chunk, String chunks, String fileMd5) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);

		String id_key = jcn.getIdKey(Constants.SALE_CON);		
		JSONObject json_video_chunk = new JSONObject();
		json_video_chunk.put("id_key", id_key);
		json_video_chunk.put("z_vid_chunk", chunk);
		json_video_chunk.put("z_vid_chunks", chunks);
		json_video_chunk.put("z_vid_md5", fileMd5);
		
		return jcn.insertJSON("zlt_vid_info_l", json_video_chunk) ? true : false;
    	
    }
    
    // 删除切片表信息
    private boolean deleteVideoChunkInfoFromDB(String fileMd5) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);
		
		String del_sql = "delete from zlt_vid_info_l where z_vid_md5 = '" + fileMd5 + "'";
		return jcn.update(del_sql) ? true : false;
    	
    }
    
    
    // 获取视频名称
    private String getVideoName(String fileName) {
		String[] types = fileName.split("\\.");
		String videoName = "";
		for (int i = 0; i < types.length-1; i++) {
			videoName += types[i] + ".";
		}
		videoName = videoName.substring(0, videoName.lastIndexOf('.'));
    	return videoName;
    }

    // 上传前检查视频是否存在
	@Override
	public String checkVideo(String fileName, String fileMd5) { 
		jComp jcn = jcon.getConnect(Constants.SALE_CON);
		String videoName = getVideoName(fileName);
		String uploader_id = "";
		String uploader_nm = "";
		if(Constants.usrInfo.containsKey(request.getHeader("token"))) {
			UserSessionInfo  uinfo = Constants.usrInfo.get(request.getHeader("token"));
			uploader_id = uinfo.getUsrid();
			uploader_nm = uinfo.getUsrdesc();		
		}
		String sql_check ="select count(1) from zlt_vid_info where z_vid_md5 = '" + fileMd5 + "' and z_vid_uploaded = 1";
		JSONObject json_ret = new JSONObject();
		
		// 视频不存在(或未传完)，新增一条记录(登记视频信息)
		if(jcn.getCount(sql_check) == 0 ) { 
			sql_check = "select count(1) from zlt_vid_info_l where z_vid_md5 = '" + fileMd5 + "'";
			// 切片表有数据，说明该视频已上传了一部分
			if(jcn.getCount(sql_check) > 0 ) {
				String sql_vid_info = "select id_key,z_uploader_id from zlt_vid_info where z_vid_md5 = '" + fileMd5 + "'" ;
				JSONObject json_vid_info = jcn.queryJsonSql(sql_vid_info, null);
				String idkey = json_vid_info.getString("id_key");
				String loader_id = json_vid_info.getString("z_uploader_id");
				// 当前用户为视频上传者，返回该条视频记录主键
				if(uploader_id.equals(loader_id) && !"".equals(loader_id)) {
					json_ret.put("exsit", false);
					json_ret.put("vid_id", idkey);
					return json_ret.toString();
				} else { // 当前用户非上传者，新增一条登记记录
					json_ret.put("exisit", false);
					json_ret.put("vid_id", registerVideoInfoIntoDB(videoName, fileMd5));
					return json_ret.toString();
				}
			} else { // 切片表无数据，新增一条登记记录
				json_ret.put("exisit", false);
				json_ret.put("vid_id", registerVideoInfoIntoDB(videoName, fileMd5));
				return json_ret.toString();
			}
		} else if (jcn.getCount(sql_check) > 0 ) { // 视频已存在，复制该视频信息，重新插入一条记录(秒传)
			String sql_vid_url = "select z_vid_url from zlt_vid_info where z_vid_md5 = '" + fileMd5 + "'";
			JSONArray ja_vid_url = jcn.queryJsonArraySql(sql_vid_url, null);
			String z_vid_url = ja_vid_url.getJSONObject(0).getString("z_vid_url");
			
			sql_check = "select id_key from zlt_vid_info where z_vid_md5 = '"+ fileMd5 +"' and z_uploader_id = '"+ uploader_id +"' and z_vid_uploaded = 0";
			JSONObject js = new JSONObject();
			if(jcn.queryJsonSql(sql_check, null) != null) {
				js = jcn.queryJsonSql(sql_check, null);
			}
					
			// 当前用户存在未传完的该文件，更新该条记录的状态即可
			if(js.containsKey("id_key") && !"".equals(js.getString("id_key"))) {
				String sql_update = "update zlt_vid_info set z_vid_url = '"+z_vid_url+"' and z_upload_date = '"+ DateUtil.getCurrentDateTime() +"' and z_vid_uploaded = 1 where id_key = " + js.getString("id_key");
				if(jcn.update(sql_update)) {
					json_ret.put("exist", true); // 视频已存在
					return json_ret.toString();
				}
			} else { // 不存在，即重新插入一条新记录(秒传)
				if(insertVideoInfoIntoDB(videoName, z_vid_url, fileMd5)) {
					json_ret.put("exist", true); // 视频已存在
					return json_ret.toString();
				}
					
			}
			
		}
		return json_ret.toString();
		
	}
	
	// 检查视频切片信息
	public String checkVideoChunk(String fileMd5) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);

		String sql_chunk_check ="select count(1) from zlt_vid_info_l where z_vid_md5 = '" + fileMd5 + "'";
		String sql_chunk_info = "select z_vid_chunk,z_vid_chunks from zlt_vid_info_l where z_vid_md5 = '" + fileMd5 + "'";
		JSONObject json_ret = new JSONObject();
		// 加入队列前与上传切片前检查视频切片信息
		if(jcn.getCount(sql_chunk_check) > 0) {
			JSONArray ja_chunk_info = jcn.queryJsonArraySql(sql_chunk_info, null);
			List<String> list_chunk = new ArrayList<>();
			for(int i = 0; i < ja_chunk_info.size(); i++) {
				list_chunk.add(ja_chunk_info.getJSONObject(i).getString("z_vid_chunk"));
			}
			String chunks = ja_chunk_info.getJSONObject(0).getString("z_vid_chunks");
			json_ret.put("ischunked", true);
			json_ret.put("uploaded_chunk", list_chunk.toString());
			json_ret.put("chunks", Integer.parseInt(chunks));
			return json_ret.toString();
		} 
		json_ret.put("ischunked", false);
		return json_ret.toString();
		
	}
	
	// 检查当前切片是否存在
	public String checkCurChunk(String chunk, String fileMd5) {
		jComp jcn = jcon.getConnect(Constants.SALE_CON);

		String sql_check ="select count(1) from zlt_vid_info_l where z_vid_md5 = '" + fileMd5 + "' and z_vid_chunk = " + chunk;
		JSONObject json_ret = new JSONObject();
		// 存在
		if(jcn.getCount(sql_check) == 1) {
			json_ret.put("exist", true);
			return json_ret.toString();
		} 
		json_ret.put("exist", false);
		return json_ret.toString();
		
	}

}
