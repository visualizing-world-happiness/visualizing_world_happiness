/* * * * * * * * * * * * * *
*          RADIALMAPVIS          *
* * * * * * * * * * * * * */

class RadialMapVis {

    constructor(parentElement, happinessData) {
        this.parentElement = parentElement;
        this.happinessData = happinessData;
        
        let colors = ["#ff8c00", "#d0743c", "#a05d56", "#6b486b", "#7b6888", "#8a89a6", "#998ec3"]

        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        this.dataCategories = Object.keys(this.happinessData[0]).filter(d=>d !== "YEAR" && d !=="COUNTRY" && d !=="REGION" && d !=="POPULATION" && d !=="HAPPINESS_RANK"  && d !=="HAPPINESS_SCORE")

        // prepare colors for range
        let colorArray = this.dataCategories.map( (d,i) => {
            return colors[i%10]
        })

        // Set ordinal color scale
        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(colorArray);
        
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 0, bottom: 0, left: 0};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .style("font", "10px sans-serif")
            .attr("transform", "translate(" + (20) + "," + (20) + ")");
        
        vis.g = vis.svg.append("g")
            .attr("transform", "translate(" + (vis.width / 2 + vis.margin.left) + "," + (vis.height / 2 + vis.margin.top) + ")");

        vis.x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)

        vis.y = d3.scaleRadial()
            .range([200, Math.min(vis.width, vis.height) / 2 + 5])        
        
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'radialMapTooltip')

        
        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.filteredData = [];
        vis.happinessData.forEach(row => {
            if (row.YEAR == 2015) {   
                let subset = (({COUNTRY, HAPPINESS_SCORE, DYSTOPIA_RESIDUAL, ECONOMY_SCORE, FREEDOM_SCORE, GENEROSITY_SCORE, HEALTH_SCORE, SOCIAL_SCORE}) => ({COUNTRY, HAPPINESS_SCORE, DYSTOPIA_RESIDUAL, ECONOMY_SCORE, FREEDOM_SCORE, GENEROSITY_SCORE, HEALTH_SCORE, SOCIAL_SCORE}))(row)     
                vis.filteredData.push(subset)
            }
        });
        console.log("PRE SORT", vis.filteredData)

        function compare(a, b) {
            // Use toUpperCase() to ignore character casing
            const countryA = a.COUNTRY.toUpperCase();
            const countryB = b.COUNTRY.toUpperCase();
          
            let comparison = 0;
            if (countryA > countryB) {
              comparison = 1;
            } else if (countryA < countryB) {
              comparison = -1;
            }
            return comparison;
          }
        vis.filteredData.sort(compare)
        vis.updateVis()
    }



    updateVis(){
        let vis = this;
        vis.x.domain(vis.filteredData.map(function(d) { return d.COUNTRY; }));
        vis.y.domain([0, d3.max(vis.filteredData, function(d) { return d.HAPPINESS_SCORE; })]);

        vis.g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(vis.dataCategories)(vis.filteredData))
            .enter().append("g")
        
            .attr("fill", function(d) { return vis.colorScale(d.key); })
            .selectAll("path")
            .data(function(d) { return d; })
            .enter().append("path")
            .attr("d", d3.arc()
                .innerRadius(function(d) { return vis.y(d[0]); })
                .outerRadius(function(d) { return vis.y(d[1]); })
                .startAngle(function(d) { return vis.x(d.data.COUNTRY); })
                .endAngle(function(d) { return vis.x(d.data.COUNTRY) + vis.x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(180))
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('opacity', "30%")
    
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                            <h4>${d.data.COUNTRY}<h3>
                            <h6> Happiness Score: ${d.data.HAPPINESS_SCORE}</h6>                    
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

        vis.label = vis.g.append("g")
            .selectAll("g")
            .data(vis.filteredData)
            .enter().append("g")
            .attr("text-anchor", "start")
            .attr("transform", function(d) { return "rotate(" + ((vis.x(d.COUNTRY) + vis.x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + 195 + ",0)"; });
        
        
            vis.label.append("text")
            .attr("transform", function(d) { return (vis.x(d.COUNTRY) + vis.x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(180)translate(0,0)" : "rotate(-180)translate(0,0)"; })
                .text(function(d) { return d.COUNTRY; })
                
        
            vis.yAxis = vis.g.append("g")
                .attr("text-anchor", "middle");
        
             vis.yTick = vis.yAxis
                .selectAll("g")
                .data(vis.y.ticks(5).slice(1))
                .enter().append("g");
        
            vis.yTick.append("circle")
                .attr("fill", "none")
                .attr("stroke", "#000")
                .attr("r", vis.y);              
        
            vis.yTick.append("circle")
                .attr("fill", "black")
                .attr("stroke", "#000")
                .attr("cy", function(d) { return -vis.y(d); })
                .attr("r", 10);  

            vis.yTick.append("text")
                .attr("y", function(d) { return -vis.y(d); })
                .attr("dy", "0.25em")
                .style("font-size", "15px")
                .style("fill", "white")
                .text(vis.y.tickFormat(5, "s"));

            
            vis.yAxis.append("text")
                .attr("y", function(d) { return -vis.y(vis.y.ticks(5).pop()) ; })
                .attr("dy", "-1em")
                .style("font-size", "15px")
                .style("fill", "black")
                .text("Happiness Score")
        
            vis.legend = vis.g.append("g")
                .selectAll("g")
                .data(vis.dataCategories)
                .enter().append("g")
                    .attr("transform", function(d, i) { return "translate(-40," + (i - (vis.dataCategories.length - 1) / 2) * 20 + ")"; });
        
            vis.legend.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", vis.colorScale);
        
            vis.legend.append("text")
                .attr("x", 28)
                .attr("y", 10)
                .attr("dy", "0.35em")
                .text(function(d) { 
                    if (d == "GENEROSITY_SCORE")
                        return "Generosity"; 
                    if (d == "ECONOMY_SCORE")
                        return "Economy"; 
                    if (d == "SOCIAL_SCORE")
                        return "Social Support"; 
                    if (d == "HEALTH_SCORE")
                        return "Life Expectancy "; 
                    if (d == "CORRUPTION_SCORE")
                        return "Absense of Corruption ";
                    if (d == "FREEDOM_SCORE")
                        return "Freedom"; 
                    if (d == "DYSTOPIA_RESIDUAL")
                        return "Dystopia Residual"; 
                });
    
        

    }
}