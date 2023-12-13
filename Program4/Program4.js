// Data Exploration Step 4
// plot histogram

function preload() {
   filepath = ["Data/Fossil_fuels_electricity_percent_of_net_generation.csv",
                  "Data/Renewable_electricity_percent_of_net_generation.csv",
                  "Data/Nuclear_electricity_percent_of_net_generation.csv",
                  "Data/Total_Net_Generation.csv"];
   table = [];
   for(var i = 0; i<filepath.length; i++)
   {
      table[i] = loadTable(filepath[i], "csv", "header"); 
   }
   series_names = ["% Fossil Fuels","% Renewable Sources","% Nuclear", "Net Generation (kWhr)"];
}

function setup() {
   createCanvas(500,300);
   background(250);
   smooth();
   
   var xtable = 3;
   var ytable = 0;
   
   border = 50;
   nrow = table[0].getRowCount();
   
   //var year_start = "2001";
   //var year_end = "2011";
   var year_start = "2011";
   var year_end = "2021";
   var year = year_end; //year for x axis

   var x = table[xtable].getColumn(year);
   x = arrayPercentileRank(x);
   var y = [];

   for(var i=0; i<nrow; i++)
   {
      y[i] = table[ytable].get(i,year_end) - table[ytable].get(i,year_start);
   }
   
   plotHistogram(y, 10);
   // x label
   textAlign(CENTER,TOP);
   text("Changes in "+series_names[ytable],width/2,height-border/2);
   
   // year
   textAlign(CENTER,BOTTOM);
   text(year_end + "-" + year_start,width/2,border);
}
 
 function plotHistogram(data, numBins) {
   // Create an array of bin boundaries
   let binWidth = (max(data) - min(data)) / numBins;
   let binBoundaries = Array(numBins + 1)
     .fill(0)
     .map((_, i) => min(data) + i * binWidth);
   
   // Create an array to store the bin counts
   let binCounts = Array(numBins).fill(0);
   
   // Count the number of values in each bin
   data.forEach((value) => {
     let binIndex = min(numBins - 1, floor((value - min(data)) / binWidth));
     binCounts[binIndex]++;
   });
   
   // Find the maximum bin count
   let maxCount = max(binCounts);
   
   // Set the style for the bars
   fill("steelblue");
   
   // Draw the bars
   var yScale = (height-2*border)/maxCount;
   binCounts.forEach((count, i) => {
     let x = border + (i / numBins) * (width-2*border);
     let y = height - count*yScale - border;
     let barWidth = (1 / numBins) * (width-2*border);
     let barHeight = count*yScale;
     rect(x, y, barWidth, barHeight);
     // print the bin labels
     textAlign(CENTER,TOP);
     text(nf(binBoundaries[i+1],0,2),x+barWidth/2,height-border*0.9);
   });
   
 }
 
function scatterplot(x,y) // for plotting the scatter plot
{
   push();
   
   //calculate scale
   var yScale = (height-2*border)/(max(y)-min(y));
   var xScale = (width-2*border)/(max(x)-min(x));
   var xOffset = border;
   var yOffset = border;
   if(min(x)<0) xOffset = - min(x)*xScale+border;
   if(min(y)<0) yOffset = - min(y)*yScale+border;
   
   // draw axis
   noFill();
   line(border,height - yOffset, width - border,height - yOffset);
   line(xOffset, border, xOffset, height - border);
   // plot the data points
   fill(0);
   for(var i=0; i<x.length; i++)
   {
      ellipse(xOffset + x[i]*xScale,height - yOffset - y[i]*yScale,2,2);
   }
   
   pop();
}

function arrayPercentileRank(data) {
   // Sort the data in ascending order
   let sortedData = data.slice().sort((a, b) => a - b);
   
   // Calculate the percentile rank of each value in the array
   let percentileRanks = data.map((value) => {
     // Calculate the number of values less than the current value
     let countLess = sortedData.filter((x) => x < value).length;
     
     // Calculate the number of values equal to the current value
     let countEqual = sortedData.filter((x) => x === value).length;
     
     // Calculate the percentile rank of the current value
     return 100 * (countLess) / (sortedData.length - countEqual);
   });
   
   return percentileRanks;
 }
 
 