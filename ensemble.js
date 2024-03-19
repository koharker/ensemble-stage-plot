
var canvasScale = 2;
var spectrumInitialized = false;
var editingColor = false;
var defaultPalette;
var userPalette = [];
var podium = {};

var ensemble;
var jsonVersion = 6;

var centerX = 525*canvasScale
var centerY = 550*canvasScale
var seatScale = 1*canvasScale
var customScale = 1
var maxRows = 6;
var generateCode = false;
var showStands;
var showPodium;
var rows;
var podium;
var stands;
var chairs;
var chairTypes = ['sqr','cello'];
var labels;
var customRowFontSizes;
var standCoordinates;
var straightRows = 0;
var editingLabelRow;

// Global variables to track the current mode and the current section being edited
var currentCanvasClickMode = 'normal'; // Other possible value: 'addChairToSection'
var currentSection = null; // Assuming this will hold some identifier for the current section
var sections;
var selectedChairs = [];

var vcLoc = [];

$(document).ready(function() {
	setLetterCheckbox();
	
    $.extend($.jCanvas.defaults, {
        strokeStyle: '#000',
        strokeWidth: 2 * canvasScale,
        x: centerX,
        y: centerY,
        inDegrees: false
    });

	$('#canvas').attr({
  		'width': $('#canvas').attr('width') * canvasScale,
  		'height': $('#canvas').attr('height') * canvasScale
	});

	$('#guide_canvas').attr({
  		'width': $('#guide_canvas').attr('width') * canvasScale,
  		'height': $('#guide_canvas').attr('height') * canvasScale
	});


	$('input').on('change', drawChart());
	$('#code').off('change');
	$('input').on('keyup', drawChart);
	$('#generate').click(drawChart);
	$('#loadlink').click(function() {
		$('#loadlink').addClass('hidden');
		$('#loadcontainer').removeClass('hidden');
	});
	$('#load').click(function() {
		loadChartFileText($('#loadcode').val(), false);
	});
	$('#fileinput').change(loadChartFile);
	$('#reset').click(reset);
	$('#guide_canvas').click(clickChart);
	$('#guide_canvas').on('dblclick', dblClickChart);
	$('#chknumbers').on('change', function() {
		setRestartCheckbox();
		drawChart();
	});
	$('#chkrestart').change(function() {
		setLetterCheckbox();
		drawChart();
	});

	$('#btnscaledown').click(function() {
		setCustomScale(-0.1);
		drawChart();
	});
	$('#btnscaleup').on('click', function() {
		setCustomScale(0.1);
		drawChart();
	});
	$('#btnrowlabelscaledown').click(function() {
		customRowFontSizes[editingLabelRow] *= 0.9;
		setCustomLabels();
	});
	$('#btnrowlabelscaleup').click(function() {
		customRowFontSizes[editingLabelRow] *= 1.111111111;
		setCustomLabels();
	});
	$('#btnstraightdown').click(function() {
		setStraight(-1);
		drawChart();
	});
	$('#btnstraightup').click(function() {
		setStraight(1);
		drawChart();
	});
	$('#chkstands').on('change', checkStands);
	$('#chkpodium').change(checkPodium);
	$('#txtlabels').blur(setCustomLabels);
	$('#txtlabels').keypress(function(e) {
		if(e.which == 13)
			setCustomLabels();
	});
	$('#txtlabels').keydown(function(e) {
		if(e.keyCode == 38 || e.keyCode == 40) // up, down arrows
			setCustomLabels();
	});
	$('#btnlabeldone').click(editLabelsDone);

	$('#code').dblclick(function () {
		$(this).select();
	});
	$('#help').click(closeHelp);
	$('#helpcontents').click(function(e) { e.stopPropagation(); });
	$('#input_labels').hide();
	
/** Logic for adding instrument sections to the chart */
	$("#add-section-btn").on('click', addSection());
	
	// Event delegation for dynamically added buttons
	//SECTION-TABLE EDIT BUTTON	  
	$("#sections-table").on("click", ".edit-btn", function() {
		var $td = $(this).closest("tr").find("td:first");
		var currentName = $td.text();
		$td.html(`<input type="text" class="edit-name-input" value="${currentName}">`);
		$(this).siblings().hide(); // Hide other buttons
		$(this).parent().append('<button class="done-btn">Done</button><button class="cancel-btn">Cancel</button>');
		$(this).remove(); // Remove edit button
	});

	$("#sections-table").on("click", ".done-btn", function() {
	var newName = $(this).siblings(".edit-name-input").val();
	$(this).closest("tr").find("td:first").text(newName);
	// Restore buttons here
	});
	  
	$("#sections-table").on("click", ".cancel-btn", function() {
	// Cancel editing: Restore the original name and buttons
	});
	  
	//SECTIONS-TABLE ADD-CHAIRS BUTTON
	$("#sections-table").on('click', ".add-chairs-btn", function() {
		currentCanvasClickMode = 'addChairToSection'

		const $td = $(this).closest("tr").find("td:first");
		currentSection = $td.text();

		// Define the tr containing the clicked button
		const currentTr = $(this).closest('tr');

		// Disable all buttons in other tr elements
		$('#sections-table tr').not(currentTr).find('button').prop('disabled', true);
		
		//const $trs = $td.prevUntil(this)
		//$trs.find('button')
		
		//$td.nextUntil().disable(); // Hide other buttons


		// Add chairs logic
	});
	
	$("#sections-table").on("click", ".delete-btn", function() {
		// Delete the section row
		$(this).closest("tr").remove();
	});







	if(!window.FileReader) {
		$('#loadfilecontainer').hide();
		showCodeInput();
	}
	
	reset();
	checkStands();
	checkPodium()
	drawChart();
	loadUrlCode();
});







/*


	var step = (250 + 10 * rows.length) / (rows.length - 1)
	console.log(rows.length + "is rows.length");
	var row_length = 0;
	for(var row in rows) {
		if(restartNumbering) {
			nT += n;
			n = 1;
		} else {
			var nT = n;
		}
		if(letterRows)
			a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(row);
		var r = 350;
		if(rows.length > 1)
			console.log(step + "is step");
			r = 225 + step * row + 50 * (customScale - 1);
			console.log(r + "is r");
		if(row < rows.length - straightRows) {
			$('canvas').drawArc({ radius: r, 
  				x: 675, y: 700,
  				// start and end angles in degrees
  				start: (-0.475 + (row+0.5)/1000)*Math.PI, end: (0.475 - (row+0.5)/1000)*Math.PI
			});
			var arc_length = (0.95* Math.PI) - .3 - (1 - r / (700+ 10*row))
			var angle_step = arc_length / (rows[row] - 1)
			var vcStep = angle_step * 1.5




*/















function drawChart() {
	readInputs();
	
	$("canvas").clearCanvas();
	var showNumbers = $('#chknumbers').attr('checked') != null;
	var restartNumbering = $('#chkrestart').attr('checked') != null;
	var letterRows = $('#chkletters').attr('checked') != null;
	var totalChairs = 0;
	var totalStands = 0;
	var totalStools = 0;

	console.log(showNumbers)
	let n = showNumbers ? 1 : '';

	var a = '';

	updateChairLabels();
	seatScale = Math.min(1, 7 / rows.length) * customScale * canvasScale;
	var step = 300 / (rows.length - 1) * canvasScale
	var row_length = 0;
	for(var row in rows) {
		if(restartNumbering) {
			nT += n;
			n = 1;
		} else {
			var nT = n;
		}
		if(letterRows)
			a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(row);
		var r = 350 * canvasScale;
		if(rows.length > 1)
			r = (185 * canvasScale) + step * row;
			console.log(r + "is r");
		if(row < rows.length - straightRows) {
			//Angled arc mode
		    let arcNarrowingAngle = 30;
			let arcStartRad = (arcNarrowingAngle - 90) * Math.PI / 180;
			let arcEndRad = (90 - arcNarrowingAngle) * Math.PI / 180;
			$('canvas').drawArc({ radius: r, x: centerX, y: centerY, start: arcStartRad, end: arcEndRad });
			let arcHeightOffset = 40 * canvasScale;
			let arcSpanAdjustmentRadians = (180 - 2 * arcNarrowingAngle) * Math.PI / 180;
			let arcHeightOffsettRadians = Math.asin(arcHeightOffset / r) * 2;

			const totalArcAngleRadians = arcSpanAdjustmentRadians - arcHeightOffsettRadians;

			var angle_step = totalArcAngleRadians / (rows[row] - 1)
			var vcStep = angle_step * 1.5
			for(var i = 0; i < rows[row]; i++) {
				var t = 0;
				if(rows[row] > 1) {
					//adjust for cello spacing here
					var numberOfCelloChairs = vcLoc.length;
					console.log(numberOfCelloChairs + "numberOfCelloChairs");
					/*if (numberOfCelloChairs > 0) {
						for (var vcChair in vcLoc) {
							console.log(vcLoc[vcChair] + "vcChair");
							var nonCelloAngleStep = angle_step - ((angle_step * 0.5 * numberOfCelloChairs) / (rows[row] - numberOfCelloChairs));
							if (chairs[row][i].shape === "cello") {
								console.log(i + "i \=" + vcLoc[vcChair] + "vcChair");
								if (chairs[row][i + 1].shape === "cello") {
									var t = -1 * (-1 * arc_length / 2 + (nonCelloAngleStep * (i - 1) + (vcStep + nonCelloAngleStep)/2));
								} else if (chairs[row][i + 1].shape !== "cello") {
									var t = -1 * (-1 * arc_length / 2 + (nonCelloAngleStep * (i - 1) + (vcStep + nonCelloAngleStep)/2  + vcStep * (numberOfCelloChairs - 1)));
								}
							};
							if (i > vcLoc[vcChair] && chairs[row][i].shape !== "cello") {
								console.log(i + "i \>" + vcLoc[vcChair] + "vcChair");
								var t = -1 * (-1 * arc_length / 2 + (nonCelloAngleStep * (i - 1)) + (vcStep * numberOfCelloChairs));
							} else if ((i < vcLoc[vcChair]) && chairs[row][i].shape !== "cello") {
								console.log(i + "i \<" + vcLoc[vcChair] + "vcChair");
								var t = -1 * (-1 * arc_length / 2 + nonCelloAngleStep * i);
							};
						}
					} else {*/
						 var t = -1 * (-1 * totalArcAngleRadians / 2 + (angle_step) * i);
					/*}*/
				}

				// Hide the arc under disabled chairs
				if(!chairs[row][i].enabled) {
					$('canvas').drawArc({
						radius: r,
						strokeStyle: '#fff',
						strokeWidth: 5,
						start: i == 0 ? Math.PI : ((t + angle_step * 0.55) * -1), // First chair, blank out entire arc to the left
						end: i == rows[row] - 1 ? Math.PI : ((t - angle_step * 0.55) * -1)  // Last chair, blank out entire arc to the right
					});
				}
				drawChair(r, t, n, a, chairs[row][i], angle_step, row, i, step);
				if(showStands) {
					drawStand(Math.max(r - step * 0.5, r - 35 * customScale), t, stands[row][i*2]);
					if(i != rows[row] - 1)
						drawStand(Math.max(r - step * 0.5, r - 35 * customScale), t - angle_step / 2, stands[row][i*2+1]);
				}
				if(showNumbers && chairs[row][i].enabled && chairs[row][i].label === false && chairTypes.includes(chairs[row][i].shape)) {
					console.log("n", n);
					n++;
				        totalChairs ++;
				}
				if(showNumbers && chairs[row][i].enabled && chairs[row][i].label === false && chairs[row][i].shape === 'circ') {
					n++
					totalStools ++;
				}
			}
			
			if (showStands) {
				for(var s in stands[row]) {
					if (stands[row][s].enabled) {
						totalStands ++;
					};
				}
			}
					
		} else {
			var y = centerY - r;
			if(!row_length) {
				if(rows.length > straightRows)
					row_length = r * 1.8;
				else
					row_length = 1000;
				
			}
			$('canvas').drawLine({ x1: centerX - row_length/2, y1: y, x2: centerX + row_length/2, y2: y });
			var x_step = (row_length - 100) / (rows[row] - 1)
			for(var i = 0; i < rows[row]; i++) {
				var x = centerX;
				if(rows[row] > 1)
					x = x_step * i + centerX - row_length/2 + 50;
				// Hide the line under disabled chairs
				if(!chairs[row][i].enabled) {
					$('canvas').drawLine({
						x1: i == 0 ? 0 : (x - x_step * 0.55), // First chair, blank out entire line to the left
						y1: y,
						x2: i == rows[row] - 1 ? centerX * 2 : (x + x_step * 0.55), // Last chair, blank out entire line to the right
						y2: y,
						strokeStyle: '#fff',
						strokeWidth: 5
					});
				}
				drawChairXY(x, y, 0, n, a, chairs[row][i], row, i);
				if(showStands) {
					drawStandXY(x, Math.min(y + step * 0.5, y + 35 * customScale), stands[row][i*2]);
					if(i != rows[row] - 1) {
						drawStandXY(x + x_step * 0.5, Math.min(y + step * 0.5, y + 35 * customScale), stands[row][i*2+1]);
					}
				}
				if(showNumbers && chairs[row][i].enabled && chairs[row][i].label === false && chairTypes.includes(chairs[row][i].shape)) {
					n++;
					totalChairs++;
				}
				if(showNumbers && chairs[row][i].enabled && chairs[row][i].label === false && chairs[row][i].shape === 'circ') {
					n++
					totalStools ++;
				}
			}
			if (showStands) {
				for(var s in stands[row]) {
					if (stands[row][s].enabled) {
						totalStands ++;
					};
				}
			}
		}
	}
	if(showStands) {
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#fff',
			x: 66 * canvasScale, y: 8 * canvasScale,
			text: ' = music stand',
			font: `normal ${11*canvasScale}pt Verdana, sans-serif`
		});
		$('canvas').drawLine({ x1: 2*canvasScale, y1: 2*canvasScale, x2: 12*canvasScale, y2: 12*canvasScale });
		$('canvas').drawLine({ x1: 2*canvasScale, y1: 12*canvasScale, x2: 12*canvasScale, y2: 2*canvasScale });
		
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#fff',
			x: 960 * canvasScale, y: 24 * canvasScale,
			text: 'total stands =',
			font: `normal ${11*canvasScale}pt Verdana, sans-serif`
		});
		
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#fff',
			x: 1025 * canvasScale, y: 24 * canvasScale,
			text: totalStands,
			font: `normal ${11*canvasScale}pt Verdana, sans-serif`
		});
	}
	
	//disp heading()  ??

	if (rows[row]) {
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#fff',
			x: 960*canvasScale, y: 8*canvasScale,
			text: 'total chairs =',
			font: `normal ${11*canvasScale}pt Verdana, sans-serif`
		});
		/*for(var rown in rows) {
			var totalChairs =	
			*/
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#fff',
			x: 1025*canvasScale, y: 8*canvasScale,
			text: totalChairs,
			font: `normal ${11*canvasScale}pt Verdana, sans-serif`
		});
		
		if (totalStools !== 0) {
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				x: 960*canvasScale, y: 40*canvasScale,
				text: 'total stools =',
				font: `normal ${11*canvasScale}pt Verdana, sans-serif`
			});
		
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				x: 1025*canvasScale, y: 40*canvasScale,
				text: totalStools,
				font: `normal ${11*canvasScale}pt Verdana, sans-serif`
			});
		}
	}
	
	if (showPodium) {
		drawPodium();
		if (showStands) {
			drawStandXY(525*canvasScale, ((450*canvasScale) - 25 * customScale), podium);
		}
	}

	$('.title').html($('#title').val());
	if(generateCode)
		$('#code').attr('value', encode());
}

function drawPodium() {
	if(podium.enabled) {
		$('canvas').drawRect({
			fillStyle: '#fff',
			strokeStyle: '#000',
			strokeWidth: 4 *canvasScale,
			x: 525*canvasScale, y: 470*canvasScale,
			width: 48 * seatScale,
			height: 48 * seatScale,
			cornerRadius: 10*seatScale
		});
	} else {
		$('canvas').drawRect({
			fillStyle: '#fff',
			strokeStyle: '#CCC',
			strokeWidth: 4*canvasScale,
			x: 525*canvasScale, y: 470*canvasScale,
			width: 48 * seatScale,
			height: 48 * seatScale,
			cornerRadius: 10 * seatScale
		});
	}
}


function drawChair(r, t, n, a, chair, angleStep, row, index, radiusStep) {
	const x = centerX - Math.sin(t) * r;
	const y = centerY - Math.cos(t) * r;
	drawChairXY(x, y, r, t, n, a, chair, angleStep, row, index, radiusStep);
}
	
function drawChairXY(x, y, r, t, n, a, chair, angleStep, row, index, radiusStep) {
	console.log("drawChairXY() n:", n)
	
	//THIS SECTIONOFFSET STUFF SHOULD GO WITH drawSection eventually...
		//let sectionBorderWidthOffset = 1.25; //for a 5px stroke width
		//let sectionBorderWidthRads = Math.asin(sectionBorderWidthOffset / chair.r) * 2
		let sectionOffsetRads = chair.angleStep / 2 //- sectionBorderWidthRads;

	setChairExtendedProperties(chair, x, y, r, t, n, a, row, index, angleStep, radiusStep, sectionOffsetRads)

	var fontSize = (chair.fontSize ? chair.fontSize : 1) * Math.round((a ? 14 : 16) * seatScale);

	if(chair.enabled) {
		if(chair.shape === "sqr"){		
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#000',
				strokeWidth: 2 * seatScale,
				x: x, y: y,
				width: 40 * seatScale, height: 40 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 3 * seatScale + 'pt',
				x: x, y: y,
				text: chair.label === false ? a + n : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Inter, sans-serif'
			});
		
		} else if(chair.shape === "circ"){
			$('canvas').drawArc({
				radius: 20 * seatScale,
				fillStyle: '#fff',
				strokeStyle: '#000',
				strokeWidth: 2 * seatScale ,
				x: x, y: y
			});
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#ffaa99',
				strokeWidth: 3 * seatScale,
				x: x, y: y,
				text: chair.label === false ? a + n : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Inter, sans-serif'
			});
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#ffaa99',
				strokeWidth: 0,
				x: x, y: y,
				text: chair.label === false ? a + n : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Inter, sans-serif'
			});
			
		} else if(chair.shape === "cello") {
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#000',
				strokeWidth: 6 * seatScale,
				x: x, y: y,
				width: 42 * seatScale, height: 42 * seatScale,
				angle: -1 * t
			});
			// $('canvas').drawRect({
			// 	fillStyle: '#fff',
			// 	strokeStyle: '#fff',
			// 	x: x, y: y,
			// 	width: 46 * seatScale - (12*canvasScale), height: 46 * seatScale - (12*canvasScale),
			// 	angle: -1 * t
			// });
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * seatScale + 'pt',
				x: x, y: y,
				text: chair.label === false ? a + n : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Verdana, sans-serif'
			});
		} else if(chair.shape === "snare") {
			$('canvas').drawRect({
				fillStyle: '#000',
				strokeStyle: '#000',
				x: x, y: y,
				width: 46 * seatScale, height: 46 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				x: x, y: y,
				width: 46 * seatScale - (12*canvasScale), height: 46 * seatScale - (12*canvasScale),
				angle: -1 * t
			});
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * canvasScale,
				x: x, y: y,
				text: chair.label === false ? a + n : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Verdana, sans-serif'
			});
		} else if(chair.shape === "snareOG") {
			$('canvas').drawEllipse({
				fillStyle: '#000',
				strokeStyle: '#000',
				strokeWidth: 5,
				width: 38 * seatScale, height: 10 * seatScale,
				x: x + Math.sin(t) * 9 * seatScale, y: y + Math.cos(t) * 9 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				width: 38 * seatScale - 4, height: 10 * seatScale - 4 ,
				x: x + Math.sin(t) * 9 * seatScale, y: y + Math.cos(t) * 9 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#000',
				strokeStyle: '#000',
				x: x, y: y,
				width: 40 * seatScale, height: 16 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				x: x, y: y,
				width: 40 * seatScale - 4, height: 16 * seatScale +seatScale,
				rotate: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#000',
				strokeStyle: '#000',
				strokeWidth: 5,
				width: 38 * seatScale, height: 10 * seatScale,
				x: x - Math.sin(t) * 8 * seatScale, y: y - Math.cos(t) * 8 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				width: 38 * seatScale - 4, height: 10 * seatScale - 4 ,
				x: x - Math.sin(t) * 8 * seatScale, y: y - Math.cos(t) * 8 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * seatScale + 'pt',
				x: x, y: y,
				text: chair.label === false ? "SD" : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Verdana, sans-serif'
			});
		} else if(chair.shape === "bass_drum") {
			$('canvas').drawEllipse({
				fillStyle: '#000',
				strokeStyle: '#000',
				strokeWidth: 5,
				width: 10 * seatScale, height: 38 * seatScale,
				x: x + Math.cos(t) * 8 * seatScale, y: y - Math.sin(t) * 8 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				width: 10 * seatScale - 4, height: 38 * seatScale - 4 ,
				x: x + Math.cos(t) * 8 * seatScale, y: y - Math.sin(t) * 8 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#000',
				strokeStyle: '#000',
				x: x, y: y,
				width: 16 * seatScale, height: 40 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				x: x, y: y,
				width: 16 * seatScale + seatScale, height: 40 * seatScale - 4,
				angle: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#000',
				strokeStyle: '#000',
				strokeWidth: 5,
				width: 10 * seatScale, height: 38 * seatScale,
				x: x - Math.cos(t) * 8 * seatScale, y: y + Math.sin(t) * 8 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				width: 10 * seatScale - 4, height: 38 * seatScale - 4 ,
				x: x - Math.cos(t) * 8 * seatScale, y: y + Math.sin(t) * 8 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5,
				x: x, y: y,
				text: chair.label === false ? "BD" : chair.label,
				font: 'normal ' + fontSize + 'pt Verdana, sans-serif'
			});
		} else if(chair.shape === "timp") {
			$('canvas').drawImage({
				source: 'timpani-icon.png',
				x: x, y: y,
				width: 50 * seatScale, height: 50 * seatScale
			});
		}
	} else {
		if(chair.shape === "sqr"){
			$('#guide_canvas').drawRect({
				fillStyle: '#CCC',
				strokeStyle: '#CCC',
				x: x, y: y,
				width: 40 * seatScale, height: 40 * seatScale,
				angle: -1 * t
			});
			$('#guide_canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				x: x, y: y,
				width: 40 * seatScale - 4, height: 40 * seatScale - 4,
				angle: -1 * t
			});
		} else if (chair.shape === "circ") {
			$('#guide_canvas').drawArc({
				radius: 20 * seatScale,
				fillStyle: '#CCC',
				strokeStyle: '#CCC',
				strokeWidth: 5,
				x: x, y: y
			});
			$('#guide_canvas').drawArc({
				radius: 20 * seatScale - 3,
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				x: x, y: y
			});
		} else if (chair.shape === "cello") {
			$('#guide_canvas').drawRect({
				fillStyle: '#CCC',
				strokeStyle: '#CCC',
				x: x, y: y,
				width: 46 * seatScale, height: 46 * seatScale,
				angle: -1 * t
			});
			$('#guide_canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				x: x, y: y,
				width: 46 * seatScale - 10, height: 46 * seatScale - 10,
				angle: -1 * t
			});
		} else if (chair.shape === "snare") {
			$('canvas').drawEllipse({
				fillStyle: '#CCC',
				strokeStyle: '#CCC',
				strokeWidth: 5,
				width: 38 * seatScale, height: 10 * seatScale,
				x: x + Math.sin(t) * 9 * seatScale, y: y + Math.cos(t) * 9 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				width: 38 * seatScale - 4, height: 10 * seatScale - 4 ,
				x: x + Math.sin(t) * 9 * seatScale, y: y + Math.cos(t) * 9 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#CCC',
				strokeStyle: '#CCC',
				x: x, y: y,
				width: 40 * seatScale, height: 16 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				x: x, y: y,
				width: 40 * seatScale - 4, height: 16 * seatScale +seatScale,
				angle: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#CCC',
				strokeStyle: '#CCC',
				strokeWidth: 5,
				width: 38 * seatScale, height: 10 * seatScale,
				x: x - Math.sin(t) * 8 * seatScale, y: y - Math.cos(t) * 8 * seatScale,
				angle: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#fff',
				strokeWidth: 5,
				width: 38 * seatScale - 4, height: 10 * seatScale - 4 ,
				x: x - Math.sin(t) * 8 * seatScale, y: y - Math.cos(t) * 8 * seatScale,
				angle: -1 * t
			});
		}
	}
	//console.log(x + ' ' + y + ' ' + t);
}

function setChairExtendedProperties(chair, x, y, r, t, n, a, row, index, angleStep, radiusStep, sectionOffsetRads) {
	chair.angleStep = angleStep;
	chair.topBoundRadius = r + radiusStep / 2;
	chair.bottomBoundRadius = r - radiusStep / 2;
	chair.radiusStep = radiusStep;
	chair.x = x;
	chair.y = y;
	chair.t  = t;
	chair.r = r;
	chair.row = row;
	chair.index = index;
	chair.leftBoundTheta = t + sectionOffsetRads;
	chair.rightBoundTheta = t - sectionOffsetRads;
	chair.n = n;
	chair.a = a;
}

function setChairBounds() {};
function drawSqrChair(chair) {
	
}

/** DRAW STAND */

function drawStand(r, t, stand) {
	var x = centerX - Math.sin(t) * r;
	var y = centerY - Math.cos(t) * r;
	drawStandXY(x, y, stand);
}

function drawStandXY(x, y, stand) {
	stand.x = x;
	stand.y = y;
	// Again with the borders
	$('#guide_canvas').drawRect({
		fillStyle: '#999',
		strokeStyle: '#999',
		x: x, y: y,
		width: 7*canvasScale, height: 7*canvasScale
	});
	$('#guide_canvas').drawRect({
		fillStyle: '#fff',
		strokeStyle: '#fff',
		x: x, y: y,
		width: 6*canvasScale, height: 6*canvasScale
	});
	console.log('drawStand: stand.enabled', stand.enabled)
	if(stand.enabled) {
		$('canvas').each(function() {
			$(this).drawLine({
				strokeStyle: '#000',
				strokeWidth: 4,
				x1: x-(5*canvasScale), y1: y-(5*canvasScale),
				x2: x+(5*canvasScale), y2: y+(5*canvasScale)
			});
			$(this).drawLine({
				x1: x-(5*canvasScale), y1: y+(5*canvasScale),
				x2: x+(5*canvasScale), y2: y-(5*canvasScale)
			});
		});
	}
}



function drawSections() {
	sections.forEach(section => {
		section.forEach(chair => {
			drawSection(chair)
		})
	})
}



function drawSection(section) {
	$("canvas").clearCanvas();
	drawChart();
	//YOU NEED TO INCLUDE ANGLESTEP IN THE FUNCTION ARGUMENTS
	//var x = centerX - Math.sin(t) * r;
	//var y = centerY - Math.cos(t) * r;
	section.forEach(chair => drawSectionXY(chair));
}

function drawSectionXY(chair) {
	const t = chair.t;
	console.log(chair.t)
	let sectionBorderWidthOffset = 1.25; //for a 5px stroke width
	let sectionBorderWidthRads = Math.asin(sectionBorderWidthOffset / chair.r) * 2
	let sectionOffsetRads = chair.angleStep / 2 - sectionBorderWidthRads;
	// Draw a 90-degree arc
	$('canvas').drawArc({
		strokeStyle: '#000',
		strokeWidth: 5,
		x: centerX, y: centerY,
		radius: chair.topBoundRadius, // chair.r + 40 * seatScale,
		// start and end angles in degrees
		start: -t - sectionOffsetRads , end: -t + sectionOffsetRads
	});
	$('canvas').drawArc({
		strokeStyle: '#000',
		strokeWidth: 5,
		x: centerX, y: centerY,
		radius: chair.bottomBoundRadius, //chair.r - 40 * seatScale,
		// start and end angles in degrees
		start: -t - sectionOffsetRads , end: -t + sectionOffsetRads
	});
	let borderLeftTheta = t + sectionOffsetRads;
	let borderRightTheta = t - sectionOffsetRads;
	var borderLeftX = centerX - Math.sin(chair.t + sectionOffsetRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset));
	var borderLeftY = centerY - Math.cos(chair.t + sectionOffsetRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset));
	var borderRightX = centerX - Math.sin(chair.t - sectionOffsetRads) * (chair.r - (2*sectionBorderWidthOffset) - 40 * seatScale);
	var borderRightY = centerY - Math.cos(chair.t - sectionOffsetRads) * (chair.r - (2*sectionBorderWidthOffset) - 40 * seatScale);

	$('canvas').drawVector({
		strokeStyle: '#000',
		strokeWidth: 5,
		x: borderLeftX, y: borderLeftY,
		// start and end angles in degrees
		a1: -t - sectionOffsetRads, l1: (chair.radiusStep + (2 * sectionBorderWidthOffset)),
	});
	$('canvas').drawVector({
		strokeStyle: '#000',
		strokeWidth: 5,
		x: borderRightX, y: borderRightY,
		// start and end angles in degrees
		a1: -t + sectionOffsetRads, l1: (80 + (2 * sectionBorderWidthOffset)) * seatScale,
	});
}

function drawSectionBorderLeft(chair) {
	let sectionBorderWidthOffset = 1.25; //for a 5px stroke width
	let sectionBorderWidthRads = Math.asin(sectionBorderWidthOffset / chair.r) * 2
	let sectionOffsetRads = chair.angleStep / 2 - sectionBorderWidthRads;
	var borderLeftX = centerX - Math.sin(chair.t + sectionOffsetRads) * (chair.r - (2* sectionBorderWidthOffset) - 40 * seatScale);
	var borderLeftY = centerY - Math.cos(chair.t + sectionOffsetRads) * (chair.r - (2* sectionBorderWidthOffset) - 40 * seatScale);
	$('canvas').drawVector({
		strokeStyle: '#000',
		strokeWidth: 5,
		x: borderLeftX, y: borderLeftY,
		// start and end angles in degrees
		a1: -t - sectionOffsetRads, l1: (80 + (2 * sectionBorderWidthOffset)) * seatScale,
	});
}

function drawSectionBorderTop(chair) {
	const sectionBorderWidthOffset = 1.25; //for a 5px stroke width
	const sectionBorderWidthRads = Math.asin(sectionBorderWidthOffset / chair.r) * 2
	const sectionOffsetRads = chair.angleStep / 2 - sectionBorderWidthRads;
	$('canvas').drawArc({
		strokeStyle: '#000',
		strokeWidth: 5,
		x: centerX, y: centerY,
		radius: chair.r + 40 * seatScale,
		// start and end angles in degrees
		start: -t - sectionOffsetRads , end: -t + sectionOffsetRads
	});
}

function connectChairsInSection(section) {
	// This assumes that chairs in row are adjacent.

	const sortedSectionChairs = sortSectionChairs(section)
	//let sectionStartStopCoordArray = []
	//find bounds of the section
	

	/**
	 * iterate first through rows
	 * start with back row and compare indicies
	 * if the sectionChairs[row][i].index == sectionChairs[row][i-1].index -1 then draw a white line instead of a black line for the side
	 */

	const sectionChairs = organizeSectionChairsIntoArray(section);

	sectionChairs.forEach((sectionRow, rowIndex) => {
		sectionRow.forEach((sectionChair, chairIndex) => {
			
			if (rowIndex == 1 && chairIndex == 1) {
				drawSectionBorderTop(sectionChair)
				drawSectionBorderLeft(sectionChair)	
			}
			//if the next chair is not adjacent, drawSectionBorderRight;
			//if there is no next row, then also drawSectionBorderBottom;

			/** 
			 * Honestly though I thought we could procedurally generate the next border section, but 
			 * I think we have to do this a different way. If there is a row below, and you don't draw the bottom,
			 * there might be a gap in the section border if the chair in the row below is not perfectly in line with this chair...
			 * You might have to use the "draw white line" method
			 */
		})
	})
	/** compare the t values to determine corners: lets say you've already selected a chair in row 4.
	 * if the chair.t of the chair you selected in row 3 is less than OR greater than (not equal to) the chair.t in row 4, then you need to draw another top arc.
	 * if the chair.t of the chair you selected in row 3 = chair.t of chair in row 4, then you draw a white top arc to mask the bottom arc of the selection box of the chair in row 4.
	 * 
	 */
}

function sortSectionChairs(section) {
	//sort from deepest row & leftmost chair, to shallowest row & rightmost chair. jCanvas arc paths are drawn from left to right.
  	console.log(section)
	const sectionSortedByRowThenIndex = section.sort((a, b) => {
		// First, compare by row descending
		if (a.row > b.row) return -1;
		if (a.row < b.row) return 1;
		// If index is the same, compare by index ascending
		if (a.index < b.index) return -1;
		if (a.index > b.index) return 1;
		return 0;
	})
  return sectionSortedByRowThenIndex
}

function organizeSectionChairsIntoArray(section) {
    const sortedSectionChairs = sortSectionChairs(section);
    let rowsMap = {};

    // Group chairs by row
    sortedSectionChairs.forEach(chair => {
        if (!rowsMap[chair.row]) {
            rowsMap[chair.row] = [];
        }
        rowsMap[chair.row].push(chair);
    });

    // Extract arrays from the rowsMap
    let sectionChairs = Object.values(rowsMap).reverse(); // Reverse to get the rows in descending order
    return sectionChairs;
}

//maybe it's easier to compare the multiarray "sections" to "chairs". remove sectionChairs = chairs, but with only those found in "sections"




function clickChart(e) {
	var canvas = $('#guide_canvas');
	var scale = 1050 * canvasScale / canvas.width();
	var x = (e.pageX - canvas.offset().left) * scale;
	var y = (e.pageY - canvas.offset().top) * scale;
	const clickableChairAreaTolerance = 18 * canvasScale 
	for(var row in rows) {
		for(var c in chairs[row]) {
			var chair = chairs[row][c];
			if(chair.x > x - clickableChairAreaTolerance && chair.x < x + clickableChairAreaTolerance && chair.y > y - clickableChairAreaTolerance && chair.y < y + clickableChairAreaTolerance ) {
				// Check the current mode to determine action
				if (currentCanvasClickMode === 'addChairToSection') {
					// Add chair to section logic
					chair.section = !chair.section ? currentSection : null;

					//!!! maybe this needs to be drawSections()...
					addChairToSection(chair, currentSection);
				} else {
					chair.enabled = !chair.enabled;
					drawChart();
					break;
				}
			}

		}
		if(!showStands)
			continue;
		for(var s in stands[row]) {
			var stand = stands[row][s];
			if(stand.x > x - 9 && stand.x < x + 9 && stand.y > y - 9 && stand.y < y + 9 ) {
				if (currentCanvasClickMode != 'addChairToSection')  {
					stand.enabled = !stand.enabled;
					drawChart();
					break;
				}
			}
		}
	}
}

// Add double click
function dblClickChart(e) {
	var canvas = $('#guide_canvas');
	var scale = 1050 * canvasScale / canvas.width();
	var x = (e.pageX - canvas.offset().left) * scale;
	var y = (e.pageY - canvas.offset().top) * scale;
	if (currentCanvasClickMode === 'addChairToSection') {return};
	for(var row in rows) {
		for(var c in chairs[row]) {
			var chair = chairs[row][c];
			var c = parseInt(c);
			if(chair.x > x - 18 && chair.x < x + 18 && chair.y > y - 18 && chair.y < y + 18 ) {
				if (chair.shape === "sqr"){
					chair.shape = "circ"
				} else if(chair.shape === "circ"){
					chair.shape = "cello";
					vcLoc.push(c);
					//numberOfCelloChairs += 1;
				} else if(chair.shape === "cello"){
					chair.shape = "snare";
					//numberOfCelloChairs -= 1;
					var vcChairNumber = vcLoc.indexOf(c);
					vcLoc.splice(vcChairNumber)
				} else if(chair.shape === "snare"){
					chair.shape = "bass_drum";
				} else if(chair.shape === "bass_drum"){
					chair.shape = "timp";
				} else if(chair.shape === "timp"){
					chair.shape = "sqr";
				} 
				drawChart();
				break;
			}
		}
	}
}




function readInputs() {
	syncCheckboxEnabledStates()
	rows = [];
	for(var i = maxRows - 1; i >= 0; i--) {
		var val = parseInt($('#row' + (i+1)).val());
		console.log(val);
		if(rows.length == 0 && !val)
			continue;
		if(!val)
			val = 0;
		rows.push(val);
		if(!chairs[i] || chairs[i].length != val) {
			chairs[i] = [];
			for(var j = 0; j < val; j ++) {
				chairs[i][j] = { enabled: true, x: 0, y: 0, t: 0, label: false, fontSize: false, shape: "sqr" }; // Add "type"

			}
		}
		if(!stands[i] || stands[i].length != val * 2 - 1) {
			stands[i] = [];
			for(var j = 0; j < val * 2 - 1; j += 2) {
				stands[i][j] = { enabled: true, x: 0, y: 0 };
				if(j != val * 2 - 2)
					stands[i][j+1] = { enabled: false, x: 0, y: 0 };
			}
		}
	}
	podium = { enabled: true, x: 525, y: 470 };
	rows.reverse();
	showStands = $('#chkstands').prop('checked');
	console.log('showStands',showStands)
	setStraight(0); // Re-run "max straight rows" logic in case rows were removed
}


function syncCheckboxEnabledStates() {
    if ($('#chknumbers').prop('checked')) {
        $('#lblrestart').removeClass('disabled');
        $('#chkrestart').removeAttr('disabled');
    } else {
        $('#lblrestart').addClass('disabled');
        $('#chkrestart').attr('disabled', 'disabled').removeAttr('checked');
    }
    if ($('#chkrestart').attr('checked')) {
        $('#lblletters').removeClass('disabled');
        $('#chkletters').removeAttr('disabled');
    } else {
        $('#lblletters').addClass('disabled');
        $('#chkletters').attr('disabled', 'disabled').removeAttr('checked');
    }
}



function editLabels(row) {
	editingLabelRow = row - 1;
	$('#input_main').hide();
	$('#input_labels').show();
	$('#lblcustomrow').html(row);
	$('#txtlabels').val(labels[editingLabelRow] ? labels[editingLabelRow].join("\n") : "");
}

function setCustomLabels() {
	if ($('#txtlabels').val().trim() == "") {
		delete labels[editingLabelRow];
		delete customRowFontSizes[editingLabelRow];
	} else {
		labels[editingLabelRow] = $('#txtlabels').val().trim().replace(/\|/g, "").replace(/\r\n/g, "\n").replace("\r", "\n").split("\n");
		if(!customRowFontSizes[editingLabelRow])
			customRowFontSizes[editingLabelRow] = 0.7;
	}
	drawChart();
}

function updateChairLabels() {
	for(var row in rows) {
		var label = 0;
		for(var c in chairs[row]) {
			var chair = chairs[row][c];
			chair.fontSize = customRowFontSizes[row];
			if(labels[row]) {
				if (chair.enabled) {
					chair.label = labels[row][label] ? labels[row][label] : "";
					label++;
				} else {
					chair.label = false;
				};
			} else if (!chair.enabled){
				chair.label = false;
			}
		}
	}
}

function editLabelsDone() {
	$('#input_labels').hide();
	$('#input_main').show();
}

function addRow() {
	maxRows++;
	$('#rows').append("<p>Row &#9;&#9;" + maxRows + ": <input id='row" + maxRows + "' size='2' maxlength='2'></input> <a class='editlabellink' href='javascript:editLabels(" + maxRows + ")'>Edit labels</a></p>");
	$('#row' + maxRows).change(drawChart);
}

function reset() {
	$('input:text').not('#loadcode').val('');
	$('input:checkbox').removeAttr('checked');
	$('#chknumbers').attr('checked', 'checked');
	checkStands();
	chairs = [];
	stands = [];
	standCoordinates = [];
	rows = [];
	sections = {};
	labels = [];
	customRowFontSizes = [];
	customScale = 1;
	straightRows = 0;
	$('#scale').html('100');
	$('#straight').html('0');
	drawChart();
}

function setRestartCheckbox() {
	if($('#chknumbers').attr('checked')) {
		$('#lblrestart').removeClass('disabled');
		$('#chkrestart').removeAttr('disabled');
	} else {
		$('#lblrestart').addClass('disabled');
		$('#chkrestart').attr('disabled', 'disabled').removeAttr('checked')
	}
	setLetterCheckbox();
}

function setLetterCheckbox() {
	if($('#chkrestart').attr('checked')) {
		$('#lblletters').removeClass('disabled');
		$('#chkletters').removeAttr('disabled');
	} else {
		$('#lblletters').addClass('disabled');
		$('#chkletters').attr('disabled', 'disabled').removeAttr('checked')
	}
}

function checkStands() {
	if($('#chkstands').prop('checked')) {
		showStands = true;
		$('#helpstands').show();
	} else {
		showStands = false;
		$('#helpstands').hide();
	}	
	drawChart();
}

function checkPodium() {
	if($('#chkpodium').attr('checked')) {
		showPodium = true;
		$('#helppodium').show();
	} else {
		showPodium = false;
		$('#helppodium').hide();
	}	
	drawChart();
}


function setCustomScale(n) {
	customScale = Math.min(2, Math.max(0.5, (customScale + n).toFixed(1)));
	$('#scale').html(Math.round(customScale * 100));
}

function setStraight(n) {
	straightRows = Math.min(rows.length, Math.max(0, straightRows + n));
	$('#straight').html(straightRows);
}



function addSection() {
	const sectionName = $("#section-name-input").val().trim();
    if (sectionName === "") {
      //alert("Please enter a section name.");
      return;
    }
	if (sections[sectionName]) {alert("Section with this name already exists."); return;};

	sections[sectionName] = []
    var actionButtons = '<button class="edit-btn">Edit</button> ' +
                        '<button class="add-chairs-btn">Add Chairs</button> ' +
                        '<button class="delete-btn">Delete</button>';
    $("#sections-table tbody").append(
      `<tr>
        <td>${sectionName}</td>
        <td>${actionButtons}</td>
      </tr>`
    );
	//if (!sections[sectionName]) {sections[sectionName] = []}; 
	console.log('addSections sections', sections)
    $("#section-name-input").val(""); // Clear input box after adding
}

function addChairToSection(chair, sectionName) {
    // Assuming we have a structure to keep track of sections and their chairs
    // You need to define how you're storing sections and their related chairs
    // Example: Adding the chair to the section in a simple manner
	// also, you need to check for adjacency.
	const section = sections[sectionName];
	
	console.log('addChairToSection: ',"section from addChairToSection", section);
	
	// 1) check if chair already has a section
	// 2) check if chair exists in current section
	// 3) check adjacency
	// 4) now we can add the chair
	const chairIsUnassigned = chairSectionIsUnassigned(chair, sectionName)
	const chairExists = section.some(existingChair => existingChair === chair);
	const chairIsAdjacent = sectionChairIsAdjacent(chair, section);
	const sectionIsEmpty = section.length === 0;


	console.log('addChairToSection: ','chairIsUnassigned',chairIsUnassigned)
	console.log('addChairToSection: ','chairExists', chairExists)
	console.log('addChairToSection: ','chairIsAdjacent',chairIsAdjacent)

	//ADD CHAIR LOGIC: if 
    if (chairIsUnassigned && !chairExists && ( sectionIsEmpty || chairIsAdjacent )) {
        section.push(chair);
        chair.section = sectionName; // Assign or reassign the chair's section property.
		drawSection(section)
    } 
	//GET RID OF CHAIR if. it is in the section, and is adjacent 
	else if (chairExists && ( sectionIsEmpty || chairIsAdjacent )) {
        const sectionChairIndex = section.indexOf(chair);
		section.splice(sectionChairIndex, 1);
		chair.section = null;
		console.log('addChairToSection: ',"Chair already exists in this section.");
		drawSection(section);
    }
    // You might want to redraw or update the UI to reflect the chair being added to the section
	console.log('addChairToSection: ',"chair from addChairToSection", chair);

	console.log('addChairToSection: ','sections list', sections);
    
	//drawChart();
}

function chairSectionIsUnassigned(chair, section) {
	if (!!chair.section && chair.section != section) {
		console.log("This chair belongs to another section.")
	}
	return true
}


function sectionChairIsAdjacent(chair, section) {
	console.log('sectionChairIsAdjacent: ', 'section: ', section)
	// If the section is empty, allow adding the chair (or adjust logic as needed)
	if (section.length === 0) {
		return true; // Or return false, depending on whether you want to allow adding the first chair without adjacency requirements
	}


	const adjacentSectionRowIsEmpty = isAdjacentSectionRowEmpty(chair, section);

	console.log('adjacentSectionRowIsEmpty:', adjacentSectionRowIsEmpty)

	// Check if chair is the first/only chair to be placed in a new row
	const chairIsOnlyChairAssignedToRow = isOnlyChairAssignedToSectionRow(chair, section)

	
	/*
	const isOnlyOneAssignedToRow = !section.some(adjacentChair => {
		adjacentChair.row === chair.row;
	});
*/
	// Check if the chair is next to a chair on its right or left, but not both
	const chairIsAdjacentToOnlyOneChairFromRow = isAdjacentToOnlyOneChair(chair, section)

	/*
	const isAdjacentToOnlyOneChair = sections[section].some(adjacentChair => 
		adjacentChair.row === chair.row && Math.abs(adjacentChair.index - chair.index) === 1
	);
	*/

	console.log('isAdjacentToOnlyOneChair', chairIsAdjacentToOnlyOneChairFromRow);
	console.log('isOnlyChairAssignedToSectionRow', isOnlyChairAssignedToSectionRow(chair, section))
	//console.log('isAdjacentToSingleChair', isAdjacentToSingleChair(section,chair));

	if (chairIsAdjacentToOnlyOneChairFromRow) return true;
  
	// Check if the chair is adjacent to any chair in the adjacent rows
	const isInAdjacentRow = section.some(adjacentChair => {
		// Check if the adjacentChair is in the row directly above or below the chair
		const isRowAdjacent = Math.abs(adjacentChair.row - chair.row) === 1;
		console.log('adjacentChairRow', adjacentChair.row)
		console.log('chairRow', chair.row)

		console.log(isRowAdjacent)

		// Check spatial adjacency based on bounding boxes
		// console.log('adjacentChairRightTheta', adjacentChair.rightBoundTheta)
		// console.log('adjacentChairLeftTheta', adjacentChair.leftBoundTheta)
		// console.log('chair.rightBoundTheta', chair.rightBoundTheta)
		// console.log('chair.leftBoundTheta', chair.leftBoundTheta)
		// console.log(`chair.leftBoundTheta (${chair.leftBoundTheta}) >= (${adjacentChair.rightBoundTheta}) adjacentChair.rightBoundTheta`, chair.leftBoundTheta >= adjacentChair.rightBoundTheta)
		const isSpatiallyAdjacent = chair.leftBoundTheta >= adjacentChair.rightBoundTheta && chair.rightBoundTheta <= adjacentChair.leftBoundTheta;
	
		return isRowAdjacent && isSpatiallyAdjacent;
	});
	console.log('isAdjacent??',isInAdjacentRow, chairIsOnlyChairAssignedToRow, chairIsAdjacentToOnlyOneChairFromRow )
	if (isInAdjacentRow && (chairIsOnlyChairAssignedToRow || chairIsAdjacentToOnlyOneChairFromRow))  {
		return isInAdjacentRow;
	};

	/**
	 * THIS SHOULD RETURN TRUE IF:
	 * chair is the first one,
	 * chair is to the immediate right or left, but not of a chair in the section
	 * chair is immediately above or below a chair in the section
	 * 
	 * 
	 */
}

function isAdjacentSectionRowEmpty(chair, section) {
	console.log('isAdjacentSectionRowEmpty: ', 'section = ', section)
	const isAdjacentSectionRowEmpty = section.some(adjacentChair => adjacentChair.row === chair.row);
	console.log('isAdjacentSectionRowEmpty: ', 'isAdjacentSectionRowEmpty = ',isAdjacentSectionRowEmpty)
	return isAdjacentSectionRowEmpty === 0;
}

function isAdjacentToOnlyOneChair(chair, section) {
	// Count the number of adjacent chairs in the same row
	const adjacentChairCount = section.filter(adjacentChair => 
		adjacentChair.row === chair.row && Math.abs(adjacentChair.index - chair.index) === 1
	).length;
	
	// Return true if exactly one chair is adjacent, false otherwise
	return adjacentChairCount === 1;
};

// Check if chair is the first/only chair to be placed in a new row
function isOnlyChairAssignedToSectionRow(chair, section) {
	console.log('isOnlyChairAssignedToSectionRow: ', 'section: ',section)
	console.log('isOnlyChairAssignedToSectionRow: ', 'chair: ',chair)
	const chairsInRowCount = section.filter(adjacentChair => {
		console.log('isOnlyChairAssignedToSectionRow: ','adjacentChair.row: ',adjacentChair, adjacentChair.row)
		console.log('isOnlyChairAssignedToSectionRow: ','chair.row: ', chair.row)
		return adjacentChair.row === chair.row;
	});
	console.log('isOnlyChairAssignedToSectionRow: ','chairsInRowCount: ', chairsInRowCount)
	return chairsInRowCount.length === 0 || chairsInRowCount.length === 1
};



function save() {
	$('#bottommessage').show().html("<span style='color: green;'>Please wait...</span>");
	$.post('save.php?action=save', {code: encode()}, null, 'text')
		.done(function(data) {
			$('#bottommessage').html("<span style='color: green;'>Click <a href='" + data + "'>here</a> to save the chart data file to your computer.<br>When you return to this page later, you can open the file by clicking the Load Saved Chart button at the top of the page.</span>");
		})
		.fail(function() {
			$('#bottommessage').hide();
			generateCode = true;
			drawChart();
			$('#helpsave').show();
		});
}

function email() {
	$('#bottommessage').show().html("<span style='color: green;'>Please wait...</span>");
	$.post('save.php?action=email', {code: encode()}, null, 'text')
		.done(function(data) {
			$('#bottommessage').hide();
			var subject = $('#title').val() ? encodeURIComponent($('#title').val()) : "Seating Chart";
			window.location.href = "mailto:?to=&subject=" + subject + "&body=" + encodeURIComponent("Here is a link to a seating chart I made: ") + data + "";
		})
		.fail(function() {
			$('#bottommessage').html("<span style='color: red;'>Sorry, there was an error generating a link to this chart.</span>");
		});
}

function showCodeInput() {
	$('#loadcodecontainer').show();
	$('#loadcodelabel').hide();
}

function loadChartFile() {
	var file = $(this)[0].files[0];
	var reader = new FileReader();
	reader.onload = function() {
		loadChartFileText(this.result, true);
	};
	reader.readAsText($(this)[0].files[0]);
}

function loadChartFileText(text, isFile) {
	text = text.replace(/\r\n/g, "\n").replace("\r", "\n").trim();
	var start = text.indexOf("-- BEGIN CHART DATA --\n") + 23;
	var end = text.indexOf("\n-- END CHART DATA --");
	if(start > -1 && end > -1) {
		text = text.substring(start, end);
	} else if (text.indexOf("\n") > -1) {
		$('#loadmessage').show().html('<br>' + (isFile ? 'The selected file' : 'The entered code') + ' does not contain valid chart data');
		return;
	}
	$('#loadmessage').hide();
	decode(text);
}

function loadUrlCode() {
	if(window.urlcodeerr)
		$('#loadmessage').show().html('<br>' + urlcodeerr);
	else if(window.urlcode)
		decode(urlcode);
}

function encode() {
	var code = '';
	if($('#chknumbers').attr('checked') == null)
		code += 'H';
	if($('#chkrestart').attr('checked') != null) {
		code = 'N';
		if($('#chkletters').attr('checked') != null)
			code += 'L'
	}

	if(customScale != 1.0)
		code += 'P' + Math.round(customScale * 100);

	code += 'R'
	var i = 0;
	var n = 0;
	for(var row in rows) {
		var val = rows[row].toString(10);
		if(val.length == 1)
			val = '0' + val;
		code += val;
	}
	if(showStands) {
		code += 'S';
		for(var row in rows) {
			for(var s in stands[row]) {
				if(stands[row][s].enabled) {
					var mask = 1 << i;
					n |= mask;
				}
				i++;
				if(i == 31) {
					code += (n.toString(36) + '.');
					i = n = 0;
				}
			}
		}
		code += (n.toString(36) + '.');
		code = code.slice(0, -1);
	}
	var rowSentinal = false;
	var chairSentinal = false;
	for(var row in rows) {
		for(var c in chairs[row]) {
			// var chairSentinal = false;
			if(!chairs[row][c].enabled) {
				var rowval = row.toString(10);
				if(rowval.length == 1)
					rowval = '0' + rowval;
				var chairval = c.toString(10);
				if(chairval.length == 1)
					chairval = '0' + chairval;
				if(!rowSentinal) {
					rowSentinal = true;
					code += ',H';
				}
				code += rowval + chairval;
			}
			
			// Save Chair Shapes
/*			if(chairs[row][c].shape === 'sqr') {
				var rowval = row.toString(10);
				if(rowval.length == 1)
					rowval = '0' + rowval;
				var chairval = c.toString(10);
				if(chairval.length == 1)
					chairval = '0' + chairval;
				if(!chairSentinal) {
					chairSentinal = true;
					code += ',Q';
				}
				code += rowval + chairval;
			} else if (chairs[row][c].shape === 'circ') {
				var rowval = row.toString(10);
				if(rowval.length == 1)
					rowval = '0' + rowval;
				var chairval = c.toString(10);
				if(chairval.length == 1)
					chairval = '0' + chairval;
				if(!chairSentinal) {
					chairSentinal = true;
					code += ',O';
				}
				code += rowval + chairval;
			}
			*/
		}
	}
	if(straightRows > 0) {
		code += ',T' + straightRows;
	}
	code = code.toUpperCase();
	
	var labelCode = "";
	for(var label in labels) {
		if(labels[label] && labels[label].length > 0)
			labelCode += "||" + label + ":" + (Math.round(customRowFontSizes[label] * 100) / 100) + "|" + labels[label].join("|");
		else
			labelCode += "||";
	}
	labelCode = labelCode.substring(2);
	if($('#title').val().length > 0)
		code += "|||" + $('#title').val();
	else if(labelCode.length > 0)
		code += "|||";	
	if(labelCode.length > 0)
		code += "|||" + labelCode;
		
	return code;
}

function decode(code) {
	reset();
	var parts = code.split("|||");
	code = parts[0];
	
	// Simple checkboxes
	var matches = code.match(/^([^R]*)/);
	if(matches != null && matches.length > 1) {
		if(matches[1].indexOf('H') > -1)
			$('#chknumbers').removeAttr('checked');
		if(matches[1].indexOf('N') > -1) {
			$('#chkrestart').attr('checked', 'checked');
			setLetterCheckbox();
			if(matches[1].indexOf('L') > -1)
				$('#chkletters').attr('checked', 'checked');
		}
	}

	// Seat scale
	var matches = code.match(/P(\d+)/);
	if(matches != null && matches.length > 1) {
		customScale = +((parseInt(matches[1], 10) / 100).toFixed(1));
		$('#scale').html(Math.round(customScale * 100));
	}

	// Rows
	var matches = code.match(/R([\d\.]*)/);
	if(matches != null && matches.length > 1) {
		var loadRows = [];
		for(var i = 0; i < matches[1].length; i+= 2) {
			if(i / 2 > 7)
				addRow();
			var val = matches[1].substring(i, i+2);
			loadRows.push(parseInt(val, 10));
			$('#row' + (i/2+1)).val(val);
			chairs[i/2] = [];
			for(var j = 0; j < parseInt(val, 10); j++) {
				chairs[i/2][j] = { enabled: true, x: 0, y: 0, t: 0, label: false, fontSize: false, shape: "sqr" };
			}
		}
	}

	// Stands
	var matches = code.match(/S([^,]*)/);
	if(matches != null && matches.length > 1) {
		var standParts = matches[1].split('.');
		var i = 0;
		var standPart = 0;
		var n = parseInt(standParts[0], 36);
		stands = [];
		for(var row in loadRows) {
			stands[row] = [];
			var val = loadRows[row];
			for(var j = 0; j < val * 2 - 1; j++) {
				var mask = 1 << i;
				stands[row][j] = { enabled: (n & mask) != 0, x: 0, y: 0 };
				i++;
				if(i == 31) {
					i = 0;
					standPart++;
					n = parseInt(standParts[standPart], 36);
				}
			}
		}
		$('#chkstands').attr('checked', 'checked');
		checkStands();
	}

	// Hidden chairs
	var matches = code.match(/,H([^,]*)/);
	if(matches != null && matches.length > 1) {
		var hidden = matches[1];
		for(var i = 0; i < hidden.length; i += 4) {
			var row   = parseInt(hidden.substring(i  , i+2), 10);
			var chair = parseInt(hidden.substring(i+2, i+4), 10);
			chairs[row][chair].enabled = false;
		}
	}
	
	
	// Chair shapes
	var matches = code.match(/,Q([^,]*)/);
	if(matches != null && matches.length > 1) {
		var hidden = matches[1];
		for(var i = 0; i < hidden.length; i += 4) {
			var row   = parseInt(hidden.substring(i  , i+2), 10);
			var chair = parseInt(hidden.substring(i+2, i+4), 10);
			chairs[row][chair].shape = 'sqr';
		}
	}
	
	var matches = code.match(/,O([^,]*)/);
	if(matches != null && matches.length > 1) {
		var hidden = matches[1];
		for(var i = 0; i < hidden.length; i += 4) {
			var row   = parseInt(hidden.substring(i  , i+2), 10);
			var chair = parseInt(hidden.substring(i+2, i+4), 10);
			chairs[row][chair].shape = 'circ';
		}
	}
	
	// Straight rows
	var matches = code.match(/,T([^,]*)/);
	if(matches != null && matches.length > 1) {
		straightRows = parseInt(matches[1], 10);
	}
	
	// Chart title
	if(parts.length > 1)
		$('#title').val(parts[1]);
	
	// Custom labels
	if(parts.length > 2) {
		var rowLabels = parts[2].split("||");
		for(var row in rowLabels) {
			var rowParts = rowLabels[row].split("|");
			var rowNumber = parseInt(rowParts[0].split(":")[0], 10);
			var rowSize = parseFloat(rowParts[0].split(":")[1], 10);
			labels[rowNumber] = rowParts.slice(1);
			customRowFontSizes[rowNumber] = rowSize;
		}
	}
	
	drawChart();
}

function showHelp(highlight) {
	$('#help').show();
	if(highlight) {
		$('#' + highlight).css('background-color', 'yellow');
	}
}

function closeHelp() {
	$('#help').hide();
	$('#helpstyle *').css('background-color', '');
}