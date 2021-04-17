# D3 Homework - Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Background

Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates from the [US Census Bureau](https://data.census.gov/cedsci/), but you are free to investigate a different data set. The current data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."


### Core Assignment: D3 Dabbler (Required Assignment)

![4-scatter](Images/Core.gif)

This part of the homework creates a scatter plot between two of the data variables, "Obesity vs. Income Level (Median)".

Using the D3 techniques learned in class, we created a scatter plot that represents each state with circle elements. Data is pulled from a local file `data.csv` by using the `d3.csv` function. 

- - -

### Bonus: Impress the Boss (Optional Assignment)

Why make a static graphic when D3 lets you interact with your data?

![7-animated-scatter](Images/Bonus.gif)

#### 1. More Data, More Dynamics

This chart includes more demographics and more risk factors. Labels  are placed in the scatter plot given click events so that users can decide which data to display. The transitions of the circles' locations is animated, as well as the ranges for the axes. 

#### 2. d3-tip Tooltips

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. We have added tooltips to the circles, and display each one when the user hovers over the circle. 

- - -
### Copyright

© 2021 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
