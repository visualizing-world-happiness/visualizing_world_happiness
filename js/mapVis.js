/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

class MapVis {

    constructor(parentElement, geoData, happinessData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.happinessData = happinessData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 5, bottom: 20, left: 5};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // create projection
        vis.projection = d3.geoMercator() 
             .translate([vis.width / 2, vis.height / 1.75])
             .scale(125)

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        // graticule
        vis.svg.append("path")
            .datum(d3.geoGraticule())
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', d => "map_" + d.properties.name)
            .attr("d", vis.path)

        // setup color scale
        vis.color = d3.scaleSequential().interpolator(d3.interpolateCubehelix("#6b486b", "#ff8c00"))
        
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')

        console.log("SEL YEAR", selectedYearMap)
        
        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.filteredData = [];
        // filter by year
        vis.happinessData.forEach(row => {
            if (row.YEAR == selectedYearMap) {
                vis.filteredData.push(row);
            }
        });

        console.log(vis.filteredData)

        // merge the two datasets
        for (var i = 0; i < vis.filteredData.length; i++) {
            var countryName = vis.filteredData[i].COUNTRY;
            var countryRegion = vis.filteredData[i].REGION;
            var population = vis.filteredData[i].POPULATION;
            var happinessRank = vis.filteredData[i].HAPPINESS_RANK;
            var happinessScore = vis.filteredData[i].HAPPINESS_SCORE;
            var economyScore = vis.filteredData[i].ECONOMY_SCORE;
            var socialScore = vis.filteredData[i].SOCIAL_SCORE;
            var healthScore = vis.filteredData[i].HEALTH_SCORE;
            var freedomScore = vis.filteredData[i].FREEDOM_SCORE;
            var corruptionScore = vis.filteredData[i].CORRUPTION_SCORE;
            var generosityScore = vis.filteredData[i].GENEROSITY_SCORE;
            var residualScore = vis.filteredData[i].DYSTOPIA_RESIDUAL;
            for (var j=0; j < vis.world.length; j++) {
                var jsonCountryName = vis.world[j].properties.name;
                if (countryName == jsonCountryName) {
                    vis.world[j].properties.REGION = countryRegion
                    vis.world[j].properties.POPULATION= population
                    vis.world[j].properties.HAPPINESS_RANK = happinessRank
                    vis.world[j].properties.HAPPINESS_SCORE = happinessScore
                    vis.world[j].properties.ECONOMY_SCORE = economyScore
                    vis.world[j].properties.SOCIAL_SCORE = socialScore
                    vis.world[j].properties.HEALTH_SCORE = healthScore
                    vis.world[j].properties.FREEDOM_SCORE = freedomScore
                    vis.world[j].properties.CORRUPTION_SCORE = corruptionScore
                    vis.world[j].properties.GENEROSITY_SCORE = generosityScore
                    vis.world[j].properties.DYSTOPIA_RESIDUAL = residualScore
                }
            }
        }

        console.log('final data structure for COUNTRY INFO + GEO', vis.world);

        vis.updateVis()
    }



    updateVis(){
        let vis = this;

        vis.color
                .domain([
                    d3.min(vis.world, function(d) { return d.properties.HAPPINESS_SCORE}),
                    d3.max(vis.world, function(d) { return d.properties.HAPPINESS_SCORE})
                   
                ]);
       

        // update map
        vis.countries
        .style("fill", function(d) {

            if (d.properties.HAPPINESS_SCORE) {
                return vis.color(d.properties.HAPPINESS_SCORE)
            } else {
                return "#ccc"
            }
            })
            
        .on('mouseover', function(event, d){
        d3.select(this)
            .transition()
            .duration(250)
            .attr('stroke-width', '1px')
            .attr('stroke', 'green')
            .attr('opacity', "50%")
            
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h4><strong>${d.properties.name}<strong><h3>
                        <h6> World Happiness Rank: <strong>${d.properties.HAPPINESS_RANK}</strong></h6> 
                        <h6> World Happiness Score: <strong>${d.properties.HAPPINESS_SCORE}</strong></h6>                     
                    </div>`);
            })
        .on('mouseout', function(event, d){
            d3.select(this)
                .transition()
                .duration(250)
                .attr('stroke-width', '0px')
                .attr('opacity', 1)
                .attr("fill", function(d) {
                    if (d.properties.HAPPINESS_SCORE) {
                return vis.color(d.properties.HAPPINESS_SCORE)
            } else {
                return "#ccc"
            }
                    })

            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })
       


         // create legend
        vis.svg.selectAll(".legend").remove()
        vis.colorLegend = d3.legendColor()
            .labelFormat(d3.format(".1f"))
            .orient('horizontal')
            .scale(vis.color)
            .shapePadding(10)
            .shapeWidth(30)
            .cells(10)
            .shapeHeight(10)
            .title("World Happiness Scores")
            .labelOffset(10);

        vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(200, 340)")
            .call(vis.colorLegend);

         // draw selected year in the background
         vis.svg.selectAll(".yearLabelMap").remove()
         vis.svg.append("text")
             .attr("class", "yearLabelMap")
             .attr("y", vis.height - 180)
             .attr("x", vis.width - 290)
             .style("font-size", "150px")
             .style("fill", "gray")
             .attr("opacity", "50%")
             .attr("dy", "1em")
             .style("text-anchor", "middle")
             .text(selectedYearMap);
        

           
                
 
            


    }
}