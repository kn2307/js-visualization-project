// static
// remove countries with 0 diff

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
   myFont = loadFont('fonts/raleway.medium.ttf');
}

var border = 20;
var rowspace = 0; //row space between graphs
var topmargin = 100;
var leftmargin = 100;
var rightmargin = 90;
var bottommargin = 20;
var txtsize = 10;
var txtsize2 = 12;
var txtsize3 = 14;
var palette = ["#4D455D","#E96479","#7DB9B6"];
var plotdim; // dimension of the combined plot
var scatterdim; // dimension of the scatter plot
var histdim; // dimension of the histogram
var axisweight = 1.5;
var frameweight = 2.5;
var dotsize = 3;

function setup() {
   createCanvas(800,500);
   background("F5E9CF");
   smooth();

   year_start = ["1981","1991","2001","2011"];
   year_end = ["1991","2001","2011","2021"];
   plotdim = [(width-2*border-leftmargin-rightmargin)/year_start.length,(height-2*border-2*rowspace-topmargin-bottommargin)/3];
   scatterdim = [min(plotdim),min(plotdim)];
   histdim = [scatterdim[1],plotdim[0]-scatterdim[0]];
   xtable = 3; //choose x axis
   
   var x = [];
   var y = [];
   var xloc;
   var yloc;
   nrow = table[0].getRowCount();

   textFont(myFont);
   // header
   push();
   textSize(txtsize3);
   textAlign(LEFT,TOP);
   textStyle(BOLD);
   text("229 countries' 10-year difference in proportion of electricity generated from 3 sources (y axis)\nvs net generation in percentile (x axis)",border,border);
   pop();

   // define text style
   fill(palette[0]);
   textSize(txtsize);
   textStyle(BOLD);
   textWrap(WORD);
   textAlign(LEFT,TOP);

   for(var k = 0 ; k < series_names.length - 1; k++)
   {
      ytable = k;
      for(var j = 0 ; j < year_start.length; j++)
      {
         if(k==0) // print year labels
         {
            push();
               textAlign(CENTER,TOP);
               text("diff ("+year_start[j]+" ~ "+year_end[j]+")",leftmargin+border+plotdim[0]*(j)+histdim[1],topmargin);
            pop();
         }
         
         x = table[xtable].getColumn(year_end[j]);
         x = arrayPercentileRank(x);
         
         for(var i=0; i<nrow; i++)
         {
            y[i] = table[ytable].get(i,year_end[j]) - table[ytable].get(i,year_start[j]);
         }
         let plot = combineplot(x,y);
         xloc = leftmargin + border + j*(plotdim[0]);
         yloc = topmargin + border + (plotdim[1]+rowspace)*k;
        
         image(plot,xloc,yloc);

         // x axis grid
         push();
            textStyle(NORMAL);
            textAlign(CENTER,TOP);
            fill(palette[1]);
            text("0th",border+leftmargin+j*plotdim[0]+histdim[1],height-border-bottommargin);
            text("100th",border+leftmargin+(j+1)*plotdim[0],height-border-bottommargin);
         pop();
      }
      //print series name
      push();
         textSize(txtsize2);
         text(series_names[ytable],border,yloc+plotdim[1]*0.5,leftmargin);
      pop();
      // y axis grid
      push();
         textStyle(NORMAL);
         textAlign(RIGHT,CENTER);
         fill(palette[2]);
         text("0",border+leftmargin,yloc+plotdim[1]/2);
         textAlign(RIGHT,TOP);
         text("+100",border+leftmargin,yloc);
         text("-100",border+leftmargin, yloc+plotdim[1]*0.9);
      pop();
   }  

   //print axis title
   fill(palette[1]);
   textAlign(LEFT,TOP);
   text("period-end net generation (percentile)",width-rightmargin,height-border*2-bottommargin,rightmargin);
   fill(palette[2]);
   text("10-year change in share of electricity generated from the source",leftmargin/2,topmargin*0.7,leftmargin*1.5);
}
function combineplot(x,y)
{
   let plot = createGraphics(histdim[1]+scatterdim[0],scatterdim[1]);
   let scatter = scatterplot(x,y);
   let histogram = plothistogram(y);
   with(plot)
   {
      push();
      translate(width/2,height/2);
      rotate(-PI/2);
      translate(-height/2,-width/2)
      image(histogram,0,0);
      pop();
      image(scatter,histdim[1],0);
      noFill();
      strokeWeight(frameweight);
      stroke(palette[0]);
      rect(0,0,width,height);
   }
   
   return plot;
}
function scatterplot(x,y) // for plotting the scatter plot
{
   let plot = createGraphics(scatterdim[0],scatterdim[1]);
   let border = 0;
   with(plot)
   {
      push();
      //calculate scale
      var yScale = (height-2*border)/200;
      var xScale = (width-2*border)/100;
      var xOffset = border;
      var yOffset = border+100*yScale;
      
      // draw axis
      strokeWeight(axisweight);
      stroke(palette[1]);
      noFill();
      line(border,height - yOffset, width - border,height - yOffset);
      stroke(palette[0]);
      line(xOffset, border, xOffset, height - 2*border);
      // plot the data points
      noStroke();
      fill(palette[0]);
      for(var i=0; i<x.length; i++)
      {
         if(y[i]!=0)
            ellipse(xOffset + x[i]*xScale,height - yOffset - y[i]*yScale,dotsize,dotsize);
      } 
   }
   return plot;
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
 

 function plothistogram(data) {
   let histogram = createGraphics(histdim[0],histdim[1]);
   var border = 0;
   
   with(histogram)
   {
      textSize(txtsize);
      noStroke();
      // Create an array of bin boundaries
      let numBins = 40;
      let binWidth = 200/numBins;
      let lowerbound = -100;
      let binBoundaries = Array(numBins + 1)
      .fill(0)
      .map((_, i) => lowerbound + i * binWidth);
      
      // Create an array to store the bin counts
      let binCounts = Array(numBins).fill(0);
      
      // Count the number of values in each bin
      data.forEach((value) => {
      let binIndex = min(numBins - 1, floor((value - lowerbound) / binWidth));
      if(value!=0)
         binCounts[binIndex]++;
      });
      
      // Find the maximum bin count
      let maxCount = max(binCounts);
      
      // Draw the bars
      var yScale = (height-2*border)/maxCount;
      
      // Set the style for the bars
      fill(palette[2]);
      binCounts.forEach((count, i) => {
      let x = border + (i / numBins) * (width-2*border);
      let y = height - count*yScale - border;
      let barWidth = (1 / numBins) * (width-2*border);
      let barHeight = count*yScale;
      rect(x, y, barWidth, barHeight);
      });
      // print the zero cutoff
      binBoundaries.forEach((value, i) => {
         if(value==0) 
         {
            strokeWeight(axisweight);
            stroke(palette[1]);
            let x = border + (i / numBins) * (width-2*border);
            line(x,height-border,x,border);
         }
      });

   }
   return histogram;
 }
 