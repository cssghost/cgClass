var fs = require('fs');
var lessc = require('./lessc-all');
var exec = require('child_process').exec;

var path = require('path');

var public_dir = path.join(__dirname, "..", "public");  
  
var less_dir = path.join(public_dir, "less", "base.less");  
var css_dir = path.join(public_dir, "css", "base.css"); 

/*
 * edit file
 */

exports.editFile = function (filepath, filename, param, callback) {
    if ( filepath && filename ) {
        fs.realpath(filepath, function(err, rpath){
            if ( err ) {
                callback(err);
                return false;
            }
            fs.readFile(
                rpath + "/" + filename,
                'utf-8',
                function(readErr, data) {
                    if (readErr) {
                        callback(readErr);
                        return false;
                    } else {
                        var strFile = data;
                        for(var key in param){
                            var reg = new RegExp("\@" + key + "[^\\;]+\\;", "gi");
                            strFile = strFile.replace(reg, "@" + key + ":" + param[key] + ";");
                        }
                        var resultBuffer = new Buffer(strFile);
                        fs.writeFile(rpath + "/" + filename,resultBuffer,function(writeErr){
                            if(writeErr) {
                                callback(writeErr);
                                return false;
                            }
                            console.log(rpath);
                            lessc.lessc(rpath.replace(/\\[^\\]+\\?$/gi,"\\"), filename.replace("config-", ""), callback);
                            // callback(readErr, "success");
                        });
                    } 
                }
            );
        });
    }else{
        callback('路径错误');
    }
}