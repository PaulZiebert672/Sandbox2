(function () {
    const appWorker = new Worker('/euler-ode/ui/orbit-worker.js');
    const $el = document.querySelector('.container #integration-config-model');
    appWorker.postMessage($el.textContent);
    
    appWorker.onmessage = function (e) {
        console.log('  <--', e.data);
        var data = e.data;
        $el.dispatchEvent(new CustomEvent('custom-event-update', {
            bubbles: true,
            detail: { data: data },
        }));
    };    
})();
