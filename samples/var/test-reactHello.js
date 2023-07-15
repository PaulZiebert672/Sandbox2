print(heredoc(function () {/*

<div id="content"></div>

*/}));

load([
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js'
], function () {

  var $h1 = React.createElement('h1', null, 'hi, there..');
  ReactDOM.render($h1, document.getElementById('content'));
});
