class RadarVis {
    constructor(parentElement, origData) {
        this.parentElement=parentElement
        this.data=origData
        this.viewData=origData
        this.initVis();

    }

    initVis(){
        let vis = this;

        vis.margin = {top: 40, right: 150, bottom: 20, left: 0};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        //color scale
        vis.colorscale = d3.scaleOrdinal(d3.schemeCategory10);

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.features=['CORRUPTION_SCORE', 'ECONOMY_SCORE', 'FREEDOM_SCORE',
            'GENEROSITY_SCORE', 'HEALTH_SCORE', 'SOCIAL_SCORE', 'DYSTOPIA_RESIDUAL'];

        vis.features_short=["Absence of Corruption",
            "Economy",
            "Freedom",
            "Generosity",
            "Health",
            "Social",
            "Dystopia Residual"]


        let radius = 250;

        vis.svg.selectAll(".levels")
            .data(d3.range(1,7).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("cx", 300)
            .attr("cy", 300)
            .attr("r", function(d, i){return radius/6*d;})
            .style("fill", "gray")
            .style("stroke", "gray")
            .style("fill-opacity", .1);

        vis.radialScale = d3.scaleLinear()
            .domain([0,3])
            .range([0,radius]);

        let ticks = [.5, 1, 1.5, 2, 2.5, 3];
        ticks.forEach(t =>
            vis.svg.append("text")
                .attr("x", 305)
                .attr("y", 300 - vis.radialScale(t))
                .text(t.toString())
        );

        vis.angleToCoordinate = function (angle, value){
            let x = Math.cos(angle) * vis.radialScale(value);
            let y = Math.sin(angle) * vis.radialScale(value);
            return {"x": 300 + x, "y": 300 - y};
        }

        for (var i = 0; i < vis.features.length; i++) {
            let ft_name = vis.features_short[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
            let line_coordinate = vis.angleToCoordinate(angle, 3);
            let label_coordinate = vis.angleToCoordinate(angle, 3.2);

            //draw axis line
            vis.svg.append("line")
                .attr("x1", 300)
                .attr("y1", 300)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke","grey");

            //draw axis label
            vis.svg.append("text")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y)
                .text(ft_name);
        }

        vis.colors=["#EDC951","#CC333F","#00A0B0"];
        let label=["Country that ranked lowest","Average values","Country that ranked highest"]

        vis.legend = vis.svg.selectAll(".legend")
            .data(vis.colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

        vis.legend.append("rect")
            .attr("x", vis.width - 18)
            .attr("y", vis.height/2- 9+100)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return vis.colors.slice().reverse()[i];});

        vis.legend.append("text")
            .attr("x", vis.width + 5)
            .attr("y", vis.height/2+100)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", 10)
            .text(function(d,i) {return label[i]});

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'radarTooltip');

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;
        vis.mean={'DYSTOPIA_RESIDUAL': 0,
            'ECONOMY_SCORE': 0,
            'FREEDOM_SCORE': 0,
            'CORRUPTION_SCORE': 0,
            'GENEROSITY_SCORE': 0,
            'HEALTH_SCORE': 0,
            'SOCIAL_SCORE': 0};
        vis.viewData= vis.data.filter(function(d) {
            return d.YEAR == selectedYearRadar;
        });
        vis.viewData.forEach(function (d){
            d['DYSTOPIA_RESIDUAL']=+d['DYSTOPIA_RESIDUAL'];
            vis.mean['DYSTOPIA_RESIDUAL']+= d['DYSTOPIA_RESIDUAL'];
            d['ECONOMY_SCORE']=+d['ECONOMY_SCORE'];
            vis.mean['ECONOMY_SCORE']+= d['ECONOMY_SCORE'];
            d['FREEDOM_SCORE']=+d['FREEDOM_SCORE'];
            vis.mean['FREEDOM_SCORE']+= d['FREEDOM_SCORE'];

            d['GENEROSITY_SCORE']=+d['GENEROSITY_SCORE'];
            vis.mean['GENEROSITY_SCORE']+= d['GENEROSITY_SCORE'];
            d['HEALTH_SCORE']=+d['HEALTH_SCORE'];
            vis.mean['HEALTH_SCORE']+= d['HEALTH_SCORE'];
            d['SOCIAL_SCORE']=+d['SOCIAL_SCORE'];
            vis.mean['SOCIAL_SCORE']+= d['SOCIAL_SCORE'];
        })
        vis.top=[
            {axis:'CORRUPTION_SCORE', value:  +vis.viewData[0]['CORRUPTION_SCORE'], country: vis.viewData[0]['COUNTRY']},
            {axis:'DYSTOPIA_RESIDUAL', value: +vis.viewData[0]['DYSTOPIA_RESIDUAL'], country: vis.viewData[0]['COUNTRY']},
            {axis:'SOCIAL_SCORE', value:  +vis.viewData[0]['SOCIAL_SCORE'], country: vis.viewData[0]['COUNTRY']},
            {axis:'HEALTH_SCORE', value:  +vis.viewData[0]['HEALTH_SCORE'], country: vis.viewData[0]['COUNTRY']},
            {axis:'GENEROSITY_SCORE', value:  +vis.viewData[0]['GENEROSITY_SCORE'], country: vis.viewData[0]['COUNTRY']},
            {axis:'FREEDOM_SCORE', value:  +vis.viewData[0]['FREEDOM_SCORE'], country: vis.viewData[0]['COUNTRY']},
            {axis:'ECONOMY_SCORE', value:  +vis.viewData[0]['ECONOMY_SCORE'], country: vis.viewData[0]['COUNTRY']}];

        vis.lowctry=vis.viewData.pop();
        vis.low=[
            {axis:'CORRUPTION_SCORE', value:  +vis.lowctry['CORRUPTION_SCORE'], country: vis.lowctry['COUNTRY']},
            {axis:'DYSTOPIA_RESIDUAL', value: +vis.lowctry['DYSTOPIA_RESIDUAL'], country: vis.lowctry['COUNTRY']},
            {axis:'SOCIAL_SCORE', value:  +vis.lowctry['SOCIAL_SCORE'], country: vis.lowctry['COUNTRY']},
            {axis:'HEALTH_SCORE', value:  +vis.lowctry['HEALTH_SCORE'], country: vis.lowctry['COUNTRY']},
            {axis:'GENEROSITY_SCORE', value:  +vis.lowctry['GENEROSITY_SCORE'], country: vis.lowctry['COUNTRY']},
            {axis:'FREEDOM_SCORE', value:  +vis.lowctry['FREEDOM_SCORE'], country: vis.lowctry['COUNTRY']},
            {axis:'ECONOMY_SCORE', value:  +vis.lowctry['ECONOMY_SCORE'], country: vis.lowctry['COUNTRY']}];
        let countries=vis.viewData.length;
        vis.mid=[
            {axis:'CORRUPTION_SCORE', value:  vis.mean['CORRUPTION_SCORE']/countries, country: 'Average Value'},
            {axis:'DYSTOPIA_RESIDUAL', value: vis.mean['DYSTOPIA_RESIDUAL']/countries, country: 'Average Value'},
            {axis:'SOCIAL_SCORE', value: vis.mean['SOCIAL_SCORE']/countries, country: 'Average Value'},
            {axis:'HEALTH_SCORE', value: vis.mean['HEALTH_SCORE']/countries, country: 'Average Value'},
            {axis:'GENEROSITY_SCORE', value:  vis.mean['GENEROSITY_SCORE']/countries, country: 'Average Value'},
            {axis:'FREEDOM_SCORE', value:  vis.mean['FREEDOM_SCORE']/countries, country: 'Average Value'},
            {axis:'ECONOMY_SCORE', value:  vis.mean['ECONOMY_SCORE']/countries, country: 'Average Value'}];
        vis.viewData=[vis.top, vis.mid, vis.low];
        vis.updateVis();
    }

    updateVis(){
        let vis = this;
        let angleSlice = Math.PI * 2 / 7;
        let radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(function(d) { return vis.radialScale(d.value); })
            .angle(function(d,i) {	return i*angleSlice; });

        let area = vis.svg.selectAll(".radarArea")
            .data(vis.viewData);

        area.exit().remove()

        let areaenter=area.enter().append("g");

        areaenter.append("path")
            .attr("class", "radarArea")
            .style("fill", function(d,i) { return vis.colors[i]; })
            .style("fill-opacity", .35)
            .merge(area)
            .attr("d", function(d) { return radarLine(d); })
            .on('mouseover', function (event,d){
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 10px">
                        <h5>${d[0].country}</h5>                
                    </div>`);
            })
            .on('mouseout', function(){
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", .35);
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .attr('transform', `translate (300, 300)`);

        let border = vis.svg.selectAll(".radarStroke")
            .data(vis.viewData);

        border.exit().remove()

        border.append("path")
            .attr("class", "radarStroke")
            .merge(areaenter)
            .attr("d", function(d) { return radarLine(d);})
            .style("stroke-width", "2px")
            .style("stroke", function(d,i) { return vis.colors[i]; })
            .style("fill", "none");


    }

}