import "./styles.css";
import * as d3 from "d3";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const colors = [
  { color: "red", thresh: 12 },
  { color: "orange", thresh: 10 },
  { color: "yellow", thresh: 9 },
  { color: "lightgreen", thresh: 8 },
  { color: "green", thresh: 6 },
  { color: "blue", thresh: 3 },
  { color: "purple", thresh: 1 },
  { color: "black", thresh: 0 }
];

fetch(url)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);

    const w = 1000,
      h = 500,
      padding = 60;

    const app = d3
      .select("body")
      .append("div")
      .attr("id", "app");

    app
      .append("h3")
      .append("text")
      .text("Heat Map of Global Land-Surface Temperature")
      .attr("id", "title")
      .style("padding", "0")
      .style("text-decoration", "underline");

    app
      .append("p")
      .append("text")
      .text("1753 - 2015: base temperature 8.66℃")
      .attr("id", "description")
      .style("padding", "0");

    const svg = app
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("x", padding)
      .attr("y", padding)
      .attr("id", "chart");

    //create x and y scales
    const xScale = d3
      .scaleBand()
      .domain(
        data.monthlyVariance.map(d => {
          return d.year;
        })
      )
      .rangeRound([padding, w - padding * 2], 0.05);

    const yScale = d3
      .scaleBand()
      .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reverse())
      .rangeRound([padding, h - padding], 0.05);

    //set up axes
    const xAxis = d3.axisBottom(xScale).tickValues(
      xScale.domain().filter(yr => {
        return yr % 15 === 0;
      })
    );

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(yScale.domain())
      .tickFormat(mon => {
        return months[mon - 1];
      });

    svg //add y axis to chart
      .append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis);

    svg //add x axis to chart
      .append("g")
      .attr("transform", "translate(0, " + (h - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    //create div for tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.month))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("data-year", d => d.year)
      .attr("data-month", d => d.month - 1)
      .attr("data-temp", d => data.baseTemperature + d.variance)
      .attr("fill", d => {
        var temp = data.baseTemperature + d.variance;
        if (temp > colors[0].thresh) return colors[0].color;
        else if (temp > colors[1].thresh) return colors[1].color;
        else if (temp > colors[2].thresh) return colors[2].color;
        else if (temp > colors[3].thresh) return colors[3].color;
        else if (temp > colors[4].thresh) return colors[4].color;
        else if (temp > colors[5].thresh) return colors[5].color;
        else if (temp > colors[6].thresh) return colors[6].color;
        else return colors[7].color;
      })
      //add tooltip functionality
      .on("mouseover", d => {
        tooltip
          .style("opacity", 0.9)
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 28 + "px")
          .attr("data-year", d.year)
          .html(
            `${months[d.month - 1]}, ${
              d.year
            } <br> <span class="tipTemp">${data.baseTemperature +
              d.variance}&#8451;</span> <br> <span class="tipVar">${
              d.variance
            }&#8451;</span>`
          );
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    //set up legend
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("stroke", "black")
      /*    legend
      .append("rect")
      .attr("width", 180)
      .attr("height", 70)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("x", 0)
      .attr("y", h - padding); */

      .selectAll("rect")
      .data(colors)
      .enter();
    legend
      .append("rect")
      .attr("y", h - 35)
      .attr("height", 20)
      .attr("x", (d, i) => 25 + 50 * i)
      .attr("width", 50)
      .attr("fill", d => d.color)
      .append("text")
      .text(d => d.thresh);

    legend
      .insert("text")
      .text(d => ">" + d.thresh)
      .attr("y", h)
      .attr("height", 20)
      .attr("x", (d, i) => 25 + 50 * i)
      .attr("width", 50);
  });
