load('https://cdn.jsdelivr.net/npm/flotr2@0.1.0/flotr2.js', function () {

var NMAX = 15000;
var x, y, data = [[], []];
var prepare = function (x) { return 2*x - 1; };
for(var i = 0, count = 0; i < NMAX; i++) {
    x = prepare(Math.random());
    y = prepare(Math.random());
    if(x*x + y*y < 1) {
        data[0].push([x, y]);
        count++;
    } else {
        data[1].push([x, y]);
    }
}
print('pi approx =', 4*count/NMAX);

var html = heredoc(function () {/*
<div id="chart" style="width:800px; height:800px;"></div>
*/});
print(html);

Flotr.draw(
    document.getElementById("chart"),
    [{
        data: data[0],
        points: { show: true, radius: 0.3, color: 'seagreen' }
    }, {
        data: data[1],
        points: { show: true, radius: 0.3, color: 'steelblue' }
    }],
    {
        title: 'Random scatter',
        subtitle: 'Monte-Carlo method',
        xaxis: { min: -1, max: 1 },
        yaxis: { min: -1, max: 1 }
    }
);

});