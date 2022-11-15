var NMAX = 108;
var $qsa = document.querySelectorAll.bind(document);

var container = heredoc(function () {/*
<div id="svg-container"></div>
*/});

var coordinates = function (n) {
  var theta = 2*Math.PI*n/NMAX;
  return [100*Math.cos(theta), 100*Math.sin(theta)];
};

var createSvgElement = function (name, attr) {
  var $el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for(var prop in attr) { $el.setAttribute(prop, attr[prop]); }
  return $el;
}, $cse = createSvgElement;

var createGraph = function (coord) {
  var $svg = $cse('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '-105 -105 210 210' });
  $svg.appendChild($cse('line', { x1: -105, y1: 0, x2: 105, y2: 0, stroke: 'dimgray', 'stroke-width': '0.15%', 'stroke-dasharray': '0.5% 0.5%' }));
  $svg.appendChild($cse('line', { x1: 0, y1: -105, x2: 0, y2: 105, stroke: 'dimgray', 'stroke-width': '0.15%', 'stroke-dasharray': '0.5% 0.5%' }));
  for(var i = 0; i < NMAX; i++) {
    var result = coord(i);
    $svg.appendChild($cse('circle', { cx: result[0], cy: result[1], r: '0.3%', fill: 'lightcoral' }));
  }
  return $svg;
};

print(container);
$qsa('#svg-container')[0].appendChild(createGraph(coordinates));
