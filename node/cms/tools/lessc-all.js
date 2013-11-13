var fs = require('fs');
var less = require('less');
var exec = require('child_process').exec;

var path = require('path');

var public_dir = path.join(__dirname, "..", "public");  
  
var less_dir = path.join(public_dir, "less", "base.less");  
var css_dir = path.join(public_dir, "css", "base.css"); 

/*
 * lessc less file
 */

function compile_less(input_file, output_file, callback) {  
    var cmd = ['lessc ', input_file, ' > ', output_file].join('');  
    // console.log(cmd);
    exec(
        cmd,
        function(error, stdout, stderr) {  
            if(error) {  
                callback(error);  
            }else{
                // console.log("lessc : success");
                callback(error, "success");
            }  
        }
    );  
}  

exports.lessc = function(filepath, filename, callback){
    fs.realpath(filepath, function(err, val){
        var pathLess = val + '\\';
        var pathCss = val.replace(/less$/gi, "css") + '\\';
        if ( path.extname(filename) === ".less" ) {
            compile_less(pathLess + filename, pathCss + filename.replace(/less$/gi, "css"), callback);
        }
    });
}

exports.lesscAll = function () {
    console.log("all files");

    fs.realpath('public/less', function(err, val){
        var pathLess = val + '\\';
        var pathCss = val.replace(/less$/gi, "css") + '\\';
        // console.log(pathLess, pathCss);
        fs.readdir(pathLess, function(e, files){
            for(var i = 0; i < files.length; i++){
                if ( path.extname(files[i]) === ".less" ) {
                    // console.log(files[i]);
                    compile_less(pathLess + files[i], pathCss + files[i].replace(/less$/gi, "css"), function(){});
                }
            }
        });
    });
}