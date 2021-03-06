var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

///////////////////////////

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("transform", function(d) { 
      return `translate(+${newXScale(d[chosenXAxis])},${newYScale(d[chosenYAxis])})`;
    });

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xLabel;

  switch (chosenXAxis) {
    case "poverty": {
      xLabel="In Poverty (%)";
    }
    break;
    case "age": {
        xLabel="Age";
    }
    break;
    case "income": {
       xLabel="Household Income (Median)";
    }
    break;
  }

  var yLabel;

  switch (chosenYAxis) {
    case "obesity": {
      yLabel="Obesity (%)";
    }
    break;
    case "smokes": {
        yLabel="Smoker";
    }
    break;
    case "healthcare": {
       yLabel="Lacks Healthcare (%))";
    }
    break;
  }
  

  let toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
    });


  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  });

  circlesGroup.on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//////////////////////////////

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(stateData, err) {
  if (err) throw err;
   // Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
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

  // xLinearScale function 
  var xLinearScale = xScale(stateData, chosenXAxis);

  // yLinearScale function 
  var yLinearScale = yScale(stateData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // Append initial Circle + Text Group
  var circlesGroup = chartGroup.selectAll("g")
    .data(stateData)
    .enter()
    .append("g")
    .attr("transform", function(d) { 
      return `translate(+${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`;
    });

  // Append initial circles
  circlesGroup.append("circle")
    .attr("r", 15)
    .classed("stateCircle", true);

  //Add the text inside the circle
  circlesGroup.append("text")
    .text( d => d.abbr )
    .classed('stateText', true)
    .attr('dominant-baseline','middle');

  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

  // Create two groups for the axis labels
  // One for vertical and one for horizontal labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate( 20 , 0 )`);

  // Define three labels for each of the dimensions in x axis:
  // In Poverty %
  // Age (median)
  // Household Income
  var inPovertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var HILabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // We also define 3 vertical axis for:
  //Obese %
  //Smoker/Non Smoker
  //Lacks Healthcare
  var obeseLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left -10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Obese (%)");

    var smokerLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokes (%)");

    var healthcareLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");

      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        switch(chosenXAxis) {
          case "poverty": {
            inPovertyLabel.classed("active", true).classed("inactive", false);
            ageLabel.classed("active", false).classed("inactive", true);
            HILabel.classed("active", false).classed("inactive", true);
          }
          break;
          case "age": {
            inPovertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            HILabel.classed("active", false).classed("inactive", true);
          }
          break;
          case "income": {
            inPovertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true);
            HILabel.classed("active", true).classed("inactive", false);
          }
          break;
        }
      }
    });

  // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // functions here found above 
      // updates y scale for new data
      yLinearScale = yScale(stateData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      switch(chosenYAxis) {
        case "obesity": {
          obeseLabel.classed("active", true).classed("inactive", false);
         smokerLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", false).classed("inactive", true);
        }
        break;
        case "smokes": {
          obeseLabel.classed("active", false).classed("inactive", true);
          smokerLabel.classed("active", true).classed("inactive", false);
          healthcareLabel.classed("active", false).classed("inactive", true);
        }
        break;
        case "healthcare": {
          obeseLabel.classed("active", false).classed("inactive", true);
          smokerLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", true).classed("inactive", false);
        }
        break;
      }
    }
  });
}).catch(function(error) {
  console.log(error);
});
