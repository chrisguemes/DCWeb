	
	var throughputChartData = {
			labels : [],
			datasets : [
				{
					label: "Data Throughput Graph",
					fillColor : "rgba(48, 164, 255, 0.2)",
					strokeColor : "rgba(48, 164, 255, 1)",
					pointColor : "rgba(48, 164, 255, 1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(48, 164, 255, 1)",
					data : []
				}
			]

		}
		

	var roundtripCharData = {
			labels : [],
			datasets : [
				{
					label: "IMCP Round Time Graph",
					fillColor : "rgba(48, 164, 255, 0.2)",
					strokeColor : "rgba(48, 164, 255, 1)",
					pointColor : "rgba(48, 164, 255, 1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(48, 164, 255, 1)",
					data : []
				}
			]

		}	

function updateICMPRoundTime(data) {
	var obj = jQuery.parseJSON(JSON.stringify(data));
	
	/* Add ICMP round last Time */
	console.log("char-data: Update ICMP round time data");
	roundtripCharData.labels = [];
	roundtripCharData.datasets[0].data = [];
	
	obj.forEach(function(item) {
		roundtripCharData.labels.push(item.label);
		roundtripCharData.datasets[0].data.push(item.data);
	});
	
	var chart2 = document.getElementById("roundtrip-chart").getContext("2d");
	window.myLine2 = new Chart(chart2).Bar(roundtripCharData, {
		responsive: true
	});	
}	

function updateDataThroughput(data) {
	var obj = jQuery.parseJSON(JSON.stringify(data));
	
	/* Add Data Throughput last Value */
	console.log("char-data: Update data throughput");
	throughputChartData.labels = [];
	throughputChartData.datasets[0].data = [];
	
	obj.forEach(function(item) {
		throughputChartData.labels.push(item.label);
		throughputChartData.datasets[0].data.push(item.data);
	});
	
	var chart1 = document.getElementById("throughput-chart").getContext("2d");
	window.myLine1 = new Chart(chart1).Line(throughputChartData, {
		responsive: true
	});
}	
				
	// var barChartData = {
			// labels : ["January","February","March","April","May","June","July"],
			// datasets : [
				// {
					// fillColor : "rgba(220,220,220,0.5)",
					// strokeColor : "rgba(220,220,220,0.8)",
					// highlightFill: "rgba(220,220,220,0.75)",
					// highlightStroke: "rgba(220,220,220,1)",
					// data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				// },
				// {
					// fillColor : "rgba(48, 164, 255, 0.2)",
					// strokeColor : "rgba(48, 164, 255, 0.8)",
					// highlightFill : "rgba(48, 164, 255, 0.75)",
					// highlightStroke : "rgba(48, 164, 255, 1)",
					// data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				// }
			// ]
	
		// }

	var pieData = [
				{
					value: 300,
					color:"#30a5ff",
					highlight: "#62b9fb",
					label: "Blue"
				},
				{
					value: 50,
					color: "#ffb53e",
					highlight: "#fac878",
					label: "Orange"
				},
				{
					value: 100,
					color: "#1ebfae",
					highlight: "#3cdfce",
					label: "Teal"
				},
				{
					value: 120,
					color: "#f9243f",
					highlight: "#f6495f",
					label: "Red"
				}

			];
			
	// var doughnutData = [
					// {
						// value: 300,
						// color:"#30a5ff",
						// highlight: "#62b9fb",
						// label: "Blue"
					// },
					// {
						// value: 50,
						// color: "#ffb53e",
						// highlight: "#fac878",
						// label: "Orange"
					// },
					// {
						// value: 100,
						// color: "#1ebfae",
						// highlight: "#3cdfce",
						// label: "Teal"
					// },
					// {
						// value: 120,
						// color: "#f9243f",
						// highlight: "#f6495f",
						// label: "Red"
					// }
	
				// ];
		
// window.onload = function(){
	// // var chart1 = document.getElementById("throughput-chart").getContext("2d");
	// // window.myLine1 = new Chart(chart1).Line(throughputChartData, {
		// // responsive: true
	// // });
	// // var chart2 = document.getElementById("roundtrip-chart").getContext("2d");
	// // window.myLine2 = new Chart(chart2).Line(roundtripCharData, {
		// // responsive: true
	// // });	
	// // var chart2 = document.getElementById("bar-chart").getContext("2d");
	// // window.myBar = new Chart(chart2).Bar(barChartData, {
		// // responsive : true
	// // });
	// // var chart3 = document.getElementById("doughnut-chart").getContext("2d");
	// // window.myDoughnut = new Chart(chart3).Doughnut(doughnutData, {responsive : true
	// // });
	// // var chart4 = document.getElementById("pie-chart").getContext("2d");
	// // window.myPie = new Chart(chart4).Pie(pieData, {responsive : true
	// // });
// };