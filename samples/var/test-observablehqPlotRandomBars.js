var html = heredoc(function () {/*

<style></style>
<div id="custom-container" class="envelope"></div>

*/});

/* Plot graph */
load(['https://cdn.jsdelivr.net/npm/d3@7', 'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6'], function () {

print(html);

const plot = Plot.rectY({length: 10000}, Plot.binX({y: "count"}, {x: Math.random})).plot();
const div = document.querySelector("#custom-container");
div.append(plot);

});
