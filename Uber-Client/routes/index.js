
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('custDriver', { title: 'Express' });
};