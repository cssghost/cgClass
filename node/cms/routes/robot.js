var editFile = require("../tools/edit-file");
var fs = require("fs");


exports.readChatConfig = function(req, res){
    fs.readFile(
        "public/less/config/config-robot.less",
        'utf-8',
        function(readErr, data) {
            if (readErr) {
                callback(readErr);
                return false;
            } else {
                var strFile = data;
                var matchColor = strFile.match(/\@chat-bc\:(.+)\;/);
                var matchImage = strFile.match(/\@chat-bg\:(.+)\;/);
                var matchImageRepeat = strFile.match(/\@chat-repeat\:(.+)\;/);
                var isColor = matchColor[1] == "transparent" ? "" : "checked";
                var isImage = matchImage[1] == "i.gif" ? "" : "checked";
                var isRepeat = matchImageRepeat[1] == "no-repeat center" ? "" : "checked";
                // res.send(matchColor[1]);
                res.render('robot', { title : "robot", chatColor: matchColor[1], chatColorChecked : isColor, chatImageChecked : isImage, chatImageRepeatChecked : isRepeat });
                // for(var key in param){
                //     var reg = new RegExp("\@" + key + "[^\\;]+\\;", "gi");
                //     strFile = strFile.replace(reg, "@" + key + ":" + param[key] + ";");
                // }
                // var resultBuffer = new Buffer(strFile);
                // fs.writeFile(rpath + "/" + filename,resultBuffer,function(writeErr){
                //     if(writeErr) {
                //         callback(writeErr);
                //         return false;
                //     }
                //     console.log(rpath);
                //     lessc.lessc(rpath.replace(/\\[^\\]+\\?$/gi,"\\"), filename.replace("config-", ""), callback);
                //     // callback(readErr, "success");
                // });
            } 
        }
    );
    // res.render('robot', { chatcolor: 'matchColor[1]' });
};

exports.robotChatBg = function(req, res){
    var result = req.body;
    var bc = result.color;
    var colorValue = result.colorValue;
    var isImage = result.isImage;
    var isRepeat = result.isRepeat;
    var image = req.files.image;
    var newImg = image ? 'config-robot-chat-bg.' + image.name.replace(/^.*\./gi, "") : "i.gif";
    var isColor = bc ? true : false;
    var editData = { "chat-bc" : "transparent", "chat-repeat" : "no-repeat center" };
    // console.log(image);
    if ( isImage && image ) {
        // 获得文件的临时路径
        var tmp_path = image.path;
        // 指定文件上传后的目录 - 示例为"images"目录。 
        var target_path = './public/images/tpls/' + newImg;
        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件, 
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                editData["chat-bg"] =  '"' + newImg + '"';
            });
        });
    }else {
        editData["chat-bg"] = "i.gif";
    }

    if ( isRepeat ) {
        editData["chat-repeat"] = "repeat-x 0 0";
    }

    if ( isColor && colorValue ) {
        editData["chat-bc"] = colorValue;
    }

    editFile.editFile(
        'public/less/config/',
        'config-robot.less',
        editData,
        function(err, file){
            if ( !err ) {
                res.send(file);
            }else{
                res.send(err);
            }
        }
    );
};
