//Tewt write when the page was load
var currentdate = new Date();
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
    "*█████╗ ██████╗ ██╗   ██╗ █████╗     ███████╗██╗  ██╗ █████╗ ██╗  ██╗",
    "██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗    ██╔════╝██║  ██║██╔══██╗██║  ██║",
    "███████║██████╔╝ ╚████╔╝ ███████║    ███████╗███████║███████║███████║",
    "██╔══██║██╔══██╗  ╚██╔╝  ██╔══██║    ╚════██║██╔══██║██╔══██║██╔══██║",
    "██║  ██║██║  ██║   ██║   ██║  ██║    ███████║██║  ██║██║  ██║██║  ██║",
    "╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝",
  'Welcome to my terminal <span class="colored">portfolio</span>',
  "To start enter the command <span class=\"command\">'help'<span>"
];

//password
var password = "Linux";

// Text for the command 'Help'
help = [
  "<br>",
  '<span class="command">about</span>          Learn more about me',
  '<span class="command">works</span>          Show my work',
  '<span class="command">social</span>         Displays social networks',
  '<span class="command">contact</span>        Get my email',
  '<span class="command">credits</span>        Show credits',
  '<span class="command">secret</span>         z?◙░▓_da~▒_*? <span class="indice">[' +password + "]<span>",
  '<span class="command">download</span>       Download my Resume',
  "<br>"
];
//Link for Download, Please don't change this
var download = "#"; // Placeholder for Arya Shah Resume link
// email
var email =
  '<a href="mailto:arya.shah@iitgn.ac.in">arya.shah@iitgn.ac.in</a>';

// Link to MyWebSite, Please don't change this
var MyWebSite = "#"; // Placeholder for Arya Shah's website
// Text for the command 'about'
about = [
  "<br>",
  "Hello there !",
  "My name is Arya Shah, a Second Year Postgraduate in Artificial Intelligence at IIT Gandhinagar.",
  "I am passionate about AI, machine learning, and software development.",
  "This terminal portfolio showcases my projects and experience.",
  "Contact me at arya[dot]shah[at]iitgn[dot]ac[dot]in",
  "Or, aryaforhire[at]gmail[dot]com",
  "<br>"
];

//link social
var github = "https://github.com/aryashah2k";
var linkedin = "https://www.linkedin.com/in/arya--shah/";
var twitter = "https://x.com/aryashah2k";
//var instagram = "#";
//var behance = "#";

//social
social = [
  "<br>",
  'github         <a href="' + github + '" target="_blank">' + github + "</a>",
  'linkedin       <a href="' + linkedin + '" target="_blank">' + linkedin + "</a>",
'twitter        <a href="' + twitter + '" target="_blank">'+ twitter + '</a>',
//'instagram      <a href="' + instagram + '" target="_blank">'+ instagram + '</a>',
  "<br>",
  '<span class="command">social github</span>  <span class="inherit">: open my github page</span>',
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
