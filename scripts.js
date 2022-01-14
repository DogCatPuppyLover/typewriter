// VARIABLE DEFINITIONS
var keystroke = new Audio("assets/audio/typewriter keystroke.mp3"); // Typewriter key sound effects: https://www.soundjay.com/typewriter-sounds.html
var keystroke2 = new Audio("assets/audio/typewriter keystroke.mp3");
var space = new Audio("assets/audio/typewriter space.mp3");
var linebreak = new Audio("assets/audio/typewriter linebreak.mp3");
var backspace = new Audio("assets/audio/typewriter backspace.mp3");
var paperIn = new Audio("assets/audio/typewriter paper in.mp3");
var paperOut = new Audio("assets/audio/typewriter paper out.mp3");

var paragraphTags = ["div", "p", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6"]
var file = 0;
var moduloKey = 0;
var turndownService = new TurndownService();
var editor = document.getElementById("editor");
var toolbox = document.getElementById("toolbox");

// SOUND EFFECT SETUP
keystroke.volume = 0.25;
keystroke2.volume = 0.25;

// CONTENTEDITABLE SETUP
document.execCommand("defaultParagraphSeparator", false, "div");
document.execCommand("insertBrOnReturn", false, false);
document.execCommand("useCSS", false, true);

// FUNCTION DEFINITIONS
var switchTab = function (i) {
  editor.innerHTML = localStorage.getItem("file_" + i);
  document.getElementById("file_" + file).classList.remove("activeTab");
  document.getElementById("file_" + i).classList.add("activeTab");
  file = i;
  clearEditClasses(document);
}

var appendStyles = function (styles) {
  // https://stackoverflow.com/a/707580
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = styles;
  document.head.appendChild(styleSheet);
}

var clearEditClasses = function (node) {
  // https://stackoverflow.com/a/22270709
  let elems = node.querySelectorAll(".editableFocus");
  [].forEach.call(elems, function(el) {
    el.classList.remove("editableFocus");
    if (el.classList.length == 0) {
      el.removeAttribute("class");
    }
  });
}

var clearAttributes = function (node) {
  // https://stackoverflow.com/a/22270709
  let elems = node.getElementsByTagName("*");
  [].forEach.call(elems, function(el) {
    // https://stackoverflow.com/a/27664638
    while (el.attributes.length > 0) {
      el.removeAttribute(el.attributes[0].name);
    }
  });
}

var addToolboxTab = function (i) {
  tab = document.createElement("button");
  tab.innerHTML = "File " + (i + 1);
  tab.id = "file_" + i;
  tab.className = "tab";
  tab.onclick = function(){switchTab(i);};
  document.getElementById("tabs").appendChild(tab);
}

var save = function () {
  let temp = document.createElement("div");
  temp.innerHTML = editor.innerHTML;
  clearAttributes(temp);
  localStorage.setItem("file_" + file, temp.innerHTML);
}

var saveFile = function (filename, data, type) {
  var blob = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  if (localStorage.getItem("typewriterSounds") == "true") {
    paperOut.play();
  }
}

var openFile = function () {
  const reader = new FileReader();
  var fileItem = document.getElementById("fileItem").files[0];
  reader.readAsText(fileItem);
  reader.onload = function (e) {
    if (fileItem.type === "text/html") {
      editor.innerHTML = e.target.result;
    } else if (fileItem.type === "text/plain") {
      var splitByParagraph = "";
      for (let i = 0; i < e.target.result.split(/\n|\n\r|\r/).length; i++) {
        splitByParagraph = splitByParagraph + "<div>" + e.target.result.split(/\n|\n\r|\r/)[i] + "</div>";
      }
      editor.innerHTML = splitByParagraph;
    } else {
      editor.innerText = e.target.result;
    }
    save();
    if (localStorage.getItem("typewriterSounds") == "true") {
      paperIn.play();
    }
  };
}

var newFile = function () {
  var i = 0;
  while (localStorage.getItem("file_" + i) !== null) {i++;}
  localStorage.setItem("file_" + i, "It was a dark and stormy night . . .");
  addToolboxTab(i);
  switchTab(i);
}

// PREFERENCES

if (localStorage.getItem("file_0") !== null) {
  i = 0;
  var tab;
  while (localStorage.getItem("file_" + i) !== null) {
    addToolboxTab(i);
    i++;
  }
  switchTab(0);
} else {
  localStorage.setItem("file_0", editor.innerHTML);
  addToolboxTab(0);
  switchTab(0);
}

if (localStorage.getItem("typewriterSounds") == "true") {
  paperIn.play();
}

if (localStorage.getItem("spellcheck") !== null) {
  editor.setAttribute("spellcheck", localStorage.getItem("spellcheck"));
}

if (localStorage.getItem("userStyles") !== null) {
  appendStyles(localStorage.getItem("userStyles"));
}

if (localStorage.getItem("focusMode") == "true") {
  editor.classList.add("focusMode");
}

// EVENTLISTENERS
editor.addEventListener("input", function (event) {
  if (localStorage.getItem("typewriterSounds") == "true") {
    if (event.keyCode == 13) {
      linebreak.currentTime = 0;
      linebreak.play();
    } else if (event.keyCode == 32) {
      space.currentTime = 0;
      space.play();
    } else if (event.keyCode == 8 || event.keyCode == 46) {
      backspace.currentTime = 0;
      backspace.play();
    } else if (!(event.keyCode == 0 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)) {
      if ((moduloKey % 2) == 0) {
      keystroke.currentTime = 0;
      keystroke.play();
      } else {
        keystroke2.currentTime = 0;
        keystroke2.play();
      }
      moduloKey++;
    }
  }
  save();
  if (localStorage.getItem("hideMouse") !== "false") {
    document.body.style.cursor = "none"; //Hide mouse cursor
    document.body.classList.add("hide-scrollbars"); //Hide scrollbars
  }
}, false);

document.body.addEventListener("mousemove", function () {
  document.body.style.cursor = "auto"; //Show mouse cursor
  document.body.classList.remove("hide-scrollbars"); //Show scrollbars
}, false);

// Keypress detection (for commands and sound effects)
document.addEventListener("keydown", function (event) {
  if (window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) {
    if (event.keyCode === 83) {
      event.preventDefault();
      var date = new Date;
      var filename = prompt("Enter filename (.html/.txt/.md):", "typewriter " + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + ".html");
      if (filename !== null) {
        if (filename.endsWith(".html")) {
          saveFile(filename, editor.innerHTML, "text/html");
        } else if (filename.endsWith(".txt")) {
          saveFile(filename, editor.innerText, "text/plain"); // use better HTML-to-text method that preserves lists
        } else if (filename.endsWith(".md")) {
          saveFile(filename, turndownService.turndown(editor.innerHTML)/*, "text/x-markdown"*/);
        } else {
          saveFile(filename, editor.innerText, "text/plain");
        }
      }
    } else if (event.keyCode == 79) {
      event.preventDefault();
      document.getElementById("fileItem").click();
    } else if (event.keyCode == 66) {
      event.preventDefault();
      document.execCommand("bold", false, null);
    } else if (event.keyCode == 73 && event.shiftKey !== true && event.altKey !== true) {
      event.preventDefault();
      document.execCommand("italic", false, null);
    } else if (event.keyCode == 48) {
      event.preventDefault();
      document.execCommand("formatBlock", false, "<div>");
    } else if (event.keyCode == 49) {
      event.preventDefault();
      document.execCommand("formatBlock", false, "<h1>");
    } else if (event.keyCode == 50) {
      event.preventDefault();
      document.execCommand("formatBlock", false, "<h2>");
    } else if (event.keyCode == 51) {
      event.preventDefault();
      document.execCommand("formatBlock", false, "<h3>");
    } else if (event.keyCode == 52) {
      event.preventDefault();
      document.execCommand("formatBlock", false, "<h4>");
    } else if (event.keyCode == 85) {
      event.preventDefault();
      document.execCommand("underline", false, null);
    } else if (event.keyCode == 75) {
      event.preventDefault();
      var linkHref = prompt("Where should the text link to? (type \"r\" to unlink)");
      if (linkHref !== null) {
        if (linkHref == "r") {
          document.execCommand("unlink", false, null);
        } else {
          document.execCommand("createLink", false, linkHref);
        }
      }
    } else if (event.keyCode == 72 && event.altKey == true) {
      event.preventDefault();
      var hiliteColor = prompt("What color should the highlight be? (type r to remove highlighting)", "#ffff00");
      if (hiliteColor !== null) {
        if (hiliteColor == "r") {
          document.execCommand("hiliteColor", false, "#ffffff00");
        } else {
          document.execCommand("hiliteColor", false, "#ffff00");
        }
      }
    } else if (event.keyCode == 220) {
      event.preventDefault();
      document.execCommand("removeFormat", false, null);
    } else if (event.keyCode == 173 && event.altKey == true) {
      event.preventDefault();
      document.execCommand("strikeThrough", false, null);
    } else if (event.keyCode === 61 && event.shiftKey == true) {
      event.preventDefault();
      document.execCommand("subscript", false, null);
    } else if (event.keyCode == 173 && event.shiftKey == true) {
      event.preventDefault();
      document.execCommand("superscript", false, null);
    } else if (event.keyCode == 76 && event.shiftKey == true) {
      event.preventDefault();
      document.execCommand("insertUnorderedList", false, null);
    } else if (event.keyCode == 76 && event.altKey == true) {
      event.preventDefault();
      document.execCommand("insertOrderedList", false, null);
    } else if (event.keyCode == 82 && event.altKey == true) {
      event.preventDefault();
      document.execCommand("insertHorizontalRule", false, null);
    } else if (event.keyCode == 73 && event.altKey == true) {
      event.preventDefault();
      var imgSrc = prompt("Paste the URL of the image you want to insert:");
      if (imgSrc !== null) {
        document.execCommand("insertImage", false, imgSrc);
      }
    } else if (event.keyCode == 9 && event.shiftKey !== true) {
      event.preventDefault();
      document.execCommand("indent", false, null);
    } else if (event.keyCode == 9 && event.shiftKey == true) {
      event.preventDefault();
      document.execCommand("outdent", false, null);
    }
  }
}, false);

// Add a class to focused elements, for detecting focus on contenteditable elements: https://stackoverflow.com/a/29979356
let selectionContainer = null;
function updateSelectionContainer() {
  let newSelectionContainer = null;
  let sel;
  if (window.getSelection && (sel = window.getSelection()).rangeCount) {
    newSelectionContainer = sel.getRangeAt(0).commonAncestorContainer;
    while (newSelectionContainer.nodeType != 1 || !paragraphTags.includes(newSelectionContainer.tagName.toLowerCase())) {
      newSelectionContainer = newSelectionContainer.parentNode;
    }
  }
  if (newSelectionContainer != selectionContainer) {
    clearEditClasses(document);
    if (newSelectionContainer) {
      newSelectionContainer.classList.add("editableFocus");
    }
    selectionContainer = newSelectionContainer;
  }
}

document.addEventListener('selectionchange', updateSelectionContainer); // Trigger focus detection
