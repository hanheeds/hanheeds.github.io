document.addEventListener('DOMContentLoaded', function () {
    // Your D3.js code here
    d3.csv("listings.csv").then(data => {
        // Parse the data
        data.forEach(d => {
            d.num_favorers = +d.num_favorers;
            d.title = d.title.substring(0,10); // Truncate title to first 10 characters
        });

        // Sort the data by num_favorers in descending order and take the top 10
        data.sort((a,b) => b.num_favorers - a.num_favorers);
        const top10Data = data.slice(0,10)

        // Set the dimensions and margins of the graph
        const margin = {top: 20, right: 30, bottom: 100, left: 40},
              width = 800 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        // Append the SVG object to the body of the page
        const svg = d3.select("body")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis
        const x = d3.scaleBand()
          .range([0, width])
          .domain(top10Data.map(d => d.title))
          .padding(0.2);
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.num_favorers)])
          .range([height, 0]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Bars
        svg.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.title))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.num_favorers))
            .attr("height", d => height - y(d.num_favorers));

        // Add labels
        svg.selectAll(".label")
          .data(data)
          .enter()
          .append("text")
            .attr("class", "label")
            .attr("x", d => x(d.title) + x.bandwidth() / 2)
            .attr("y", d => y(d.num_favorers) - 5)
            .attr("text-anchor", "middle")
            .text(d => d.num_favorers);
    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });
});
