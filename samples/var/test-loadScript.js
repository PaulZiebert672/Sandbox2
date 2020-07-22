print(`
<style>.strange {font-size: 18pt; font-family: Helvetica; color: blue; padding-left: 12pt;}</style>
<div class="big strange">111</div>
<div class="small strange">222</div>
`);

load([
  'https://zeptojs.com/zepto.js',
  'https://underscorejs.org/underscore.js'
], function () {
  _.each($('.strange'), function (el) {
    print($(el).attr('class'));
  });
});
