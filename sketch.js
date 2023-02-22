
const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
const contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

const xlabels = new Set();
const gdps = new Set();
const pops = new Set();
var x = [];
var y = [];
var values = [];
var colorsarray = [];

var tablearray = [];

function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 255;
  var b = num & 255;
  return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
}
function fillcolorarray(){
  for (var i = 0; i < 10; i++) {
    colorsarray.push(getRandomRgb());

}}
function barinit() {
  var data = [{ x, y, marker: {color : colorsarray}, type: "bar"}];
  Plotly.newPlot("bar", data);
}
function pieinit(){
  var data = [{
    values: [],
    labels: [],
    marker: {colors : colorsarray},
    type: 'pie'
  }];
  Plotly.newPlot('pie', data);
}




d3.select("#submit").on("click", setup);
/// Lookup and Restyle Functions
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
        Plotly.restyle("pie", "labels", [x]);
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
         Plotly.restyle("pie", "labels", [x]);
    }
    function gotContent(data){
        let page = data.query.pages;
        let pageId = Object.keys(data.query.pages)[0];
        let content = page[pageId].revisions[0]['*'];
        let wordRegex = / (?:GDP_PPP_per_capita     =.*\$)(\d*,\d*)/
        gdp = content.match(wordRegex)[1]
        gdp =gdp.replaceAll(',','');
        Number.parseInt(gdp)
        gdps.add(gdp);
        y = Array.from(gdps);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("pie", "values", [y]);
    }
    function gotContent2(data2){
        let page2 = data2.query.pages;
        let pageId2 = Object.keys(data2.query.pages)[0];
        let content2 = page2[pageId2].revisions[0]['*'];
        let wordRegex2 = / (?:GDP_PPP_per_capita     =.*\$)(\d*,\d*)/
        gdp2 = content2.match(wordRegex2)[1]
        gdp2  =gdp2.replaceAll(',','');
        Number.parseInt(gdp2);
        gdps.add(gdp2);
        y = Array.from(gdps);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("pie", "values", [y]);
        
    }
      
};
function filltable(){
  if (x >1){
    for(var i = 0; i < x.length; i++){
        var tabledicts = {};
        
        tabledicts.countryname = x[i],
        tabledicts.Gdprow = y[i],
        tablearray.push(tabledicts)

    };
console.log(tablearray)} 
}
fillcolorarray();
getRandomRgb();
barinit();
pieinit();
filltable();





