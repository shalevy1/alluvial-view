/**
 * @Author: John Isaacs <john>
 * @Date:   22-Sep-172017
 * @Filename: alluvial.js
 * @Last modified by:   john
 * @Last modified time: 13-Dec-172017
 */







	var width = window.innerWidth;

	var height = window.innerHeight;

	var nodeWidth = 5;

	var sortBy = 'size';


	function drawgraph (selection, data){

		var formatNumber = d3.format(",.0f"),
		    format = function(d) { return formatNumber(d); };

		var g = selection
		    .attr("width", +width )
		    .attr("height", +height + 20 )
		  	.append("g")
		    .attr("transform", "translate(" + 0 + "," + 10 + ")");

		// Calculating the best nodePadding

		var nested = d3.nest()
	    	.key(function (d){ return d.group; })
	    	.rollup(function (d){ return d.length; })
	    	.entries(data.nodes)

	    var maxNodes = d3.max(nested, function (d){ return d.values; });

		var sankey = d3.sankey()
		    .nodeWidth(+nodeWidth)
		    .nodePadding(d3.min([10,(height-maxNodes)/maxNodes]))
		    .size([+width, +height]);

		var path = sankey.link(),
			nodes = data.nodes,
			links = data.links;

		sankey
	   		.nodes(nodes)
	    	.links(links)
	    	.layout(32);

	    // Re-sorting nodes

	    nested = d3.nest()
	    	.key(function(d){ return d.group; })
	    	.map(nodes)

	    d3.values(nested)
	    	.forEach(function (d){
		    	var y = ( height - d3.sum(d,function(n){ return n.dy+sankey.nodePadding();}) ) / 2 + sankey.nodePadding()/2;
		    	d.sort(function (a,b){
		    		if (sortBy == "automatic") return b.y - a.y;
		    		if (sortBy == "size") return b.dy - a.dy;
		    		if (sortBy == "name") return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
		    	})
		    	d.forEach(function (node){
		    		node.y = y;
		    		y += node.dy +sankey.nodePadding();
		    	})
		    })

	    // Resorting links

		d3.values(nested).forEach(function (d){

			d.forEach(function (node){

	    		var ly = 0;
	    		node.sourceLinks
		    		.sort(function (a,b){
		    			return a.target.y - b.target.y;
		    		})
		    		.forEach(function (link){
		    			link.sy = ly;
		    			ly += link.dy;
		    		})

		    	ly = 0;

		    	node.targetLinks
		    		.sort(function(a,b){
		    			return a.source.y - b.source.y;
		    		})
		    		.forEach(function (link){
		    			link.ty = ly;
		    			ly += link.dy;
		    		})
			})
		})

	 	//colors.domain(links, function (d){ return d.source.name; });

		var link = g.append("g").selectAll(".link")
	    	.data(links)
	   		.enter().append("path")
			    .attr("class", function (d){ return "link "+d.cidx+" "+d.vidx+" "+d.pidx+" count"+d.vcount+" multi"+d.multi; })
					.attr("voyageCount", function (d){ return d.vcount})
					.attr("multi", function (d){ return d.multi})
					.attr("lid", function (d){ return d.id})
			    .attr("d", path )
			    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			    .style("fill","none")
			    .style("stroke", function (d){ return getColour(d.source.name)})
			    .style("stroke-opacity",".4")
			    .sort(function(a, b) { return b.dy - a.dy; })
			    .append("title")
			    .text(function(d) {  return d.value});

		var node = g.append("g").selectAll(".node")
	    	.data(nodes)
	    	.enter().append("g")
		      	.attr("class", "node")
						.attr("group", function (d){ return d.group})
		      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		node.append("rect")
		    .attr("height", function(d) { return d.dy; })
		    .attr("width", sankey.nodeWidth())
		    .style("fill", function (d) { return "#666"; })
		    .append("title")
		    	.text(function(d) { return d.name + "\n" + format(d.value); });

		node.append("text")
		    .attr("x", -6)
	      	.attr("y", function (d) { return d.dy / 2; })
	      	.attr("dy", ".35em")
	      	.attr("text-anchor", "end")
	      	.attr("transform", null)
			    .text(function(d) { return d.name; })
			    .style("font-size","11px")
					.style("font-family","Arial, Helvetica")
			    .style("pointer-events","none")
			    .filter(function(d) { return d.x < +width / 2; })
			    .attr("x", 6 + sankey.nodeWidth())
		     	.attr("text-anchor", "start");

	}
