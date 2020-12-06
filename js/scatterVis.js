/* * * * * * * * * * * * * *
*          ScatterVis          *
* * * * * * * * * * * * * */

class ScatterVis {

    constructor(parentElement, happinessData) {
        this.parentElement = parentElement;
        this.happinessData = happinessData;
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 0, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        
        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);
        
        
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')

        // draw Y-axis Label
        vis.svg.append("text")
            .attr("class", "yLabel")
            .attr("text-anchor", "end")
            .attr("y", 35)
		    .attr("dy", ".85em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "15")
            .attr("opacity", "70%")
            .text("Happiness Score");
       
        vis.regions=['Western Europe', 'North America', 'Australia and New Zealand"',
            'Middle East and Northern Africa', 'Latin America and Caribbean', 'Southeastern Asia', 'Eastern Asia',
            'Southern Asia', 'Central and Eastern Europe', 'Sub-Saharan Africa'];

        vis.colors=["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"]
       
        vis.color = d3.scaleOrdinal().range(vis.colors);
        vis.legend = vis.svg.selectAll(".legend")
            .data(vis.colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(-1000," + i * 20 + ")"; });

        vis.legend.append("rect")
            .attr("x", vis.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("stroke", "1")
            .style("fill", function(d, i) {return vis.colors.slice()[i];});

        vis.legend.append("text")
            .attr("x", vis.width + 5)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", 10)
            .text(function(d,i) {return vis.regions[i]});
        

           

            

        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.filteredData = [];
        console.log("SELECTED YEAR IS: ", selectedYear)
        vis.happinessData.forEach(row => {
            if (row.YEAR == selectedYear) {
                vis.filteredData.push(row);
            }
        });

        console.log("SCATTER DATA", vis.filteredData)
        vis.updateVis()
    }

    updateVis(){
        let vis = this;
        // setup scales
        vis.xScale = d3.scaleLinear()
            .domain(d3.extent(vis.filteredData, function(d) {
                return d[selectedScore]
             }))
             .range([25, vis.width - 25 * 2])

        vis.yScale = d3.scaleLinear()
            .domain(d3.extent(vis.filteredData, function(d) {

                return d.HAPPINESS_SCORE
            }))
            .range([vis.height - 25, 25])
        
        vis.popScale = d3.scaleLinear()
		    .domain(d3.extent(vis.filteredData, function(d) { return parseFloat(d.POPULATION) }))
		    .range([7, 30]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)
            .ticks(10)

        // draw dynamic X-axis Label
        vis.xlabel = vis.svg.selectAll(".xLabel")
            .data(selectedScoreText[0])
        
         vis.xlabel.enter()
            .append("text")
            .attr("class", "xLabel")
            .merge(vis.xlabel)   
            .attr("text-anchor", "end")
            .style("font-size", "15")
            .attr("opacity", "70%")
            .attr("x", vis.width - 25)
            .attr("y", vis.height - 35)
            .transition()
            .duration(1500)
            .text(selectedScoreText);
        
            vis.xlabel.exit().remove()
        
        

        // draw selected year in the background
        vis.labels = vis.svg.selectAll(".yearLabel")
            .data(selectedYear[0])

        vis.labels.enter()
            .append("text")
            .attr("class", "yearLabel")
            .merge(vis.labels)   
            .transition()
            .duration(1500)
            .text(selectedYear)
            
            .style("font-size", "250px")
            .style("fill", "gray")
            .attr("opacity", "30%")
            .attr("transform", "translate(35," + (vis.height - 35) +   ")")
        
        vis.labels.exit()
            
        vis.circles = vis.svg.selectAll("circle")
            .data(vis.filteredData)

        vis.circles.enter()
            .append("circle")
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'green')
                    .attr('opacity', "30%")
    
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                            <h4>${d.COUNTRY}<h3>
                            <h6> World Happiness Rank: ${d.HAPPINESS_RANK}</h6> 
                            <h6> World Happiness Score: ${d.HAPPINESS_SCORE}</h6>                     
                        </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'green')
                    .attr('opacity', "70%")
                
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .merge(vis.circles)   
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr("fill", function(d) {
                if (d.REGION == "Western Europe") {
                    return "#8dd3c7"
                } else if (d.REGION == "North America") {
                    return "#ffffb3" 
                } else if (d.REGION == "Australia and New Zealand") {
                    return "#bebada" 
                } else if (d.REGION == "Middle East and Northern Africa") {
                    return "#fb8072" 
                } else if (d.REGION == "Latin America and Caribbean") {
                    return "#80b1d3" 
                } else if (d.REGION == "Southeastern Asia") {
                    return "#fdb462" 
                } else if (d.REGION == "Eastern Asia") {
                    return "#b3de69" 
                } else if (d.REGION == "Southern Asia") {
                    return "#fccde5" 
                } else if (d.REGION == "Central and Eastern Europe") {
                    return "#d9d9d9" 
                } else if (d.REGION == "Sub-Saharan Africa") {
                    return "#bc80bd" 
                }
            })
            .attr("stroke", "darkgreen")   
            .attr("opacity", "70%")
            .on("start", function() {
                d3.select(this)
                    .attr("fill", "green")
                    .attr("r", 2)
            })
            .attr("cx", function(d) {
                return vis.xScale(d[selectedScore])
            })
            .attr("cy", function(d) {
                return vis.yScale(d.HAPPINESS_SCORE)
            })
            .attr("r", function(d) {
                return vis.popScale(d.POPULATION)
            })
            
        vis.circles.exit()
            .transition()
            .duration(500)

        vis.svg.append("g")
			.attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height - 25) +   ")");
            
       

		vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + 25 + ",0)")

        // Call axis functions with the new domain
        vis.svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
        


            


    }
}