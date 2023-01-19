
const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
const contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

var xlabels = [];
var gdps = [];
let userInput1;
let userInput2;


function setup() {
    noCanvas();
    xlabels.length = 0;
    gdps.length = 0;


    userInput1 = select('#userInput1');
    userInput2 = select('#userInput2');
    userInput1.changed(goWiki);
    userInput2.changed(goWiki2);
    goWiki();
    goWiki2();



     function goWiki() {

        let term = userInput1.value();
        console.log(term)
        let url = searchUrl + term;
        loadJSON(url, gotSearch, 'jsonp');
        console.log(url);
        if (term != "")
          xlabels.push(userInput1.value());

    }
    function goWiki2() {

        let term2 = userInput2.value();
        let url2 = searchUrl + term2;
        loadJSON(url2, gotSearch2, 'jsonp')
        console.log(url2);
        if (term2 != "")
          xlabels.push(userInput2.value());
        console.log(xlabels);
    }
    function gotSearch(data){

        console.log(data)
        console.log(data[1][0])
        let title = data[1][0];
        createP(title);
        console.log('Querying: ' + title);
        let url = contentUrl + title;
        loadJSON(url, gotContent, 'jsonp')
    }
    function gotSearch2(data2){

        console.log(data2)
        console.log(data2[1][0])
        let title2 = data2[1][0];
        createP(title2);
        console.log('Querying: ' + title2);
        let url2 = contentUrl + title2;
        loadJSON(url2, gotContent2, 'jsonp')
    }
    function gotContent(data){
        let page = data.query.pages;
        let pageId = Object.keys(data.query.pages)[0];

        let content = page[pageId].revisions[0]['*'];
        let wordRegex = / (?:GDP_PPP_per_capita     = {{\w*}}) \$(\d*,\d*)/
        gdp = content.match(wordRegex)[1]
        gdp =gdp.replaceAll(',','');
        Number.parseInt(gdp)
        gdps.push(gdp);
        console.log(gdp);
        myChart.update()


    }
    function gotContent2(data2){
        let page2 = data2.query.pages;
        let pageId2 = Object.keys(data2.query.pages)[0];

        let content2 = page2[pageId2].revisions[0]['*'];
        let wordRegex2 = / (?:GDP_PPP_per_capita     = {{\w*}}) \$(\d*,\d*)/
        gdp2 = content2.match(wordRegex2)[1]
        gdp2  =gdp2.replaceAll(',','');
        Number.parseInt(gdp2);
        gdps.push(gdp2);
        console.log(gdp2);
        myChart.update()


    }
  const ctx = document.getElementById('myChart');

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xlabels,
      datasets: [{
        label: 'GDP per Capita',
        data: gdps,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};







