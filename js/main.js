/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables
let selectedCountry = '';
let selectedYearMap = 2020;
let selectedYear = $('#yearSlider').val();
let selectedYearRadar = $('#yearSelectorRadar').val();
let selectedScore = $('#scoreSelector').val();
let selectedYearBar = $('#yearSelectorBar').val();
let selectedOrderBar = $('#orderSelectorBar').val();
let selectedRegion = $('#regionSelector').val();
selectedScoreText = $('#scoreSelector option:selected').text();
let dateParser = d3.timeParse("%Y");

// load data using promises
let promises = [

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
    d3.csv("data/world_happiness_rankings.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log('check out the data', dataArray);

    // init map
    mapVis = new MapVis('mapDiv', dataArray[0], dataArray[1]);

    // init map
    trendVis = new TrendVis('trendDiv', dataArray[0], dataArray[1]);

    // init bubble visualization
    bubbleVis = new BubbleVis('bubbleDiv', dataArray[1]);

    // init scatter visualization
    scatterVis = new ScatterVis('scatterDiv', dataArray[1]);

    // init stacked bar visualization
    stackedBarVis = new StackedBarVis('stackedBarDiv', dataArray[1]);

   // init radial map visualization
   radialMapDiv = new RadialMapVis('radialMapDiv', dataArray[1]);

   // init radar visualization
   radarVis = new RadarVis("radarDiv", dataArray[1])

   // init lines graph visualization
    myVis = new MyVis("happinesstrendDiv", dataArray[1]);

    // init education visualization
    educationVis = new EducationVis("educationDiv", dataArray[1]);

}

 function yearChange2() {
    selectedYear = $('#yearSelector2').val();
    scatterVis.wrangleData();
 }

 function yearChange3() {
    selectedYear = $('#yearSlider').val();
    scatterVis.wrangleData();
 }

 function yearChangeRadar() {
   selectedYearRadar = $('#yearSelectorRadar').val();
   radarVis.wrangleData();
}

 function scoreChange() {
    selectedScore = $('#scoreSelector').val();
    selectedScoreText = $('#scoreSelector option:selected').text();
    scatterVis.updateVis();
 }

 function regionChange() {
   selectedRegion = $('#regionSelector').val();
   selectedRegionText = $('#regionSelector option:selected').text();
   myVis.wrangleData();
}

 function yearChangeBar() {
   selectedYearBar = $('#yearSelectorBar').val();
   stackedBarVis.wrangleData();
}

function orderChangeBar() {
   selectedOrderBar = $('#orderSelectorBar').val();
   stackedBarVis.wrangleData();
}

$('.carousel').carousel({
    interval: false
})




