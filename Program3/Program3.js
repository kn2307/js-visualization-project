// Data Exploration Step 3
// change x axis to percentiles

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
   series_names = ["% Fossil Fuels","% Renewable Sources","% Nuclear", "Period-End Net Generation (Percentile)"];
}

function setup() {
   createCanvas(500,300);
   background(250);
   smooth();
   
   var xtable = 3;
   var ytable = 0;
   
   border = 50;
   nrow = table[0].getRowCount();
   
   //var year_start = "2011";
   //var year_end = "2021";
   var year_start = "2001";
   var year_end = "2011";
   var year = year_end; //year for x axis

   var x = table[xtable].getColumn(year);
   x = arrayPercentileRank(x);
   var y = [];

   for(var i=0; i<nrow; i++)
   {
      y[i] = table[ytable].get(i,year_end) - table[ytable].get(i,year_start);
   }
   
   scatterplot(x,y);
   // x label
   textAlign(CENTER,TOP);
   text(series_names[xtable],width/2,height-border);
   // y label
   textAlign(LEFT,BOTTOM);
   text(series_names[ytable],border/2,border);
   // year
   textAlign(CENTER,BOTTOM);
   text(year_end+" - "+year_start,width/2,border);
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
 
 