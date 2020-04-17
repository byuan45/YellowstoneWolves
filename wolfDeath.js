function death() {
  d3.csv("Mortality.csv").then(function (dataset) {
    function layout() {
      let deathArray = [];
      let deathCause = [];
      let ageType = ["Old Adult", "Adult", "Yearling", "Pup"];
      for (let i = 0; i < dataset.length; i++) {
        if (deathCause.includes(dataset[i].Cause) === false) {
          deathArray.push([
            dataset[i].Cause,
            [
              [0, "Old Adult"],
              [0, "Adult"],
              [0, "Yearling"],
              [0, "Pup"],
            ],
          ]);
          deathCause.push(dataset[i].Cause);
        }
        if (dataset[i].Age === "Old Adult") {
          let deathReason = dataset[i].Cause;
          for (let j = 0; j < deathArray.length; j++) {
            if (deathArray[j][0] === deathReason) {
              deathArray[j][1][0][0] += 1;
            }
          }
        }
        if (dataset[i].Age === "Adult") {
          let deathReason = dataset[i].Cause;
          for (let j = 0; j < deathArray.length; j++) {
            if (deathArray[j][0] === deathReason) {
              deathArray[j][1][1][0] += 1;
            }
          }
        }
        if (dataset[i].Age === "Yearling") {
          let deathReason = dataset[i].Cause;
          for (let j = 0; j < deathArray.length; j++) {
            if (deathArray[j][0] === deathReason) {
              deathArray[j][1][2][0] += 1;
            }
          }
        }
        if (dataset[i].Age === "Pup") {
          let deathReason = dataset[i].Cause;
          for (let j = 0; j < deathArray.length; j++) {
            if (deathArray[j][0] === deathReason) {
              deathArray[j][1][3][0] += 1;
            }
          }
        }
      }
      totalArray = [deathArray, deathCause, ageType];
      return totalArray;
    }
    let test = layout();
    console.log(test);
    var margin = { top: 20, right: 0, bottom: 35, left: 30 };

    var width = 1500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // creating x,y, and colors
    var x = d3
      .scaleBand()
      .paddingInner(0.3)
      .domain(test[1])
      .range([10, width - 10]);
    var y = d3.scaleLinear().domain([0, 30]).range([height, 0]);

    var x1 = d3.scaleBand().domain(test[2]).range([0, x.bandwidth()]);

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //axis area
    var xAxis = d3.axisBottom().scale(x).tickSize(0);

    var yAxis = d3.axisLeft().scale(y);
    var color = d3
      .scaleOrdinal()
      .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de"]);
    var colors = ["#ca0020", "#f4a582", "#d5d5d5", "#92c5de"];
    //draw rect
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .style("opacity", "0")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .text("Value");
    svg
      .select(".y")
      .transition()
      .duration(500)
      .delay(1300)
      .style("opacity", "1");

    svg
      .append("text")
      .attr("class", "black")
      .attr(
        "transform",
        "translate(" + 10 + "," + (height - 350) + ")rotate(270)"
      )
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("fill", "#23815a")
      .text("Number of Wolves");
    svg
      .append("text")
      .attr("class", "axisSteelBlue")
      .attr("transform", "translate(" + 750 + "," + (height + 30) + ")")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("fill", "#23815a")
      .text("Cause Of Death");
    var slice = svg
      .selectAll(".slice")
      .data(test[0])
      .enter()
      .append("g")
      .attr("class", "g")
      .attr("transform", function (d) {
        return "translate(" + x(d[0]) + ",0)";
      });

    //categorie = x axis
    // rate  = color/type

    slice
      .selectAll("rect")
      .data(function (d) {
        return d[1];
      })
      .enter()
      .append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function (d) {
        return x1(d[1]);
      })
      .style("fill", function (d) {
        return color(d[1]);
      })
      .attr("y", function (d) {
        return y(0);
      })
      .attr("height", function (d) {
        return height - y(0);
      })
      .on("mouseover", function (d) {
        d3.select(this).style("fill", d3.rgb(color(d[1])).darker(2));
      })
      .on("mouseout", function (d) {
        d3.select(this).style("fill", color(d[1]));
      });
    slice
      .selectAll("rect")
      .transition()
      .delay(function (d) {
        return Math.random() * 1000;
      })
      .duration(1000)
      .attr("y", function (d) {
        return y(d[0]);
      })
      .attr("height", function (d) {
        return height - y(d[0]);
      });

    var legend = svg
      .selectAll(".legend")
      .data(test[2])
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      })
      .style("opacity", "0");

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d) {
        return color(d);
      });

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        return d;
      });

    legend
      .transition()
      .duration(500)
      .delay(function (d, i) {
        return 1300 + 100 * i;
      })
      .style("opacity", "1");
  });
}
