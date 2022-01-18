// VARIABLE DEFINITIONS

// Sounds
const keystroke = new Audio("assets/audio/typewriter keystroke.mp3"); // Typewriter key sound effects: https://www.soundjay.com/typewriter-sounds.html
const keystroke2 = new Audio("assets/audio/typewriter keystroke.mp3");
const space = new Audio("assets/audio/typewriter space.mp3");
const linebreak = new Audio("assets/audio/typewriter linebreak.mp3");
const backspace = new Audio("assets/audio/typewriter backspace.mp3");
const paperIn = new Audio("assets/audio/typewriter paper in.mp3");
const paperOut = new Audio("assets/audio/typewriter paper out.mp3");

// Variables
var file = 0;
var moduloKey = 0;
const paragraphTags = ["div", "p", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6"]
var newFileMessages = ["<p>It was a dark and stormy night . . .</p>", "<p>Psst . . . remember to save your work to your computer! LocalStorage can be unreliable.</p>", "<p>If you find any bugs, please report them on GitHub: <a href=\"https://github.com/DogCatPuppyLover/typewriter/issues\">https://github.com/DogCatPuppyLover/typewriter/issues</a></p>"]

//Libraries
var converter = new showdown.Converter();
/* showdown.makeMarkdown.node = function (src) {
  switch () {
  default:
    txt = node.outerHTML;
    break;
} */ // Remove extra newline characters after unconverted tags: https://github.com/showdownjs/showdown/issues/621

// Elements
const editor = document.getElementById("editor");
const toolbox = document.getElementById("toolbox");

// SOUND EFFECT SETUP
keystroke.volume = 0.25;
keystroke2.volume = 0.25;

// CONTENTEDITABLE SETUP
document.execCommand("defaultParagraphSeparator", false, "p");
document.execCommand("insertBrOnReturn", false, false);
document.execCommand("useCSS", false, true);

// FUNCTION DECLARATIONS
function randomNewFileMessage () {
  return newFileMessages[Math.floor(Math.random() * newFileMessages.length)];
}

function switchTab (i) {
  switchFile(i);
  document.getElementById("file_" + file).classList.remove("activeTab");
  document.getElementById("file_" + i).classList.add("activeTab");
  file = i;
  clearEditClasses(document);
}

function switchFile (i) {
  editor.innerHTML = localStorage.getItem("file_" + i);
}

function appendStyles (styles) {
  // https://stackoverflow.com/a/707580
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = styles;
  document.head.appendChild(styleSheet);
}

// Add a class to focused elements, for detecting focus on contenteditable elements: https://stackoverflow.com/a/29979356
let selectionContainer = null;
function updateSelectionContainer() {
  clearEditClasses(document);
  let newSelectionContainer = null;
  let sel;
  if (window.getSelection && (sel = window.getSelection()).rangeCount) {
    newSelectionContainer = sel.getRangeAt(0).commonAncestorContainer;
    while (newSelectionContainer.nodeType != 1 || !paragraphTags.includes(newSelectionContainer.tagName.toLowerCase())) {
      newSelectionContainer = newSelectionContainer.parentNode;
    }
  }
  if (newSelectionContainer) {
    newSelectionContainer.classList.add("editableFocus");
  }
  selectionContainer = newSelectionContainer;
}

function clearEditClasses (node) {
  // https://stackoverflow.com/a/22270709
  let elems = node.querySelectorAll(".editableFocus");
  [].forEach.call(elems, function(el) {
    el.classList.remove("editableFocus");
    if (el.classList.length == 0) {
      el.removeAttribute("class");
    }
  });
}

function clearAttributes (node, exceptions) { // Removes all attributes except the ones specified.
  // https://stackoverflow.com/a/22270709
  let elems = node.getElementsByTagName("*");
  [].forEach.call(elems, function(el) {
    // https://stackoverflow.com/a/27664638
    for (let i = 0; i < el.attributes.length; i++) {
      if (!exceptions.includes(el.attributes[i].name))
      el.removeAttribute(el.attributes[i].name);
    }
  });
}

function addToolboxTab (i) {
  tab = document.createElement("button");
  tab.innerHTML = "File " + (i + 1);
  tab.id = "file_" + i;
  tab.className = "tab";
  tab.onclick = function(){switchTab(i);};
  document.getElementById("tabs").appendChild(tab);
}

function save () {
  localStorage.setItem("file_" + file, normalizeFile(editor.innerHTML));
}

function saveFile (filename, data, type) {
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

function normalizeFile (fileContent) {
  let temp = document.createElement("div");
  temp.innerHTML = fileContent;
  clearAttributes(temp, ["href"]);
  tempString = String(temp.innerHTML);
  var lines = String(tempString).split("<br>"); // <br> to <p>: https://stackoverflow.com/a/18494509
  var newContent = "";
  for (let i = 0; i < lines.length; i++) {
     newContent += "<p>" + lines[i] + "</p>";
   }
   tempString = newContent;
   tempString = tempString.replaceAll(/<div>/gi, "<p>").replaceAll(/<\/div>/gi, "</p>");
   tempString = tempString.trim()
   return tempString;
}

function openFile () {
  const reader = new FileReader();
  var fileItem = document.getElementById("fileItem").files[0];
  reader.readAsText(fileItem);
  reader.onload = function (event) {
    var fileContent = event.target.result;
    if (fileItem.name.endsWith(".md") || fileItem.type === "text/x-markdown") {
      editor.innerHTML = converter.makeHtml(fileContent);
    } else if (fileItem.name.endsWith(".html") || fileItem.name.endsWith(".htm") || fileItem.name.endsWith(".mhtml") || fileItem.type === "text/html") {
      fileContent = normalizeFile(fileContent);
      editor.innerHTML = fileContent;
    } else if (fileItem.name.endsWith(".txt") || fileItem.type === "text/plain") {
      var splitByParagraph = "";
      for (let i = 0; i < string(fileContent).split(/\n|\n\r|\r/).length; i++) {
        fileContent = fileContent + "<p>" + event.target.result.split(/\n|\n\r|\r/)[i] + "</p>";
      }
      editor.innerHTML = fileContent;
    } else {
      editor.innerText = fileContent;
    }
    save();
    if (localStorage.getItem("typewriterSounds") == "true") {
      paperIn.play();
    }
  };
}

function newFile () {
  var i = 0;
  while (localStorage.getItem("file_" + i) !== null) {i++;}
  localStorage.setItem("file_" + i, randomNewFileMessage());
  addToolboxTab(i);
  switchTab(i);
}

function saveFileDialog () {
  let date = new Date;
  var filename = prompt("Enter filename (.html/.txt/.md):", "typewriter " + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + ".html");
  if (filename !== null) {
    if (filename.endsWith(".html")) {
      saveFile(filename, editor.innerHTML, "text/html");
    } else if (filename.endsWith(".txt")) {
      saveFile(filename, editor.innerText, "text/plain"); // use better HTML-to-text method that preserves lists
    } else if (filename.endsWith(".md")) {
      saveFile(filename, converter.makeMarkdown(editor.innerHTML)/*, "text/x-markdown"*/);
    } else {
      saveFile(filename, editor.innerText, "text/plain");
    }
  }
}

// LOCALSTORAGE

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

// Preferences

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
    document.body.style.cursor = "none"; // Hide mouse cursor
    document.body.classList.add("hide-scrollbars"); // Hide scrollbars
  }
  toolbox.classList.add("quickFadeOut");
}, false);

document.body.addEventListener("mousemove", function () {
  document.body.style.cursor = "auto"; // Show mouse cursor
  document.body.classList.remove("hide-scrollbars"); // Show scrollbars
  toolbox.classList.remove("quickFadeOut");
}, false);

/*

let element = window.getSelection()).rangeCount.getRangeAt(0).commonAncestorContainer;
element.outerHTML = element.innerHTML;

*/

// Keypress detection (for commands and sound effects)
document.addEventListener("keydown", function (event) {
  if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && !((event.shiftKey && event.keyCode === 73) || (!event.altKey && event.keyCode === 82))) { // exclude ctrl + shift i and ctrl + r
    switch (event.keyCode) {
      case 83:
        event.preventDefault();
        saveFileDialog();
        break;

      case 79:
        event.preventDefault();
        document.getElementById("fileItem").click();
        break;

      case 66:
        event.preventDefault();
        document.execCommand("bold", false, null);
        break;

      case 73:
        if (!event.shiftKey) { // ctrl + shift + i = inspect element
          if (event.altKey) {
            event.preventDefault();
            var imgSrc = prompt("Paste the URL of the image you want to insert:");
            if (imgSrc !== null) {
              document.execCommand("insertImage", false, imgSrc);
            }
            break;
          } else {
            event.preventDefault();
            document.execCommand("italic", false, null);
            break;
          }
        }

      case 48:
        event.preventDefault();
        document.execCommand("formatBlock", false, "<p>");
        break;

      case 49:
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h1>");
        break;

      case 50:
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h2>");
        break;

      case 51:
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h3>");
        break;

      case 52:
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h4>");
        break;

      case 53:
        event.preventDefault();
        document.execCommand("underline", false, null);
        break;

      case 75:
        event.preventDefault();
        var linkHref = prompt("Where should the text link to? (type \"null\" to unlink)");
        if (linkHref !== null) {
          if (linkHref == "null") {
            document.execCommand("unlink", false, null);
          } else {
            document.execCommand("createLink", false, linkHref);
          }
        }
        break;

      case 72:
        if (event.altKey) {
          event.preventDefault();
          var hiliteColor = prompt("What color should the highlight be? (type r to remove highlighting)", "#ffff00");
          if (hiliteColor !== null) {
            if (hiliteColor == "r") {
              document.execCommand("hiliteColor", false, "#ffffff00");
            } else {
              document.execCommand("hiliteColor", false, "#ffff00");
            }
          }
          break;
        }

      case 220:
        event.preventDefault();
        document.execCommand("removeFormat", false, null);
        break;

      case 173:
        if (event.altKey) {
          event.preventDefault();
          document.execCommand("strikeThrough", false, null);
          break;
        }

      case 61:
        if (event.shiftKey) {
          event.preventDefault();
          document.execCommand("subscript", false, null);
          break;
        }

      case 173:
        if (event.shiftKey) {
          event.preventDefault();
          document.execCommand("superscript", false, null);
          break;
        }

      case 76:
        if (event.altKey) {
          event.preventDefault();
          document.execCommand("insertOrderedList", false, null);
        } else if (event.shiftKey) {
          event.preventDefault();
          document.execCommand("insertUnorderedList", false, null);
          break;
        }

      case 82:
        if (event.altKey) {
          event.preventDefault();
          document.execCommand("insertHorizontalRule", false, null);
          break;
        }

      case 9:
        event.preventDefault();
        if (event.shiftKey) {
          document.execCommand("indent", false, null);
        } else {
          document.execCommand("outdent", false, null);
        }
        break;
    }
  }
}, false);

document.addEventListener('selectionchange', updateSelectionContainer); // Trigger focus detection
