/* custom events */

var el = heredoc(function () {/*
<div id="content-0890">
  <div id="form-1966">
    <form>
      <input type="text">
      <input type="submit">
    </form>
  </div>
  <div id="display-2479">
  </div>
</div>
*/});
print(el);

var $el = document.querySelector('#content-0890');

$el.addEventListener('custom-event-update', function (e) {
  var $display = $el.querySelector('#display-2479');
  $display.innerHTML = `step number: ${e.detail.num + 1}`;
});

$el.addEventListener('submit', async function (e) {
  e.preventDefault();
  print(new Date(), '...');
  print('-->', e.target);
  for(var i = 0; i < 12; i++) {
    $el.dispatchEvent(new CustomEvent('custom-event-update', {
      bubbles: true,
      detail: { num: i },
    }));
    await new Promise(r => setTimeout(r, 2000)); /* sleep */
  }
  print('...', 'end of processsing');
});