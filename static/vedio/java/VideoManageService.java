
@Service("VideoManageService")
public interface VideoManageService {
	
	// 上传视频
	public boolean videoUpload(MultipartFile file, boolean chunked, String chunk, String chunks, String fileMd5, String vid_id);
	
	// 上传前检查视频是否已存在
	public String checkVideo(String fileName, String fileMd5);
	
	// 加入队列前检查视频切片信息
	public String checkVideoChunk(String fileMd5);
	
	// 检查当前切片是否存在
	public String checkCurChunk(String chunk, String fileMd5);
	

}
