var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(censusData) {

    // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.poverty        = +data.poverty;
      data.age            = +data.age;
      data.income         = +data.income;
      data.healthcare     = +data.healthcare;
      data.healthcareLow  = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity        = +data.obesity;
      data.obesityLow     = +data.obesityLow;
      data.obesityHigh    = +data.obesityHigh;
      data.smokes         = +data.smokes;
      data.smokesHigh     = +data.smokesHigh;
      data.smokesLow      = +data.smokesLow;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain( [ d3.min(censusData, d => d.income) * 0.8, d3.max(censusData, d => d.income) * 1.2])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.obesity)])
    .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);
     
    //Create a group for each circle and text, bound to the data
    //Position each group in the circle's position in the chart. 
   var textCirGroup = chartGroup.selectAll("g")
      .data(censusData)
      .enter()
      .append("g")
      .attr("transform", function(d) { 
        return `translate(+${xLinearScale(d.income)},${yLinearScale(d.obesity)})`;
      });

    // Add the circle using this helper function
    textCirGroup.append("circle")
    .attr('r', 20)
    .classed('stateCircle', true);

    //Add the text inside the circle
    textCirGroup.append("text")
    .text( function (d) {
      return (d.abbr);
    })
    .classed('stateText', true);

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(
      function(d) {
        return (`${d.state}<br>Med. Income: ${Math.round(d.income/1000)}K<br>Obesity Index: ${d.obesity}`);
      }
    );
    // Create tooltip in the chart
    // ==============================
    textCirGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    // 1) Mouse Over event
    textCirGroup.on("mouseover", function (d) {
      toolTip.show(d, this);
    });
    // 2) Mouse Out event
    textCirGroup.on("mouseout", function (d) {
      toolTip.hide(d);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity Index (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Median Income");

  }).catch(function(error) {
    console.log(error);
  });