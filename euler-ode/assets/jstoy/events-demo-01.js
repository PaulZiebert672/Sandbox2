var log = function (s) { return print('<pre>' + escapeHtml(JSON.stringify(s, null, 4)) + '</pre>'); };
print(heredoc(function () {/*

<style>
.container h2 { font-family: arial, sans-serif; color: red; padding-left: 18pt; }
.container div#ode-info { padding: 2pt 36pt; margin: 3pt 6pt; background-color: beige; color: gray; }
.container .vlabel label { font-family: arial, sans-serif; text-align: right; color: steelblue; padding: 2pt 8pt; }
.container .vfield input { font-family: courier, fixed; text-align: right; color: teal; }
.container .vbutton input { padding: 2pt 24pt; }
</style>

<div id="ode-data" class="container">
  <hr>
  <h2>Numerical integration</h2>
  <form id="form-init" autocomplete="off" method="post" action="">
  </form>
  <div id="ode-info">
  </div>
  <hr>
</div>
<div id="ode-templates" class="template">
  <script type="text/template" id="form-init-template">
    <div>
      <span class="vlabel">
        <label for="coordinate">(q, p) @ t0:</label>
      </span>
      <span class="vfield">
        <input name="coordinate" value="<%= coordinate %>" size="24" type="text">
        <input name="momentum" value="<%= momentum %>" size="24" type="text">
      </span>
      <span class="vbutton">
        <input name="submit" value="submit" type="submit">
      </span>
    </div>
  </script>
  <script type="text/template" id="ode-info-template">
    <%= count %> record(s)
  </script>
</div>

*/}));

load([
  '/euler-ode/ui/utility.js',
  '/euler-ode/ui/framework.js'
], function () {

var _util = VoidCode.Util;
var $qsa = document.querySelectorAll.bind(document);
var Model = VoidCode.Model;
var View = VoidCode.View;
var Controller = VoidCode.Controller;

// Models

var formModel = new Model({
  coordinate: 0,
  momentum: 1
});

var infoModel = new Model({
  count: 0
});
infoModel.on('chunk/complete', function () {
  print('<--', 'got it');
  // log(this);
  var count = this.get('count');
  this.set({ count: ++count });
}.bind(infoModel));

// Views

var formView = new View({
  el: '#form-init',
  template: _util.template($qsa('#form-init-template')[0].innerHTML),
  render: function (data) {
    $qsa(this.el)[0].innerHTML = this.template(data);
  }
});

var infoView = new View({
  el: '#ode-info',
  template: _util.template($qsa('#ode-info-template')[0].innerHTML),
  render: function (data) {
    $qsa(this.el)[0].innerHTML = this.template(data);
  },
  reset: function () { $qsa(this.el)[0].innerHTML = ''; },
});

// Controllers

var formController = new Controller({
  model: formModel,
  view:  formView,
  events: {
    '#form-init/submit': 'onSubmit',
    // '#form-init input[type="text"]/change': 'onTextChanged',
    // '#form-init input[type="checkbox"]/change': 'onCheckboxChanged',
  },
  onSubmit: function (event) {
    event.preventDefault();
    evolution();
  }

});
formController.init();

var infoController = new Controller({
  model: infoModel,
  view:  infoView,
  events: {}
});
infoController.init();

// log(formModel);
// log(formView);
// log(infoController);

var evolution = function () {
  var NMAX = 24;
  var sleepFor = function (time) {
    var now = new Date().getTime();
    while(new Date().getTime() < now + time) { /* do nothing */ }
  };
  var Event = VoidCode.Event;
  for(var i = 0; i <= NMAX; i++) {
    setTimeout(function (k, Event) {
       var alpha = 2*Math.PI*k/NMAX;
       sleepFor(600);
       var result = [Math.cos(alpha), Math.sin(alpha)];
       print('-->', result);
       Event.trigger('chunk/complete');
    }, 0, i, Event);
  }
};

}); /* load */
