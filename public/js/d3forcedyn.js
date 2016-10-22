var color = d3.scale.category20();

var width = $("#d3force").width(),  // width and height of the SVG canvas 
    height = 460;

var noderadius = 8;
	
// A list of node objects.  We represent each node as {id: "name"}, but the D3
// system will decorate the node with addtional fields, notably x: and y: for
// the force layout and index" as part of the binding mechanism.
//var nodes = [];

// A list of links.  We represent a link as {source: <node>, target: <node>},
// and in fact, the force layout mechanism expects those names.  
//var links = [];

// Create the force layout.  After a call to force.start(), the tick method will
// be called repeatedly until the layout "gels" in a stable configuration.
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
	.charge(-60)
    .linkDistance(30)
    .size([width, height])
    .on("tick", tick);

// add an SVG element inside the DOM's BODY element
var svg = d3.select("#d3force").append("svg")
    .attr("width", width)
    .attr("height", height);

var nodes = force.nodes(),	
	links = force.links();	

d3.json("tables/pathlist.json", function(error, graph) {
	if (error) throw error;
	force
	  .nodes(graph.nodes)
	  .links(graph.links)
});
	
function update_graph() {

    // First update the links...

    // The call to <selection>.data() gets the link objects that need updating
    // and associates them with the corresponding DOM elements, in this case,
    // SVG line elements.  The first argument, force.links() simply returns our
    // links[] array.  The second argument is a function that produces a unique
    // and invariate identifier for each link.  This makes it possible for D3 to
    // correctly associate each link object with each line element in the DOM,
    // even if the link object moves around in memory.
    // 
    // link_update, in addition to processing objects that need updating,
    // defines two custom methods, .enter() and .exit(), that refer to link
    // objects that are newly added and that have been deleted (respectively).
    // See below to see how these methods are used.
    var link_update = svg.selectAll(".link").data(
        force.links(), 
        function(d) { return d.source + "-" + d.target; }
    );

    // link_update.enter() creates an SVG line element for each new link
    // object.  Note that we call .insert("line", ".node") to add SVG line
    // elements to the DOM before any elements with class="node".  This
    // guarantees that the lines will be drawn first.  (Try changing that to
    // .append("line") to see what happens...)
    link_update.enter()
        .insert("line", ".node")
        .attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.value); });

    // link_update.exit() processes link objects that have been removed
    // by removing its corresponding SVG line element.
    //link_update.exit()
    //    .remove();

    // Now update the nodes.  This is similar in structure to what we just
    // did for the links:
    //
    // node_selection.data() returns a selection of nodes that need updating
    // and defines two custom methods, .enter() and .exit(), that will process
    // newly created node objects and deleted node objects.
    // 
    // Note that, similar to what we did for links, we've provided an id method
    // that returns a unique and invariate identifier for each node.  This is
    // what lets D3 associate each node object with its corresponding circle
    // element in the DOM, even if the node object moves around in memory.
    var node_update = svg.selectAll(".node").data(
        force.nodes(), 
        function(d) { return d.u16Addr;}
    );

    // Create an SVG circle for each new node added to the graph.  Note that we
    // use a function to set the class of each node, because in this demo, the
    // color is determined by the class of the node, e.g.
    //      
    //      <style> 
    //        .node.a { fill: #1f77b4; } 
    //      </style>
    //      ...
    //      <circle class="node a" r="8"</circle>
    // 
    // ... but other techniques are possible
    node_update.enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", noderadius)
		.style("fill", function(d) { return color(d.hops); })
		.on("mouseover", function(){d3.select(this).style("r", noderadius*1.5);})
		.on("mouseout", function(){d3.select(this).style("r", noderadius);})		
		.call(force.drag);

	node_update.append("text")
		.attr("class", "nodetext")
		.attr("dx", 20)
		.attr("dy", ".35em")
		.text(function(d) {return "0x000"+(d.u16Addr.toString(16)).slice(-4).toUpperCase()});
		
	node_update.append("title")
	  .text(function(d) { return "0x000"+(d.u16Addr.toString(16)).slice(-4).toUpperCase() + " [" + d.u64Addr + "]"; });
		
		
    // Remove the SVG circle whenever a node vanishes from the node list.
    node_update.exit()
        .remove();

    // Start calling the tick() method repeatedly to lay out the graph.
    force.start();
}

// This tick method is called repeatedly until the layout stabilizes.
//
// NOTE: the order in which we update nodes and links does NOT determine which
// gets drawn first -- the drawing order is determined by the ordering in the
// DOM.  See the notes under link_update.enter() above for one technique for
// setting the ordering in the DOM.
function tick() {

    // Drawing the nodes: Update the cx, cy attributes of each circle element
    // from the x, y fields of the corresponding node object.
    svg.selectAll(".node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

    // Drawing the links: Update the start and end points of each line element
    // from the x, y fields of the corresponding source and target node objects.
    svg.selectAll(".link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
		
	var nodes = force.nodes();
	var q = d3.geom.quadtree(nodes);
		
	for (node in nodes) {
		q.visit(collide(node));
	}
}

function collide(node) {
  var r = noderadius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = noderadius * 2;
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

function d3forceAddNode(u16Addr, u64Addr, hops) {
	force.nodes().push({"u16Addr":u16Addr, "u64Addr":u64Addr, "hops":hops});
	//update_graph();
}

function d3forceAddLink(source, target, value) {
	force.links().push({"source": source, "target": target, "value": value});
	//update_graph();
}
function d3forceRestart(e) {
	//force.start();
	update_graph();
}

setTimeout(function() {
    update_graph();
}, 0);