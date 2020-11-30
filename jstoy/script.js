'use strict';
void function ($form, $out) {
    /* DOM manipulation helpers */
    var print = function () {
        var $line = document.createElement('div');
        $line.className = 'printline';
        $line.innerHTML = Array.prototype.slice.call(arguments).join(' ');
        document.getElementById('print').appendChild($line);
    };
    var load = function (src, callback) {
        if(Array.isArray(src)) {
            (src.length > 1)?
                load(src.shift(), function () {
                    load(src, callback)
                }):
                load(src.shift(), callback);
        } else {
            var $script = document.createElement('script');
            $script.addEventListener('load', function () {
                this.parentNode.removeChild(this);
                try {
                    $out.innerHTML = callback();
                } catch(exception) {
                    print(src + ': ', exception);
                    if(typeof exception.stack === 'string') {
                        print('<pre>' + exception.stack + '</pre>');
                    }
                }
            });
            $script.addEventListener('error', function () {
                this.parentNode.removeChild(this);
                print(src, ': failed to load');
            });
            $script.src = src;
            document.head.appendChild($script);
        }
    };
    var link = function (href) {
        var basename = href.split('/').slice(-1)[0];
        var $link = Array.prototype.slice.call(document.head.querySelectorAll('link'))
            .filter(function (el) {
                return el.href.split('/').slice(-1)[0] === basename;
            })[0];
        if(!$link) {
            $link = document.createElement('link');
            $link.rel = 'stylesheet';
            $link.type = 'text/css';
            $link.href = href;
            document.head.appendChild($link);
        }
    };
    /* ES5 compatibility helpers */
    var escapeHtml = function (html) {
        var inventory = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
        for(var sym in inventory) {
            html = html.replace(RegExp(sym, "g"), inventory[sym]);
        }
        return html;
    };
    var heredoc = function (fn) {
        return fn.toString().split('\n').slice(1, -1).join('\n');
    };
    var template = function (text) {
        var config = {
            interpolate: /<%=(.+?)%>/g,
            evaluate: /<%(.+?)%>/g
        };
        return new Function("data",
            "var output = " +
            JSON.stringify(text)
                .replace(config.interpolate, '" + (data.$1) + "')
                .replace(config.evaluate, '"; $1 output += "') +
            "; return output;"
        );
    };

    /* Entry point */
    if(typeof localStorage === 'object') {
        $form.elements['code'].value = localStorage.getItem('code');
        $form.elements['save'].disabled = true;
    } else {
        $out.innerHTML = 'warning: unable to use local storage';
    }
    $form.addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('print').innerHTML = '';
        try {
            $out.innerHTML = eval($form.elements['code'].value);
        } catch(exception) {
            $out.innerHTML = exception;
            if(typeof exception.stack === 'string') {
                $out.innerHTML += '<pre>' + exception.stack + '</pre>';
            }
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
