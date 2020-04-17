function wolfPopulation() {
  d3.csv("wolfPopulation.csv").then(function (dataset) {
    var year = [
      1996,
      1997,
      1998,
      1999,
      2000,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2015,
      2016,
      2017,
      2018,
      2019,
    ];
    var options = d3
      .select("#year")
      .selectAll("option")
      .data(year)
      .enter()
      .append("option")
      .text((d) => d);

    d3.select("#year").on("change", function () {
      remove(d3.select("#year").property("value"));
    });

    function remove(newYear) {
      d3.select("svg").remove();
      update(newYear);
    }
    function update(input) {
      var margin = { top: 20, right: 160, bottom: 35, left: 30 };

      var width = 1300 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var svg = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      function layout(year) {
        const result = dataset.filter((dataset) => dataset.Year == year);
        let adultArray = [];
        let pupArray = [];
        let nameArray = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].Type === "A") {
            adultArray.push([
              result[i].Pack,
              parseInt(result[i].Population),
              0,
            ]);
          }
          if (result[i].Type === "P") {
            pupArray.push([result[i].Pack, parseInt(result[i].Population)]);
          }
          if (nameArray.includes(result[i].Pack) === false) {
            nameArray.push(result[i].Pack);
          }
        }
        for (let i = 0; i < adultArray.length; i++) {
          let packName = adultArray[i][0];
          let adultPop = parseInt(adultArray[i][1]);
          for (let j = 0; j < pupArray.length; j++) {
            if (pupArray[j][0] == packName) {
              pupArray[j].push(adultPop);
            }
          }
        }

        let totalArray = [adultArray, pupArray, nameArray];
        return totalArray;
      }

      //draw rect
      let something = layout(input);

      var x = d3
        .scaleBand()
        .domain(something[2])
        .range([10, width - 10], 0.02);
      var y = d3.scaleLinear().domain([0, 40]).range([height, 0]);

      var colors = ["b33040", "#d25c4d"];
      var yAxis = d3.axisLeft().scale(y);

      var xAxis = d3.axisBottom().scale(x);
      svg.append("g").attr("class", "y axis").call(yAxis);

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      something.splice(2);

      svg
        .append("text")
        .attr("class", "black")
        .attr(
          "transform",
          "translate(" + -23 + "," + (height - 250) + ")rotate(270)"
        )
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("fill", "#23815a")
        .text("Number of Wolves");

      svg
        .append("text")
        .attr("class", "black")
        .attr("transform", "translate(" + 500 + "," + (height + 35) + ")")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("fill", "#23815a")
        .text("Pack Name");
      svg
        .selectAll("g.Population")
        .data(something)
        .enter()
        .append("g")
        .attr("class", "Population")
        .style("fill", function (d, i) {
          return colors[i];
        })
        .selectAll("rect")
        .data(function (d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d[0]);
        })
        .attr("y", function (d) {
          return y(d[2] + d[1]);
        })
        .attr("height", function (d) {
          return y(d[2]) - y(d[2] + d[1]);
        })
        .attr("width", x.bandwidth() - 10);
      //   .on("mouseover", function () {
      //     tooltip.style("display", null);
      //   })
      //   .on("mouseout", function () {
      //     tooltip.style("display", "none");
      //   })
      //   .on("mousemove", function (d) {
      //     var xPosition = d3.mouse(this)[0] - 15;
      //     var yPosition = d3.mouse(this)[1] - 25;
      //     tooltip.attr(
      //       "transform",
      //       "translate(" + xPosition + "," + yPosition + ")"
      //     );
      //     tooltip.select("text").text(d.y);
      //   });
      // var tooltip = svg
      //   .append("g")
      //   .attr("class", "tooltip")
      //   .style("display", "none");

      // tooltip
      //   .append("rect")
      //   .attr("width", 30)
      //   .attr("height", 20)
      //   .attr("fill", "white")
      //   .style("opacity", 0.5);

      // tooltip
      //   .append("text")
      //   .attr("x", 15)
      //   .attr("dy", "1.2em")
      //   .style("text-anchor", "middle")
      //   .attr("font-size", "12px")
      //   .attr("font-weight", "bold");
      // draw legend
      var legend = svg
        .selectAll(".legend")
        .data(colors)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(30," + i * 19 + ")";
        });

      legend
        .append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) {
          return colors.slice().reverse()[i];
        });

      legend
        .append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d, i) {
          switch (i) {
            case 0:
              return "Pups";
            case 1:
              return "Adults";
          }
        });

      //draw tooltip
    }
    update(1996);
  });
}
