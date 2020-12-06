
/*
 * MyVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class MyVis {


	constructor(_parentElement, _data) {
		this.parentElement = _parentElement;
		this.data = _data;

		this.initVis();
	}


	/*
	 * Initialize visualization (static content, e.g. SVG area or axes)
	 */

	initVis() {
		let vis = this;

		vis.margin = { top: 50, right: 40, bottom: 60, left: 60 };
		vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
			vis.height = 500 - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width]);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y)
			.ticks(6);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");
		/*
		// Axis title
		vis.svg.append("text")
			.attr("x", vis.width/2)
			.attr("y", -8)
			.attr("text-anchor", "middle")
			.text("Happiness Trend: What Makes Countries Happy?");
		*/

		// create gradient
		/*
		vis.defs = vis.svg.append("defs");
		vis.gradient = vis.defs.append("linearGradient")
			.attr("id", "svgGradient")
			.attr("x1", "0%")
			.attr("x2", "0%")
			.attr("y1", "0%")
			.attr("y2", "100%")
			.attr("gradientUnits","userSpaceOnUse");
		vis.gradient.append("stop")
			.attr('class', 'start')
			.attr("offset", "0%")
			.attr("stop-color", "yellow")
			.attr("stop-opacity", 1);

		vis.gradient.append("stop")
			.attr('class', 'start')
			.attr("offset", "30%")
			.attr("stop-color", "white")
			.attr("stop-opacity", .5);

		vis.gradient.append("stop")
			.attr('class', 'end')
			.attr("offset", "50%")
			.attr("stop-color", "#999")
			.attr("stop-opacity", 1);
		*/
		// Tooltip
		// append tooltip
		vis.tooltip = d3.select("body").append('div')
			.attr('class', "tooltip")
			.attr('id', 'pieTooltip');

		  // draw Y-axis Label
		  vis.svg.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 0 - vis.margin.left)
		  .attr("x",0 - (vis.height / 2))
		  .attr("dy", "1em")
		  .style("text-anchor", "middle")
		  .text("Happiness Score");

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}



	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// filter by selected region
		console.log("SELECTED REGION IS: ", selectedRegion)
		console.log("STARTING DATA", this.data)
		let filteredData = []
        this.data.forEach(row => {
            if (row.REGION == selectedRegion) {
                filteredData.push(row);
            }
		});
		console.log("FILTERED STARTING DATA", filteredData)

		//create groups by year:
		// 1. group data by year

		let initData = filteredData;


		let initDataScoreDifference = initData.forEach((entry, i) => {
			// for each country, grab the elements in initData?
			//console.log(entry.COUNTRY)
			// sort the years
			// calculate the difference
			//
			// if this is 2015, store the value?
			// if this is 2016, store the value and subtract 2015
		});


		// create groups by years, to display the dots
		let tempDict = {'2015': [], '2016': [], '2017': [], '2018': [], '2019': [], '2020': []};

		initData.forEach((entry, i) => {


			if(tempDict[entry.YEAR] ){
				tempDict[entry.YEAR].push(entry);

				// if(i!=0){
				// 	console.log(i);
				// }

				// if[i!=0]{
				// 	console.log(i)
				// 	//tempDict[i][entry.HAPPINESS_SCORE] - tempDict[i-1][entry.HAPPINESS_SCORE]
				// }

			}else{
				tempDict[entry.YEAR] = [];
			}
		})
		console.log(tempDict);

		let finalDataStructure = [];
		Object.keys(tempDict).forEach((key, i)=>{
			finalDataStructure.push(tempDict[key]);
		})


		this.displayData = finalDataStructure;

		console.log("DISPLAY DATA", this.displayData)




		// create groups by countries:
		// use index to create ID
		let tempDictCountries = {};

		initData.forEach((entry, i) => {
			if(tempDictCountries[entry.COUNTRY]){
				tempDictCountries[entry.COUNTRY].push(entry);
			}else{
				tempDictCountries[entry.COUNTRY] = [entry];
			}
		})

		vis.dataByCountryDict = tempDictCountries;
		console.log(vis.dataByCountryDict)

		let finalDataStructureCountry = [];
		Object.keys(tempDictCountries).forEach((country, i)=>{
			let numberOfYears = tempDictCountries[country].length;

			tempDictCountries[country]["id"] = i;
			if(numberOfYears === 0){
				tempDictCountries[country]["happinessChange"] = 0;
			}else{
				tempDictCountries[country]["happinessChange"] = tempDictCountries[country][numberOfYears-1]["HAPPINESS_SCORE"] - tempDictCountries[country][0]["HAPPINESS_SCORE"];

			}
			finalDataStructureCountry.push(tempDictCountries[country]);
		})

		this.dataByCountryArray = finalDataStructureCountry;
		console.log("MY VIS FINAL DATA", this.dataByCountryArray)



		// Update the visualization
		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 * Function parameters only needed if different kinds of updates are needed
	 */

	updateVis() {
		let vis = this;

		// Set domains
		let minMaxY = [2, 8]
			//d3.max(vis.displayData.map(function (d, i) {return d[i].HAPPINESS_SCORE;}))

		
		vis.y.domain(minMaxY);
		//console.log(vis.displayData);
		// console.log(d3.max(vis.displayData.map(function (d, i) {return d[i].HAPPINESS_SCORE;})))
		//console.log(minMaxY); // returns 0, 7.561  instead of 0, 7.809 (Finland 2020)
		
		let minMaxX = d3.extent(vis.displayData.map(function (d, i) {
			console.log("JUST BEFORE", d[0])
			console.log("PARSED DATE", dateParser(d[0].YEAR))
			return (dateParser(d[0].YEAR))
		}));

		console.log("DOMAIN", minMaxX)
		//let minMaxX =  [
		//	dateParser(2015), dateParser(2020)]
		vis.x.domain(minMaxX);

		vis.pathGroups = vis.svg.selectAll(".pathGroup")
		vis.pathGroups.remove()

		// create path groups, i.e. group for each country
		vis.pathGroups = vis.svg.selectAll(".pathGroup")
			.data(vis.dataByCountryArray)

		vis.pathGroupsMerged = vis.pathGroups.enter().append("g")
			.attr("class", "pathGroup")
			.merge(vis.pathGroups)

		vis.pathGroupsMerged.append("path")
			.attr("d", d3.line()
				.x(function(d, i) {
					return vis.x(dateParser(d.YEAR))
				})
				.y(function(d, i) {
					return vis.y(+d.HAPPINESS_SCORE)
				})
			)
			.attr("fill", "transparent")
			.attr("stroke-width", d => {
				if(d.happinessChange >= 1 || d.happinessChange <= -1){return "2px";}
				else{return "1px";}
			})
			.attr("stroke",
					d => {
					if(d.happinessChange >= 1 || d.happinessChange <= -1){return "darkorange";}
					else{return "gray"}
					//else{return "url(#svgGradient)";}
					}
				)
			.attr("class", d => {
				// console.log(d)

				// assign a special class to the circles with the score change
				return "a"+d.id;
			})
		// each circle and line have a class name that reflects country

			.on("mouseover", function (event, d, i) {
				d3.select(this)
				.attr("stroke-width", d => {
					if(d.happinessChange >= 1 || d.happinessChange <= -1){return "2px";}
					else{return "1px";}
				}				)
				.attr("stroke",
					d => {
						if(d.happinessChange >= 1 || d.happinessChange <= -1){return "darkorange";}
						else{return "black";}
					}
					);

				vis.myCircle = d3.selectAll(`.myCircle.a${vis.dataByCountryDict[d[0].COUNTRY].id}`)
				vis.myCircle
					.attr("fill", "red").attr("r", "5")
				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
					.style("top", event.pageY + "px")
					.html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                         <h3>${d[0].COUNTRY}<h3>   
                         <h5> Happiness Score: ${d[0].HAPPINESS_SCORE}</h5>
                         <h5> Happiness Rank: ${d[0].HAPPINESS_RANK}</h5>        
                     </div>`);
			})
			.on("mouseout", function (event, d) {
				d3.select(this).attr("stroke",
						d => {
							if(d.happinessChange >= 1.5 || d.happinessChange <= -1.5){return "red";}
							else{return "gray"}
							//else{return ""url(#svgGradient)"";}
						}
					);
				d3.selectAll(`.myCircle.a${vis.dataByCountryDict[d[0].COUNTRY].id}`).attr("fill", "gray").attr("r", "2");
				d3.selectAll(`.a${vis.dataByCountryDict[d[0].COUNTRY].id}`).attr("stroke",
					d => {
						if(d.happinessChange >= 1 || d.happinessChange <= -1){return "darkorange";}
						else{return "gray"}
							//else{return ""url(#svgGradient)"";}
					}
					);
				vis.tooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
					.html(``);

			})
			vis.pathGroups.exit().remove()
			vis.pathGroupsMerged.exit().remove()

		



		// 2. create groups ('g') by year
		// circleGroupsByYear = vis. svg.selectAll('g').data(...)

		// 3. transition, translate all the circle groups
		// append circles to each according group
		// only attributes you need to define are radius and y coordinate
		// x position will be defined just through the translation
		// [[{},{},{}], [{},{},{}], ...]
		// [year1, year2, year3,...]

		vis.yearGroups = vis.svg.selectAll('.yearGroup')
		vis.yearGroups.remove()

		vis.yearGroups = vis.svg.selectAll('.yearGroup').data(vis.displayData)
			.enter()
			.append("g")
			.attr("class", "yearGroup")
			.attr("transform", (d,i) =>`translate(${vis.x(dateParser(d[0].YEAR))},0)`);

		vis.circles = vis.yearGroups.selectAll(".myCircle")
		vis.circles.remove()

		vis.circles = vis.yearGroups.selectAll(".myCircle").data(
			function (d){
				// console.log(d);
				return(d);
			});
		

		// give every circle a class of a country name
		vis.circles.enter().append('circle')
			.attr("class", d=>`myCircle a${vis.dataByCountryDict[d.COUNTRY].id}`)
			.attr("cy", (d,i)=>{return vis.y(d.HAPPINESS_SCORE)})
			.attr("r", "3")
			.attr("fill", (d, i)=>{
				// get the current happiness score
				// console.log(d.HAPPINESS_SCORE)
				// calculate the difference between the happiness score from the previous year
				// if the difference is greater than .5,  change the fill to red
				// otherwise
				return "gray";
			})
			.attr("stroke", "gray")
		// mouseover effect similar to path
			.on("mouseover", function (event, d) {
				d3.select(this).attr("fill", "red")
				//console.log(d)
				// when hovering over a circle, use d3.selectAll - every circle with class 3, select the line with class 3
				// https://stackoverflow.com/questions/17435838/how-to-use-d3-selectall-with-multiple-class-names/17436116
				d3.selectAll(`.myCircle.a${vis.dataByCountryDict[d.COUNTRY].id}`).attr("fill", "red").attr("r", "5")
				d3.selectAll(`.a${vis.dataByCountryDict[d.COUNTRY].id}`).attr("stroke", "black")
				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
					.style("top", event.pageY + "px")
					.html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                         <h3>${d.COUNTRY}<h3>
                         <h5> Happiness Score: ${d.HAPPINESS_SCORE}</h5>
                         <h5> Happiness Rank: ${d.HAPPINESS_RANK}</h5>                                
                     </div>`);
			})
		// mouse out effect - reverse ie setting to initial color
			.on("mouseout", function (event, d) {
				d3.select(this).attr("fill", "gray");
				d3.selectAll(`.myCircle.a${vis.dataByCountryDict[d.COUNTRY].id}`).attr("fill", "gray").attr("r", "2");
				d3.selectAll(`.a${vis.dataByCountryDict[d.COUNTRY].id}`).attr("stroke", "gray");
				vis.tooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
					.html(``);
			})




		function calculateHappinessChange(d, i) {
			//console.log(d)
			for(let i=0; i<=d.length; i++) {
				//console.log(i)
			}
			//vis.svg.selectAll(`.myCircle.a${d.id}`);

			// console.log(countryCircles)
			// if(countryCircles.length < 2){
			// 	console.log(countryCircles)
			// }


			// select all the circles by country name
			// get the position of all the circles
			// draw a line through this position


			// // loop through the country circles
			// for(vis.i=0; vis.i<=vis.circles.length; vis.i++){
			// 	let countryCircles = vis.svg.selectAll(".myCircle");
			// 	//let countryCircles = vis.svg.selectAll(d=>`${d.COUNTRY}`)
			// 	// filter the countries with the highest change
			// 	console.log(countryCircles);
			//
			// }

		}

		calculateHappinessChange(vis.dataByCountryArray);

		// let countryCircles = vis.svg.selectAll(`.myCircle.a${vis.dataByCountryDict[d.COUNTRY].id}`)
		// 	.data([vis.displayData], function(d){ return d.YEAR });


		// construct the list of the countries
		// look at each item in the list
		// select by name
		// Update the line




		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);
	}
}