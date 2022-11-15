load("https://cdn.jsdelivr.net/npm/vue/dist/vue.js", function () {

print(heredoc(function () {/*

<style>
  #info-element { margin: 0.5em 1.5em; font-size: 2.0em; color: darkblue; }
</style>

<h1>The first example with Vue.js</h1>
<div id="info-element"> {{ message }} </div>

*/}));

var info = new Vue({
  el: '#info-element',
  data: {
    message: 'Hello Vue.js!'
  }
});

}) /* load */;
