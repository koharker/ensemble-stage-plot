import './general.js';
import { Section } from './sections.js'; // Import Chair class if needed inside Section class

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
const sections = {};

var vcLoc = [];

$(function() {
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


	$('input').on('change', drawChart);
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
	$("#add-section-btn").on('click', addSection);
	
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
					drawStand(Math.max(r - step * 0.5, r - 35 * canvasScale * customScale), t, stands[row][i*2]);
					if(i != rows[row] - 1)
						drawStand(Math.max(r - step * 0.5, r - 35 * canvasScale * customScale), t - angle_step / 2, stands[row][i*2+1]);
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
	
	// maybe we want chair.draw()? ?

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
			$('canvas').drawChairText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * seatScale,
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
			$('canvas').drawChairText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * seatScale,
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
			$('canvas').drawChairText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * seatScale,
				x: x, y: y,
				text: chair.label === false ? a + n : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Inter, sans-serif'
			});
		} else if(chair.shape === "snare") {
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#000',
				strokeWidth: 2 * seatScale,
				width: 40 * seatScale, height: 10 * seatScale,
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
				width: 40 * seatScale - 4, height: 16 * seatScale + seatScale,
				rotate: -1 * t
			});
			$('canvas').drawEllipse({
				fillStyle: '#fff',
				strokeStyle: '#000',
				strokeWidth: 2 * seatScale,
				width: 40 * seatScale, height: 10 * seatScale,
				x: x - Math.sin(t) * 10 * seatScale, y: y - Math.cos(t) * 10 * seatScale,
				rotate: -1 * t
			});
			$('canvas').drawChairText({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 5 * seatScale,
				x: x, y: y,
				text: chair.label === false ? "SD" : chair.label,
				fontSize: fontSize + 'pt',
				fontFamily: 'Inter, sans-serif'
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
			$('canvas').drawRect({
				fillStyle: '#fff',
				strokeStyle: '#CCC',
				strokeWidth: 2 * seatScale,
				x: x, y: y,
				width: 40 * seatScale, height: 40 * seatScale,
				rotate: -1 * t
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
	chair.topBoundRadius = (row == rows.length - 1 || rows.length == 1) ? r + 55 * canvasScale : r + radiusStep / 2; //radiusStep/2 unless it's the top row or only row, then 55
	chair.bottomBoundRadius = row == 0 ? r - 55 * canvasScale : r - radiusStep / 2; //radiusStep/2 unless it's the bottom row, then 55
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
	console.log('setChairExtendedProperties: ', 'chair.row', row)
	console.log('setChairExtendedProperties: ', 'rows.length', rows.length - 1)
	console.log('setChairExtendedProperties: ', 'chair.topBoundRadius', chair.topBoundRadius)
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



/**
 * Draws the entire section on a canvas. This function clears the existing canvas, redraws the chart,
 * and then iterates over each row in the section to draw each chair using the drawSectionXY function.
 *
 * @param {Section} section - The section object within which to draw chairs. Expected to have a `rows`
 *                            property, mapping row numbers to arrays of chair objects.
 */
function drawSection(section) {
    $("canvas").clearCanvas();
    drawChart();
    
    // Iterate over each row in the section
    Object.values(section.rows).forEach(row => {
		drawSectionByRow(row, section)
        // For each row, iterate over each chair and draw it
        //row.forEach(chair => drawSectionXY(chair));
    });
}


function drawSectionByRow(row, section) {
	drawSectionRowSides(row, section);
	//drawSectionRowBottom(row, section);
	drawSectionRowTopAndBottom(row, section)
	//drawSectionRowTop();
}


function drawSectionRowSides(row, section) {
	//We don't know the length of the section edges, so pull a sample chair to find other variables we need.
	const chair = row.chairs[0];

	const thetaBounds = findRowThetaBounds(row.chairs);


	let sectionBorderWidthOffset = 1.25; //for a 5px stroke width
	let sectionBorderWidthRads = Math.asin(sectionBorderWidthOffset / chair.r) * 2
	let sectionOffsetRads = chair.angleStep / 2 - sectionBorderWidthRads; //rads for if you want side borders to be drawn INSIDE the section bounds
	const sideBorderVectorLength = chair.topBoundRadius - chair.bottomBoundRadius + (4 * sectionBorderWidthOffset)

	var borderLeftX = centerX - Math.sin(thetaBounds.maxLeftTheta - sectionBorderWidthRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset));
	var borderLeftY = centerY - Math.cos(thetaBounds.maxLeftTheta - sectionBorderWidthRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset));
	var borderRightX = centerX - Math.sin(thetaBounds.minRightTheta - sectionBorderWidthRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset));
	var borderRightY = centerY - Math.cos(thetaBounds.minRightTheta - sectionBorderWidthRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset));

	/*// use this if you want the section edge to be drawn right down the middle between two chairs.
	$('canvas').drawVector({
		strokeStyle: '#0A0',
		strokeWidth: 12,
		x: centerX - Math.sin(-leftBorderRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset)), y: centerY - Math.cos(-leftBorderRads) * (chair.bottomBoundRadius - (2* sectionBorderWidthOffset)),
		// start and end angles in degrees
		a1: leftBorderRads, l1: sideBorderVectorLength //(chair.radiusStep + (2 * sectionBorderWidthOffset)),
	});*/

	// use this if you want the section edge to be drawn on the inside edge of the border between 2 chairs.
	$('canvas').drawVector({
		strokeStyle: '#00A',
		strokeWidth: 10,
		x: borderLeftX, y: borderLeftY,
		// start and end angles in degrees
		a1: -thetaBounds.maxLeftTheta, l1: sideBorderVectorLength //(chair.radiusStep + (2 * sectionBorderWidthOffset)),
	});
	$('canvas').drawVector({
		strokeStyle: '#00A',
		strokeWidth: 10,
		x: borderRightX, y: borderRightY,
		// start and end angles in degrees
		a1: -thetaBounds.minRightTheta, l1: sideBorderVectorLength,
	});

}





function drawSectionRowTopAndBottom(row, section) {
	//Pull a sample chair to find other variables we need.
	const chair = row.chairs[0];
	// Adjust the row numbers to match the bottom-to-top drawing order
	const aboveRowNumber = +chair.row + 1;
	const belowRowNumber = +chair.row - 1;
	
	// Check if these rows are empty or do not exist
	const aboveRowIsEmpty = !section.rows[aboveRowNumber] || section.rows[aboveRowNumber]?.chairs.length === 0;
	const belowRowIsEmpty = !section.rows[belowRowNumber] || section.rows[belowRowNumber]?.chairs.length === 0;
	

	const aboveRow = section.rows[+chair.row + 1] || {};
	const currentRow = section.rows[+chair.row];
	const belowRow = section.rows[+chair.row - 1] || {};

	const aboveRowThetaBounds = findRowThetaBounds(aboveRow?.chairs || []);
	const currentRowThetaBounds = findRowThetaBounds(currentRow.chairs);
	const belowRowThetaBounds = findRowThetaBounds(belowRow?.chairs || []);

	const segments = [];
	
	const segment = {
		startTheta: currentRowThetaBounds.maxLeftTheta,
		stopTheta: currentRowThetaBounds.minRightTheta,
		radius: chair.bottomBoundRadius
	}

	//If the row is the top row of the section (meaning that there is no row above it), draw a line across the whole thing.
	if (aboveRowIsEmpty) {
		const newSegment = Object.create(segment)
		newSegment.radius = chair.topBoundRadius
		segments.push(newSegment); // Insert the new segment
	}

	console.log('drawSectionRowTopAndBottom: ', 'belowRowThetaBounds = ', belowRowThetaBounds);
	console.log('drawSectionRowTopAndBottom: ', 'currentRowThetaBounds = ', currentRowThetaBounds);
	console.log('drawSectionRowTopAndBottom: ', 'b.lt = ', belowRowThetaBounds.maxLeftTheta);
	console.log('drawSectionRowTopAndBottom: ', 'c.rt = ', currentRowThetaBounds.minRightTheta);
	console.log('drawSectionRowTopAndBottom: ', 'b.lt > c.rt = ', belowRowThetaBounds.maxLeftTheta > currentRowThetaBounds.minRightTheta);

	if (!belowRowIsEmpty) {
		if (belowRowThetaBounds.maxLeftTheta > currentRowThetaBounds.minRightTheta) {
			console.log('drawSectionRowTopAndBottom: ', 'math.max(b.lt, c.lt) = ', Math.max(belowRowThetaBounds.maxLeftTheta, currentRowThetaBounds.maxLeftTheta));
			const newSegment = {
				radius: chair.bottomBoundRadius,
				startTheta: Math.max(belowRowThetaBounds.maxLeftTheta, currentRowThetaBounds.maxLeftTheta),
				stopTheta: Math.min(belowRowThetaBounds.maxLeftTheta, currentRowThetaBounds.maxLeftTheta)
			}
			segments.push(newSegment); // Insert the new segment
		}

		if (belowRowThetaBounds.minRightTheta < currentRowThetaBounds.maxLeftTheta) {
			const newSegment = {
				radius: chair.bottomBoundRadius,
				startTheta: Math.max(belowRowThetaBounds.minRightTheta, currentRowThetaBounds.minRightTheta),
				stopTheta: Math.min(belowRowThetaBounds.minRightTheta, currentRowThetaBounds.minRightTheta)
			}
			segments.push(newSegment); // Insert the new segment
		}
	}

	if (belowRowIsEmpty) {
		segments.push(segment); // Insert the whole bottom segment
	}

	console.log('drawSectionRowTopAndBottom: ', 'segments = ', segments);


	segments.forEach(segment => {
		
		$('canvas').drawArc({
			strokeStyle: '#A0A',
			strokeWidth: 10,
			x: centerX, y: centerY,
			radius: segment.radius, //chair.r - 40 * seatScale,
			// start and end angles in degrees
			start: -segment.startTheta , end: -segment.stopTheta
		});
	})
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
					//chair.section = !chair.section ? currentSection : null;

					//!!! maybe this needs to be drawSections()...
					const section = sections[currentSection]; //add this after you fix logic in addChairToSection to support Section objects

					addChairToSection(chair, section);
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
	ensemble = {
		chairs: [],
		rows: [],
		stands: [],
		labels: [],
		customRowFontSizes: [],
		sections: {},
		settings: {
			letterRows: false,
			restartNumbering: false,
		}
	}
	chairs = [];
	stands = [];
	standCoordinates = [];
	rows = [];
	resetObject(sections)
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
	sections[sectionName] = new Section(sectionName);
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


////////////////////////////////////////////////////////////////////////////////

function addChairToSection(chair, section) {	
	// 1) check if chair already has a section
	// 2) check if chair exists in current section
	// 3) check adjacency
	// 4) now we can add the chair
	const chairIsUnassigned = isChairUnassignedOrInSection(chair, section)
	const chairAlreadyExistsInSection = doesChairExistInSection(chair, section)
	const sectionIsEmpty = section.isEmpty()
	  
	const chairIsAdjacent = sectionChairIsAdjacent(chair, section);
	const chairIsOnlyChairAssignedToRow = isOnlyChairAssignedToSectionRow(chair, section)

	const chairDisruptsVerticalContinuityOnRemoval = !sectionIsEmpty && !chairIsOnlyChairAssignedToRow ? disruptsVerticalContinuityOnRemoval(chair, section) : false;

	//const chairExists = section.some(existingChair => existingChair === chair); //Where 'section' is an Array
	//const sectionIsEmpty = section.length === 0; //Where 'section' is an Array
	console.log('addChairToSection: ','chairIsUnassigned',chairIsUnassigned)
	console.log('addChairToSection: ','sectionIsEmpty',sectionIsEmpty)
	console.log('addChairToSection: ','chairAlreadyExistsInSection', chairAlreadyExistsInSection)

	console.log('addChairToSection: ','chairIsAdjacent',chairIsAdjacent)

	//ADD CHAIR LOGIC: if 
    if (chairIsUnassigned && !chairAlreadyExistsInSection && ( sectionIsEmpty || chairIsAdjacent )) {
        //section.push(chair);
		section.addChair(chair)
        chair.section = section.name; // Assign or reassign the chair's section property.
		drawSection(section)
    }
	//GET RID OF CHAIR if. it is in the section, and is adjacent 
	else if (chairAlreadyExistsInSection && ( sectionIsEmpty || chairIsAdjacent ) && !chairDisruptsVerticalContinuityOnRemoval) {
		disruptsVerticalContinuityOnRemoval(chair, section);
		console.log("ajo;ishjgpfoihwIHPOGAIW disruptsVerticalContinuityOnRemoval(chair, section);", chairDisruptsVerticalContinuityOnRemoval)
        //const sectionChairIndex = section.indexOf(chair);
		//section.splice(sectionChairIndex, 1);
		section.removeChair(chair)
		chair.section = null;
		console.log('addChairToSection: ',"Chair already exists in this section.");
		drawSection(section);
    }
    // You might want to redraw or update the UI to reflect the chair being added to the section
	console.log('addChairToSection: ',"chair from addChairToSection", chair);

	console.log('addChairToSection: ','sections list', sections);
    
	//drawChart();
}



/**
 * Checks if a chair is either not assigned to any section or is already assigned to the specified section.
 * This is useful for ensuring that a chair is not mistakenly assigned to multiple sections or to verify
 * the chair's current assignment status relative to a specific section.
 *
 * @param {Object} chair - The chair object to check, expected to have a `section` property that indicates
 *                         the name of the section it is currently assigned to, if any.
 * @param {Section} section - The section object or structure against which to check the chair's assignment.
 *                            This object must have a `name` property to identify the section.
 * @returns {boolean} Returns `true` if the chair is unassigned or if it belongs to the specified section,
 *                    based on a comparison of the chair's `section` property and the section's `name`.
 *                    If the chair is assigned to a different section, it logs a message and returns `false`.
 */
function isChairUnassignedOrInSection(chair, section) {
	if (!!chair.section && chair.section != section.name) {
		console.log("This chair belongs to another section.")
		return false;
	}
	return true
}


/**
 * Checks if a specific chair object exists within any row of a given section.
 * Iterates through each row in the section's `rows` property and checks each chair
 * to see if it matches the specified `chair` object.
 * 
 * @param {Object} chair - The chair object to search for.
 * @param {Section} section - The section object to search within. The section should
 *                            have a `rows` property where each key is a row number and
 *                            its value is an array of chair objects.
 * @returns {boolean} Returns `true` if the specified chair object is found within any
 *                    of the rows in the given section. Otherwise, returns `false`.
 */
function doesChairExistInSection(chair, section) {
	for (let rowKey in section.rows) {
		let row = section.rows[rowKey]; // Access the array of chairs for this row
		for (let existingChair of row.chairs) { // Use of 'for...of' to iterate over array elements
			if (existingChair === chair) {
				return true; // The exact chair object was found
			}
		}
	}
	return false; // The chair object was not found
}




function sectionChairIsAdjacent(chair, section) {

	const adjacentSectionRowIsEmpty = isAdjacentSectionRowEmpty(chair, section);

	console.log('adjacentSectionRowIsEmpty:', adjacentSectionRowIsEmpty)

	// Check if chair is the first/only chair to be placed in a new row
	const chairIsOnlyChairAssignedToRow = isOnlyChairAssignedToSectionRow(chair, section)

	const chairIsLastRemainingChairAssignedToRow = isLastRemainingChairAssignedToRow(chair, section)
	if (chairIsLastRemainingChairAssignedToRow && section.length !== 1) return true;
  

	// Check if the chair is next to a chair on its right or left, but not both
	const chairIsAdjacentToOnlyOneChairFromRow = isAdjacentToOnlyOneChair(chair, section)



	console.log('isAdjacentToOnlyOneChair', chairIsAdjacentToOnlyOneChairFromRow);
	console.log('isOnlyChairAssignedToSectionRow', isOnlyChairAssignedToSectionRow(chair, section))
	//console.log('isAdjacentToSingleChair', isAdjacentToSingleChair(section,chair));

	if (chairIsAdjacentToOnlyOneChairFromRow) return true;
  
	const chairIsInAdjacentRow = isInAdjacentRow(chair, section);
	// Check if the chair is adjacent to any chair in the adjacent rows


	console.log('isAdjacent??',chairIsInAdjacentRow, chairIsOnlyChairAssignedToRow, chairIsAdjacentToOnlyOneChairFromRow )
	if (chairIsInAdjacentRow && (chairIsOnlyChairAssignedToRow || chairIsAdjacentToOnlyOneChairFromRow))  {
		return chairIsInAdjacentRow;
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





/**
 * Checks if the row immediately adjacent (either above or below) to the specified chair's row
 * within a given section is empty, considering that rows are drawn from bottom to top on the canvas.
 * An adjacent row is considered empty if it either does not exist or contains no chairs.
 *
 * @param {Object} chair - The chair object, expected to have a `row` property indicating its row number.
 * @param {Section} section - The section object within which to check for adjacent rows. The section
 *                            is expected to have a `rows` property, where each key is a row number
 *                            and its value is an array of chair objects in that row.
 * @returns {boolean} Returns `true` if either the row immediately above (considering the bottom-to-top drawing order)
 *                    or below the chair's row is empty or does not exist. Otherwise, returns `false`.
 */
function isAdjacentSectionRowEmpty(chair, section) {
	console.log('isAdjacentSectionRowEmpty: ', 'section = ', section);
  
	// Adjust the row numbers to match the bottom-to-top drawing order
	const aboveRowNumber = +chair.row + 1;
	const belowRowNumber = +chair.row - 1;
  
	// Check if these rows are empty or do not exist
	const isAboveRowEmpty = !section.rows[aboveRowNumber] || section.rows[aboveRowNumber]?.chairs.length === 0;
	const isBelowRowEmpty = !section.rows[belowRowNumber] || section.rows[belowRowNumber]?.chairs.length === 0;
  
	console.log('isAdjacentSectionRowEmpty: ', 'isAboveRowEmpty = ', isAboveRowEmpty, 'isBelowRowEmpty = ', isBelowRowEmpty);
  
	// If either adjacent row is empty, return true
	return isAboveRowEmpty || isBelowRowEmpty;
  }

  

/**
 * Checks if a given chair is immediately adjacent to exactly one other chair within the same row
 * of the section, either to its left or right, but not both. This function assumes that each chair
 * within a row has a unique index property that determines its position within the row.
 *
 * @param {Object} chair - The chair object to check. Expected to have `row` and `index` properties,
 *                         where `row` indicates the row number the chair is in, and `index` indicates
 *                         its position within the row.
 * @param {Section} section - The section object within which to check for adjacency. Expected to have
 *                            a `rows` property, where each key is a row number and its value is an array
 *                            of chair objects within that row.
 * @returns {boolean} Returns `true` if the chair is immediately adjacent to exactly one other chair
 *                    within the same row, either to its left or right. Returns `false` otherwise.
 */
function isAdjacentToOnlyOneChair(chair, section) {
    console.log('isAdjacentToOnlyOneChair: ', 'section: ', section);
    console.log('isAdjacentToOnlyOneChair: ', 'chair: ', chair);

    // Get the array of chairs in the specified row; if the row doesn't exist, treat it as an empty array
    const chairsInRow = section.rows[chair.row]?.chairs || [];

    // Count the number of chairs immediately adjacent to the given chair in the same row
    const adjacentChairCount = chairsInRow.filter(adjacentChair => 
        Math.abs(adjacentChair.index - chair.index) === 1
    ).length;

    // Return true if exactly one chair is adjacent, false otherwise
    return adjacentChairCount === 1;
}





/**
 * Checks if a chair is the first/only chair assigned to its row within a given section. This function is
 * useful for determining if adding a chair to a row would make it the initial chair in that row, indicating
 * the row was previously empty.
 *
 * @param {Object} chair - The chair object to check, expected to have a `row` property indicating its row number.
 * @param {Section} section - The section object within which to check the chair's row. The section is expected
 *                            to have a `rows` property, where each key is a row number and its value is an
 *                            array of chair objects assigned to that row.
 * @returns {boolean} Returns `true` if the chair's row is currently empty (meaning the chair will be the first
 *                    and only chair in that row). Returns `false` if the row already contains one or more chairs.
 */
function isOnlyChairAssignedToSectionRow(chair, section) {
  console.log('isOnlyChairAssignedToSectionRow: ', 'section: ', section);
  console.log('isOnlyChairAssignedToSectionRow: ', 'chair: ', chair);

  // Get the array of chairs in the specified row; if the row doesn't exist, treat it as an empty array
  const chairsInRow = section.rows[chair.row]?.chairs || [];

  console.log('isOnlyChairAssignedToSectionRow: ', 'chairsInRow: ', chairsInRow);

  // Since we're checking if the row is currently empty, we expect no chairs to be in it yet
  return chairsInRow.length === 0;
}




/**
 * Determines if the specified chair is the last remaining chair assigned to its row
 * within a given section. This function is useful for scenarios where you need to
 * check if removing a chair would leave a row empty, indicating special handling might
 * be required for the last chair in a row.
 *
 * @param {Object} chair - The chair object to check. The chair object must have a `row`
 *                         property that indicates the row it is assigned to.
 * @param {Section} section - The section object within which to check for the chair.
 *                            The section must have a `rows` property, where each key is
 *                            a row number and its value is an array of chair objects assigned
 *                            to that row.
 * @returns {boolean} Returns `true` if the specified chair is the only chair in its row
 *                    within the section. Returns `false` if there are other chairs in the
 *                    row or if the chair is not found in the specified row.
 */
function isLastRemainingChairAssignedToRow(chair, section) {
	console.log('isLastRemainingChairAssignedToRow: ', 'section: ', section);
	console.log('isLastRemainingChairAssignedToRow: ', 'chair: ', chair);
  
	const chairsInSameRow = section.rows[chair.row]?.chairs || [];
  
	console.log('chairsInSameRow: ', chairsInSameRow);
  
	if (chairsInSameRow.length === 1 && chairsInSameRow.includes(chair)) {
	  	console.log('This is the last remaining chair in the row.');
	  	return true;
	}
  
	console.log('This is not the last remaining chair in the row.');
	return false;
}
  
  


/**
 * Checks if a chair is in a row adjacent (either directly above or below) to any chair in the section
 * and spatially adjacent based on their bounding box properties. Spatial adjacency is determined by
 * comparing the left and right bounding angles (theta) of the chairs.
 *
 * @param {Object} chair - The chair object to check. Expected to have `row`, `leftBoundTheta`,
 *                         and `rightBoundTheta` properties.
 * @param {Section} section - The section object within which to check for adjacent chairs.
 *                            Expected to have a `rows` property, mapping row numbers to arrays of chair objects.
 * @returns {boolean} Returns `true` if the chair is both in an adjacent row and spatially adjacent to
 *                    at least one chair in the section. Returns `false` otherwise.
 */
function isInAdjacentRow(chair, section) {
    // Determine the row numbers immediately above and below the chair's row
    const aboveRowNumber = +chair.row + 1;
    const belowRowNumber = +chair.row - 1;

	console.log('isInAdjacentRow: ', 'section = ', section)
	console.log('isInAdjacentRow: ', 'chair.row = ', chair.row)
	console.log('isInAdjacentRow: ', 'aboveRowNumber = ', aboveRowNumber)
	console.log('isInAdjacentRow: ', 'section.rows[aboveRowNumber] = ', section.rows[aboveRowNumber])
	console.log('isInAdjacentRow: ', 'section.rows[belowRowNumber] = ', section.rows[belowRowNumber])
    // Combine chairs from both adjacent rows into a single array for checking
    const chairsInAdjacentRows = (section.rows[aboveRowNumber]?.chairs || []).concat(section.rows[belowRowNumber]?.chairs || []);

	console.log('isInAdjacentRow: ', 'chairsInAdjacentRows = ', chairsInAdjacentRows)
    // Check if any chair in the adjacent rows is spatially adjacent to the given chair
    return chairsInAdjacentRows.some(adjacentChair => {
        // Log the rows for debugging
        console.log('adjacentChairRow', adjacentChair.row);
        console.log('chairRow', chair.row);

        // Check spatial adjacency based on bounding boxes
        const isSpatiallyAdjacent = chair.leftBoundTheta >= adjacentChair.rightBoundTheta && chair.rightBoundTheta <= adjacentChair.leftBoundTheta;

        console.log('SpatiallyAdjacent', isSpatiallyAdjacent);

        return isSpatiallyAdjacent;
    });
}





function sectionChairBridgesGap(chair, section) {
	const sectionChairsByRow = organizeSectionChairsIntoArray(section);
	
	if (chair.row ) {}
}

function isBetweenTwoChairsAboveAndBelow(chair, section) {}
function isLastChairBetweenTwoRows(chair, section) { }

function isLastChairConnectingTwoRows(chair, section) {

}



/**
 * Checks if the specified chair's removal would disrupt vertical continuity between its row
 * and adjacent rows. A chair is considered critical for vertical continuity if it's the only chair
 * in its row that is within specific theta bounds of chairs in the adjacent rows above or below,
 * indicating a vertical spatial connection.
 *
 * @param {Object} chair - The chair to assess for vertical continuity impact. Expected to have
 *                         properties indicating its row and theta bounds.
 * @param {Section} section - The section from which the chair might be removed. Expected to have
 *                            a `rows` property, mapping row numbers to arrays of chair objects,
 *                            each with theta bounds.
 * @returns {boolean} Returns `true` if removing the chair disrupts vertical continuity with
 *                    adjacent rows, false otherwise.
 */
function disruptsVerticalContinuityOnRemoval(chair, section) {
    // Adjacent rows to consider
    const aboveRow = section.rows[+chair.row + 1] || [];
	const currentRow = section.rows[+chair.row];
    const belowRow = section.rows[+chair.row - 1] || [];

	const aboveRowThetaBounds = findRowThetaBounds(aboveRow?.chairs || []);
	const currentRowThetaBounds = findRowThetaBounds(currentRow.chairs);
	const belowRowThetaBounds = findRowThetaBounds(belowRow?.chairs || []);

	console.log('checkVerticalConnectivity: ', 'aboveRowThetaBounds = ', aboveRowThetaBounds)


    // Function to determine if a chair in the current row has a vertical connection
    // to any chair in a specified adjacent row.
    const hasVerticalConnection = (currentRowThetaBounds, adjacentRowThetaBounds) => {
		// Check if the adjacent row exists
		if (adjacentRowThetaBounds.maxLeftTheta === null || adjacentRowThetaBounds.minRightTheta === null) {
			return false; // No vertical connection if the adjacent row does not exist
		}
		return currentRowThetaBounds.maxLeftTheta >= adjacentRowThetaBounds.minRightTheta &&
			   currentRowThetaBounds.minRightTheta <= adjacentRowThetaBounds.maxLeftTheta;
    };

    // Check for vertical connections before removing the chair
    const isConnectedAbove = hasVerticalConnection(currentRowThetaBounds, aboveRowThetaBounds);
    const isConnectedBelow = hasVerticalConnection(currentRowThetaBounds, belowRowThetaBounds);

    // Remove the chair temporarily to see if vertical continuity is broken
    const tempRow = currentRow.chairs.filter(c => c !== chair);
	const tempRowThetaBounds = findRowThetaBounds(tempRow) || {maxLeftTheta: 0, minRightTheta: 0}

    const isConnectedAboveAfterRemoval = hasVerticalConnection(tempRowThetaBounds, aboveRowThetaBounds);
    const isConnectedBelowAfterRemoval = hasVerticalConnection(tempRowThetaBounds, belowRowThetaBounds);

	console.log('checkVerticalConnectivity: ', 'isConnectedAbove && !isConnectedAboveAfterRemoval', isConnectedAbove ,'&&', !isConnectedAboveAfterRemoval)
	console.log('checkVerticalConnectivity: ', 'isConnectedAbove && !isConnectedAboveAfterRemoval', isConnectedAbove && !isConnectedAboveAfterRemoval)


	/** if the last remaining chair is in the top row and it is connected below, 
	 * or if the last remaining chair is in the bottom row, and it is connected above, 
	 * then it does NOT disruptVerticalConnection.
	 */
	if (isLastRemainingChairAssignedToRow(chair, section) && ((!isConnectedAbove && isConnectedBelow) || (!isConnectedBelow && isConnectedAbove))) {return false}

	// if it's the last remaining and it is connected above AND below, then it DOES disruptVerticalConnection
	if (isLastRemainingChairAssignedToRow(chair, section) && isConnectedAbove && isConnectedBelow) {return true}

    // Assess the impact of chair removal on vertical continuity
    return (isConnectedAbove && !isConnectedAboveAfterRemoval) || (isConnectedBelow && !isConnectedBelowAfterRemoval);
}




/**
 * Finds the maximum leftBoundTheta and minimum rightBoundTheta for all chairs in a given row.
 * This helps determine the critical bounds for assessing continuity and adjacency within the row.
 *
 * @param {Object[]} chairsInRow - An array of chair objects within a specific row. Each chair object
 *                                 is expected to have `leftBoundTheta` and `rightBoundTheta` properties.
 * @returns {{maxLeftTheta: number, minRightTheta: number}} An object containing the maximum leftBoundTheta
 *                                                          and minimum rightBoundTheta found among all chairs
 *                                                          in the row.
 */
function findRowThetaBounds(chairsInRow) {
    if (chairsInRow.length === 0) {
        // Return a default or indicative value when there are no chairs in the row
        return { maxLeftTheta: null, minRightTheta: null };
    }

    // Initialize max and min with the first chair's theta values
    let maxLeftTheta = chairsInRow[0].leftBoundTheta;
    let minRightTheta = chairsInRow[0].rightBoundTheta;

    // Iterate over each chair to find the max left theta and min right theta bounds
    chairsInRow.forEach(chair => {
        if (chair.leftBoundTheta > maxLeftTheta) {
            maxLeftTheta = chair.leftBoundTheta;
        }
        if (chair.rightBoundTheta < minRightTheta) {
            minRightTheta = chair.rightBoundTheta;
        }
    });

    return { maxLeftTheta, minRightTheta };
}






///////////////////////////////////////////////////////////////////


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






// Draws chair Text on canvas
$.fn.drawChairText = function drawChairText(args) {
	$('canvas').drawText({
		fillStyle: args.strokeStyle,
		strokeStyle: args.strokeStyle,
		strokeWidth: args.strokeWidth,
		x: args.x, y: args.y,
		text: args.text,
		fontSize: args.fontSize,
		fontFamily: args.fontFamily
	});
	$('canvas').drawText({
		fillStyle: args.fillStyle,
		strokeStyle: args.fillStyle,
		strokeWidth: 0,
		x: args.x, y: args.y,
		text: args.text,
		fontSize: args.fontSize,
		fontFamily: args.fontFamily
	});
}



function resetObject(object) {
    // Loop through all properties of the object and delete them
    for (const prop in object) {
        if (object.hasOwnProperty(prop)) {
        delete object[prop];
        }
    }
}