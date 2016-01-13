// Vue component define
var docker = new Vue({
  el: '#table',
  data: {
    people_count: 200,
    scatterCategory: ['issue1', 'issue2', 'issue3', 'issue4', 'issue5', 'issue6', 'issue7', 'issue8', 'issue9', 'issue10', 'issue11', 'issue12', 'issue13', 'issue14', 'issue15'],
    selectScaCate: ['issue1', 'issue2', 'issue4', 'issue5', 'issue9'],
    sensorDockerFunc: null
  },
  methods: {
    displayDCPU: function () {
      var data = 55;

      //generation function
      function generate(data, id) {
        var margin = {top: 45, right: 10, bottom: 10, left: 10},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var svg = d3.select(id).append("svg")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        for (var i=0; i<20; i++) {
          svg.append('rect')
              .attr("width", (width - 84) / 20)
              .attr("height", height * 0.55)
              .attr('id', 'docker_cpu_rect_' + (i+1))
              .attr('transform', "translate(" + (i * (width - 4) / 20) + ",0)" );
        }

        var i=0;
        var temp = Math.floor(data / 5);
        if (temp === 0 && data !== 0)
          temp =1;

        for ( ; i < temp; i++) {
          svg.select('#docker_cpu_rect_' + (i+1)).style('fill', '#00afff');
        }

        for ( ; i<20; i++) {
          svg.select('#docker_cpu_rect_' + (i+1)).style('fill', '#f3f3f3');
        }

        svg.selectAll('.dockerCpuText').remove();

        svg.append('text')
            .attr('class', 'dockerCpuText')
            .attr('x', 0)
            .attr('y', height * 0.8 + margin.top)
            .text(data + '%');
      }

      //redraw function
      function redraw(data) {
        //format of time data
        var i=0;
        var temp = Math.floor(data / 5);
        if (temp === 0 && data !== 0)
          temp =1;

        for ( ; i < temp; i++) {
          d3.select('#docker_cpu_rect_' + (i+1)).style('fill', '#00afff');
        }

        for ( ; i<20; i++) {
          d3.select('#docker_cpu_rect_' + (i+1)).style('fill', '#f3f3f3');
        }

        d3.select('.dockerCpuText').text(data + '%');
      }

      //inits chart
      var sca = new generate(data, "#docker-cpu-rect-d3");

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data = Math.floor(Math.random() * 100);

        redraw(data);
      }, 1500);
    },
    displayDMem: function () {
      var data = [
        {time: '10:01', used: 200, extra: 500, total: 1000},
        {time: '10:02', used: 620, extra: 600, total: 1000},
        {time: '10:03', used: 300, extra: 800, total: 1000},
        {time: '10:04', used: 440, extra: 700, total: 1000},
        {time: '10:05', used: 900, extra: 700, total: 1000},
        {time: '10:06', used: 300, extra: 700, total: 1000},
        {time: '10:07', used: 50, extra: 700, total: 1000},
        {time: '10:08', used: 350, extra: 700, total: 1000},
        {time: '10:09', used: 750, extra: 700, total: 1000}
      ];

      var category = ['used'];

      var hAxis = 10, mAxis = 10;

      //generation function
      function generate(data, id, axisNum) {
        var margin = {top: 20, right: 18, bottom: 35, left: 28},
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M").parse;
        var formatPercent = d3.format(".0%");

        var legendSize = 10,
            legendColor = 'rgba(0, 160, 233, 0.7)';

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.minutes, Math.floor(data.length/axisNum))
            .tickSize(-height)
            .tickPadding([6])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat(formatPercent)
            .orient("left");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({'time': parseDate(data[i]['time']), 'used': data[i]['used'], 'extra': data[i]['extra'], 'total': data[i]['total']});
          }

          return temp;
        })();

        x.domain(d3.extent(ddata, function(d) { return d.time; }));

        var area = d3.svg.area()
            .x(function(d) { return x(d.time); })
            .y0(height)
            .y1(function(d) { return y(d['used']/d['total']); })
            .interpolate("cardinal");

        d3.select('#svg-memD').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "svg-memD")
            .attr("width", width+margin.right+margin.left)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "memD-x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var path = svg.append("svg:path")
            .datum(ddata)
            .attr("class", "areaDM")
            .attr("d", area);

        var points = svg.selectAll(".gPoints")
            .data(ddata)
            .enter().append("g")
            .attr("class", "gPoints");

        //legend rendering
        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(0,'+ (height + margin.bottom - legendSize * 1.2) +')');

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', legendColor);

        legend.append('text')
            .data(ddata)
            .attr('x', legendSize*1.2)
            .attr('y', legendSize/1.1)
            .text('used');

        points.selectAll(".circle")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "memtipDPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              console.log(this);

              d3.select(this).transition().duration(100).style("opacity", 1);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", x(d['time']))
                  .attr("x2", x(d['time']))
                  .attr("y2", height);

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': 'Used' + ' | ' + formatPercent(d['used']/d['total']),
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).style("opacity", 0);

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['y'] = y;
          axisOpt['xAxis'] = xAxis;
          axisOpt['width'] = width;
          axisOpt['height'] = height;

          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['points'] = points;
          svgD['area'] = area;
          svgD['path'] = path;

          return svgD;
        }
      }

      //redraw function
      function redraw(data, id, x, y, xAxis, svg, area, path, points, height, axisNum) {
        //format of time data
        var parseDate = d3.time.format("%H:%M").parse;
        var formatPercent = d3.format(".0%");

        var ddata = (function() {
          var temp = [];

          for (var i=0; i<data.length; i++) {
            temp.push({'time': parseDate(data[i]['time']), 'used': data[i]['used'], 'extra': data[i]['extra'], 'total': data[i]['total']});
          }

          return temp;
        })();

        x.domain(d3.extent(ddata, function(d) {
          return d['time'];
        }));

        xAxis.ticks(d3.time.minutes, Math.floor(data.length / axisNum));

        svg.select("#memD-x-axis")
            .transition()
            .duration(200)
            .ease("sin-in-out")
            .call(xAxis);

        //area line updating
        path.datum(ddata)
            .transition()
            .duration(200)
            .attr("class", "areaDM")
            .attr("d", area);

        //circle updating
        points.selectAll(".memtipDPoints")
            .data(ddata)
            .attr("class", "memtipDPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px");

        //draw new dot
        points.selectAll(".memtipDPoints")
            .data(ddata)
            .enter().append("circle")
            .attr("class", "memtipDPoints")
            .attr("cx", function (d) {
              return x(d.time);
            })
            .attr("cy", function (d) {
              return y(d['used']/d['total']);
            })
            .attr("r", "6px")
            .on("mouseover", function (d) {
              d3.select(this).transition().duration(100).style("opacity", 1);

              svg.append("g")
                  .attr("class", "tipDot")
                  .append("line")
                  .attr("class", "tipDot")
                  .transition()
                  .duration(50)
                  .attr("x1", x(d['time']))
                  .attr("x2", x(d['time']))
                  .attr("y2", height);

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

              svg.append("polyline")      // attach a polyline
                  .attr("class", "tipDot")  // colour the line
                  .style("fill", "black")     // remove any fill colour
                  .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': 'Used' + ' | ' +formatPercent(d['used']/d['total']),
                'trigger': 'hover'
              })
                  .tooltip('show');
            })
            .on("mouseout",  function (d) {
              d3.select(this).transition().duration(100).style("opacity", 0);

              d3.selectAll('.tipDot').transition().duration(100).remove();

              $(this).tooltip('destroy');
            });

        //remove old dot
        points.selectAll(".memtipDPoints")
            .data(ddata)
            .exit()
            .transition()
            .duration(200)
            .remove();

      }

      //inits chart
      var sca = new generate(data, "#docker-mem-area-d3", 8);

      //dynamic data and chart update
      setInterval(function() {
        //update donut data
        data.push({time: hAxis + ":" + mAxis, used: Math.random()*200+400, extra: Math.random()*1000, total: 1000});

        // console.log(tAxis);
        if(mAxis === 59) {
          hAxis++;
          mAxis=0;
        }
        else {
          mAxis++;
        }

        if (Object.keys(data).length === 20) data.shift();

        // generate(data, "#docker-mem-area-d3");
        redraw(data, "#docker-mem-area-d3", sca.getOpt()['x'], sca.getOpt()['y'], sca.getOpt()['xAxis'], sca.getSvg()['svg'], sca.getSvg()['area'], sca.getSvg()['path'], sca.getSvg()['points'], sca.getOpt()['height'], 8);
      }, 3500);
    }
  },
  compiled: function () {
    var self = this;

    self.displayDCPU();
    self.displayDMem();
  }
});