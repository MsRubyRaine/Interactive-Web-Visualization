function init() {
  // Get ID from HTML from line 25
  var selector = d3.select("#selDataset");

  // Use sample.json to get the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    //Python uses For x in some data, JS uses variable.forEach => x.
    sampleNames.forEach((sample) => {
      //recalling the select tag ID from line 3
      selector
        //add an option tag to the select variable to create dropdown names
        .append("option")
        //Set options as the individual IDs
        .text(sample)
        //Set value attribute as the sample
        .property("value", sample);
    });
    // Use the initial sample from the list to build the initial plots
    var initalSample = sampleNames[0];
    buildCharts(initalSample);
    buildMetadata(initalSample);
  });
}
// Initializing the dashboard
init();
//calling back to the function in the HTML
function optionChanged(updatedSample) {
  // Updates data to reflect the name selected
  buildMetadata(updatedSample);
  buildCharts(updatedSample);
}
// Create function buildMetadata to grab metadata from the json file
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

//Creating function to build Charts
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var Result = resultArray[0];
    var otuID = Result.otu_ids;
    var otuLabel = Result.otu_labels;
    console.log(otuLabel);
    var sampleValue = Result.sample_values.map((value) => parseInt(value));
    var yticks = otuID.slice(0,10).map((id) => "OTU " + id).reverse();
    // Create the trace for the bar chart.
    var barData = {
      x: sampleValue.slice(0,10).reverse(),
      y: yticks,
      hoverinfo: otuLabel,
      type: "bar",
      orientation: "h",
      backgroundColor: "rgb(192, 189, 189)"
    };
    // Create bar chart.
    var barLayout = {
      title: {
        text: "<b>Top 10 Bacteria Cultures Found</b>",
        y: 0.90
      },
      margin: {
        l: 100,
        r: 35,
        b: 50,
        t: 75,
        pad: 4
      },
    };
    // Use Plotly to plot the data.
    Plotly.newPlot("bar", [barData], barLayout);

  // Create the trace for the bubble chart.
  var bubbleData = {
    x: otuID,
    y: sampleValue,
    type: "bubble",
    text: otuLabel,
    hoverinfo: "x+y+text",
    mode: "markers",
    marker: {size: sampleValue, color: otuID, colorscale: "Earth"}
  };
  // Create the bubble chart.
  var bubbleLayout = {
    title: {
      text: "<b>Bacteria Cultures Per Sample</b>",
      y:0.95,
    },
    xaxis: {title: "OTU ID"},
    margin: {
      l: 75,
      r: 50,
      b: 60,
      t: 60,
      pad: 10
    },
    hovermode: "closest"
  };
  // Use Plotly to plot the data.
  Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
  })}