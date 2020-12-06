/* * * * * * * * * * * * * *
*          TrendVis          *
* * * * * * * * * * * * * */

class TrendVis {

    constructor(parentElement, geoData, happinessData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.happinessData = happinessData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        
        vis.margin = {top: 20, right: 40, bottom: 20, left: 50};

		vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
		vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // draw Y-axis Label
        vis.svg.append("text")
            .attr("class", "yLabel")
            .attr("text-anchor", "end")
            .attr("y", -40)
            .attr("x", 5)
            .attr("dy", ".5em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "9")
            .attr("opacity", "70%")
            .text("Happiness Score (SUM)");

         // append tooltip
         vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'trendTooltip')
        
         vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.filteredData = [];
        vis.displayData = JSON.parse(JSON.stringify(vis.happinessData));
        let parseDate = d3.timeParse("%Y");
        
        vis.displayData.forEach(d=>{
            d.YEAR = parseDate(d.YEAR.toString());
            d["HAPPINESS_SCORE"]=+d["HAPPINESS_SCORE"];
        });

        vis.displayData.reduce(function(res, value) {
        if (!res[value.YEAR]) {
            res[value.YEAR] = { YEAR: value.YEAR, HAPPINESS_SCORE: 0 };
            vis.filteredData.push(res[value.YEAR])
        }
        res[value.YEAR].HAPPINESS_SCORE += value.HAPPINESS_SCORE;
        return res;
        }, {});

        console.log("GROUPED BY:", vis.filteredData)
        console.log("FULL DATA:", vis.happinessData)
        vis.updateVis()
    }



    updateVis(){
        let vis = this;
        // Scales and axes
		vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.filteredData, function(d) { return d.YEAR; }));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([810, d3.max(vis.filteredData, function(d) { return d.HAPPINESS_SCORE; })]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(4);
            
        // SVG area path generator
        vis.line = d3.line()
            .x(function(d) { return vis.x(d.YEAR); })
            .y(function(d) { return vis.y(d.HAPPINESS_SCORE); });

        // Draw area by using the path generator
        vis.svg.append("path")
            .datum(vis.filteredData)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .style("opacity", 0.55)
            .attr("d", vis.line);


        let circle = vis.svg.selectAll("circle").data(vis.filteredData)
        circle.enter().append("circle")
		.attr("class", "circle")
        .attr("fill", "#ff8c00")
        .attr("stroke", "gray")
		.merge(circle)	
		.attr("r", 7)
		.attr("cx", d => {
			return vis.x(d.YEAR);
		})
		.attr("cy", d => {
			return vis.y(d.HAPPINESS_SCORE);
        })
        .on("click ", function(event, d) {

            selectedYearMap = d.YEAR.getUTCFullYear();
            mapVis.wrangleData();

            
		})
		.on("mouseover", function(event, d){
            d3.select(this)
                
                .attr('opacity', 0.3)
            
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h6>Year: <strong>${d.YEAR.getUTCFullYear()}<strong><h6>
                        <h6> Aggregate World Happiness Score: <strong>${Math.round(d.HAPPINESS_SCORE)}</strong></h6>
                    </div>`);
            })
            
        .on("mouseout", function(event, d){
                d3.select(this)
                .attr('opacity', 1)
                
                vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
            })


        // Call axis functions with the new domain 
		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);
            
        vis.svg.append("g")
			.attr("class", "y-axis axis")
			.call(vis.yAxis);

       


    }
}