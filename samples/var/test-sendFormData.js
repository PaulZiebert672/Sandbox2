print(heredoc(function () {/*
<div>
<form id="aacaf978">
<input id="b0089008" name="code" type="text" />
<input type="submit" />
</form>
</div>
*/}));

var $form = document.querySelector('#aacaf978');
$form.addEventListener('submit', async e => {
  e.preventDefault();
  var data = new URLSearchParams();
  for(var pair of new FormData(e.target)) {
    data.append(pair[0], pair[1]);
  }
  print('form: ', e.target);
  print('--> ', data);

  try {
    var result = await fetch('http://localhost:6780/api/v1/200', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    });
    print('response status:', result.status);
    var payload = await result.text();
    print('response body:', payload);
  } catch(err) {
    print(err);
  }

});
