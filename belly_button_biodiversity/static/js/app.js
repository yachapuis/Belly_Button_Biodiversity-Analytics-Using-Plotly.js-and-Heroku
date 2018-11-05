function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`  
  d3.json(`/metadata/${sample}`).then((data)=>{
    console.log(data)
    var metapanel = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
    metapanel.html("");
 
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var startcount = 0;
    Object.entries(data).forEach(function([key, value]){
      metapanel
      .append("p")
      .attr("class", `meta meta${startcount}`)
      .html(`<b>${key.toUpperCase()}: ${value}</b>`);
      startcount += 1;
    });

    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data)=>{
    console.log(data);

    // @TODO: Build a Pie and a Bubble Charts
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var labels = data.otu_ids.slice(0,10);
    var values = data.sample_values.slice(0,10);
    var hovertext = data.otu_labels.slice(0,10);

    // @TODO: Build a Pie Chart
    var tracePie = {
      labels: labels,
      values: values,
      hovertext: hovertext,
      textinfo: 'value',
      type: "pie"
    };
    var Pie = [tracePie];
    var layout = {
      title: "Pie Chart of the Top 10 Samples",
      height: 500 
    };
 
    Plotly.newPlot("pie", Pie, layout);

    // @TODO: Build a Bubble Chart
    var traceBubble = {
      x: data.otu_ids,
      y: data.sample_values,
      hovertext: data.otu_labels,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Earth"
      }
    };
    var Bubble = [traceBubble];
    var layout = {
      title: "Bubble Chart of the Top 10 Samples",
      xaxis: {title: "OTU ID"}
    };
     
    Plotly.newPlot("bubble", Bubble, layout);
    
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


