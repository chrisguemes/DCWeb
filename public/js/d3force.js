var width = $("#d3force").width();
	height = 460;
//var myradius = 15
    padding = 6, // separation between nodes
    maxRadius = 12;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#d3force").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("dblclick", doubleclick);

// var nodes = force.nodes(),
    // links = force.links();
	
d3.json("tables/pathlist.json", function(error, graph) {
	if (error) throw error;

	force
	  .nodes(graph.nodes)
	  .links(graph.links)
	  .start();

	var link = svg.selectAll(".link")
	  .data(graph.links)
	  .enter()
	  .append("line")
	  .attr("class", "link")
	  .style("stroke-width", function(d) { return Math.sqrt(d.value); });
  	  
/* 	//var node = svg.selectAll(".node")
	var node = svg.selectAll("circle")	
	  .data(graph.nodes)
	  .enter()
	  .append("circle")
	  .attr("class", "node")
	  .attr("r", myradius)
	  .style("fill", function(d) { return color(d.hops); })
	  .call(force.drag); */
	  
	// Create the groups under svg
	var gnodes = svg.selectAll('g.gnode')
	  .data(graph.nodes)
	  .enter()
	  .append('g')
	  .classed('gnode', true);

	// Add one circle in each group
	var node = gnodes.append("circle")
	  .attr("class", "node")
	  .attr("r", 15)
	  .style("fill", function(d) { return color(d.hops); })
	  .call(force.drag);

	// Append the labels to each group
	var labels = gnodes.append("text")
	  .attr("dx", -8)
      .attr("dy", ".35em")	
	  .text(function(d) { 
			var shortAddr = parseInt(d.u16Addr, 10);
			return ("0"+(shortAddr.toString(16))).slice(-2).toUpperCase();
		});	  
  
	gnodes.append("title")
	  .text(function(d) { return d.u64Addr; });
 	  
	force.on("tick", function(e) {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

/* 		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; }); */

/*
		// Funciona con nodos normales
		var nodes = force.nodes();
		var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;
		while (++i < n) q.visit(collide(nodes[i])); */
			
		// Translate the groups
		gnodes.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; });
		
/*  		var q = d3.geom.quadtree(gnodes[0]),
			i = 0,
			n = gnodes[0].length;
		while (++i < n) q.visit(collide(gnodes[0][i])); */

	
  });
});

// Resolve collisions between nodes.
function collide(node) {
    var nodeEl = svg.selectAll('g.gnode')
        .filter(function(d, i) {
            return node.id == d.id
        }).node();   
    var nodeSize = nodeEl.getBBox().height+16;//You can remove/reduce this static value 16 to decrease the gap between nodes.
    var r = nodeSize / 2 + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = nodeSize / 2 + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

function doubleclick() {
  // var node = svg.selectAll(".node")
  
  // var point = d3.mouse(this),
      // node = {x: point[0], y: point[1]},
      // n = nodes.push(node);

  // // add links to any nearby nodes
  // nodes.forEach(function(target) {
    // var x = target.x - node.x,
        // y = target.y - node.y;
    // if (Math.sqrt(x * x + y * y) < 30) {
      // links.push({source: node, target: target});
    // }
  // });

  restart();
}

function restart() {
  // var link = svg.selectAll(".link")
  // var node = svg.selectAll(".node")
  
  // link = link.data(links);

  // link.enter().insert("line", ".node")
      // .attr("class", "link");

  // node = node.data(nodes);

  // node.enter().insert("circle", ".cursor")
      // .attr("class", "node")
      // .attr("r", 6)
      // .call(force.drag);

  force.start();
}
