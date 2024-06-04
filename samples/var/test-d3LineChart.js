var html = heredoc(function () {/*

<style></style>
<div id="custom-container" class="envelope"></div>

*/});

/* Access data */
var dataset = Array.from({ length: 240 + 1 })
  .map((_, i) => i)
  .map(function (v) {
    var x = (v - 120)/24;
    return { x: x, y: (1/Math.sqrt(2*Math.PI))*Math.exp(-x*x/2) };
  });

var xAccessor = function (d) { return d.x; };
var yAccessor = function (d) { return d.y; };

/* Plot graph */
load('https://d3js.org/d3.v7.js', async function () {

print(html);

// 2. Create chart dimensions
var dimensions = {
  width: window.innerWidth*0.96,
  height: 640,
  margin: {
    top: 15,
    right: 15,
    bottom: 20,
    left: 40
  }
};
dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

// 3. Draw canvas
var wrapper = d3.select("#custom-container")
  .append("svg")
  .attr("width", dimensions.width)
  .attr("height", dimensions.height);
var bounds = wrapper.append("g").style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

// 4. Create scales
var yScale = d3.scaleLinear()
  .domain(d3.extent(dataset, yAccessor))
  .range([dimensions.boundedHeight, 0]);
var xScale = d3.scaleLinear()
  .domain(d3.extent(dataset, xAccessor))
  .range([0, dimensions.boundedWidth]);

// 5. Draw data
var lineGenerator = d3.line()
  .x(d => xScale(xAccessor(d)))
  .y(d => yScale(yAccessor(d)));
var line = bounds.append("path")
  .attr("d", lineGenerator(dataset))
  .attr("fill", "none")
  .attr("stroke", "#93af58")
  .attr("stroke-width", 3);

// 6. Draw peripherals
var yAxisGenerator = d3.axisLeft().scale(yScale);
var yAxis = bounds.append("g").call(yAxisGenerator);
var xAxisGenerator = d3.axisBottom().scale(xScale);
var xAxis = bounds.append("g").call(xAxisGenerator);

// print(JSON.stringify(dataset), xAccessor(dataset[0]), yAccessor(dataset[0]));
// print(JSON.stringify(dimensions));

});
