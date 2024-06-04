var html = heredoc(function () {/*

<style>
.envelope { display: flex; justify-content: center; margin: 24pt; padding: 30pt; background-color: cyan; }
.element { display: flex; justify-content: center; width: 80%; margin: 12pt; padding: 18pt; background-color: steelblue; }
.status { text-align: right; color: red; font-family: Arial, sans-serif; }
</style>

<div id="custom-container" class="envelope">
  <div id="custom-area" class="element">Click here</div>
</div>

<div id="info-001" class="status"></div>
<div id="info-002" class="status"></div>

*/});

var DIV_OUTPUT_CLASS = 'sample-output-before';
var $output = document.querySelector('div.' + DIV_OUTPUT_CLASS);

var $parent= document.querySelector('body');
var $el = document.createElement('div');
$el.className = DIV_OUTPUT_CLASS;
!$output && $parent.insertBefore($el, document.querySelector('h1')), $el.innerHTML = html;

!$output && document.querySelector('div#custom-area').addEventListener('click', function (e) {
  e.target.dispatchEvent(new CustomEvent('custom-event-update', {
      bubbles: true,
      detail: { date: new Date() },
    }));
});

!$output && document.querySelector('div#custom-container').addEventListener('custom-event-update', function (e) {
  document.querySelectorAll('div.status').forEach(function ($x) {
    $x.innerHTML = 'internal div clicked: ' + JSON.stringify(e.detail);
  });
});
