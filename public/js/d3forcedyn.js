function myGraph(el) {

	var color = d3.scale.category20();

    // Add and remove elements on the graph object
    this.addNode = function (id, u16Addr, u64Addr, hops) {
        nodes.push({"id":id, "u16Addr":u16Addr, "u64Addr":u64Addr, "hops":hops});
        update();
    }

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] === n)||(links[i]['target'] == n)) links.splice(i,1);
            else i++;
        }
        var index = findNodeIndex(id);
        if(index !== undefined) {
            nodes.splice(index, 1);
            update();
        }
    }

    this.addLink = function (sourceId, targetId) {
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);

        if((sourceNode !== undefined) && (targetNode !== undefined)) {
            links.push({"source": sourceNode, "target": targetNode});
            update();
        }
    }

    var findNode = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return nodes[i]
        };
    }

    var findNodeIndex = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return i
        };
    }

    // set up the D3 visualisation in the specified element
    var w = $(el).innerWidth(),
        h = 460; //$(el).innerHeight();

    var vis = this.vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var force = d3.layout.force()
        .gravity(.05)
        .distance(100)
        .charge(-100)
        .size([w, h]);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {

        var link = vis.selectAll("line.link")
            .data(links, function(d) { return d.source.id + "-" + d.target.id; });

        link.enter().insert("line")
            .attr("class", "link");

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d.id;});

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

    // Make it all go
    update();
}

graph = new myGraph("#d3force");

// You can do this from the console as much as you like...
graph.addNode(0, "0x0000", "11:22:33:44:55:66:77:88", 0);
graph.addNode(1, "0x0001", "11:22:33:44:55:66:00:29", 1);
graph.addLink(1, 0);
graph.addNode(2, "0x0002", "11:22:33:44:55:66:00:05", 1);
graph.addNode(3, "0x0003", "11:22:33:44:55:66:00:46", 2);
graph.addNode(4, "0x0004", "11:22:33:44:55:66:00:25", 1);
graph.addLink(2, 0);
graph.addLink(3, 0);
graph.addLink(3, 0);
graph.addLink(4, 3);