
const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
const contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

const xlabels = new Set();
const gdps = new Set();
var x = [];
var y = [];


function chartinit() {
  var data = [{
    x,
    y,
    type: "bar"
  }];
  

  var layout = {
    height: 600,
    width: 800
    };
    Plotly.newPlot("bar", data, layout);
}


d3.select("#submit").on("click", setup);
function setup() {
    var userInput1 = d3.select('#userInput1').node().value;
    var userInput2 = d3.select('#userInput2').node().value;
    goWiki(userInput1);
    goWiki2(userInput2);

     function goWiki(userInput1) {
        let term = userInput1;
        let url = searchUrl + term;
        loadJSON(url, gotSearch, 'jsonp');
    }
    function goWiki2(userInput2) {
        let term2 = userInput2;
        let url2 = searchUrl + term2;
        loadJSON(url2, gotSearch2, 'jsonp')
    }
    function gotSearch(data){
        let title = data[1][0];
        createP(title);
        if (title != "")
          xlabels.add(title);
        let url = contentUrl + title;
        loadJSON(url, gotContent, 'jsonp')
        x = Array.from(xlabels)
        Plotly.restyle("bar", "x", [x]);
    }
    function gotSearch2(data2){

        let title2 = data2[1][0];
        createP(title2);
        if (title2 != "")
          xlabels.add(title2);
        let url2 = contentUrl + title2;
        loadJSON(url2, gotContent2, 'jsonp')
         x = Array.from(xlabels)
         Plotly.restyle("bar", "x", [x]);
    }
    function gotContent(data){
        let page = data.query.pages;
        console.log(page)
        let pageId = Object.keys(data.query.pages)[0];
        console.log(pageId)
        let content = page[pageId].revisions[0]['*'];
        console.log(content)
        let wordRegex = / (?:GDP_PPP_per_capita     = {{\w*}}) \$(\d*,\d*)/
        gdp = content.match(wordRegex)[1]
        gdp =gdp.replaceAll(',','');
        Number.parseInt(gdp)
        gdps.add(gdp);
        y = Array.from(gdps);
        Plotly.restyle("bar", "y", [y]);
    }
    function gotContent2(data2){
        let page2 = data2.query.pages;
        let pageId2 = Object.keys(data2.query.pages)[0];
        let content2 = page2[pageId2].revisions[0]['*'];
        let wordRegex2 = / (?:GDP_PPP_per_capita     = {{\w*}}) \$(\d*,\d*)/
        gdp2 = content2.match(wordRegex2)[1]
        gdp2  =gdp2.replaceAll(',','');
        Number.parseInt(gdp2);
        gdps.add(gdp2);
        y = Array.from(gdps);
        Plotly.restyle("bar", "y", [y]);
        
    }
};

chartinit();







