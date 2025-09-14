/***************************
    </> by Arya Shah
***************************/
var before = document.getElementById("before");
var getter = document.getElementById("getter");
var pw = false;
let psw = false;
var cmd = document.getElementById("writer"); //zone d'ecriture
var textarea = document.getElementById("setter"); //textarea
var terminal = document.getElementById("terminal"); //commandes entré
var historique = []; // historique des commandes
var valueH = 0;
var frame = document.getElementsByClassName("container");
var close = document.getElementById("close");
// frame project
var back = document.getElementsByClassName("btn-back");
var project = document.getElementsByClassName("prez-2");
var projectLink = document.getElementsByClassName("btn-direction");

// Keep brand centered by matching left spacer width to right header actions
var headerActions = document.querySelector('.header-actions');
var headerSpacer = document.querySelector('.site-header .spacer');
function syncHeader() {
  if (headerActions && headerSpacer) {
    headerSpacer.style.width = headerActions.offsetWidth + 'px';
  }
}
window.addEventListener('load', syncHeader);
window.addEventListener('resize', syncHeader);

// Unified terminal launcher
function startTerminal() {
  var overlay = document.querySelector(".animation");
  if (!overlay) return;
  document.body.classList.add("terminal-active");
  overlay.style.display = "block"; // ensure visible
  overlay.innerHTML = '<img src="img/animation.gif" alt="animation start launching" />';
  setTimeout(function() {
    playSound(start, 0.5);
  }, 500);

  // After load animation, quickly start the terminal (reduced delay)
  setTimeout(function() {
    boucleWrite(run, "", 120);
    overlay.style.display = "none";
    overlay.innerHTML = "";
    textarea.focus();
    syncHeader();
  }, 2000);
}

var startBtn = document.getElementById("start");
if (startBtn) {
  startBtn.addEventListener("click", function(e) {
    e.preventDefault();
    startTerminal();
  });
}

// Exit terminal handler
var exitBtn = document.getElementById("exitTerminal");
if (exitBtn) {
  exitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // Clear terminal content and return to landing
    setTimeout(function() {
      terminal.innerHTML = '<a id="before"></a>';
      before = document.getElementById("before");
    }, 1);
    getter.classList.remove("shutdown");
    cmd.innerHTML = "";
    textarea.value = "";
    document.body.classList.remove("terminal-active");
    syncHeader();
  });
}

window.addEventListener("keyup", enterKey);
//close vbtn frame
close.addEventListener("mousedown", function() {
  close.src = "img/X2.png";
});
close.addEventListener("mouseup", function() {
  close.src = "img/X.png";
  frame[0].classList.remove("open");
  enableProject();
  addLine("window close", "colored", 10);
  textarea.focus();
  playSound(closeFrame, 0.5);
});

//START ADD Text un the console
console.log(
  "%cWelcome to the",
  "color: purple; font-weight: bold; font-size: 30px;"
);
console.log(
  "%cArya Shah Terminal Portfolio",
  "color: magenta; font-weight: bold; font-size: 24px;"
);
console.log("%c Password : " + password, "color: cyan");

//init
textarea.value = "";
cmd.innerHTML = textarea.value;

// Manage color theme without removing existing body classes (e.g., terminal-active)
var COLOR_CLASSES = [
  "color1","color2","color3","color4","color5","color6","color7","color8"
];
function setBodyColor(n) {
  // remove any previous color class
  document.body.classList.remove.apply(document.body.classList, COLOR_CLASSES);
  // apply new color if n > 0
  if (n > 0 && n <= 8) {
    document.body.classList.add("color" + n);
    try { localStorage.setItem('themeColorClass', 'color' + n); } catch(_) {}
  }
}

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (pw) {
    let et = "*";
    let w = textarea.value.length;
    cmd.innerHTML = et.repeat(w);
    if (textarea.value === password) {
      psw = true;
    }
    if (psw && e.keyCode == 13) {
      boucleWrite(secret, "colored margin", 120);
      cmd.innerHTML = "";
      textarea.value = "";
      psw = false;
      pw = false;
      getter.classList.remove("password");
      //playSound(goodPassword, 0.5);
    } else if (e.keyCode == 13) {
      addLine("Wrong password", "error", 0);
      cmd.innerHTML = "";
      textarea.value = "";
      pw = false;
      getter.classList.remove("password");
      playSound(wrongPassword, 0.5);
    }
  } else {
    if (e.keyCode == 13) {
      historique.push(cmd.innerHTML);
      valueH = historique.length;
      addLine("admin> " + cmd.innerHTML, "no-animation", 0);
      testValue(cmd.innerHTML.toLowerCase());
      cmd.innerHTML = "";
      textarea.value = "";
    }
    if (e.keyCode == 38 && valueH != 0) {
      valueH -= 1;
      textarea.value = historique[valueH];
      cmd.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && valueH != historique.length) {
      valueH += 1;
      if (historique[valueH] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = historique[valueH];
      }
      cmd.innerHTML = textarea.value;
    }
  }
}

function testValue(test) {
  switch (test.toLowerCase()) {
    case "help":
      boucleWrite(help, "", 100);
      break;
    case "about":
      boucleWrite(about, "colored margin", 120);
      break;
    case "social":
      boucleWrite(social, "colored", 120);
      break;
    case "contact":
      addLine("My email :  " + email, "colored", 100);
      break;
    case "works":
      addLine("window open", "colored", 10);
      frame[0].classList.add("open");
      playSound(openFrame, 0.5);
      break;
    case "credits":
      boucleWrite(credits, "colored", 120);
      break;
    case "secret":
      getter.classList.add("password");
      pw = true;
      playSound(passwordEnter, 0.5);
      break;
    case "download":
      addLine("download start in 1 s", "colored", 0);
      setTimeout(function() {
        window.open(download, "_blank");
      }, 1000);
      break;

    //social link
    case "social github":
      openTab(github, 1000);
      break;
    case "social linkedin":
      openTab(linkedin, 1000);
      break;
    case "social behance":
      openTab(behance, 1000);
      break;
    /*
    case "social twitter":
      openTab(twitter, 1000);
      break;
    case "social instagram":
      openTab(instagram, 1000);
      break;*/

    //color
    case "color":
      addLine(
        "Enter color with a number 0 to 8 for change the apparence",
        "colored",
        0
      );
      break;
    case "color 0":
      setBodyColor(0);
      addLine("Reset :(", "colored", 100);
      break;
    case "color 1":
      setBodyColor(1);
      addLine("HOoooo :O", "colored", 100);
      break;
    case "color 2":
      setBodyColor(2);
      addLine("HOooooo :O", "colored", 100);
      break;
    case "color 3":
      setBodyColor(3);
      addLine("HOoooooo :O", "colored", 100);
      break;
    case "color 4":
      setBodyColor(4);
      addLine("HOooooooo :O", "colored", 100);
      break;
    case "color 5":
      setBodyColor(5);
      addLine("HOoooooooo :O", "colored", 100);
      break;
    case "color 6":
      setBodyColor(6);
      addLine("HOooooooooo :O", "colored", 100);
      break;
    case "color 7":
      setBodyColor(7);
      addLine("HOoooooooooo :O", "colored", 100);
      break;
    case "color 8":
      setBodyColor(8);
      addLine("HOooooooooooo :O", "colored", 100);
      break;
    case "clear":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "shutdown":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      getter.classList.add("shutdown");
      var x = document.getElementById("setter");
      x.parentNode.removeChild(x);

      playSound(closeS, 0.5);

      cmd.innerHTML = "";
      textarea.value = "";
      document.body.classList = "shutdown";
      addLine("Press F5 to restart the machin", "white", 2500);
      break;
    case "ping":
      addLine("Pong !", "colored", 100);
      break;
    case "historic":
      addLine("<br>", "", 0);
      boucleWrite(historique, "colored", 120);
      addLine("<br>", "", 120 * historique.length + 50);
      break;

    default:
      addLine("Command not recognized. Test the command 'help'", "error", 100);
      playSound(wrongCommand, 0.5);
      break;
  }
}

function boucleWrite(name, classe, time) {
  name.forEach(function(item, index) {
    addLine(item, classe, index * time);
  });
}

function addLine(text, classe, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }

  setTimeout(function() {
    var txt = document.createElement("p");
    txt.innerHTML = t;
    txt.className = classe;

    before.parentNode.insertBefore(txt, before);

    window.scrollTo(0, document.body.offsetHeight);
    playAlea()
  }, time);
}

//play sound with effects
function playSound(audio, vol) {
  audio.volume = vol;
  audio.play();
}

// function play sound type alea
function playAlea() {
  var alea = Math.floor(Math.random() * Math.floor(4));
  var vl = 0.5;

  switch (alea) {
    case 0:
      playSound(type1, vl);
      break;
    case 1:
      playSound(type2, vl);
      break;
    case 2:
      playSound(type3, vl);
      break;
    case 3:
      playSound(type4, vl);
      break;
    case 4:
      playSound(type5, vl);
      break;
  }
}

function openTab(link, time) {
  addLine("open in " + time / 1000 + "s", "colored", 0);
  setTimeout(function() {
    window.open(link, "_blank");
  }, time);
}

//***********************//
//      Interact JS      //
//***********************//

//change top and bottom text frame
var topF = document.querySelector("#toped");
var bottom = document.querySelector(".b1");

interact(".resize-drag")
  .draggable({
    ignoreFrom: ".undrag",
    onmove: window.dragMoveListener,
    restrict: {
      restriction: "parent",
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    }
  })
  .pointerEvents({
    ignoreFrom: ".undrag"
  })
  .resizable({
    inertia: true,

    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    // keep the edges inside the parent
    restrictEdges: {
      outer: "parent",
      endOnly: true
    },

    // minimum size
    restrictSize: {
      min: { width: 560, height: 500 }
    },

    inertia: true
  })
  .on("resizemove", function(event) {
    var target = event.target,
      x = parseFloat(target.getAttribute("data-x")) || 0,
      y = parseFloat(target.getAttribute("data-y")) || 0;

    // update the element's style
    target.style.width = event.rect.width + "px";
    target.style.height = event.rect.height + "px";

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px," + y + "px)";

    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
    //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
  });

function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
    y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// project open
for (let j = 0; j < project.length; j++) {
  back[j].addEventListener("mousedown", function() {
    enableProject();
  });
  projectLink[j].addEventListener("mousedown", function() {
    let u = document.getElementById(projectLink[j].dataset.directionProject);
    u.classList.add("prez-show");
    topF.innerHTML = projectLink[j].dataset.top;
  });
}

function enableProject() {
  for (let i = 0; i < project.length; i++) {
    project[i].classList.remove("prez-show");
    topF.innerHTML = "Arya Shah's Works";
  }
}
