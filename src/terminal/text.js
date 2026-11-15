//Tewt write when the page was load
var currentdate = new Date();

/* Equal-width # banner. One trailing space between glyphs, then rstrip and pad. */
function asciiBanner(text) {
  var map = {
    A: [" ### ", "#   #", "#####", "#   #", "#   #"],
    R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
    Y: ["#   #", "#   #", " # # ", "  #  ", "  #  "],
    S: [" ####", "#    ", " ### ", "    #", "#### "],
    H: ["#   #", "#   #", "#####", "#   #", "#   #"],
    " ": ["  ", "  ", "  ", "  ", "  "]
  };
  var rows = ["", "", "", "", ""];
  var i;
  var r;
  for (i = 0; i < text.length; i++) {
    var glyph = map[text.charAt(i)];
    for (r = 0; r < 5; r++) {
      rows[r] += glyph[r] + " ";
    }
  }
  var width = 0;
  for (r = 0; r < 5; r++) {
    rows[r] = rows[r].replace(/[ ]+$/g, "");
    if (rows[r].length > width) width = rows[r].length;
  }
  for (r = 0; r < 5; r++) {
    while (rows[r].length < width) rows[r] += " ";
  }
  var lines = [];
  for (r = 0; r < 5; r++) {
    lines.push({ text: rows[r], cls: "ascii" });
  }
  return lines;
}

var banner = asciiBanner("ARYA SHAH");
run = [
  '<span class="indice">Run </span><span class="colored">Arya Shah</span>',
  '<span class="indice">[' +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    "]</span>",
  banner[0],
  banner[1],
  banner[2],
  banner[3],
  banner[4],
  'Welcome to my terminal <span class="colored">portfolio</span>',
  "To start enter the command <span class=\"command\">'help'</span>"
];

//password
var password = "Linux";

// Text for the command 'Help'
help = [
  "<br>",
  '<span class="command">about</span>          Learn more about me',
  '<span class="command">works</span>          Show my work',
  '<span class="command">projects</span>       List repositories',
  '<span class="command">papers</span>         List papers',
  '<span class="command">social</span>         Displays social networks',
  '<span class="command">contact</span>        Get my email',
  '<span class="command">credits</span>        Show credits',
  '<span class="command">secret</span>         z?◙░▓_da~▒_*? <span class="indice">[' +password + "]<span>",
  '<span class="command">download</span>       Resume status',
  "<br>"
];
//Link for Download, Please don't change this
var download = "#"; // Placeholder for Arya Shah Resume link
// email
var email =
  '<a href="mailto:arya.shah@iitgn.ac.in">arya.shah@iitgn.ac.in</a>, <a href="mailto:aryaforhire@gmail.com">aryaforhire@gmail.com</a>';

// Link to MyWebSite, Please don't change this
var MyWebSite = "#"; // Placeholder for Arya Shah's website
// Text for the command 'about'
about = [
  "<br>",
  "Arya Shah, Senior AI engineer at Aistra Labs, Mumbai, since June 2026.",
  "M.Tech, Artificial Intelligence, IIT Gandhinagar, August 2024 to June 2026.",
  "Email: arya.shah@iitgn.ac.in, aryaforhire@gmail.com",
  'GitHub: <a href="https://github.com/aryashah2k" target="_blank">https://github.com/aryashah2k</a>',
  'LinkedIn: <a href="https://www.linkedin.com/in/arya--shah/" target="_blank">https://www.linkedin.com/in/arya--shah/</a>',
  'Scholar: <a href="https://scholar.google.com/citations?user=bURGVj0AAAAJ&amp;hl=en" target="_blank">https://scholar.google.com/citations?user=bURGVj0AAAAJ&amp;hl=en</a>',
  'X: <a href="https://x.com/aryashah2k" target="_blank">https://x.com/aryashah2k</a>',
  "<br>"
];

//link social
var github = "https://github.com/aryashah2k";
var linkedin = "https://www.linkedin.com/in/arya--shah/";
var twitter = "https://x.com/aryashah2k";
var scholar = "https://scholar.google.com/citations?user=bURGVj0AAAAJ&hl=en";

projects = [
  "<br>",
  'metaheuRUSTics | A Rust library for metaheuristic optimization algorithms. | <a href="https://github.com/aryashah2k/metaheuRUSTics" target="_blank">https://github.com/aryashah2k/metaheuRUSTics</a>',
  'In Search of Goodness | Benchmark of goodness functions for the Forward-Forward algorithm. | <a href="https://github.com/aryashah2k/In-Search-of-Goodness" target="_blank">https://github.com/aryashah2k/In-Search-of-Goodness</a>',
  'Agreeableness and sycophancy | Code for the ACL 2026 paper. | <a href="https://github.com/aryashah2k/Quantifying-Agreeableness-Driven-Sycophancy-in-Role-Playing-Language-Models" target="_blank">https://github.com/aryashah2k/Quantifying-Agreeableness-Driven-Sycophancy-in-Role-Playing-Language-Models</a>',
  "<br>"
];

papers = [
  "<br>",
  'Too Nice to Tell the Truth (ACL 2026) <a href="https://aclanthology.org/2026.acl-long.1421/" target="_blank">https://aclanthology.org/2026.acl-long.1421/</a>',
  'Sycophancy as a Multilingual Alignment Failure (arXiv) <a href="https://arxiv.org/abs/2606.08451" target="_blank">https://arxiv.org/abs/2606.08451</a>',
  'In Search of Goodness (arXiv) <a href="https://arxiv.org/abs/2511.18567" target="_blank">https://arxiv.org/abs/2511.18567</a>',
  'Purrturbed but Stable (CVPR 2026) <a href="https://arxiv.org/abs/2511.02404" target="_blank">https://arxiv.org/abs/2511.02404</a>',
  "<br>"
];

//social
social = [
  "<br>",
  'github         <a href="' + github + '" target="_blank">' + github + "</a>",
  'linkedin       <a href="' + linkedin + '" target="_blank">' + linkedin + "</a>",
  'scholar        <a href="' + scholar.replace(/&/g, "&amp;") + '" target="_blank">' + scholar.replace(/&/g, "&amp;") + "</a>",
  'twitter        <a href="' + twitter + '" target="_blank">' + twitter + "</a>",
  "<br>",
  '<span class="command">social github</span>   <span class="inherit">: open my github page</span>',
  '<span class="command">social linkedin</span> <span class="inherit">: open my linkedin page</span>',
  '<span class="command">social scholar</span>  <span class="inherit">: open my scholar page</span>',
  '<span class="command">social twitter</span>  <span class="inherit">: open my X page</span>',
  "<br>"
];

//open windows
var openWindow = "new open window";

//works
var worksOpen = "works open";
var worksClos = "works close";

//credits
credits = [
  "<br>",
  '<span class="margin">Developed By Arya Shah at IIT Gandhinagar</span>',
  '<span class="margin">Thanks to <a href="http://maximefreund.com/" target="_blank">Maxime Freund</a>.</span>',
  '<span class="margin">Thanks to taye for the script <a href="https://interactjs.io/" target="_blank">interact.js</a> on Github</span>',
  "<br>"
];

//secret
secret = [
  "<br>",
  '<span class="command">historic</span>       View your command history',
  '<span class="command">color</span>          Enter color with a number 0 to 8 for change the apparence',
  '<span class="command">clear</span>          reset commands',
  '<span class="command">shutdown</span>       Stop the machin',
  '<span class="command">ping</span>',
  "<br>"
];


//audio
var start = new Audio('/assets/sounds/start.wav');
var closeFrame = new Audio('/assets/sounds/CloseWindows.wav');
var openFrame = new Audio('/assets/sounds/OpenWindow.wav');
var wrongCommand = new Audio('/assets/sounds/WrongCommand.wav');
var passwordEnter = new Audio('/assets/sounds/Password.wav');
var wrongPassword = new Audio('/assets/sounds/WrongPassword.wav');
var goodPassword = new Audio('/assets/sounds/GoodPassword.wav');
var closeS = new Audio('/assets/sounds/end.mp4');
var type1 = new Audio('/assets/sounds/type1.wav');
var type2 = new Audio('/assets/sounds/type2.wav');
var type3 = new Audio('/assets/sounds/type3.wav');
var type4 = new Audio('/assets/sounds/type4.wav');
var type5 = new Audio('/assets/sounds/type5.wav');
