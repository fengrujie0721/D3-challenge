// @TODO: YOUR CODE HERE!
// set svg width and height
var svgWidth=960;
var svgHeight=850;

var margin={
    top:20,
    right:40,
    bottom:80,
    left:100
};
// 
var width=svgWidth-margin.left-margin.right;
var height=svgHeight-margin.top-margin.bottom;
// create svg wrapper
var svg=d3
.select("#scatter")
.append("svg")
.attr("width",svgWidth)
.attr("height",svgHeight);
// append a svg group
var chartGroup=svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// initial parameter
var chosenXAxis="poverty";
// function used for updating x-scale
function xScale(data,chosenXAxis){
    // create scales
    var xLinearScale=d3.scaleLinear()
      .domain([d3.min(data,d=>d[chosenXAxis])*0.8,
       d3.max(data,d=>d[chosenXAxis])*1.2])
       .range([0,width]);
    return xLinearScale;
}
// initial yaxis parameter
var chosenYAxis="obesity";
// function used for updating y-scale
function yScale(data,chosenYAxis){
    var yLinearScale=d3.scaleLinear()
    .domain([d3.min(data,d=>d[chosenYAxis])*0.8,
      d3.max(data,d=>d[chosenYAxis])*1.2])
      .range([height,0]);
      return yLinearScale;
}
// function used for updating circles xAxis
function renderAxes(newXScale,xAxis){
    var bottomAxis=d3.axisBottom(newXScale);
    
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;

}
 // function used for updating circles yAxis   
function renderAxes2(newYScale,yAxis)   { 
    var leftAxis=d3.axisLeft(newYScale);
    yAxis.transition()
    .duration(10)
    .call(leftAxis);
    
    
    return yAxis;
}

  
// function used for updating text group 
function rendertext(textGroup,newXScale,chosenXAxis,newYScale,chosenYAxis){
    textGroup
    .attr("x",d=>newXScale(d[chosenXAxis])-9.5)
    .attr("y",d=>newYScale(d[chosenYAxis])+6)
    .attr("font-size","15")
    .attr("fill","white")
    .attr("align","center")
    .text(function(d){return (d.abbr);});
    return textGroup;

    
    
}


// new circles
function renderCircles(circlesGroup,newXScale,chosenXAxis,newYScale,chosenYAxis){
    circlesGroup.transition()
    .duration(1000)
   
    .attr("cx",d=>newXScale(d[chosenXAxis]))
    .attr("cy",d=>newYScale(d[chosenYAxis]));
    return circlesGroup;
   

}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis,circlesGroup){
    var xlabel;
    var ylabel;
    if(chosenXAxis==="poverty"&&chosenYAxis==="obesity"){
        xlabel="Poverty: ";
        ylabel="Obesity: ";
    }
    else if(chosenXAxis==="age"&&chosenYAxis==="obesity"){
        xlabel="Age: ";
        ylabel="Obesity: ";

    }
    else if(chosenXAxis==="income"&&chosenYAxis==="obesity"){
        xlabel="Income: ";
        ylabel="Obesity: ";

    }
    else if(chosenXAxis==="poverty"&&chosenYAxis==="smokes"){
        xlabel="Poverty: ";
        ylabel="Smoke: ";
    }
    else if(chosenXAxis==="age"&&chosenYAxis==="smokes"){
        xlabel="Age: ";
        ylabel="Smoke: ";
    }
    else if(chosenXAxis==="income"&&chosenYAxis==="smokes"){
        xlabel="Income: ";
        ylabel="Smoke: ";
    }
    else if(chosenXAxis==="poverty"&&chosenYAxis==="healthcare"){
        xlabel="Poverty: ";
        ylabel="Lacks Healthcare: ";
    }
    else if(chosenXAxis==="income"&&chosenYAxis==="healthcare"){
        xlabel="Income: ";
        ylabel="Lacks Healthcare: ";
    }
    else {
        xlabel="Age: ";
        ylabel="Lacks Healthcare: ";
    }
    var percent="%";
    var toolTip=d3.tip()
    .attr("class","tooltip")
    .offset([0,0])
    
    
    .html(function(d){
        if (chosenXAxis==="poverty"){
            return(`${d.state}<br>${xlabel} ${d[chosenXAxis]}${percent}<br>${ylabel}${d[chosenYAxis]}${percent}`);
        }
        else {return(`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}${percent}`)};
    });
    
    
    chartGroup.call(toolTip);
    
    circlesGroup.on("mouseover",function(data){
        toolTip.show(data,this);
    })
    .on("mouseout",function(data){
        toolTip.hide(data);
    });
    
    return circlesGroup;}
    

// retrieve data from csv file and execute everything
d3.csv("assets/data/data.csv").then(function(data,err){
    if(err) throw err;
    // parse data
    data.forEach(function(data){
        data.poverty= +data.poverty;
        data.obesity= +data.obesity;
        data.income= +data.income;
        data.age= +data.age;
        data.healthcare= +data.healthcare;
        data.smokes= +data.smokes;
        console.log(data.abbr);
    });
    // create x scale
    var xLinearScale=xScale(data,chosenXAxis);
    // create y scale
    var yLinearScale=yScale(data,chosenYAxis);
    // create bottom axis
    var bottomAxis=d3.axisBottom(xLinearScale);
    // create left axis
    var leftAxis=d3.axisLeft(yLinearScale);
    //append x axis 
    var xAxis=chartGroup.append("g")
    .classed("x-axis",true)
    .attr("transform",`translate(0, ${height})`)
    .call(bottomAxis);
    // append y axis
    var yAxis=chartGroup.append("g")
         .call(leftAxis);
    // append initial circles
    var circlesGroup=chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx",d=>xLinearScale(d[chosenXAxis]))
    .attr("cy",d=>yLinearScale(d[chosenYAxis]))
    .attr("r","20")
    .attr("fill","blue")
    .attr("opacity","0.5");
       
    //append initial text    
    var textGroup=chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .attr("x",d=>xLinearScale(d[chosenXAxis])-9.5)
    .attr("y",d=>yLinearScale(d[chosenYAxis])+6)
    .attr("font-size","15")
    .attr("fill","white")
    .attr("align","center")
    .html(function(d){return (d.abbr);});


    // create group for xaxis label and yaxis label
    var xlabelsGroup=chartGroup.append("g")
    var ylabelsGroup=chartGroup.append("g")

    var povertylabel=xlabelsGroup.append("text")
    .attr("transform",`translate(${width / 2}, ${height + 20})`)
    .attr("x",0)
    .attr("y",20)
    .attr("value","poverty")
    .classed("active",true)
    .text("In Poverty(%)");

    var agelabel=xlabelsGroup.append("text")
    .attr("transform",`translate(${width / 2}, ${height + 20})`)
    .attr("x",0)
    .attr("y",40)
    .attr("value","age")
    .classed("inactive",true)
    .text("Age(Median)");

    var incomelabel=xlabelsGroup.append("text")
    .attr("transform",`translate(${width / 2}, ${height + 20})`)
    .attr("x",0)
    .attr("y",60)
    .attr("value","income")
    .classed("inactive",true)
    .text("Household Income(Median)");

    

    var obesitylabel=ylabelsGroup.append("text")
    .attr("transform",`rotate(-90)`)
    .attr("x",0-(height/2))
    .attr("y",-30)
    .attr("value","obesity")
    .classed("active",true)
    .text("Obese(%)");

    var smokeslabel=ylabelsGroup.append("text")
    .attr("transform",`rotate(-90)`)
    .attr("x",0-(height/2))
    .attr("y",-60)
    .attr("value","smokes")
    .classed("inactive",true)
    .text("Smokes(%)");

    var healthcarelabel=ylabelsGroup.append("text")
    .attr("transform",`rotate(-90)`)
    .attr("x",0-(height/2))
    .attr("y",-90)
    .attr("value","healthcare")
    .classed("inactive",true)
    .text("Lacks Healthcare(%)");
    // update tooltip function above csv import
    var circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup,textGroup);
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
    .on("click",function(){
        var value=d3.select(this).attr("value");
        
        if (value!==chosenXAxis){
            chosenXAxis=value;
            
            xLinearScale=xScale(data,chosenXAxis);
            
            xAxis=renderAxes(xLinearScale,xAxis);
            textGroup=rendertext(textGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
            
            circlesGroup=renderCircles(circlesGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
            circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup,textGroup);
            if(chosenXAxis==="poverty"&&chosenYAxis==="obesity"){
                povertylabel
                .classed("active",true)
                .classed("inactive",false);
                agelabel
                .classed("active",false)
                .classed("inactive",true);
                incomelabel
                .classed("active",false)
                .classed("inactive",true);
                obesitylabel
                .classed("active",true)
                .classed("inactive",false);
                smokeslabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",false)
                .classed("inactive",true);
                

            }
            else if(chosenXAxis==="age"&&chosenYAxis==="obesity"){
                agelabel
                .classed("active",true)
                .classed("inactive",false);
                povertylabel
                .classed("active",false)
                .classed("inactive",true);
                incomelabel
                .classed("active",false)
                .classed("inactive",true);
                obesitylabel
                .classed("active",true)
                .classed("inactive",false);
                smokeslabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",false)
                .classed("inactive",true);
                
            }

            else if(chosenXAxis==="income"&&chosenYAxis==="obesity"){
                incomelabel
                .classed("active",true)
                .classed("inactive",false);
                povertylabel
                .classed("active",false)
                .classed("inactive",true);
                agelabel
                .classed("active",false)
                .classed("inactive",true);
                obesitylabel
                .classed("active",true)
                .classed("inactive",false);
                smokeslabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",false)
                .classed("inactive",true);
                
            }
            else if(chosenXAxis==="age"&&chosenYAxis==="smokes"){
                agelabel
                .classed("active",true)
                .classed("inactive",false);
                povertylabel
                .classed("active",false)
                .classed("inactive",true);
                incomelabel
                .classed("active",false)
                .classed("inactive",true);
                smokeslabel
                .classed("active",true)
                .classed("inactive",false);
                obesitylabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",false)
                .classed("inactive",true);
               
            }
            else if(chosenXAxis==="income"&&chosenYAxis==="smokes"){
                incomelabel
                .classed("active",true)
                .classed("inactive",false);
                povertylabel
                .classed("active",false)
                .classed("inactive",true);
                agelabel
                .classed("active",false)
                .classed("inactive",true);
                smokeslabel
                .classed("active",true)
                .classed("inactive",false);
                obesitylabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",false)
                .classed("inactive",true);
                
            }
            else if(chosenXAxis==="poverty"&&chosenYAxis==="smokes"){
                povertylabel
                .classed("active",true)
                .classed("inactive",false);
                incomelabel
                .classed("active",false)
                .classed("inactive",true);
                agelabel
                .classed("active",false)
                .classed("inactive",true);
                smokeslabel
                .classed("active",true)
                .classed("inactive",false);
                obesitylabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",false)
                .classed("inactive",true);
            }
            else if(chosenXAxis==="poverty"&&chosenYAxis==="healthcare"){
                povertylabel
                .classed("active",true)
                .classed("inactive",false);
                incomelabel
                .classed("active",false)
                .classed("inactive",true);
                agelabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",true)
                .classed("inactive",false);
                obesitylabel
                .classed("active",false)
                .classed("inactive",true);
                smokeslabel
                .classed("active",false)
                .classed("inactive",true);
            }
            else if(chosenXAxis==="age"&&chosenYAxis==="healthcare"){
                agelabel
                .classed("active",true)
                .classed("inactive",false);
                incomelabel
                .classed("active",false)
                .classed("inactive",true);
                povertylabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",true)
                .classed("inactive",false);
                obesitylabel
                .classed("active",false)
                .classed("inactive",true);
                smokeslabel
                .classed("active",false)
                .classed("inactive",true);
            }
            else {
                incomelabel
                .classed("active",true)
                .classed("inactive",false);
                agelabel
                .classed("active",false)
                .classed("inactive",true);
                povertylabel
                .classed("active",false)
                .classed("inactive",true);
                healthcarelabel
                .classed("active",true)
                .classed("inactive",false);
                obesitylabel
                .classed("active",false)
                .classed("inactive",true);
                smokeslabel
                .classed("active",false)
                .classed("inactive",true);
            }

            }
        });
        // y axis labels event listener
        ylabelsGroup.selectAll("text")
        .on("click",function(){
            var value=d3.select(this).attr("value");
            
            if (value!==chosenYAxis){
                chosenYAxis=value;
                
                
                yLinearScale=yScale(data,chosenYAxis);
                textGroup=rendertext(textGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
                
                yAxis=renderAxes2(yLinearScale,yAxis);
                circlesGroup=renderCircles(circlesGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis,textGroup);
                circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup,textGroup);
                if(chosenXAxis==="poverty"&&chosenYAxis==="obesity"){
                    povertylabel
                    .classed("active",true)
                    .classed("inactive",false);
                    agelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    incomelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    obesitylabel
                    .classed("active",true)
                    .classed("inactive",false);
                    smokeslabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",false)
                    .classed("inactive",true);
    
                }
                else if(chosenXAxis==="age"&&chosenYAxis==="obesity"){
                    agelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    povertylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    incomelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    obesitylabel
                    .classed("active",true)
                    .classed("inactive",false);
                    smokeslabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    
                }
                else if(chosenXAxis==="income"&&chosenYAxis==="obesity"){
                    incomelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    povertylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    agelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    obesitylabel
                    .classed("active",true)
                    .classed("inactive",false);
                    smokeslabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",false)
                    .classed("inactive",true);
                }
                else if(chosenXAxis==="age"&&chosenYAxis==="smokes"){
                    agelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    povertylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    incomelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    smokeslabel
                    .classed("active",true)
                    .classed("inactive",false);
                    obesitylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    
                }
                else if(chosenXAxis==="income"&&chosenYAxis==="smokes"){
                    incomelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    povertylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    agelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    smokeslabel
                    .classed("active",true)
                    .classed("inactive",false);
                    obesitylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    
                }
                else if(chosenXAxis==="poverty"&&chosenYAxis==="smokes"){
                    povertylabel
                    .classed("active",true)
                    .classed("inactive",false);
                    incomelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    agelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    smokeslabel
                    .classed("active",true)
                    .classed("inactive",false);
                    obesitylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    
                }
                else if(chosenXAxis==="poverty"&&chosenYAxis==="healthcare"){
                    povertylabel
                    .classed("active",true)
                    .classed("inactive",false);
                    incomelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    agelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    obesitylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    smokeslabel
                    .classed("active",false)
                    .classed("inactive",true);
                }
                else if(chosenXAxis==="age"&&chosenYAxis==="healthcare"){
                    agelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    incomelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    povertylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    obesitylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    smokeslabel
                    .classed("active",false)
                    .classed("inactive",true);
                }
                else {
                    incomelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    agelabel
                    .classed("active",false)
                    .classed("inactive",true);
                    povertylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    healthcarelabel
                    .classed("active",true)
                    .classed("inactive",false);
                    obesitylabel
                    .classed("active",false)
                    .classed("inactive",true);
                    smokeslabel
                    .classed("active",false)
                    .classed("inactive",true);
                }
    
                }
            });
       
            
        
    }).catch(function(error){
        console.log(error);
 
});

