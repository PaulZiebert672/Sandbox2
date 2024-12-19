(function () {
    const $tblData = document.querySelector('#integration-result-table-data-template');
    const htmlTable = ejs.render($tblData.innerHTML);
    document.querySelector('.container #integration-result-table').innerHTML = htmlTable;
    const $tblRow = document.querySelector('#integration-result-table-row-template');
    const template = ejs.compile($tblRow.innerHTML);

    const $el = document.querySelector('.container #integration-config-model');
    $el.addEventListener('custom-event-update', function (e) {
        var breakArray = function (s) {
            return Array.isArray(s)? s.join('<br>'): s;
        };
        var detail = {
            data: e.detail.data.map(function (x) {
                return {
                    time: x.time,
                    coordinate: breakArray(x.coordinate),
                    momentum: breakArray(x.momentum),
                    invariant: breakArray(x.invariant)
                };
            })
        };
        console.log('==>', detail.data.length);
        var htmlRow = template(detail);
        var $tbody = document.querySelector('.container #integration-result-table-body');
        $tbody.innerHTML += htmlRow;
        window.scrollTo(0, document.body.scrollHeight);
    });    
})();
