var tools = require('../tools/lessc');
/*
 * GET home page.
 */
// module.exports = function(app){
//     app.get('/', function(req, res){
//         res.render('index', { title: 'Express' });
//     });
// };
exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.hello = function(req, res) {
    console.log(tools);
    res.send('The time is ' + new Date().toString());
}; 
