var exec = require("child_process").exec;
var fs = require("fs");
var url = require("url");
var querystring = require('querystring'); 

function login(request, response){
    var params = url.parse(request.url, true).query;
    console.log(request.url);
    var info ='';  
    request.addListener('data', function(chunk){  
        info += chunk;  
    })  
    .addListener('end', function(){  
        var file = fs.readFileSync('../less/popup.less', "utf8");
        var _match = file.match(/(\@[^\@\:\{\}]+\:[^\;\n\{\}]+\;)/gi);
        if( _match ){
            var value = "@import \"less-base\";\n";
            for(var i = 0; i < _match.length; i++ ){
                value += _match[i] + "\n";
            }
            var resultBuffer = new Buffer(value);
            fs.writeFile('../css/test.css', resultBuffer, function(err){
                if(err) throw err;
                console.log('has finished');
            })
            
        }
        // info = querystring.parse(info);  
        // response.send(JSON.stringify(info));
        // console.log(typeof info);  
    });
}


function start(request, response) {
    console.log("Request handler 'start' was called.");

    exec(
        "find /",
        { timeout: 10000, maxBuffer: 20000*1024 },
        function(error, stdout, stderr){
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write(stdout);
            response.end(); 
        }
    );
}
function upload(request, response) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello Upload");
    response.end();
}

function readLess(request, response){
    var file = fs.readFileSync('./module-common.less', "utf8");
    var _match = file.match(/(\@[^\@\:]+\:[^\;\n]+\;)/gi);
    var params = url.parse(request.url, true).query;
    if( _match ){
        var value = "@import \"less-base\";\n";
        response.writeHead(200, {"Content-Type": "text/plain"});
        for(var i = 0; i < _match.length; i++ ){
            response.write(_match[i] + "\n");
            value += _match[i] + "\n";
        }
        for(var key in params){
            response.write(key + " " + params[key] + "\n");
        }
        response.end();
        var resultBuffer = new Buffer(value);
        fs.writeFile('./module-common.less',resultBuffer,function(err){
            if(err) throw err;
            console.log('has finished');
        })
        
    }

    // fs.readFile('./json.json',function(err,data){
    //     if(err) throw err;

    //     var result = JSON.parse(data);
    //     if ( result.success ) {
    //         var dataList = result.list;
    //         var chunks = [];    
    //         var length = 0;
    //         for( var i = 0; i < dataList.length; i++ ){
    //             // console.log("id : " + dataList[i].id);
    //             // console.log("name : " + dataList[i].name);
    //             var val = " id : " + dataList[i].id + "name : " + dataList[i].name;
    //             var buffer = new Buffer(val);
    //             chunks.push(buffer);
    //             length += buffer.length;
    //         }
    //         var resultBuffer = new Buffer(length);
    //         for(var i=0,size=chunks.length,pos=0;i<size;i++){
    //             chunks[i].copy(resultBuffer,pos);
    //             pos += chunks[i].length;
    //         }
            
    //         fs.writeFile('./resut.less',resultBuffer,function(err){
    //             if(err) throw err;
    //             console.log('has finished');
    //         });
    //     }
    // });
}

exports.start = start;
exports.upload = upload;
exports.readLess = readLess;
exports.login = login;