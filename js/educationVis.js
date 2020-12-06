/* * * * * * * * * * * * * *
*          EducationVis          *
* * * * * * * * * * * * * */

class EducationVis {

    constructor(parentElement, happinessData) {
        this.parentElement = parentElement;
        this.happinessData = happinessData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        
        vis.margin = {top: 20, right: 50, bottom: 20, left: 50};

		vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
		vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
        
            // append tooltip
        vis.tooltip = d3.select("body").append('div')
         .attr('class', "tooltip")
         .attr('id', 'educationTooltip')

         vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.updateVis()
    }



    updateVis(){
        let vis = this;
       
        vis.x = d3.scaleLinear()
            .domain([0, 100])         
            .range([0, 400]);    

        vis.svg.append("circle")
        .attr("cx", vis.x(vis.margin.right + 10)).attr("cy", 50).attr("r", 40).style("fill", "yellow").style("stroke", "orange").style("stroke-width", "2px")
        .on("mouseover", function(event, d){
            d3.select(this)
                
                .attr('opacity', 0.3)

            /* vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX - 100 + "px")
                .style("top", event.pageY + 50 + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h3>1. <b>Stay Active </h3><br>
                        <h5>Physical activity releases dopamine, which makes people happy (chemical reaction in the brain).<br>
                         <br>Happiness is increased by undertaking challenging tasks not associated with material rewards.<h5>
                    </div>`);*/
            })
        .on("click", function(event, d) {
            $('#title_span').text("");
            $('#content_span').text("")
            $('#title_span').text("1. Invest in relationships");
            $('#content_span').text("Surround yourself with happy people. Being around people who are content buoys your own mood. And by being happy yourself, you give something back to those around you.(ref: MayoClinic.org)");
        })

        .on("mouseout", function(event, d){
                d3.select(this)
                    .attr('opacity', 1)
                


            })
        vis.svg.append("text")
            .attr("x", vis.x(vis.margin.right + 9)).attr("y", 58)
            .text("1").style("fill", "orange").style("font-size", "25px")  

        vis.svg.append("circle")
        .attr("cx", vis.x(vis.margin.right + 50)).attr("cy", 50).attr("r", 40).style("fill", "yellow").style("stroke", "orange").style("stroke-width", "2px")
        .on("mouseover", function(event, d){
            d3.select(this)
                .attr('opacity', 0.3)
        })
        .on("click", function(event, d) {
                $('#title_span').text("2. Express gratitude");
                $('#content_span').text("Gratitude is more than saying thank you. It's a sense of wonder, appreciation and, yes, thankfulness for life. It's easy to go through life without recognizing your good fortune. Often, it takes a serious illness or other tragic event to jolt people into appreciating the good things in their lives. Don't wait for something like that to happen to you. (ref: MayoClinic.org)");
            
            /*    vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX - 100 + "px")
                .style("top", event.pageY + 50 + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h3><b>2. Surround Yourself with Positive People</h3><br>
                        <h5>Happy people have close family and friends. Community makes people happy and leads to having something bigger than ourselves to care about.<h5>
                    </div>`); */
            })
            
        .on("mouseout", function(event, d){
                d3.select(this)
                .attr('opacity', 1)

            })
        vis.svg.append("text")
            .attr("x", vis.x(vis.margin.right + 49)).attr("y", 58)
            .text("2").style("fill", "orange").style("font-size", "25px")  

        vis.svg.append("circle")
        .attr("cx", vis.x(vis.margin.right + 90)).attr("cy", 50).attr("r", 40).style("fill", "yellow").style("stroke", "orange").style("stroke-width", "2px")
        .on("mouseover", function(event, d){
            d3.select(this)
                .attr('opacity', 0.3)
        })
        .on("click", function(event, d) {
            
                $('#title_span').text("3. Cultivate optimism");
                $('#content_span').text("Develop the habit of seeing the positive side of things. You needn't become overly optimistic — after all, bad things do happen. It would be silly to pretend otherwise. But you don't have to let the negatives color your whole outlook on life. Remember that what is right about you almost always is more than what is wrong. (ref: MayoClinic.org)");   
           
            /*     vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX - 100 + "px")
                .style("top", event.pageY + 50 + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h3>3. Set up Intrinsic Goals</h3><br>
                        <h5>Values are key components of happiness (intrinsically motivated people are less prone to depression and unhappiness)
                        <br>
                        <br>Examples of extrinsic goals: money, image, status
                        <br>Examples of intrinsic goals: personal growth, relationships, community feeling<h5>
                    </div>`); */
            })
            
            .on("mouseout", function(event, d){
                    d3.select(this)
                    .attr('opacity', 1)
                })
            
            vis.svg.append("text")
                .attr("x", vis.x(vis.margin.right + 89)).attr("y", 58)
                .text("3").style("fill", "orange").style("font-size", "25px")  
        
        vis.svg.append("circle")
        .attr("cx", vis.x(vis.margin.right + 130)).attr("cy", 50).attr("r", 40).style("fill", "yellow").style("stroke", "orange").style("stroke-width", "2px")
        .on("mouseover", function(event, d){
            d3.select(this)
                .attr('opacity', 0.3)
        })
        .on("click", function(event, d) {
                $('#title_span').text("4. Find your purpose");
                $('#content_span').text("People who strive to meet a goal or fulfill a mission — whether it's growing a garden, caring for children or honoring one's spirituality — are happier than those who don't have such aspirations. (ref: MayoClinic.org)");   

            /* vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX - 100 + "px")
                .style("top", event.pageY + 50 + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h3>4. Practice Meditation and Positive Thinking</h3><br>
                        <h5> Counting blessings and acts of kindness increases happiness.<h5>
                    </div>`); */
            })
            
        .on("mouseout", function(event, d){
                d3.select(this)
                .attr('opacity', 1)

            })
        vis.svg.append("text")
            .attr("x", vis.x(vis.margin.right + 129)).attr("y", 58)
            .text("4").style("fill", "orange").style("font-size", "25px")  
        
            vis.svg.append("circle")
        .attr("cx", vis.x(vis.margin.right + 170)).attr("cy", 50).attr("r", 40).style("fill", "yellow").style("stroke", "orange").style("stroke-width", "2px")
        .on("mouseover", function(event, d){
            d3.select(this)
                
                .attr('opacity', 0.3)
        })
        .on("click", function(event, d) {
             $('#title_span').text("5. Live in the moment");
            $('#content_span').text("Don't postpone joy waiting for a day when your life is less busy or less stressful. That day may never come. Instead, look for opportunities to savor the small pleasures of everyday life. Focus on the positives in the present moment, instead of dwelling on the past or worrying about the future. (ref: MayoClinic.org)");      
            
            /* vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX - 100 + "px")
                .style("top", event.pageY + 50 + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 20px">
                        <h3>5. Immerse Yourself in Nature</h3><br>
                        <h5>Spending time in nature can reduce stress and increase feelings of vitality, awe, gratitude and compassion.<br>
                         <br>The natural world helps remind people that they are but small beings on this planet and gives them a greater sense of the whole. <br>
                         <br>Nature nurtures and restores. It is one of the greatest resources for happiness.<h5>
                    </div>`); */
            })
            
        .on("mouseout", function(event, d){
                d3.select(this)
                .attr('opacity', 1)
            })

            vis.svg.append("text")
            .attr("x", vis.x(vis.margin.right + 169)).attr("y", 58)
            .text("5").style("fill", "orange").style("font-size", "25px")  
    }
}