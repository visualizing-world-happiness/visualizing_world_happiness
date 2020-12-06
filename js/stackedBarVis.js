class StackedBarVis {
    constructor(parentElement, origData) {
        this.parentElement = parentElement;
        this.origData = origData;
        this.wrangledData=d3.groups(this.origData, d => +d.YEAR);
        this.displayData = [];
        this.score_types=['ECONOMY_SCORE','SOCIAL_SCORE','HEALTH_SCORE', 'FREEDOM_SCORE','CORRUPTION_SCORE',
            'GENEROSITY_SCORE',  'DYSTOPIA_RESIDUAL'];
        this.initVis()
    }
    
    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 150, bottom: 20, left: 70};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add axis
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.3);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom().scale(vis.x);
        vis.yAxis = d3.axisLeft().scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis")
            .call(vis.yAxis);

        vis.svg.append("g")
            .attr("class", "x-axis")
            .call(vis.xAxis);

        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Score");

        //color scale
        let colors = ["#ff8c00", "#d0743c", "#a05d56", "#6b486b", "#7b6888", "#8a89a6", "#998ec3"]
        vis.color = d3.scaleOrdinal()
            .range(colors);

        vis.features_short=["Economy",
            "Social Support",
            "Life Expetancy",
            "Freedom",
            "Absence of Corruption",
            "Generosity",
            "Dystopia Residual"]

        vis.legend = vis.svg.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

        vis.legend.append("rect")
            .attr("x", vis.width - 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return colors.slice()[i];});

        vis.legend.append("text")
            .attr("x", vis.width + 15)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", 10)
            .text(function(d,i) {return vis.features_short[i]});

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'stackTooltip');

        
            vis.wrangleData();

    }

    wrangleData(){
        let vis = this;
        let sortedData=vis.wrangledData[5-(2020-selectedYearBar)][1]
        if (selectedOrderBar=="high"){
            vis.displayData =sortedData.sort((a,b) => {return a.HAPPINESS_RANK - b.HAPPINESS_RANK}).slice(0, 10);}
        else{
            vis.displayData =sortedData.sort((a,b) => {return b.HAPPINESS_RANK - a.HAPPINESS_RANK}).slice(0, 10);}
        vis.countries=[];
        vis.displayData.forEach(d=>{
            d["ECONOMY_SCORE"]=+d["ECONOMY_SCORE"];
            d["SOCIAL_SCORE"]=+d["SOCIAL_SCORE"];
            d["HEALTH_SCORE"]=+d["HEALTH_SCORE"];
            d["FREEDOM_SCORE"]=+d["FREEDOM_SCORE"];
            d["CORRUPTION_SCORE"]=+d["CORRUPTION_SCORE"];
            d["GENEROSITY_SCORE"]=+d["GENEROSITY_SCORE"];
            d["DYSTOPIA_RESIDUAL"]=+d["DYSTOPIA_RESIDUAL"];
            d["HAPPINESS_SCORE"]=+d["HAPPINESS_SCORE"];

            vis.countries.push(d["COUNTRY"]);
        });
        let stacked= Object.assign(d3.stack().keys(vis.score_types)(vis.displayData), {
            keys: vis.score_types,
            ids: vis.score_types.map(R => vis.countries.map(P => `${R}_${P}`)),
            countries: vis.countries});

        vis.flatten=[]
        stacked.forEach((d,i) => {
            stacked.countries.forEach((D,I) => {
                stacked[i][I].key = stacked.ids[i][I];
            });
            d.forEach((D,I)=>{
                vis.flatten.push({
                    key: D.key,
                    0: D[0],
                    1: D[1],
                    type: d.key,
                    country: D.data.COUNTRY
                });
            });
        });
        vis.updateVis();

    }

    updateVis(){
        let vis = this;
        //update domain for axes
        vis.x.domain(vis.displayData.map(d=> d.COUNTRY));
        vis.y.domain([0, d3.max(vis.displayData, function(d) { return d.HAPPINESS_SCORE; })]);

        let bars = vis.svg.selectAll("rect.stackgraph")
            .data(vis.flatten,  d => d.key);

        bars.exit().remove()

        bars.enter().append("rect")
            .attr("class", "stackgraph")
            .attr("fill", d => vis.color(d.type))
            .attr("width", vis.x.bandwidth())
            .merge(bars)
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('opacity', .5);
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h4>${d3.format(".3")(d[1]-d[0])}</h4>                
                    </div>`);
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('opacity', 1);

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition().duration(1000)
            .ease(d3.easeLinear)
            .attr("x", d => vis.x(d.country))
            .attr("y", d => vis.y(d[1]))
            .attr("height", d => vis.y(d[0]) - vis.y(d[1]));

        //axis
        vis.svg.selectAll(".x-axis").transition().duration(1000)
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis.scale(vis.x));

        vis.svg.selectAll(".y-axis").transition().duration(1500)
            .call(vis.yAxis.scale(vis.y));

    }

}