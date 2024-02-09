var html = heredoc(function () {/*

<style>
.envelope { display: flex; justify-content: center; margin: 24pt; padding: 30pt; background-color: cyan; }
.element { display: flex; justify-content: center; width: 80%; margin: 12pt; padding: 18pt; background-color: steelblue; }
</style>

<div id="custom-container" class="envelope">
  <div id="custom-area" class="element">Click here</div>
</div>

*/});

var DIV_OUTPUT_CLASS = 'sample-output-before';
var $output = document.querySelector('div.' + DIV_OUTPUT_CLASS);

var $parent= document.querySelector('body');
var $el = document.createElement('div');
$el.className = DIV_OUTPUT_CLASS;
!$output && $parent.insertBefore($el, document.querySelector('h1')), $el.innerHTML = html;

!$output && document.querySelector('div#custom-area').addEventListener('click', function (e) {
  print(Date.now(), e.target.innerHTML);
  e.target.innerHTML = new Date() + '- click me';
  e.target.style.backgroundColor = ['red', 'yellow', 'darkcyan', 'green', 'blue'][Math.floor(5*Math.random())];
});
