'use strict';
var VoidCode = VoidCode || {};

/*
 * Events are mixed into both the View and Model
 * components so that instances of either of these
 * components can publish Event of interest
 */
VoidCode.Event = (function () {
    var channel = {};
    var trigger = function (event, data) {
        channel.hasOwnProperty(event) && channel[event](data);
    };
    var on = function (event, callback) {
        channel[event] = callback;
    };
    var off = function (event) {
        channel.hasOwnProperty(event) && delete channel[event];
    };
    return {
        trigger: trigger,
        on: on,
        off: off,
    };
})();

/*
 * Model manages the data for an application
 */
void function (root, _util) {
     root.Model = function (attributes) {
        this.id = _util.uniqueId('model');
        this.attributes = attributes || {};
    };
}(VoidCode, VoidCode.Util);

void function (proto, Event, _util) {
    proto.get = function (attrName) {
        return this.attributes[attrName];
    };
    proto.set = function (attributes) {
        _util.extend(this.attributes, attributes);
        this.change(attributes);
        return this;
    };
    proto.change = function (attributes) {
        this.trigger(this.id + '/update', attributes);
    };
    _util.extend(proto, Event);
}(VoidCode.Model.prototype, VoidCode.Event, VoidCode.Util);

/*
 * View is a visual representation of Model that
 * present a filtered view of its current state
 */
void function (root, _util) {
     root.View = function (options) {
        this.id = _util.uniqueId('view');
        _util.extend(this, options);
    };
}(VoidCode, VoidCode.Util);

void function (proto, Event, _util) {
    proto.init = function (model) {
        this.render(model.attributes);
        this.on(model.id + '/update', this.render.bind(this));
    };
    proto.render = function (attributes) {
        console.error(this.id, ': render must be redefined');
    };
    _util.extend(proto, Event);
}(VoidCode.View.prototype, VoidCode.Event, VoidCode.Util);

/* Controllers are an intermediary between Models and
 * Views which are classically responsible for two tasks:
 *
 *   ~ they update the View when the Model changes
 *   ~ they update the Model when the user manipulates the View
 */
void function (root, _util) {
    VoidCode.Controller = function (options) {
        this.id = _util.uniqueId('controller');
        _util.extend(this, options);
        /*
         * we have very loose constructor here
         * expecting presence of the following members:
         *   1. model: Model
         *   2. view: View
         *   3. events: { selector: String, handler: String }
         */
    };
}(VoidCode, VoidCode.Util);

void function (proto, _util, $qsa) {
    proto.init = function () {
        this.model && this.view && this.view.init(this.model);
        if(this.events) {
            _util.each(this.events, function (method, eventName) {
                var parts = eventName.split('/');
                var selector = parts[0];
                var eventType = parts[1];
                var collection = $qsa(selector);
                for(var i = 0; i < collection.length; i++) {
                    if(typeof method === 'string') {
                        collection[i].addEventListener(eventType, this[method]);
                    }
                    if(typeof method === 'function') {
                        collection[i].addEventListener(eventType, method);
                    }
                }
            }.bind(this));
        }
    };
}(
    VoidCode.Controller.prototype,
    VoidCode.Util,
    document.querySelectorAll.bind(document)
);
