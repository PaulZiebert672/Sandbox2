var text = 'смолка байкальская';
print(heredoc(function () {/*
<style>
  #qrcodeCanvas { margin: 1em 1em; }
</style>
<p>Render in canvas</p>
<div id="qrcodeCanvas"></div>
*/}));

load([
  'https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js',
  'https://jeromeetienne.github.io/jquery-qrcode/src/jquery.qrcode.js',
  'https://jeromeetienne.github.io/jquery-qrcode/src/qrcode.js'
], function () {
  $('#qrcodeCanvas').qrcode({
    width: 300,
    height: 300,
    text: unescape(encodeURIComponent(text))
  });
});
