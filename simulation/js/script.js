//program variables
//controls section
var simstatus = 0;
var rotstatus = 1;
//comments section
var commenttext = "Some Text";
var commentloc = 0;
//computing section
var trans = new point(100, 250);

var o = new point(0, 0, "");
var a = new point(0, 0, "");
var b = new point(0, 0, "");
//var d= new point(0,0,"D");

var theta2 = 40; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
var phi = 0; // All angles in Degrees. (mention the specification in the script like here)
var omega2 = 1.5; // angular velocity in rad/s
//var omega3=0, omega4=0;

var r = 0,
  l = 0,
  offset = 0;
var flaggrashof = true;
//graphics section
var canvas;
var ctx;
//timing section
var simTimeId = setInterval("", "1000");
var pauseTime = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
//click status of legend and quick reference
var legendCS = false;
var quickrefCS = false;
//temporary or dummy variables
var temp = 0,
  t1 = 0,
  t2 = 0;
var toffset = 0;
/*
// for trials during development
function trythis()
{ 		alert();}
*/

//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss() {
  $(".variable").css("padding-top", "20px");

  //$('#legend').css("width",document.getElementById('legendimg').width+"px");
  //$('#quickref').css("height",document.getElementById('quickrefimg').height+"px");
}

//start of simulation here; starts the timer with increments of 0.1 seconds
function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#theta2spinner").spinner("value", theta2); //to set simulation parameters on pause
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
    document.querySelector(".playPause").textContent = "Pause";
  }
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}

//Initialise system parameters here
function varinit() {
  varchange();

  //Variable r2 slider and number input types
  $("#r2slider").slider("value", 40);
  $("#r2spinner").spinner("value", 40);
  //Variable r3 slider and number input types
  $("#r3slider").slider("value", 100);
  $("#r3spinner").spinner("value", 100);

  //Variable theta2 slider and number input types
  $("#theta2slider").slider("value", 40);
  $("#theta2spinner").spinner("value", 40);
  //Variable omega2 slider and number input types
  $("#omega2slider").slider("value", 1);
  $("#omega2spinner").spinner("value", 1);
  //Variable omega2 slider and number input types
  $("#offsetslider").slider("value", 40);
  $("#offsetspinner").spinner("value", 40);
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange() {
  //Variable r2 slider and number input types
  $("#r2slider").slider({ max: 46, min: 20, step: 2 }); // slider initialisation : jQuery widget
  $("#r2spinner").spinner({ max: 46, min: 20, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#r2slider").on("slide", function (e, ui) {
    $("#r2spinner").spinner("value", ui.value);
    updateR3Limits(ui.value, false);
    ptx = [];
    pty = [];
  });
  $("#r2spinner").on("spin", function (e, ui) {
    $("#r2slider").slider("value", ui.value);
    updateR3Limits(ui.value, false);
    ptx = [];
    pty = [];
  });
  $("#r2spinner").on("change", function () {
    updateR3Limits($("#r2spinner").spinner("value"), false);
    varchange();
  });

  //Variable r3 slider and number input types
  $("#r3slider").slider({ max: 240, min: 80, step: 2 }); // slider initialisation : jQuery widget
  $("#r3spinner").spinner({ max: 240, min: 80, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#r3slider").on("slide", function (e, ui) {
    $("#r3spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r3spinner").on("spin", function (e, ui) {
    $("#r3slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r3spinner").on("change", function () {
    varchange();
  });

  //Variable theta2 slider and number input types
  $("#theta2slider").slider({ max: 360, min: 0, step: 2 }); // slider initialisation : jQuery widget
  $("#theta2spinner").spinner({ max: 360, min: 0, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#theta2slider").on("slide", function (e, ui) {
    $("#theta2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#theta2spinner").on("spin", function (e, ui) {
    $("#theta2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#theta2spinner").on("change", function () {
    varchange();
  });

  //Variable omega2 slider and number input types
  $("#omega2slider").slider({ max: 1.8, min: 0.2, step: 0.2 }); // slider initialisation : jQuery widget
  $("#omega2spinner").spinner({ max: 1.8, min: 0.2, step: 0.2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#omega2slider").on("slide", function (e, ui) {
    $("#omega2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("spin", function (e, ui) {
    $("#omega2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("change", function () {
    varchange();
  });

  //Variable offset slider and number input types
  $("#offsetslider").slider({ max: 100, min: 0, step: 5 }); // slider initialisation : jQuery widget
  $("#offsetspinner").spinner({ max: 100, min: 0, step: 5 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#offsetslider").on("slide", function (e, ui) {
    $("#offsetspinner").spinner("value", ui.value);
    // updateR3Limits(ui.value, false);
    // updateR3Limits(l, false);
    ptx = [];
    pty = [];
  });
  $("#offsetspinner").on("spin", function (e, ui) {
    $("#offsetslider").slider("value", ui.value);
    // updateR3Limits(ui.value, false);
    // updateR3Limits(l, false);
    ptx = [];
    pty = [];
  });
  $("#offsetspinner").on("change", function () {
    // updateR3Limits($("#r3spinner").spinner("value"), false);
    // updateR3Limits(l, false);
    varchange();
  });
  varupdate();
}

//Computing of various system parameters
function varupdate() {
  $("#r2slider").slider("value", $("#r2spinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#r3slider").slider("value", $("#r3spinner").spinner("value"));
  $("#offsetslider").slider("value", $("#offsetspinner").spinner("value"));
  $("#theta2slider").slider("value", $("#theta2spinner").spinner("value"));

  r = $("#r2spinner").spinner("value");
  l = $("#r3spinner").spinner("value");
  // r = $("#r2spinner").spinner("value");
  // l = $("#r3spinner").spinner("value");
  updateR3Limits(r, true);

  offset = $("#offsetspinner").spinner("value");
  // updateR3Limits(l, false);
  $("#omega2set").hide();
  $("#r3slider").slider({ max: 6 * $("#r2slider").slider("value") });
  $("#r3slider").slider({ min: 2.5 * $("#r2slider").slider("value") });
  $("#r3spinner").spinner({ max: 6 * $("#r2slider").slider("value") });
  $("#r3spinner").spinner({ min: 2.5 * $("#r2slider").slider("value") });
  $("#offsetspinner").spinner({
    max: $("#r3slider").slider("value") - $("#r2slider").slider("value") - 5,
  });
  $("#offsetslider").slider({
    max: $("#r3slider").slider("value") - $("#r2slider").slider("value") - 5,
  });

  if (!simstatus) {
    $("#theta2slider").slider("disable");
    $("#theta2spinner").spinner("disable");
    //omega2=$('#omega2spinner').spinner("value");
    printcomment("", 2);
    theta2 = theta2 + rotstatus * 0.1 * deg(omega2);
    theta2 = theta2 % 360;
  }
  if (simstatus) {
    $("#theta2slider").slider("enable");
    $("#theta2spinner").spinner("enable");
    /*$('#omega2slider').slider("disable"); 
$('#omega2spinner').spinner("disable"); */
    theta2 = $("#theta2spinner").spinner("value");
    printcomment(
      "Crank at " +
        theta2 +
        "&deg; <br>Position of slider from Crank Center = " +
        roundd(b.xcoord - o.xcoord, 2) +
        "cm",
      2
    );
  }
  phi = deg(Math.asin((offset - r * Math.sin(rad(theta2))) / l));
  o.xcoord = 0;
  o.ycoord = 0;
  a.xcoord = o.xcoord + r * Math.cos(rad(theta2));
  a.ycoord = o.ycoord + r * Math.sin(rad(theta2));
  b.xcoord = a.xcoord + l * Math.cos(rad(phi));
  b.ycoord = o.ycoord + offset;

  t1 = deg(Math.PI + Math.asin(offset / (l - r)));
  t2 = deg(Math.asin(offset / (l + r)));
  printcomment(
    "Limits of l for the given r <br> " +
      $("#r3spinner").spinner("option", "min") +
      " and " +
      $("#r3spinner").spinner("option", "max") +
      " ",
    2
  );
  draw();
}

//Simulation graphics
function draw() {
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 550, 400); //clears the complete canvas#simscreen everytime

  pointtrans(o, trans);
  pointtrans(a, trans);
  pointtrans(b, trans);

  //Crank Center and Sliding base

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#666666";
  ctx.moveTo(75, b.ycoord + 15);
  ctx.lineTo(530, b.ycoord + 15);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 20;
  ctx.lineCap = "butt";
  ctx.moveTo(o.xcoord, o.ycoord);
  ctx.lineTo(o.xcoord, o.ycoord + 12);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.moveTo(o.xcoord, o.ycoord);
  ctx.lineTo(o.xcoord, o.ycoord - 3);
  ctx.stroke();
  ctx.closePath();
  pointjoin(o, a, ctx, "#CCCC00", 12);

  pointdisp(o, ctx, 2, "#000000", "#003366", "", "", "");
  ctx.strokeStyle = "#000";
  ctx.arc(o.xcoord, o.ycoord, 6, 0, 2 * Math.PI, false);
  ctx.stroke();

  pointjoin(a, b, ctx, "#CCCC00", 12);

  pointdisp(a, ctx, 2, "#000000", "#003366", "", "", "");
  ctx.strokeStyle = "#000";
  ctx.arc(a.xcoord, a.ycoord, 5, 0, 2 * Math.PI, false);
  ctx.stroke();
  pointdisp(b, ctx, 5, "#000000", "#003366", "", "", "");

  drawrem(ctx);

  // slider element
  ctx.globalAlpha = 0.8;
  drawrect(b, 50, 20, 10, ctx, "#CC9933", "#CC9933", 1);
  ctx.globalAlpha = 1;

  /* if(document.getElementById("trace").checked==true)
  {
  pointtrace(ptx,pty,ctx,"blue",2);
  pointdisp(p,ctx,2,'','','',true,1);
  }
  else
  {
  ptx=[];
  pty=[];
  }*/
}

function drawrem(context) {
  // positioning dimension display

  toffset = -45;
  // dimension line
  if (simstatus) {
    context.save();
    context.translate(0.5, 0.5);
    context.beginPath();
    context.lineWidth = 0.5;
    context.strokeStyle = "#000000";
    context.moveTo(o.xcoord, o.ycoord - toffset + 5);
    context.lineTo(o.xcoord, o.ycoord);
    context.moveTo(b.xcoord, o.ycoord - toffset + 5);
    context.lineTo(b.xcoord, b.ycoord);
    context.moveTo(o.xcoord + 2 * toffset + 5, o.ycoord);
    context.lineTo(o.xcoord, o.ycoord);
    context.moveTo(b.xcoord, b.ycoord);
    context.lineTo(o.xcoord + 2 * toffset + 5, b.ycoord);
    context.stroke();
    context.restore();

    context.beginPath();
    context.moveTo(o.xcoord + 5, o.ycoord - toffset);
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.lineTo(b.xcoord - 5, o.ycoord - toffset);
    if (offset < 70)
      context.moveTo(o.xcoord + 2 * toffset + 20, o.ycoord - (3 * toffset) / 4);
    else context.moveTo(o.xcoord + 2 * toffset + 20, o.ycoord);
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    if (offset < 70)
      context.lineTo(o.xcoord + 2 * toffset + 20, o.ycoord + (5 * toffset) / 2);
    else context.lineTo(o.xcoord + 2 * toffset + 20, b.ycoord);

    context.stroke();

    // arrows at dimension
    drawArrow(
      b.xcoord,
      o.ycoord - toffset,
      context,
      180,
      15,
      30,
      "#000",
      "",
      "#000"
    );
    drawArrow(
      o.xcoord,
      o.ycoord - toffset,
      context,
      0,
      15,
      30,
      "#000",
      "",
      "#000"
    );
    if (offset < 70) {
      drawArrow(
        o.xcoord + 2 * toffset + 20,
        o.ycoord,
        context,
        90,
        15,
        30,
        "#000",
        "",
        "#000"
      );
      drawArrow(
        o.xcoord + 2 * toffset + 20,
        b.ycoord,
        context,
        270,
        15,
        30,
        "#000",
        "",
        "#000"
      );
    } else {
      drawArrow(
        o.xcoord + 2 * toffset + 20,
        o.ycoord,
        context,
        270,
        15,
        30,
        "#000",
        "",
        "#000"
      );
      drawArrow(
        o.xcoord + 2 * toffset + 20,
        b.ycoord,
        context,
        90,
        15,
        30,
        "#000",
        "",
        "#000"
      );
    }

    context.save();
    context.lineWidth = 1;
    context.fillStyle = "#000000";
    context.font = "10px 'Nunito', sans-serif";
    context.fillText("d", (o.xcoord + b.xcoord) / 2, o.ycoord - toffset - 10);

    context.save();
    if (offset > 40)
      context.translate(
        o.xcoord + 2 * toffset + 15,
        (o.ycoord + b.ycoord - toffset - 10) / 2
      );
    else
      context.translate(o.xcoord + 2 * toffset + 15, o.ycoord + 1.5 * toffset);
    context.rotate(-Math.PI / 2);
    context.font = "14px 'Nunito', sans-serif";
    context.fillText("Offset", 0, 0);
    context.restore();

    context.restore();
  }
  context.save();
  context.translate(0.5, 0.5);
  context.lineWidth = 1;
  context.fillStyle = "#000000";
  context.font = "600 16px  'Nunito', sans-serif";
  context.fillText(

    "Quick Return Ratio = \u03B1/\u03B2 = " +
      roundd((t1 - t2) / (360 - t1 + t2), 2),
     
    300,
    15

  );
  console.log(t1-t2);
  if (isNaN(t1 - t2)) {
    console.log("Not a number");
    document.getElementById("simscreen").style.visibility="hidden";
    document.getElementById("canvas-container").style.height="250px";
    document.getElementById("commentboxleft").style.display="none";
    document.getElementById("commentboxright").style.display="none";
    document.getElementById("commentboxright1").style.display="block";
    document.getElementById("commentboxright1").innerHTML = 
         'The quick return ratio is reaching the infinity.<br> Please change the offset slider value to avoid this condition</div>';
}
else {
  // console.log("This is a number");
  document.getElementById("simscreen").style.visibility="visible";
  document.getElementById("canvas-container").style.height="auto";
  document.getElementById("commentboxleft").style.display="block";
  document.getElementById("commentboxright").style.display="block";
  document.getElementById("commentboxright1").style.display="none";
}

  context.restore();

  // Position Analysis Title
  context.save();
  context.lineWidth = 1;
  context.font = "600 16px  'Nunito', sans-serif";
  context.fillStyle = "#000000";
  context.fillText("Position Analysis", 15, 15);
  context.restore();

  // r, l, d, offset display
  context.save();
  context.lineWidth = 1;
  context.fillStyle = "#000000";
  context.font = "12px 'Nunito', sans-serif";
  context.fillText(
    "r",
    (o.xcoord + a.xcoord) / 2 - 1,
    (o.ycoord + a.ycoord) / 2 + 1
  );
  context.fillText(
    "l",
    (a.xcoord + b.xcoord) / 2 - 1,
    (a.ycoord + b.ycoord) / 2 + 3
  );
  context.restore();

  if (simstatus)
    printcomment(
      "Position diagram at the given theta, d = " +
        roundd(b.xcoord - o.xcoord, 2) +
        "mm",
      1
    );
  else printcomment("Simulation of Offset Slider Crank Mechanism", 1);

  context.save();
  context.lineWidth = 1;
  if (r < 40) temp = 40;
  else temp = r;
  context.beginPath();
  context.strokeStyle = "#555555";
  context.arc(o.xcoord, o.ycoord, temp, 0, 2 * Math.PI);
  context.moveTo(o.xcoord, o.ycoord);
  context.lineTo(
    o.xcoord + temp * Math.cos(rad(t2)),
    o.ycoord - temp * Math.sin(rad(t2))
  );
  context.moveTo(o.xcoord, o.ycoord);
  context.lineTo(
    o.xcoord + temp * Math.cos(rad(t1)),
    o.ycoord - temp * Math.sin(rad(t1))
  );
  context.closePath();
  context.arc(o.xcoord, o.ycoord, 20, rad(-t2), rad(-t1), true);
  drawArrow(
    o.xcoord + 20 * Math.cos(rad(-t1)),
    o.ycoord + 20 * Math.sin(rad(-t1)),
    context,
    -t1 + 90,
    7,
    45,
    "",
    "2",
    ""
  );
  context.moveTo(o.xcoord, o.ycoord);
  context.arc(o.xcoord, o.ycoord, 25, rad(-t1), rad(-t2), true);
  drawArrow(
    o.xcoord + 25 * Math.cos(rad(-t2)),
    o.ycoord + 25 * Math.sin(rad(-t2)),
    context,
    -t2 + 90,
    7,
    45,
    "",
    "2",
    ""
  );
  context.closePath();

  context.save();
  context.lineWidth = 1;
  context.fillStyle = "#000000";
  context.font = "12px 'Nunito', sans-serif";
  context.fillText(
    "\u03B1",
    o.xcoord + 25 * Math.cos(rad(-t1 / 2)),
    o.ycoord + 25 * Math.sin(rad(-t1 / 2))
  );
  context.fillText(
    "\u03B2",
    o.xcoord + 35 * Math.cos(rad(90 - t2 / 2)),
    o.ycoord + 35 * Math.sin(rad(90 - t2 / 2))
  );
  context.restore();
  context.restore();
}

function updateR3Limits(r2Value, updateSlider) {
  const maxR3 = 6 * r2Value;
  const minR3 = 2.5 * r2Value;

  $('#r3slider').slider("option", "max", maxR3);
  $('#r3slider').slider("option", "min", minR3);
  $('#r3spinner').spinner("option", "max", maxR3);
  $('#r3spinner').spinner("option", "min", minR3);

  const r3Value = $('#r3spinner').spinner("value");
  if (r3Value < minR3) {
    $('#r3spinner').spinner("value", minR3);
    if (updateSlider) {
      $('#r3slider').slider("value", minR3);
    }
  } else if (r3Value > maxR3) {
    $('#r3spinner').spinner("value", maxR3);
    if (updateSlider) {
      $('#r3slider').slider("value", maxR3);
    }
  } else {
    $('#r3spinner').spinner("value", r3Value);
    if (updateSlider) {
      $('#r3slider').slider("value", r3Value);
    }
  }
}
// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
