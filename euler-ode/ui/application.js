'use strict';
var VoidCode = VoidCode || {};

VoidCode.Evolution = (function (_util, $qsa) {
    var Config = VoidCode.Config,
        Event = VoidCode.Event,
        Model = VoidCode.Model,
        View = VoidCode.View,
        Point = VoidCode.Point,
        Psi = VoidCode.Psi,
        Limit = VoidCode.Limit,
        Problem = VoidCode.Problem;
    var tbModel = new Model;
    var statModel = new Model({
        realT: 0,
        nRecords: 0
    });
    var outModel = new Model({
        title: '...',
        integrator: '',
        h: '',
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
    var statView = new View({
        el: '#stat',
        template: _util.template($qsa('#div-stat-template')[0].innerHTML),
        render: function (data) {
            $qsa(this.el)[0].innerHTML = this.template(data);
        },
        reset: function () { $qsa(this.el)[0].innerHTML = ''; },
    });
    var outView = new View({
        el: '#output',
        template: _util.template($qsa('#div-output-template')[0].innerHTML),
        render: function (data) {
            $qsa(this.el)[0].innerHTML = this.template(data);
        },
    });

    /* Init all views and set event listeners */
    var init = function () {
        tbModel.change = function (attributes) {
            this.trigger(this.id + '/append', attributes);
        };
        tbView.init(tbModel);
        tbView.on(tbModel.id + '/append', tbView.addElement.bind(tbView));
        statView.init(statModel);
        outView.init(outModel);
    };
    var evolve = function () {
        var t0 = Config.time[0], t1 = Config.time[1];
        var pt = Point.create({
            "t": t0,
            "psi": new Psi(Config.psi0)
        }, Config);
        var nMax = Config.step[0];
        var nSkip = Config.step[1];
        var tau, h;
        if(Config.scale && Problem[Config.id].hasOwnProperty('period')) {
            tau = Problem[Config.id].period.call(pt, pt.toValue());
            if(!isNaN(tau - parseFloat(tau))) {
                t0 *= tau;
                t1 *= tau;
                pt.t = t0;
            }
        }
        h = (t1 - t0) / nMax;
        outModel.set({
            title: Problem[Config.id].title,
            integrator: Config.integrator,
            h: h,
        });
        /* try to hold coordinates in prescribed limits */
        var limits = null;
        if(Problem[Config.id].hasOwnProperty('limits')) {
            limits = function (q) {
                return Limit.normalizeQ(q, Problem[Config.id].limits);
            };
        }
        var dump = function (pt) {
            var display = function (value) {
                return (value instanceof Array)? value.join('<br>'): value;
            };
            tbModel.set({
                time: pt.t,
                coordinate: display(pt.psi.q),
                momentum: display(pt.psi.p),
                invariant: display(pt.toValue()),
            });
        };
        var realT0 = Date.now();
        var i = 0;
        var chunk = function () {
            var k = 0;
            do {
                pt.integrator(h);
                limits && (pt.psi.q = limits(pt.psi.q));
                i++;
                k++;
                if(i % nSkip === 0) {
                    dump(pt);
                }
            } while(i < nMax && k < 200); /* magic number */
            statModel.set({
                realT: ((Date.now() - realT0) / 1000).toFixed(3),
                nRecords: i,
            });
            if(i < nMax) {
                setTimeout(chunk, 0);
            } else {
                Event.trigger('task/complete');
            }
        };
        dump(pt);
        chunk();
    };
    var reset = function () {
        tbView.reset();
        statView.reset();
    };
    return {
        init: init,
        evolve: evolve,
        reset: reset,
    };
})(VoidCode.Util, document.querySelectorAll.bind(document));

/* ------------ */

VoidCode.Run = function (_util, $qsa) {
    var Config = VoidCode.Config,
        Point = VoidCode.Point,
        Integrator = VoidCode.Integrator,
        Problem = VoidCode.Problem,
        Event = VoidCode.Event,
        Model = VoidCode.Model,
        View = VoidCode.View,
        Controller = VoidCode.Controller,
        Evolution = VoidCode.Evolution;
    var formModel = new Model({
        id: Config.id,
        integrator: Config.integrator,
        params: Config.params,
        time0: Config.time[0],
        time1: Config.time[1],
        step: Config.step[0],
        skip: Config.step[1],
        coordinate: Config.psi0[0],
        momentum: Config.psi0[1],
        scale: Config.scale,
    });
    var formView = new View({
        el: '#form-init',
        template: _util.template($qsa('#form-init-template')[0].innerHTML),
        render: function (data) {
            $qsa(this.el)[0].innerHTML = this.template(data);
        },
    });
    var formController = new Controller({
        model: formModel,
        view:  formView,
        events: {
            '#form-init/submit': 'onSubmit',
            '#form-init input[type="text"]/change': 'onTextChanged',
            '#form-init input[type="checkbox"]/change': 'onCheckboxChanged',
        },
        onSubmit: function (event) {
            var model = formController.model;
            var parseArrayOrScalar = function (src) {
                if(typeof src === 'string'
                    && src.indexOf(',') !== -1
                    && src.indexOf('[') === -1
                ) {
                    src = '[' + src + ']';
                }
                return JSON.parse(src);
            };
            var fail = function(err) {
                $qsa('#output')[0].innerHTML = err;
                model.isProcessed = false;
                Evolution.reset();
            };

            event.preventDefault();
            /* prevent reentry */
            if(!model.isProcessed) {
                model.isProcessed = true;
            } else {
                return false;
            }
            Event.on('task/complete', function () {
                model.isProcessed = false;
            });
            Config.id = model.get('id');
            Config.integrator = model.get('integrator');
            Config.time[0] = parseFloat(model.get('time0'));
            Config.time[1] = parseFloat(model.get('time1'));
            Config.scale = !!model.get('scale');
            Config.step[0] = parseInt(model.get('step'));
            Config.step[1] = parseInt(model.get('skip'));
            try {
                Config.psi0[0] = parseArrayOrScalar(model.get('coordinate'));
                Config.psi0[1] = parseArrayOrScalar(model.get('momentum'));
                Config.params = JSON.parse(model.get('params'));
                Point.prototype.ode = Problem[Config.id].ode;
                Point.prototype.invariant = Problem[Config.id].invariant;
                Point.prototype.integrator = Integrator(Config.integrator);
                Point.prototype.params = Config.params;
            }
            catch(ex) {
                fail(ex.toString());
                return false;
            }
            /*
             * ----- BEGIN VALIDATION BLOCK ------
             */
            if(!Config.time.every(function (num) {
                return isFinite(num);
            })) {
                fail('time variable is not valid');
                return false;
            }
            if(!Config.step.every(function (num) {
                return num > 0;
            })) {
                fail(
                    $qsa('span.vlabel > label[for="step"]')[0].innerHTML
                    + ' value is expected to be a positive integer'
                );
                return false;
            }
            if(
                !(function (obj) { /* returns flat array of values */
                    var ar = [];
                    _util.each(obj, function (value) {
                        ar.push(value);
                    });
                    return ar.concat.apply([], ar);
                })(Point.prototype.ode.call(Config, {
                    q: Config.psi0[0],
                    p: Config.psi0[1]
                })).every(function (num) {
                    return isFinite(num);
                })
                || Config.psi0[0].length !== Config.psi0[1].length
            ) {
                console.warn(
                    'xdot is bad:',
                    JSON.stringify(Point.prototype.ode.call(Config, {
                        q: Config.psi0[0],
                        p: Config.psi0[1]
                    }))
                );
                fail(
                    $qsa('span.vlabel > label[for="coordinate"]')[0].innerHTML
                    + ' value is inappropriate for the given problem id'
                );
                return false;
            }
            /*
             * ----- END VALIDATION BLOCK ------
             */
            Evolution.init();
            setTimeout(Evolution.evolve, 0);
            return false;
        },
        onTextChanged: function () {
            /* update model without triggering render */
            formController.model.attributes[this.name] = this.value;
            return this;
        },
        onCheckboxChanged: function () {
            /* update model without triggering render */
            formController.model.attributes[this.name] = this.checked;
            return this;
        },
    });
    formController.init();
};

/* ------------ */

VoidCode.Run(VoidCode.Util, document.querySelectorAll.bind(document));
