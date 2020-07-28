var cdnJquery = 'https://code.jquery.com/jquery-3.5.1.js';
var cdnBootstrap = {
  css: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.css',
  js: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.js'
};

link(cdnBootstrap.css);
print(heredoc(function () { /*
<style>.productInStockList {font-size: 1.25em; color: red;}</style>
<div class="row"><div class="col-md-1 offset-md-1 productInStockList">113</div></div>
<div class="row"><div class="col-md-1 offset-md-1 productInStockList">204</div></div>
<div class="row"><label class="col-md-1">Amount:</label><div class="col-md-1 productInStockList">317</div></div>
<div class="row"><button class="col-md-1 offset-md-2 btn btn-outline-secondary">Go!</button></div>
*/ }));

load([cdnJquery, cdnBootstrap.js], function () {
  if(!$('body > div.container-fluid').length) {
    $('body').wrapInner('<div class="container-fluid"></div>');
  }
  $('.productInStockList').each((idx, el) => {
    print($(el).text(), $(el).attr('class'));
  });
});
