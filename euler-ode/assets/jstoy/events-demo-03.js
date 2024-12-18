print(heredoc(function () {/*

<style>
.container h2 {
    font-family: arial, sans-serif;
    color: red;
    padding-left: 18pt;
}
.container div#ode-info {
    padding: 2pt 36pt;
    margin: 3pt 6pt;
    width: 54%;
    background-color: beige;
    color: gray;
}
.container .vlabel label {
    font-family: arial,
    sans-serif; text-align: right;
    color: steelblue;
    padding: 2pt 8pt;
}
.container .vfield input {
    font-family: courier, fixed;
    text-align: right;
    color: teal;
}
.container .vbutton input {
    padding: 2pt 24pt;
}
.container #table-out {
    margin: 6pt 6pt;
    width: 60%;
}
.container #table-out thead {
    display: table;
    width: 100%;
    table-layout: fixed;
    color: steelblue;
    background-color: #d2dddd;
}
.container #table-body { display: block; max-heigth: 30em; overflow-y: auto; }
.container #table-out tr.vpoint-data {
    display: table;
    width: 100%;
    table-layout: fixed;
    text-align: left;
    font-family: monospace;
    font-size: 14px;
    color: steelblue;
    border-bottom-width: thin;
    border-bottom-style: solid;
    border-bottom-color: #d2dddd;
}
</style>

<div id="ode-data" class="container">
    <hr>
    <h2>Numerical integration</h2>
    <form id="form-init" autocomplete="off" method="post" action="">
    </form>
    <div id="ode-table">
        <table id="table-out"></table>
    </div>
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
    <script type="text/template" id="table-out-template">
        <thead>
            <tr class="vpoint-header">
                <th>q</th>
                <th>p</th>
            </tr>
        </thead>
        <tbody id="table-body"></tbody>
    </script>
    <script type="text/template" id="table-body-template">
        <% data.forEach(function (pt) { %>
        <tr class="vpoint-data">
            <td><%~ pt.coordinate %></td>
            <td><%~ pt.momentum %></td>
        </tr>
        <% }) %>
    </script>
    <script type="text/template" id="ode-info-template">
        <%= count %> record(s)
    </script>
</div>

*/}));

load([
    '/euler-ode/js/problems/mp.js',
    '/euler-ode/js/problems/index.js',
    '/euler-ode/js/evector.js',
    '/euler-ode/js/psi.js',
    '/euler-ode/js/point.js',
    '/euler-ode/js/limit.js',
    '/euler-ode/js/integrator.js',
    '/euler-ode/ui/utility.js',
    '/euler-ode/ui/framework.js',
    '/euler-ode/ui/orbit-timeout.js'
], function () {

var $qsa = document.querySelectorAll.bind(document);
var _util = VoidCode.Util;

var Model = VoidCode.Model;
var View = VoidCode.View;
var Controller = VoidCode.Controller;
var Orbit = VoidCode.Orbit;

// Models

var formModel = new Model({
    coordinate: 0,
    momentum: 1
});

var infoModel = new Model({
    count: 0
});

var tbModel = new Model;

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

var tbView = new View({
    elementTable: '#table-out',
    elementBody: '#table-body',
    templateTable: _util.template($qsa('#table-out-template')[0].innerHTML),
    templateBody: _util.template($qsa('#table-body-template')[0].innerHTML),
    render: function (data) {
        $qsa(this.elementTable)[0].innerHTML = this.templateTable(data);
    },
    addElement: function (data) {
        var $tbody = $qsa(this.elementBody)[0];
        $tbody.innerHTML += this.templateBody(data);
        $tbody.scrollTo && $tbody.scrollTo(0, $tbody.scrollHeight - $tbody.clientHeight);
    },
    reset: function () { $qsa(this.elementTable)[0].innerHTML = ''; },
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
        var orb = new Orbit({
            id: "mp",
            integrator: "rk4",
            psi0: [ 0, 1 ],
            time: [ 0, 1 ],
            scale: true,
            step: [ 36, 1 ]
        });
        orb.evolve();
    }
});
formController.init();

var infoController = new Controller({
    model: infoModel,
    view:  infoView,
    events: {}
});
infoController.model.on('task/partial', function (data) {
    print('<--', 'got it:', data.length);
    var count = this.get('count');
    count += data.length;
    this.set({ count: count });
});
infoController.init();

var tbController = new Controller({
    model: tbModel,
    view:  tbView,
    events: {}
});
tbController.model.on('task/partial', function (data) {
    print('<~~', 'got it:', JSON.stringify(data));
    this.trigger(this.id + '/append', data);
});
tbController.view.on(
    tbController.model.id + '/append',
    tbController.view.addElement
);
tbController.init();

}); /* load */
