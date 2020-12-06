/* * * * * * * * * * * * * *
*          BubbleVis          *
* * * * * * * * * * * * * */

class BubbleVis {

    constructor(parentElement, happinessData) {
        this.parentElement = parentElement;
        this.happinessData = happinessData;
        this.selected_variable = 'world_happiness_score';
        this.selected_variable_scaled = 'world_happiness_score_scaled';
        this.pre_symbol = ""
        this.post_symbol = ""
        this.pretty_variable = "Happiness score: "
        this.formatValue = d3.format(".2n");
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        
        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title bubble-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // init buttons

        vis.buttons = d3.selectAll('#buttons')
        vis.buttons.append('button')
                    .text('Economy')
                    .attr('value', 'ECONOMY_SCORE')
                    .attr("class", "button")
                    .classed('d_sel', true)
                    .on("mouseover", function(d) {
                        d3.select(this)
                                .style("background", "orange")
                                .style("color", "white")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("background", "#ecf0f1")
                            .style("color", "#454545")
                    })
        vis.buttons.append('button')
                    .text('Freedom')
                    .attr('value', 'FREEDOM_SCORE')
                    .attr("class", "button")
                    .classed('d_sel', true)
                    .on("mouseover", function(d) {
                        d3.select(this)
                                .style("background", "orange")
                                .style("color", "white")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("background", "#ecf0f1")
                            .style("color", "#454545")
                    })

        vis.buttons.append('button')
                    .text('Generosity')
                    .attr('value', 'GENEROSITY_SCORE')
                    .attr("class", "button")
                    .classed('d_sel', true)
                    .on("mouseover", function(d) {
                        d3.select(this)
                                .style("background", "orange")
                                .style("color", "white")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("background", "#ecf0f1")
                            .style("color", "#454545")
                    })

        vis.buttons.append('button')
                    .text('Life Expectancy')
                    .attr('value', 'HEALTH_SCORE')
                    .attr("class", "button")
                    .classed('d_sel', true)
                    .on("mouseover", function(d) {
                        d3.select(this)
                                .style("background", "orange")
                                .style("color", "white")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("background", "#ecf0f1")
                            .style("color", "#454545")
                    })

        vis.buttons.append('button')
                    .text('Social')
                    .attr('value', 'SOCIAL_SCORE')
                    .attr("class", "button")
                    .classed('d_sel', true)
                    .on("mouseover", function(d) {
                        d3.select(this)
                                .style("background", "orange")
                                .style("color", "white")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("background", "#ecf0f1")
                            .style("color", "#454545")
                    })
        vis.buttons.append('button')
                    .text('Absence of Corruption')
                    .attr('value', 'CORRUPTION_SCORE')
                    .attr("class", "button")
                    .classed('d_sel', true)
                    .on("mouseover", function(d) {
                        d3.select(this)
                                .style("background", "orange")
                                .style("color", "white")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("background", "#ecf0f1")
                            .style("color", "#454545")
                    })
        
     
        // formatting the data displayed in the tooltip
        vis.formatValue = d3.format(".2n");

        vis.selected_variable = 'ECONOMY_SCORE';
        vis.pretty_variable = "Economy Score: "
        vis.formatValue = d3.format(".2n");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'bubbleTooltip')


        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.filteredData = [];

        // filter to year that has population data - 2020
        vis.happinessData.forEach(row => {
            if (row.YEAR == 2020) {
                vis.filteredData.push(row);
            }
        });

        console.log(vis.filteredData)


        vis.updateVis()
    }



    updateVis(){
        let vis = this;
        
        //setup scales
        vis.radiusScale = d3.scaleLinear()
		    .domain(d3.extent(vis.filteredData, function(d) { return parseFloat(d.POPULATION) }))
		    .range([7, 30]);
	    vis.scaleColor = d3.scaleSequential()
            .domain([0, 8])
            .interpolator(d3.interpolateCubehelix("#fff7bc", "#d95f0e"));;
	    vis.scaleStroke = d3.scaleOrdinal()
		    .domain(d3.extent(vis.filteredData, function(d) { return parseFloat(d.REGION) }))
            .range(["#338F72", "#73A521", "#C95A2F", "#5A6D98", "#A0A0A0"]);
            
	    vis.xScale = d3.scaleLinear()
            .rangeRound([25, vis.width - 25])
            

        vis.toggleHighlight = (function(){
                let current_stroke_width = 0.5
                let current_stroke = "black"
       
               return function(){
                           current_stroke_width = current_stroke_width == 0.5 ? 3 : 0.5
                           current_stroke = current_stroke == "black" ? "#C40320" : "black"
                   d3.select(this).style("stroke-width", current_stroke_width)
                               .style("stroke", current_stroke);
               }
           })();

        vis.xScale.domain(d3.extent(vis.filteredData, function(d) { return d[vis.selected_variable]; }));
        
        // create x-axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)   
                
        // Add bubbles
        vis.circles = vis.svg.selectAll('.circ')
            .data(vis.filteredData)
            .enter().append('circle').classed('circ', true)
            .attr('r', function(d) { return vis.radiusScale(d.POPULATION); })
            .attr('cx', function(d){ return vis.xScale(d[vis.selected_variable]); })
            .attr('cy', function(){ return vis.height/2; })
            .attr("fill", function(d) { return vis.scaleColor(d.HAPPINESS_SCORE); })
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .on('click', vis.toggleHighlight)
            
            vis.circles
                .on('mouseover', function(event, d){
                    d3.select(this)

                        .attr('opacity', "50%")
        
                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                            <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                                <h4><strong>${d.COUNTRY}<strong><h3>
                                <h6> Selected Category: <strong>${d[vis.selected_variable]}</strong></h6> 
                                <h6> World Happiness Score: <strong>${d.HAPPINESS_SCORE}</strong></h6> 
                                <h6> Population <strong>${d.POPULATION}</strong></h6>                        
                            </div>`);
                     })
                .on('mouseout', function(event, d){
                    d3.select(this)

                        .attr('opacity', "100%")
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                })

            vis.svg.append("g")
			    .attr("class", "x-axis axis")
			    .attr("transform", "translate(0," + (vis.height - 17) +   ")");

            // Call axis functions with the new domain
            vis.svg.select(".x-axis")
                .transition()
                .duration(500)
                .call(vis.xAxis);

        

        vis.simulation = d3.forceSimulation(vis.filteredData)
            .force('x', d3.forceX(function(d){
                    return vis.xScale(d[vis.selected_variable])
                })
            )
            .force('y', d3.forceY(vis.height/2).strength(0.03))
            .force('collide', d3.forceCollide(function(d) { return vis.radiusScale(d.POPULATION); }).strength(0.9))
            .alpha(0.01)
            .alphaTarget(0.3)
            .alphaDecay(0.1)
            .on('tick', tick)

        d3.selectAll('.d_sel').on('click', function(){

            vis.selected_variable = this.value;
            console.log("SELECTED VAR",vis.selected_variable);
            vis.simulation.force('x', d3.forceX(function(d){
                return vis.xScale(d[vis.selected_variable])
            }))


            if (vis.selected_variable == "ECONOMY_SCORE") {
                d3.select("#p0").transition().duration(800).style("opacity", 1).text("Economy");
                d3.select("#p1").transition().duration(800).style("opacity", 1).text("Economy Score measures the value of a country's economic activity relative to the size of its population.");
                d3.select("#p2").transition().duration(800).style("opacity", 1).text("We can observe that the happiest countries in the world, like Luxemburg, Singapore, and Norway, have the highest GDP per capita--resulting in a higher Economy score. We can see that there appears to be a strong correlation between Economy and Happiness scores. Therefore, having a healthy economy leads to happier lives.");
            }

            if (vis.selected_variable == "FREEDOM_SCORE") {
                d3.select("#p0").transition().duration(800).style("opacity", 1).text("Freedom");
                d3.select("#p1").transition().duration(800).style("opacity", 1).text("Freedom Score measures the extent to which Freedom contributed to the calculation of the Happiness Score.");
                d3.select("#p2").transition().duration(800).style("opacity", 1).text("Most countries in the rankings are closely clustered together in terms of Freedom score, though countries with higher Freedom scores, like Denmark, Canada, and Iceland, also have higher overall happiness scores.");
            }

            if (vis.selected_variable == "GENEROSITY_SCORE") {
                d3.select("#p0").transition().duration(800).style("opacity", 1).text("Generosity");
                d3.select("#p1").transition().duration(800).style("opacity", 1).text("Generosity Score measures the extent to which country's generosity towards other countries contributed to the calculation of the Happiness Score.");
                d3.select("#p2").transition().duration(800).style("opacity", 1).text("Two countries stand out among the rest when it comes to Generosity scores: Myanmar and Indonesia, even though their overall Happiness Score is not among the highest.");
            }

            if (vis.selected_variable == "HEALTH_SCORE") {
                d3.select("#p0").transition().duration(800).style("opacity", 1).text("Life Expectancy");
                d3.select("#p1").transition().duration(800).style("opacity", 1).text("This score measures how life expectancy contributed to the calculation of the Happiness Score.");
                d3.select("#p2").transition().duration(800).style("opacity", 1).text("There is a very strong correlation with countries scoring higher having higher overall happiness scores as well.");
            }

            if (vis.selected_variable == "SOCIAL_SCORE") {
                d3.select("#p0").transition().duration(800).style("opacity", 1).text("Society");
                d3.select("#p1").transition().duration(800).style("opacity", 1).text("Society Score measures the extent to which society and family contributed to the calculation of the Happiness Score.");
                d3.select("#p2").transition().duration(800).style("opacity", 1).text("Countries with highest Social score, like Scandinavian countries (Norway, Sweden, Finland, Denmark, and Iceland), also have some of the highest overall Happiness scores. We can observe a correlation between Social and Happiness scores.");
            }

            if (vis.selected_variable == "CORRUPTION_SCORE") {
                d3.select("#p0").transition().duration(800).style("opacity", 1).text("Corruption");
                d3.select("#p1").transition().duration(800).style("opacity", 1).text("Corruption Score measures the extent to which government corruption contributed to the calculation of the Happiness Score.");
                d3.select("#p2").transition().duration(800).style("opacity", 1).text("Surprisingly, the vast majority of the countries scored very low on Corruption score, which indicates the absence of corruption within their countries. Governments should be worried that the 'absence of corruption' had very poor scores across the globe. Citizens need to believe that the government has their best interests at heart and only a handful of countries (primarily, Scandinavian countries) achieved somewhat positive scores.");
            }
        })
        
            function tick(){
                d3.selectAll('.circ')
                    .attr('cx', function(d){return d.x})
                    .attr('cy', function(d){return d.y})
            }
       
    }
}