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

// data and plots
var plot;
var diffmode = true;
var percentile_x = true;
var year_start = "1980"; // default values when the program starts
var year_end = "2021";
var country_names = [];
var x = []; //x axis data to be plotted
var y = []; //y axis data to be plotted
var tf; //timeframe for calculating changes
let numBins = 40; //number of bins in the histogram
var xloc,yloc; //location for displaying info

// format
var border = 25;
var topmargin = 120;
var leftmargin = 120;
var rightmargin = 500;
var bottommargin = 80;
var txtsize = 16;
var txtsize2 = 18;
var txtsize3 = 20;
var palette = ["#4D455D","#E96479","#7DB9B6","orange","white"];
var plotdim;
var scatterdim;
var histdim;
var axisweight = 1.5;
var frameweight = 3;
var dotsize = 5;

//slider
var lm = border + leftmargin;    // Left margin for grid
var bm = topmargin;    // Bottom margin for grid
var gw;    // Grid width
var gh;    // Grid height
var minSlider;    // Minimum value of X for slider
var maxSlider;  // Maximum value of X for slider (use rowCount)
var col = 1;         // Initializes col at 1
var rowCount;  // rowCount 
var colCount;  
var sliderX = lm;   // Initializes x coordinate for slider
var sliderX2; //for diffmode
var locked = false; // check if the first slider is pressed
var locked2 = false; // check if the second slider is pressed (for diff mode)
var d = 20; // slider button diameter
var locktf = false; // lock the distance between the 2 sliders

function setup()
{
   createCanvas(1280,720);
   background(palette[4]);
   smooth();
   
   plotdim = [(width-2*border-leftmargin-rightmargin),(height-2*border-topmargin-bottommargin)];
   scatterdim = [min(plotdim),min(plotdim)];
   histdim = [scatterdim[1],plotdim[0]-scatterdim[0]];
   xtable = 3; //choose x axis
   ytable = 0;
   country_names = table[ytable].getColumn(0);
   rowCount = table[0].getRowCount();
   colCount = table[0].getColumnCount();
   // initialize values after loading the table
   minSlider = 1;    // Minimum value of X for slider
   maxSlider = colCount;  // Maximum value of X for slider (use rowCount)
   gw = width - 2*border - leftmargin - rightmargin;    // Grid width
   gh = height;    // Grid height
   sliderX2 = lm + gw;
   selectData();

   textFont(myFont);
   

   // define text style
   fill(palette[0]);
   textSize(txtsize);
   textStyle(BOLD);
   textWrap(WORD);
   textAlign(LEFT,TOP);
   selectData();
   plot = combineplot(x,y);
}

function draw()
{
   background(palette[4]);
   // header
   push();
   fill(palette[0]);
   textSize(txtsize3);
   textAlign(LEFT,TOP);
   textStyle(BOLD);
   text("229 countries' proportion of electricity generated from 3 sources vs net generation",border,border);
   pop();

   slider();
   fill(palette[0])
   let beginloc = border + topmargin;
   textAlign(LEFT,TOP);
   text("Mode: ", width - rightmargin, beginloc);
   text("x-axis: ",width - rightmargin, beginloc+txtsize);
   
   // print status
   if(diffmode)
   {
      fill(palette[2]);
      text("Difference Mode",width - rightmargin + txtsize*9, beginloc);
      fill(palette[0]);
      text("Lock Timeframe: ", width - rightmargin, beginloc+2*txtsize);
      if(locktf)
      {
         fill(palette[3]);
         text("On",width - rightmargin + txtsize*9, beginloc+2*txtsize);
      }
      else
      {
         fill(palette[2]);
         text("Off",width - rightmargin + txtsize*9, beginloc+2*txtsize);
      }
   }
   else
   {
      fill(palette[3]);
      text("Normal Mode",width - rightmargin + txtsize*9, beginloc);
   }
   if(percentile_x)
   {
      fill(palette[2]);
      text("Percentile",width - rightmargin + txtsize*9, beginloc+txtsize);
   }
   else
   {
      fill(palette[3]);
      text("Level",width - rightmargin + txtsize*9, beginloc+txtsize);
   }

   // plot the graphs
   scatterplot(x,y);
   image(plot,border+leftmargin,border+topmargin);
   addlabel();
   addinstruction();
   push();
   noFill();
   stroke(palette[0]);
   rect(width-rightmargin,height*0.6,txtsize*24,txtsize*8);
   pop();
}
function addinstruction() 
{
   textAlign(LEFT,TOP);
   textSize(txtsize2);
   text("Keyboard Commands: \n",width-rightmargin,border+topmargin*1.75,rightmargin-border)
   var instruction = "";
   instruction += "Press S to switch between Fossil Fuels, Renewable Sources, and Nuclear\n";
   instruction += "Press D to switch between difference mode and normal mode\n";
   instruction += "Press L to lock the distance between 2 sliders (difference mode only)\n";
   instruction += "Press P to switch between percentile and level for x axis";
   textSize(txtsize);
   textWrap(WORD);
   text(instruction,width-rightmargin,border+topmargin*1.8+txtsize*2,rightmargin-border);
   text("Hover the mouse over a data point to show its information",width - rightmargin,height - bottommargin*1.8);
   textAlign(CENTER,TOP);
   text("Use the slide bar to select a time period for the data",border+leftmargin+plotdim[0]/2,topmargin/2);
}

function addlabel() // add axis titles, axis grid
{
   //print axis title

   push();
   fill(palette[2]);
   textAlign(LEFT,TOP);
   textWrap(WORD);
   if(diffmode)
   {
      text("Change in "+series_names[ytable],border/2,height/2,leftmargin);
   }
  else
   {
      text(series_names[ytable], border, height/2, leftmargin*1.5);
   }
   pop();
   // x axis grid
   push();
   textStyle(NORMAL);
   textAlign(CENTER,TOP);
   fill(palette[1]);
   
   if(percentile_x)
   {
      textAlign(CENTER,TOP);
      text("Period-End Net Generation (percentile)",leftmargin+border+histdim[1]+scatterdim[0]/2,height-bottommargin);
      text("0th",border+leftmargin+histdim[1],height-border-bottommargin);
      text("100th",border+leftmargin+plotdim[0],height-border-bottommargin);
   }
   else
   {
      textAlign(CENTER,TOP);
      text("Period-End Net Generation (kWhr)",width/2,height-bottommargin);
      text(min(x),border+leftmargin+histdim[1],height-border-bottommargin);
      text(max(x),border+leftmargin+plotdim[0],height-border-bottommargin);
   }
   pop();
   // y axis grid
   push();
   textStyle(NORMAL);
   textAlign(RIGHT,CENTER);
   fill(palette[2]);
   
   textAlign(RIGHT,CENTER);
   if(diffmode)
   {
      text("+100",border+leftmargin,border+topmargin);
      text("0",border+leftmargin,border+topmargin+plotdim[1]/2);
      text("-100",border+leftmargin, border+topmargin+plotdim[1]);
   }
   pop();
}

function showinfo(index,xloc,yloc) //show detailed information when hovering the mouse over
{
   let txt_series = "", txt_start = "", txt_end = "", txt_diff = "";
   let showlocx = width - rightmargin;
   let showlocy = height*0.6;
   
   push();
   fill(palette[0]);
   textAlign(LEFT,TOP);
   if(percentile_x)
      text(year_end + " net generation: "+nf(x[index],0,2) + " percentile",showlocx+txtsize,showlocy+txtsize*6);
   else
      text(year_end + " net generation: "+nf(x[index],0,2) + " kWhr",showlocx+txtsize,showlocy+txtsize*6);

   // show coordinates
   fill(palette[3]);
   textAlign(LEFT,BOTTOM);
   text(country_names[index]+"("+nf(x[index],0,2)+","+nf(y[index],0,2)+")",xloc,yloc);
    for(var i = 0; i<3; i++)
    {
      if(diffmode)
      {
         txt_series += series_names[i] + ": \n";
         txt_start += nf(table[i].get(index,year_start),0,2) + "\n";
         txt_end += nf(table[i].get(index,year_end),0,2) + "\n";
         txt_diff += nfp(table[i].get(index,year_end) - table[i].get(index,year_start),0,2) + "\n";
         fill(palette[0]);
         textAlign(LEFT,TOP);
         text(country_names[index],showlocx+txtsize,showlocy);
         text(txt_series,showlocx+txtsize,showlocy+txtsize*2);
         textAlign(RIGHT,TOP);
         text(year_start,showlocx+15*txtsize,showlocy);
         text("diff",showlocx+19*txtsize,showlocy);
         text(year_end,showlocx+23*txtsize,showlocy);
         text(txt_start,showlocx+15*txtsize,showlocy+txtsize*2);
         text(txt_diff,showlocx+19*txtsize,showlocy+txtsize*2);
         text(txt_end,showlocx+23*txtsize,showlocy+txtsize*2);
      }
      else
      {
         txt_series += series_names[i] + ": \n";
         txt_end += nf(table[i].get(index,year_end),0,2) + "\n";
         fill(palette[0]);
         textAlign(LEFT,TOP);
         text(country_names[index],showlocx+txtsize,showlocy);
         text(txt_series,showlocx+txtsize,showlocy+txtsize*2);
         textAlign(RIGHT,TOP);
         text(year_end,showlocx+15*txtsize,showlocy);
         text(txt_end,showlocx+15*txtsize,showlocy+txtsize*2);
      }
    }
    
    pop();
}
function initiate_diffmode() // initialization when switched to difference mode
{
   sliderX = lm;
   sliderX2 = lm + gw;
   slider();
   selectData();
   locktf = false;
   plot = combineplot(x,y);
}

function initiate_normalmode() // initialization when switched to normal mode
{
   sliderX = lm;
   slider();
   selectData();
   plot = combineplot(x,y);
}

function slider() {
   push();
   // Slider line
   stroke(palette[0]);
   strokeCap(SQUARE);
   strokeWeight(5);
   line(lm, bm, lm + gw, bm);

   // Slider button
   noStroke();
   fill(palette[2]);

   if(locked==true)
   {
      sliderX = mouseX;
      if(locktf == true && diffmode)
      {
         sliderX = constrain(sliderX, lm, lm + gw - 1 - gw*tf/(colCount-1));
         sliderX2 = sliderX + gw*tf/(colCount-1);
      }
   }
   else if(locked2 == true)
   {
      sliderX2 = mouseX;
      if(locktf == true && diffmode)
      {
         sliderX2 = constrain(sliderX2, lm + gw*tf/(colCount-1), lm + gw - 1);
         sliderX = sliderX2 - gw*tf/(colCount-1);
      }
   }
   

   sliderX = constrain(sliderX, lm, lm + gw - 1);  // The "-1" avoids array error
   ellipse(sliderX, bm, d, d);
   fill(palette[3]);
   ellipse(sliderX, bm, d/2, d/2);

   if(diffmode)
   {
      sliderX2 = constrain(sliderX2, sliderX, lm + gw - 1);  // The "-1" avoids array error
      noStroke();
      fill(palette[2]);
      ellipse(sliderX2, bm, d, d);
      fill(palette[3]);
      ellipse(sliderX2, bm, d/2, d/2);
   }
   // Slider min/max labels
   push();
   fill(palette[0]);
   textSize(txtsize);
   textAlign(RIGHT,CENTER);
   text(table[ytable].columns[1], lm - d, bm);
   textAlign(LEFT,CENTER);
   text(table[ytable].columns[colCount-1], lm + gw + d, bm);
   pop();
   // Use slider to set data value
   col = int(((sliderX - lm)/gw) * (colCount-1))+1;
   col2 = int(((sliderX2 - lm)/gw) * (colCount-1))+1;
   if(diffmode)
   {
      year_start = table[ytable].columns[col];
      year_end = table[ytable].columns[col2];
   }
   else
   {
      year_end = table[ytable].columns[col];
   }
   
   if(locked || locked2)
   {
      selectData();
      plot = combineplot(x,y); //generate plot only when the slider bar is adjusted
   }
   
   // Slider current value
   fill(palette[0]);
   textAlign(CENTER,CENTER)
   text(table[ytable].columns[col], sliderX, bm - 25);
   if(diffmode)
   {
      text(table[ytable].columns[col2], sliderX2, bm - 25);
   }
   pop();
}

function selectData()
{
   x = table[xtable].getColumn(year_end);
   if(percentile_x)
   {
      x = arrayPercentileRank(x);
   }
   
   if(diffmode)
   {
      for(var i=0; i<rowCount; i++)
      {
         y[i] = table[ytable].get(i,year_end) - table[ytable].get(i,year_start);
      }
   }
   else
   {
      y = table[ytable].getColumn(year_end);
   }  
}

function mousePressed()
{
   if (dist(mouseX, mouseY, sliderX, bm) < d)
   { 
      locked=true;
   }
   else if (diffmode == true && dist(mouseX, mouseY, sliderX2, bm) < d)
   { 
      locked2=true;
   }
  else
    return 0;
}

function mouseReleased()
{ 
   locked=false;
   locked2=false;
}

function keyTyped()
{
   if (key === 'p')
   {
      percentile_x = !percentile_x;
      selectData();
      plot = combineplot(x,y);
   }
   if (key === 'd')
   {
      diffmode = !diffmode;
      if(diffmode)
         initiate_diffmode();
      else
         initiate_normalmode();
   }
   if (key === 'l')
   {
      // lock the timeframe
      locktf = !locktf;
      tf = year_end - year_start;
   }
   if(key === 's')
   {
      ytable++;
      if(ytable>2)
         ytable = 0;
      selectData();
      plot = combineplot(x,y);
   }
}

function combineplot(x,y) // place the histogram
{
   let plot = createGraphics(histdim[1]+scatterdim[0],scatterdim[1]);
   let histogram = plothistogram(y);
   with(plot)
   {
      push();
      translate(width/2,height/2);
      rotate(-PI/2);
      translate(-height/2,-width/2)
      image(histogram,0,0);
      pop();
      
      noFill();
      strokeWeight(frameweight);
      stroke(palette[0]);
      rect(0,0,width,height);
      strokeWeight(axisweight);
      stroke(palette[0]);
      line(histdim[1],0,histdim[1],height);
   }
   
   return plot;
}
function scatterplot(x,y) // for plotting the scatter plot
{   
   push();
      //calculate scale
      var yScale = scatterdim[1]/200;
      var xScale = scatterdim[0]/100;
      if(percentile_x == false)
      {
         xScale = scatterdim[0]/(max(x)-min(x));
      }
      var xOffset = border+leftmargin+histdim[1];
      var yOffset = border+bottommargin + 100*yScale;
      if(diffmode==false)
      {
         yScale = scatterdim[1]/100;
         yOffset = border + bottommargin;
      }
      // draw axis
      strokeWeight(axisweight);
      stroke(palette[1]);
      noFill();
      line(xOffset,height - yOffset, xOffset + scatterdim[0],height - yOffset);
      stroke(palette[2]);
      // plot the data points
      noStroke();
      for(var i=0; i<x.length; i++)
      {
         if(y[i]!=0)
         {
            xloc = xOffset + x[i]*xScale;
            yloc = height - yOffset - y[i]*yScale;
            
            if (dist(mouseX, mouseY, xloc, yloc) < dotsize)
            {
               fill(palette[3]);
               showinfo(i,xloc,yloc);
            }  
            else
               fill(palette[0]);

            ellipse(xloc,yloc,dotsize,dotsize);
         }    
      } 
   
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
      let binWidth = 200/numBins;
      let lowerbound = -100;
      if(diffmode == false)
      {
         lowerbound = 0;
         binWidth = 100/numBins;
      }
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