'use strict';
void function ($form, $out) {
    if(typeof localStorage === 'object') {
        $form.elements['code'].value = localStorage.getItem('code');
        $form.elements['save'].disabled = true;
    } else {
        $out.innerHTML = 'warning: unable to use local storage';
    }
    $form.addEventListener('submit', function (event) {
        event.preventDefault();
        var print = function () {
            var $line = document.createElement('div');
            $line.className = 'printline';
            $line.innerHTML = Array.prototype.slice.call(arguments).join(' ');
            document.getElementById('print').appendChild($line);
        };
        var load = function (fname, callback) {
            if(Array.isArray(fname)) {
                (fname.length > 1)?
                    load(fname.shift(), function () {
                        load(fname, callback)
                    }):
                    load(fname.shift(), callback);
            } else {
                var $script = document.createElement('script');
                $script.addEventListener('load', function () {
                    this.parentNode.removeChild(this);
                    try {
                        $out.innerHTML = callback();
                    } catch(exception) {
                        print(fname + ': ', exception);
                        typeof(exception.stack) === 'string' && print(exception.stack);
                    }
                });
                $script.addEventListener('error', function () {
                    this.parentNode.removeChild(this);
                    print(fname, ': failed to load');
                });
                $script.src = fname;
                document.head.appendChild($script);
            }
        };
        document.getElementById('print').innerHTML = '';
        try {
            $out.innerHTML = eval($form.elements['code'].value);
        } catch(exception) {
            $out.innerHTML = exception;
            typeof(exception.stack) === 'string' && print(exception.stack);
        }
    }.bind(undefined));
    $form.elements['save'].addEventListener('click', function (event) {
        if(typeof localStorage === 'object') {
            localStorage.setItem('code', $form.elements['code'].value);
            $form.elements['save'].disabled = true;
        }
    });
    $form.elements['code'].addEventListener('change', function (event) {
        $form.elements['save'].disabled = false;
    });
}(document.getElementById('input'), document.getElementById('result'));
