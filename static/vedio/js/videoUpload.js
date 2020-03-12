jQuery(function() {
    var $ = jQuery, // just in case. Make sure it's not an other libaray.

        $wrap = $('#uploader'),

        // 图片容器
        $queue = $('<ul class="filelist"></ul>')
        .appendTo($wrap.find('.queueList')),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
        $info = $statusBar.find('.info'),

        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

        // 总体进度条
        $progress = $statusBar.find('.progress').hide(),

        // 添加的文件数量
        fileCount = 0,

        // 添加的文件总大小
        fileSize = 0,

        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        // 所有文件的进度信息，key为file id
        percentages = {},

        supportTransition = (function() {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                'WebkitTransition' in s ||
                'MozTransition' in s ||
                'msTransition' in s ||
                'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;

    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }

    WebUploader.Uploader.register({
        'before-send-file': 'preupload',
        'before-send': 'checkchunk'
    }, {
        preupload: function(file) {
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
                success: function(response) {

                    // 如果验证已经上传过
                    if (response.exist) {
                        var $li = $('#' + file.id),
                            $percent = $li.find('.progress span');
                        $percent.css('width', 100 + '%');
                        percentages[file.id][1] = 1;
                        updateTotalProgress();
                        owner.skipFile(file);
                        console.log("md5值为:" + file.wholeMd5 + "的视频秒传成功!");
                        //deferred.reject();
                    } else {
                        file.vid_id = response.vid_id;
                    }

                    // 介绍此promise, webuploader接着往下走。
                    deferred.resolve();

                }
            });

            return deferred.promise();
        },

        checkchunk: function(block) {
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
                success: function(response) {

                    // 有分片
                    if (response.exist) {
                        console.log("正在跳过分片:" + block.chunk);
                        deferred.reject();
                    } else {
                        deferred.resolve();
                    }
                    var file = block.file;
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress span');
                    $percent.text('');
                    $percent.show();
                }
            });

            return deferred.promise();
        }


    });
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
            extensions: 'mp4,flv',
        },
        swf: swf_url,
        disableGlobalDnd: true,
        sendAsBinary: false,
        threads: 3,
        chunked: true, // 分片上传上传大文件
        chunkSize: 10 * 1024 * 1024, // 分片大小
        server: upload_url,
        fileNumLimit: 5,
        fileSizeLimit: 1000 * 1024 * 1024,
        fileSingleSizeLimit: 1000 * 1024 * 1024 // 500 M
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: '#filePicker2',
        innerHTML: '继续添加'
    });

    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
        var $li = $('<li id="' + file.id + '">' +
                '<p class="title style="color:white;">' + file.name + '</p>' +
                '<p class="imgWrap"></p>' +
                '<p class="progress"><span></span></p>' +
                '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function(code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('');
            uploader.makeThumb(file, function(error, src) {
                if (error) {
                    //                    src = '/static/comm/videothumb.png';
                    //                    var img = $('<img style="padding-top:25px" src="'+src+'">');
                    //                    $wrap.empty().append( img );
                    return;
                }

            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }

        file.on('statuschange', function(cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                $li.off('mouseenter mouseleave');
                $btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                console.log(file.statusText);
                showError(file.statusText);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function() {
            $btns.stop().animate({ height: 30 });
        });

        $li.on('mouseleave', function() {
            $btns.stop().animate({ height: 0 });
        });

        $btns.on('click', 'span', function() {

            var index = $(this).index(),
                deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');

            }


        });

        $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);

        delete percentages[file.id];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function(k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;

        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '<br>',
            stats;

        if (state === 'ready') {
            text = '选中' + fileCount + '个视频，共' +
                WebUploader.formatSize(fileSize) + '。';
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = '已成功上传' + stats.successNum + '个至XX相册，' +
                    stats.uploadFailNum + '个视频上传失败，<a class="retry" href="#">重新上传</a>失败视频或<a class="ignore" href="#">忽略</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '个（' +
                WebUploader.formatSize(fileSize) +
                '），已上传' + stats.successNum + '个';

            if (stats.uploadFailNum) {
                text += '，失败' + stats.uploadFailNum + '个';
            }
        }
        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                $placeHolder.removeClass('element-invisible');
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass('element-invisible');
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass('element-invisible');
                $('#filePicker2').removeClass('element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                uploader.options.server = upload_url;
                $('#filePicker2').addClass('element-invisible');
                $progress.show();
                $upload.text('暂停上传');
                break;

            case 'paused':
                $progress.show();
                $upload.text('继续上传');
                break;

            case 'confirm':
                $upload.text('开始上传').addClass('disabled');
                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                $upload.text('暂停上传').hide();
                if (stats.successNum) {
                    alert('上传成功');
                    back();
                } else {
                    // 没有成功的图片，重设
                    alert('上传失败');
                    state = 'done';
                    location.reload();

                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function(file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.id][1] = percentage;
        updateTotalProgress();
    };


    uploader.onFileDequeued = function(file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };
    uploader.on('fileQueued', function(file) {

        fileCount++;
        fileSize += file.size;

        if (fileCount === 1) {
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
        }

        addFile(file);
        setState('ready');
        updateTotalProgress();

        uploader.md5File(file, 0, 500 * 1024 * 1024)
            // 及时显示进度
            .progress(function(percentage) {
                $upload.text('开始上传').addClass('disabled');
                $(".uploadBtn").text("MD5校验中");
                console.log('Percentage:', (percentage * 100).toFixed(2) + "%");
            })

        // 完成
        .then(function(fileMd5) {
            file.wholeMd5 = fileMd5;
            //uploader.options.formData.fileMd5 = file.wholeMd5;//每个文件都附带一个md5，便于实现秒传
            console.log('md5 result:', fileMd5);
            $upload.text('开始上传').removeClass('disabled');
            $.ajax({
                url: check_chunk,
                dataType: 'json',
                data: {
                    fileMd5: file.wholeMd5
                },
                success: function(data) {
                    if (data.ischunked) {
                        var len = data.uploaded_chunk.length;
                        var chunks = data.chunks;
                        file.upload_percent = (len / chunks) * 100;
                        var $li = $('#' + file.id),
                            $progress = $li.find('.progress');
                        $progress.css('height', '15px');

                        $percent = $li.find('.progress span');
                        $percent.text(file.upload_percent.toFixed(2) + '%');
                        $percent.css('width', (len / chunks) * 100 + '%');
                        $percent.show();

                    }
                }

            })
        });

    });


    uploader.on('uploadBeforeSend', function(block, data) {
        var deferred = WebUploader.Deferred();
        var file = block.file;
        data.fileMd5 = file.wholeMd5;
        data.vid_id = file.vid_id;
        if (block.chunks > 1) {
            data.isChunked = true; // 切片上传
        } else {
            data.isChunked = false; // 不切片上传
        }
        console.log("正在上传分片:" + block.chunk.toString());
    });

    uploader.on('all', function(type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;

            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;

        }
    });

    uploader.onError = function(code) {
        alert('Eroor: ' + code);
    };

    $upload.on('click', function() {

        if ($(this).hasClass('disabled')) {
            return false;
        }

        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop(true);
        }
    });

    $info.on('click', '.retry', function() {
        uploader.retry();
    });

    $info.on('click', '.ignore', function() {
        alert('todo');
    });

    $upload.addClass('state-' + state);
    updateTotalProgress();
});