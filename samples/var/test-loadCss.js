if(!document.head.querySelector('#id12')) {
  var $link = document.createElement('link');
  $link.rel = 'stylesheet';
  $link.type = 'text/css';
  $link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.css';
  $link.id = 'id12';
  document.head.append($link);
}

//document.head.removeChild(document.head.querySelector('#id12'));

//document.head.removeChild(document.head.querySelector('#id12'));
var $initLink = [].slice.call(document.head.querySelectorAll('link'))
  .filter(function (el) {
    var tgt = "style.css";
    return el.href.slice(-(tgt.length)) == tgt;
  })[0];
//$initLink && document.head.removeChild($initLink);

load([
  'https://code.jquery.com/jquery-3.5.1.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.js'
], function () {

  print('<h1>Hello</h1>');

})
