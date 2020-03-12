# README

***

## 前端

***

### webuploader简介

> WebUploader是由Baidu WebFE(FEX)团队开发的一个简单的以HTML5为主，FLASH为辅的现代文件上传组件。在现代的浏览器里面能充分发挥HTML5的优势，同时又不摒弃主流IE浏览器，沿用原来的FLASH运行时，兼容IE6+，iOS 6+, android 4+。两套运行时，同样的调用方式，可供用户任意选用。采用大文件分片并发上传，极大的提高了文件上传效率。

* 官网地址 : <http://fex.baidu.com/webuploader/>
* GitHub : <https://github.com/fex-team/webuploader>
* 参考链接 1 : <https://www.cnblogs.com/deng-cc/p/10117956.html>
* 参考链接 2 : <https://blog.csdn.net/u012211603/article/details/88779161>

### HTML页面

* 引入js css

  ```html
  <link rel="stylesheet" type="text/css" href="../css/webuploader.css}">
  <link rel="stylesheet" type="text/css" href="../css/demo.css}">
  
  <script type="text/javascript" src="../js/jquery-1.10.2.min.js}"></script>
  <script type="text/javascript" src="../js/bootstrap.min.js}"></script>
  <script type="text/javascript" src="../js/webuploader.nolog.js}"></script>
  <script type="text/javascript" src="../js/videoUpload.js}"></script>
  ```

* 请求接口

  ```javascript
  var swf_url="../swf/Uploader.swf"; // webuploader插件运行需要
  var upload_url=".../videoUpload"; // 上传接口
  var check_url=".../checkVideo"; // 上传前检测接口，检测视频是否存在，可实现秒传
  var check_chunk=".../checkVideoChunk"; // 加入队列时检测接口，返回已上传分片信息，用于展示上传进度
  var check_cur=".../checkCurChunk"; // 上传每个分片前检测接口，检测该分片是否存在
  ```

### videoUpload.js

* 创建一个`webuploder`对象

  

  ```javascript
  // 实例化
  uploader = WebUploader.create({
    pick: {
      id: '#filePicker',
      innerHTML: '选择视频'
    },
    dnd: '#uploader .queueList',
    paste: document.body,
    accept: {
      title: 'Video',
      extensions: 'mp4,flv', // 允许的文件格式
    },
    swf: swf_url, // 插件路径
    disableGlobalDnd: true,
    sendAsBinary:false,
    threads: 3,
    chunked: true, // 是否开启分片上传
    chunkSize: 10 * 1024 * 1024, // 分片大小
    server: upload_url, // 服务端接口
    fileNumLimit: 5, // 文件数量限制
    fileSizeLimit: 1000 * 1024 * 1024,   // 总文件大小限制
    fileSingleSizeLimit: 1000 * 1024 * 1024    // 单个文件大小限制
  });
  ```

* 如何实现断点续传和秒传

  因为这是小众需求，所以默认没有做在webuploader里面，而只是提供[hook接口](http://fex.baidu.com/webuploader/document.html#toc_2)，让用户很简单的扩展此功能。

  那么，都有哪些重要的hook接口呢？

  - `before-send-file` 此hook在文件发送之前执行
  - `before-send` 此hook在文件分片（如果没有启用分片，整个文件被当成一个分片）后，上传之前执行。
  - `after-send-file` 此hook在文件所有分片都上传完后，且服务端没有错误返回后执行。
  - ...

  对于秒传来说，其实就是文件上传前，把内容读取出来，算出md5值，然后通过ajax与服务端验证进行验证, 然后根据结果选择继续上传还是掉过上传。

  像这个操作里面有两个都是异步操作，文件内容blob读取和ajax请求。所以这个`handler`必须是异步的，怎样告诉组件此`handler`是异步的呢？只需要在`hanlder`里面返回一个[promise](http://api.jquery.com/deferred.promise/)对象就可以了，这样webuploader就会等待此过程，监听此promise的完成事件，自动继续。

  以下是此思路的简单实现。

  ```javascript
  WebUploader.Uploader.register({
    'before-send-file': 'preupload',
    'before-send':'checkchunk'
  }, {
    preupload: function( file ) {
      var me = this,
          owner = this.owner,
          server = me.options.server,
          deferred = WebUploader.Deferred();
  
      // 与服务安验证
      $.ajax({
        url: check_url,
        dataType: 'json',
        data: {
          fileName: file.name,
          fileMd5: file.wholeMd5
        },
        success: function( response ) {
  
          // 如果验证已经上传过
          if ( response.exist ) {
            var $li = $('#'+file.id),
                $percent = $li.find('.progress span');
            $percent.css('width', 100 + '%');
            percentages[ file.id ][ 1 ] = 1;
            updateTotalProgress();
            owner.skipFile( file );
            console.log("md5值为:" + file.wholeMd5 + "的视频秒传成功!");
            //deferred.reject();
          }else {
            file.vid_id = response.vid_id;
          }
  
          // 介绍此promise, webuploader接着往下走。
          deferred.resolve();
  
        }
      });
  
      return deferred.promise();
    },
  
    checkchunk: function( block ) {
      var me = this,
          owner = this.owner,
          server = me.options.server,
          deferred = WebUploader.Deferred();
  
      // 与服务安验证
      $.ajax({
        url: check_cur,
        dataType: 'json',
        data: {
          fileMd5: block.file.wholeMd5,
          chunk: block.chunk
        },
        success: function( response ) {
  
          // 有分片
          if ( response.exist ) {
            console.log("正在跳过分片:"+ block.chunk);
            deferred.reject();
          } else {
            deferred.resolve();
          }
          var file=block.file;
          var $li = $('#'+file.id),
              $percent = $li.find('.progress span');
          $percent.text('');
          $percent.show();
        }
      });
  
      return deferred.promise();
    }
  });
  ```

  

* `fileQueued`事件

  

  在`fileQueued`事件中计算文件的md5,并请求服务端，返回上传进度

  ```javascript
  uploader.on( 'fileQueued', function( file ) {
   
          fileCount++;
          fileSize += file.size;
  
          if ( fileCount === 1 ) {
              $placeHolder.addClass( 'element-invisible' );
              $statusBar.show();
          }
  
          addFile( file );
          setState( 'ready' );
          updateTotalProgress();
  
       	 uploader.md5File( file, 0, 500 * 1024 * 1024 )
  	     // 及时显示进度
  	     .progress(function(percentage) {
  	    	 $upload.text( '开始上传' ).addClass( 'disabled' );
  	    	 $(".uploadBtn").text("MD5校验中");
  	         console.log('Percentage:', (percentage * 100).toFixed(2) + "%");
  	     })
  	
  	     // 完成
  	     .then(function(fileMd5) {
  	         file.wholeMd5 = fileMd5;
  	         console.log('md5 result:', fileMd5);
  	         $upload.text( '开始上传' ).removeClass( 'disabled' );
  	         $.ajax({
  	        	url:check_chunk,
  	        	dataType: 'json',
  	        	data:{       	
  	        	  fileMd5: file.wholeMd5
  	        	},
  	        	success: function( data ) {
  	         		if (data.ischunked){
                  		var len  = data.uploaded_chunk.length;
                  		var chunks = data.chunks;
                  		file.upload_percent = (len / chunks) * 100;
                  		var $li = $('#'+file.id),
                  		$progress = $li.find('.progress');
                  		$progress.css('height', '15px');
  
                  		$percent = $li.find('.progress span');
                  		$percent.text( file.upload_percent.toFixed(2) + '%' );
                  		$percent.css('width', (len / chunks) * 100 + '%');
                  		$percent.show();
  
  	         		}
  	         	}
       
  	          })
  	     });
  
      });
  ```

* `uploadBeforeSend`事件

  

  该事件在每个分片请求上传接口前触发，在这里可以选择放在data里传给服务端的参数

  ```javascript
    uploader.on('uploadBeforeSend', function (block, data) {
          var deferred = WebUploader.Deferred(); 
          var file = block.file;
          data.fileMd5 = file.wholeMd5;
          data.vid_id = file.vid_id;
          if(block.chunks > 1){
          	data.isChunked = true; // 切片上传
          } else {
          	data.isChunked = false; // 不切片上传
          }
          console.log("正在上传分片:"+block.chunk.toString());
      });
  ```

## 后端

### 控制器

见`VideoManageController.java`

### 实现类

见`VideoManageServiceImpl.java`

## 数据库

* 主表`ZLT_VID_INFO`

  ```plsql
  
    CREATE TABLE "SALE"."ZLT_VID_INFO" 
     (	"ID_KEY" NUMBER(20,0) NOT NULL ENABLE, 
      "Z_VID_NAME" VARCHAR2(100 BYTE), 
      "Z_VID_URL" VARCHAR2(256 BYTE), 
      "Z_UPLOAD_DATE" DATE, 
      "Z_UPLOADER_ID" NUMBER(20,0), 
      "Z_UPLOADER_NM" VARCHAR2(20 BYTE), 
      "Z_VID_MD5" VARCHAR2(100 BYTE), 
      "Z_VID_UPLOADED" NUMBER(1,0), 
      CONSTRAINT "ZLT_VID_INFO_PK" PRIMARY KEY ("ID_KEY")
      USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
      STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
              PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
              BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
      TABLESPACE "USERS"  ENABLE
     ) SEGMENT CREATION IMMEDIATE 
    PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
   NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
            PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
            BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "USERS" ;
  
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."ID_KEY" IS '主键';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_VID_NAME" IS '视频名称';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_VID_URL" IS '视频路径';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_UPLOAD_DATE" IS '上传时间';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_UPLOADER_ID" IS '上传人ID';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_UPLOADER_NM" IS '上传人';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_VID_MD5" IS '视频MD5值';
  COMMENT ON COLUMN "SALE"."ZLT_VID_INFO"."Z_VID_UPLOADED" IS '是否上传完毕?1:已完毕;0:未完毕';
  ```

* 细表`ZLT_VID_INFO_L`

  ```plsql
  
    CREATE TABLE "SALE"."ZLT_VID_INFO_L" 
     (	"ID_KEY" NUMBER(20,0) NOT NULL ENABLE, 
      "Z_VID_CHUNK" NUMBER(5,0), 
      "Z_VID_MD5" VARCHAR2(100 BYTE), 
      "Z_VID_CHUNKS" NUMBER(5,0), 
      CONSTRAINT "ZLT_VID_INFO_L_PK" PRIMARY KEY ("ID_KEY")
      USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
      STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
              PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
              BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
      TABLESPACE "USERS"  ENABLE
     ) SEGMENT CREATION IMMEDIATE 
    PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
   NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
            PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
            BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "USERS" ;
  
     COMMENT ON COLUMN "SALE"."ZLT_VID_INFO_L"."ID_KEY" IS '主键';
     COMMENT ON COLUMN "SALE"."ZLT_VID_INFO_L"."Z_VID_CHUNK" IS '当前切片数';
     COMMENT ON COLUMN "SALE"."ZLT_VID_INFO_L"."Z_VID_MD5" IS '视频MD5值';
     COMMENT ON COLUMN "SALE"."ZLT_VID_INFO_L"."Z_VID_CHUNKS" IS '总切片数';
  
  ```

* 视图`ZLTV_VID_UPLOADING`

  ```plsql
    CREATE OR REPLACE FORCE VIEW "SALE"."ZLTV_VID_UPLOADING" ("ID_KEY", "Z_VID_NAME", "Z_UPLOAD_DATE", "Z_UPLOADER_ID", "Z_UPLOADER_NM", "Z_VID_MD5", "Z_VID_UPLOADED", "Z_UPLOADED_CHUNKS", "Z_VID_CHUNKS", "Z_UPLOAD_PROGRESS") AS 
    select a.id_key, a.z_vid_name, a.z_upload_date, a.z_uploader_id, z_uploader_nm, a.z_vid_md5, a.z_vid_uploaded,
  b.z_uploaded_chunks,b.z_vid_chunks,
  to_char(ROUND((b.z_uploaded_chunks/b.z_vid_chunks),2)*100,'99D99')||'%' z_upload_progress
  from zlt_vid_info a
  left outer join 
  (select z_vid_chunks,z_vid_md5,count(1) z_uploaded_chunks from zlt_vid_info_l group by z_vid_chunks,z_vid_md5 ) b
  on a.z_vid_md5 = b.z_vid_md5 
  where a.z_vid_uploaded = 0;
  
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."ID_KEY" IS '主键';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_VID_NAME" IS '视频名称';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_UPLOAD_DATE" IS '上传时间';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_UPLOADER_ID" IS '上传人ID';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_UPLOADER_NM" IS '上传人';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_VID_MD5" IS '视频MD5值';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_VID_UPLOADED" IS '是否上传完毕?0:未完毕;1:已完毕';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_UPLOADED_CHUNKS" IS '已上传切片数';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_VID_CHUNKS" IS '该视频总切片数';
     COMMENT ON COLUMN "SALE"."ZLTV_VID_UPLOADING"."Z_UPLOAD_PROGRESS" IS '上传进度';
  ```

  



