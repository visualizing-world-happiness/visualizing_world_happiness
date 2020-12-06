var $header_top = $('.header-top');
var $nav = $('nav');
 
$header_top.find('a').on('click', function() {
  $(this).parent().toggleClass('open-menu');
});
 
$('#fullpage').fullpage({
  sectionsColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  sectionSelector: '.vertical-scrolling',
  navigation: true,
  navigationTooltips: ["Introduction", "What Makes us Happy?", "How is Happiness Measured", "Happiest Countries in the World", "Happiness Rankings by Country", "Happiness Scores Across Every Country", "How does Happiness Score Change over Time?", "Factors Contributing to Happiness", "Factor Analysis", "Commonality between the Happiest", "Conclusion", "Happiness Quote", "Feedback", "References"],
  slidesNavigation: true,
  controlArrows: true,
  anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection', 'fifthSection', 'sixthSection', 'seventhSection', 'eightthSection', 'ninthSection', 'tenthSection', 'eleventhSection', 'twelvethSection', 'thirteenthSection', 'fourteenthSection'],
  menu: '#menu',
 
  afterLoad: function(anchorLink, index) {
    $header_top.css('background', 'rgba(0, 47, 77, .3)');
    $nav.css('background', 'rgba(0, 47, 77, .25)');
    if (index == 12) {
        $('#fp-nav').hide();
      }
  },
 
  onLeave: function(index, nextIndex, direction) {
    if(index == 12) {
      $('#fp-nav').show();
    }
  },
 
 
});