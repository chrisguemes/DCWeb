var color = d3.scale.category20();

var width = $("#d3force").width();
	height = 460;
	myradius = 8

var svg = d3.select("#d3force").append("svg")
	.attr("width", width)
	.attr("height", height)
	.on("dblclick", doubleclick);

var force = d3.layout.force()
	.gravity(.05)
	.distance(100)
	.charge(-100)
	.size([width, height]);

var nodes = force.nodes(),
	links = force.links();
	
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
	  
	var node = svg.selectAll(".node")
	  .data(graph.nodes)
	  .enter()
	  .append("circle")
	  .attr("class", "node")
	  .attr("r", myradius)
	  .style("fill", function(d) { return color(d.hops); })
	  .call(force.drag);
	  
	node.append("title")
	  .text(function(d) { return "0x000"+(d.u16Addr.toString(16)).slice(-4).toUpperCase() + " [" + d.u64Addr + "]"; });
	  
	force.on("tick", function(e) {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		var nodes = force.nodes();
		var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;
		while (++i < n) q.visit(collide(nodes[i]));

		svg.selectAll("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		
	});
});

function collide(node) {
  var r = myradius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = myradius * 2;
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
  restart();
}

function d3forceUpdate() {

	var link = svg.selectAll("line.link")
		.data(links, function(d) { return d.source + "-" + d.target; });

	link.enter().insert("line")
		.attr("class", "link");

	link.exit().remove();

	var node = svg.selectAll("g.node")
		.data(nodes, function(d) { return d.u16Addr;});

	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.call(force.drag);

	nodeEnter.append("circle")
		.attr("r", "18px")
		.style("fill", function(d) { return color(d.hops); })
		
	nodeEnter.append("image")
		.attr("class", "circle")
		.attr("xlink:href", "images/electricity-icon-png-4556.png")
		.attr("x", "-15px")
		.attr("y", "-15px")
		.attr("width", "30px")
		.attr("height", "30px");

	nodeEnter.append("text")
		.attr("class", "nodetext")
		.attr("dx", 20)
		.attr("dy", ".35em")
		.text(function(d) {return d.u16Addr});

	nodeEnter.append("title")
		.text(function(d) {return d.u64Addr});			

	node.exit().remove();

	force.on("tick", function() {
	  link.attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });

	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});

	// Restart the force layout.
	force.start();
}



function d3forceAddNode(u16Addr, u64Addr, hops) {
	nodes.push({"u16Addr":u16Addr, "u64Addr":u64Addr, "hops":hops});
	d3forceUpdate();
}

function d3forceAddLink(source, target, value) {
	links.push({"source": source, "target": target, "value": value});
	d3forceUpdate();
}

function d3forceFindNode(u64Addr) {
	for (var i=0; i < nodes.length; i++) {
		if (nodes[i].u64Addr === u64Addr)
			return nodes[i]
	};
}

function d3forceFindLink(source, target) {
	for (var i=0; i < links.length; i++) {
		if ((links[i].source === source) && (links[i].target === target)) 
			return links[i]
	};
}
