print(heredoc(function () {/*

    <!-- DOM element for plotly scatter diagram -->
    <div id="plot"></div>

*/}));
load([
    '/Sandbox/samples/es5/kepler-orbit.js',
    'https://cdn.plot.ly/plotly-2.35.2.min.js'
], function () {

var N = 120;    // number of points
var eps = 0.28; // eccentricity
var x = [], y = [];
var orbit = new KeplerOrbit(eps);

for (var n = 0; n < N; n++) {
    var t = n*2*Math.PI/N;
    var coord = orbit.coord(t);
    x.push(coord.q[0]);
    y.push(coord.q[1]);
};

var trace = {
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter',
    name: `eccentricity = ${eps}`
};

var data = [trace];
var layout = {
    title: 'Kepler problem',
    width: 900,
    height: 900,
    yaxis: { scaleanchor: "x" },
    showlegend: true,
    legend: {
    x: 1,
    xanchor: 'center',
    y: 1
    }
};
Plotly.newPlot('plot', data, layout);

}); /* load */
