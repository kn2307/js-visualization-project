// Data Exploration Step 1

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
   background(255);
   smooth();
   var year = "2020"; //change this variable to see the plot for different year
   var xtable = 3;
   var ytable = 1; //change the source of generation here
   border = 50;
   nrow = table[0].getRowCount();
   x = table[xtable].getColumn(year); //total generation
   y = table[ytable].getColumn(year); //% nuclear
   
   scatterplot(x,y);
   // x label
   textAlign(CENTER,TOP);
   text(series_names[xtable],width/2,height-border);
   // y label
   textAlign(LEFT,BOTTOM);
   text(series_names[ytable],border/2,border);
   // year
   textAlign(CENTER,BOTTOM);
   text("Year " + year,width/2,border);
}

function scatterplot(x,y) // for plotting the scatter plot
{
   push();
   
   //calculate scale
   yScale = (height-2*border)/100;
   xScale = (width-2*border)/max(x);

   // draw axis
   noFill();
   rect(border,border,max(x)*xScale,100*yScale);

   // plot the data points
   fill(0);
   for(var i=0; i<x.length; i++)
   {
      ellipse(border + x[i]*xScale,height - y[i]*yScale - border,2,2);
   }
   
   pop();
}

