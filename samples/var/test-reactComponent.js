/* render DOM node */
print(heredoc(function () {/*

<div id="content"></div>

*/}));

load([
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js'
], function () {

class HelloWorld extends React.Component {
  render() {  /* shortcut for `render: function () {` */
    return React.createElement(
      'h1',
      Object.assign(
        { style: { color: 'crimson', fontFamily: 'sans-serif, Arial' } },
        this.props
      ),
      'hi, ' + this.props.frameworkName
    );
  }
}

ReactDOM.render(
  React.createElement(
    'div',
    null,
    React.createElement(
      HelloWorld,
      {
        id: 'backbone',
        frameworkName: 'Backbone.js',
        title: 'Backbone.js gives structure to web applications'
      }
    ),
    React.createElement(
      HelloWorld,
      {
        id: 'angular',
        frameworkName: 'Angular',
        title: 'Superheroic JavaScript MVW Framework'
      }
    )
  ),
  document.getElementById('content')
);

}); /* load */
