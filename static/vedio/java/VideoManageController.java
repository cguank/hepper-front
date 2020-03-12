@Controller
@RequestMapping("请求路径")
public class VideoManageController {
	
	@Autowired
	private VideoManageService vm;
	@Autowired
	HttpServletRequest request;
	@Autowired
	HttpServletResponse response;
	
	
	// 上传视频
	@ResponseBody
	@RequestMapping(value = "/videoUpload" , method = RequestMethod.POST)
	public String videoUpload( HttpServletRequest request) {
		String isChunked = request.getParameter("isChunked"); //是否切片上传
		boolean chunked = false; // 是否切片上传
		String chunk = ""; // 当前切片数
		String chunks = ""; // 总切片数
		// 切片上传
		if(isChunked.equals("true")) {
			chunked = true;
			chunk = request.getParameter("chunk"); 
			chunks = request.getParameter("chunks"); 
		}
		String fileMd5 = request.getParameter("fileMd5"); // 文件md5
		String vid_id = request.getParameter("vid_id"); // 视频id
		MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
		MultipartFile file = multiRequest.getFile("file"); // 获取视频文件
		if(file!=null) {
			Msg msg  = vm.videoUpload(file, chunked, chunk, chunks, fileMd5, vid_id);
			if (msg.getStatus().equals("200")) {
				return msg.getInfo().toString();
			}
		}
		return "false";
	}

	// 上传前检查视频是否已存在
	@ResponseBody
	@RequestMapping(value = "/checkVideo")
	public String checkVideo( HttpServletRequest request) {
		String fileName = request.getParameter("fileName");
		String fileMd5 = request.getParameter("fileMd5"); // 文件md5
		Msg msg  = vm.checkVideo(fileName, fileMd5);
		if (msg.getStatus().equals("200")) {
			return msg.getInfo().toString();
		}
		return "false";
	}
	
	// 加入队列前检查视频切片信息
	@ResponseBody
	@RequestMapping(value = "/checkVideoChunk")
	public String checkVideoChunk( HttpServletRequest request) {
		String fileMd5 = request.getParameter("fileMd5"); // 文件md5
		Msg msg  = vm.checkVideoChunk(fileMd5);
		if (msg.getStatus().equals("200")) {
			return msg.getInfo().toString();
		}
		return "false";
	}
	
	// 检查当前切片是否存在
	@ResponseBody
	@RequestMapping(value = "/checkCurChunk")
	public String checkCurChunk( HttpServletRequest request) {
		String chunk = request.getParameter("chunk"); // 当前切片值
		String fileMd5 = request.getParameter("fileMd5"); // 文件md5
		Msg msg  = vm.checkCurChunk(chunk, fileMd5);
		if (msg.getStatus().equals("200")) {
			return msg.getInfo().toString();
		}
		return "false";
	}
	
}
