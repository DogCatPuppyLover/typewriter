// Lint with https://jshint.com/

"use strict";

// VARIABLE DEFINITIONS

//Libraries
var converter = new showdown.Converter();

// Variables
var file = 0;
var moduloKey = 0;
var saveTimeout;
var lastSave = Date.now();
var selectionContainer = null;
var preferences;
const paragraphTags = ["DIV", "P", "UL", "OL", "H1", "H2", "H3", "H4", "H5", "H6"];
const newFileMessages = ["<p>It was a dark and stormy night . . .</p>", "<p>Psst . . . remember to save your work to your computer! LocalStorage can be unreliable.</p>", "<p>If you find a bug or would like to request a feature, please submit an issue on GitHub: <a href=\"https://github.com/DogCatPuppyLover/typewriter/issues\">https://github.com/DogCatPuppyLover/typewriter/issues</a></p>", "<p>Thank you for using Typewriter! <3</p>", "<p>Never gonna give you up</p><p>Never gonna let you down</p><p>Never gonna run around and desert you</p><p>Never gonna make you cry</p><p>Never gonna say goodbye</p><p>Never gonna tell a lie and hurt you</p>"];
var checkboxPreferences = [];
var radioPreferences = [];
var textareas = [];
var theme = [];
var font = [];

// Elements
const root = document.getElementsByTagName("html")[0];
const editor = document.getElementById("editor");
const toolbox = document.getElementById("toolbox");
const preferencesModal = document.getElementById("preferences-modal");
const preferencesForm = document.getElementById("preferences-form");

// Sounds
const keystroke = new Audio("assets/audio/typewriter keystroke.mp3"); // Typewriter key sound effects: https://www.soundjay.com/typewriter-sounds.html
const keystroke2 = new Audio("assets/audio/typewriter keystroke.mp3"); // Switch between keystroke and keystroke2 so that sounds are played even if the user is typing quickly
const space = new Audio("assets/audio/typewriter space.mp3");
const linebreak = new Audio("assets/audio/typewriter linebreak.mp3");
const backspace = new Audio("assets/audio/typewriter backspace.mp3");
const paperIn = new Audio("assets/audio/typewriter paper in.mp3");
const paperOut = new Audio("assets/audio/typewriter paper out.mp3");
keystroke.volume = 0.1;
keystroke2.volume = 0.1;

// IMMEDIATELY EXCECUTED SCRIPTS

document.execCommand("defaultParagraphSeparator", false, "p");
document.execCommand("insertBrOnReturn", false, false);
document.execCommand("styleWithCSS", false, false);

editor.focus(); // This might be an accessibility problem, and the behavior is not consistent across browsers: https://github.com/guardian/scribe/blob/master/BROWSERINCONSISTENCIES.md

generatePreferenceArrays();
if (localStorage.getItem("preferences") == null) {
  backwardsCompat();
  processPreferences();
}
updatePreferences();
restorePreferences();


if (localStorage.getItem("file_0") === null) {
  localStorage.setItem("file_0", normalizeFile(editor.innerHTML));
  addToolboxTab(0);
} else {
  let i = 0;
  while (localStorage.getItem("file_" + i) !== null) {
    addToolboxTab(i);
    i++;
  }
}
switchTab(0);
toolbox.removeAttribute("hidden"); /* Only show toolbox if tabs can be rendered */

if (preferences["typewriter-sounds"] == "true") {
  paperIn.play();
}

// FUNCTION DECLARATIONS

// Core

function save() {
  localStorage.setItem("file_" + file, normalizeFile(editor.innerHTML));
  lastSave = Date.now();
  console.log("Autosaved");
}

function openFile() {
  newFile();
  const reader = new FileReader();
  var fileItem = document.getElementById("file-item").files[0];
  reader.readAsText(fileItem);
  reader.onload = function(event) {
    var fileContent = event.target.result;
    var fileName = fileItem.name;
    var splitExtension = fileItem.name.split(".");
    var fileExtension = splitExtension[splitExtension.length];

    function exportText() {
      let splitByParagraph = "";
      for (let i = 0; i < fileContent.split(/\n|\n\r|\r/).length; i++) {
        splitByParagraph = splitByParagraph + "<p>" + event.target.result.split(/\n|\n\r|\r/)[i] + "</p>";
      }
      editor.innerHTML = splitByParagraph;
    }

    function exportHtml() {
      fileContent = normalizeFile(fileContent);
      editor.innerHTML = fileContent;
    }

    function exportMarkdown() {
      editor.innerHTML = converter.makeHtml(fileContent);
    }

    switch (fileItem.type) {
      case "text/x-markdown":
        exportMarkdown();
        break;

      case "text/html":
        exportHtml();
        break;

      case "text/plain":
        exportText();
        break;

      default:
        switch (fileExtension) {
          case "md":
            exportMarkdown();
            break;

          case "html":
          case "htm":
          case "mhtml":
            exportHtml();
            break;

          case "txt":
            exportText();
            break;

          default:
            editor.innerText = fileContent;
        }
    }

    save();

    if (localStorage.getItem("typewriter-sounds") == "true") {
      paperIn.play();
    }
  };
}

function exportFileDialog() {
  var fileName = prompt("Enter filename:", "typewriter-file" + (file + 1) + ".html");
  if (fileName !== null) {
    let splitFileName = fileName.split(".");
    switch (splitFileName[splitFileName.length]) {
      case "html":
        exportFile(fileName, editor.innerHTML, "text/html");
        break;

      case "txt":
        exportFile(fileName, editor.innerText, "text/plain"); // use better HTML-to-text method that preserves lists
        break;

      case "md":
        exportFile(fileName, converter.makeMarkdown(editor.innerHTML));
        break;

      default:
        exportFile(fileName, editor.innerText, "text/plain");
    }
  }
}

function exportFile(fileName, data, type) { // https://stackoverflow.com/a/30832210/
  var blob = new Blob([data], {
    type: type
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    let a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  if (localStorage.getItem("typewriter-sounds") == "true") {
    paperOut.play();
  }
}

function newFile() {
  var i = 0;
  while (localStorage.getItem("file_" + i) !== null) {
    i++;
  }
  localStorage.setItem("file_" + i, randomNewFileMessage());
  addToolboxTab(i);
  switchTab(i);
}

// Tabs

function switchTab(id) {
  var oldTab = document.getElementById("file_" + file);
  var targetTab = document.getElementById("file_" + id);
  file = id;
  editor.innerHTML = normalizeFile(localStorage.getItem("file_" + id));
  oldTab.classList.remove("activeTab");
  targetTab.classList.add("activeTab");
  targetTab.scrollIntoView();
  clearEditClasses(document);
}

function addToolboxTab(i) {
  var tab = document.createElement("button");
  tab.innerHTML = "File " + (i + 1);
  tab.id = "file_" + i;
  tab.className = "tab";
  tab.onclick = () => {
    switchTab(i);
  };
  document.getElementById("tabs").appendChild(tab);
  document.getElementById("newfile").scrollIntoView();
}

// Preferences

function processPreferences() {
  var preferencesFormData = new FormData(preferencesForm);
  var formObject = {};
  checkboxPreferences.forEach((pref) => {
    if (preferencesFormData.has(pref)) {
      preferencesFormData.set(pref, "true");
    } else {
      preferencesFormData.append(pref, "false");
    }
  });
  for (let pair of preferencesFormData) { // Iterates through FormData: https://developer.mozilla.org/en-US/docs/Web/API/FormData/values
    formObject[pair[0]] = pair[1];
  }
  localStorage.setItem("preferences", JSON.stringify(formObject));
}

function restorePreferences() {
  Object.keys(preferences).forEach(key => {
    if (checkboxPreferences.includes(key)) {
      document.querySelector("[name=\"" + key + "\"]").checked = (preferences[key] === "true");
    } else if (radioPreferences.includes(key)) {
      document.querySelector("[name=\"" + key + "\"]" + "[value=\"" + preferences[key] + "\"]").checked = true;
    } else if (textareas.includes(key)) {
      document.querySelector("[name=\"" + key + "\"]").value = preferences[key];
    }
  });
}

function updatePreferences() {
  preferences = JSON.parse(localStorage.getItem("preferences"));
  if (preferences["focus-mode"] == "true") {
    editor.classList.add("focus-mode");
  } else {
    editor.classList.remove("focus-mode");
  }
  editor.setAttribute("spellcheck", preferences.spellcheck);
  theme.forEach((className) => {
    root.classList.remove(className);
  });
  font.forEach((className) => {
    root.classList.remove(className);
  });
  root.classList.add(preferences.theme);
  root.classList.add(preferences.font);
  document.getElementById("user-styles-element").innerHTML = preferences["user-styles"];
}

// Miscellaneous

function normalizeFile(fileContent) {
  let temp = document.createElement("div"); // Create a new DOM element to perform operations on
  temp.innerHTML = fileContent;
  clearAttributes(temp, ["href"]); // Remove all attributes (e.g. classes) except href (to preserve links)
  let tempHTML = temp.innerHTML;
  if (tempHTML.includes("<br>")) {
    let brSplit = tempHTML.split("<br>"); // <br> to <p>: https://stackoverflow.com/a/18494509
    let joined = "";
    for (let i = 0; i < brSplit.length; i++) {
      joined += "<p>" + brSplit[i] + "</p>";
    }
    temp.innerHTML = joined;
  }
  clearEmptyTags(temp, ["img"]); // This should clear unclosed tags, not empty tags. Empty <p> tags are acceptable; unclosed ones, like the ones that are generated when you try to wrap a <p> in another <p>, are not. This might be able to use a modified version of this: https://stackoverflow.com/a/22720661/
  tempHTML = temp.innerHTML;
  tempHTML = tempHTML.replace(/<div>/gi, "<p>").replaceAll(/<\/div>/gi, "</p>"); // Replace all <div> tags with <p> tags
  tempHTML = tempHTML.replace(/\s{2,}/g, " "); // Remove extra whitespace: https://stackoverflow.com/a/14053282/
  tempHTML = tempHTML.replaceAll("\n", ""); // Remove newlines
  tempHTML = tempHTML.trim(); // Remove extra whitespace at the ends of the string
  return tempHTML;
}

function updateSelectionContainer() { // Add a class to focused elements, for detecting focus on contenteditable elements: https://stackoverflow.com/a/29979356
  clearEditClasses(document);
  var selection = window.getSelection();
  if (window.getSelection && selection.rangeCount) {
    var newSelectionContainer = selection.getRangeAt(0).commonAncestorContainer;
    while (newSelectionContainer != null && (!newSelectionContainer.ELEMENT_NODE || !paragraphTags.includes(newSelectionContainer.tagName))) { // Starting at the selected element, go up one level while the nodeType is an element and the node is a "paragraph tag", or the element is null.
      newSelectionContainer = newSelectionContainer.parentNode;
    }
    if (newSelectionContainer != null) {
      newSelectionContainer.classList.add("editable-focus");
      selectionContainer = newSelectionContainer;
    }
  }
}

function clearEditClasses(node) {
  // https://stackoverflow.com/a/22270709
  var elems = node.querySelectorAll(".editable-focus");
  elems.forEach(el => {
    el.classList.remove("editable-focus");
    if (el.classList.length == 0) {
      el.removeAttribute("class");
    }
  });
}

function clearAttributes(node, exceptions) { // Removes all attributes except the ones specified.
  // https://stackoverflow.com/a/22270709
  var elems = Array.from(node.getElementsByTagName("*"));
  elems.forEach(el => {
    var attributes = Array.from(el.attributes);
    attributes.forEach(attr => {
      if (!exceptions.includes(attr.name)) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

function clearEmptyTags(node, exceptions) {
  // https://stackoverflow.com/a/22270709
  var elems = Array.from(node.getElementsByTagName("*"));
  elems.forEach(el => {
    if (el.innerHTML == "" && !exceptions.includes(el.tagName)) {
      el.remove();
    }
  });
}

function playSound(sound, volume, randomAmplitude) {
  sound.currentTime = 0;
  sound.volume = Math.min(volume + randomAmplitude * (Math.random() - 0.5), 1);
  sound.play();
}

function randomNewFileMessage() {
  if (new Date().getMonth() == 11 && new Date().getDate() == 25) {
    return "Merry Christmas! 🎄";
  } else if (new Date().getMonth() == 11 && new Date().getDate() == 31) {
    return "Happy New Year's Eve! 🎉";
  } else if (new Date().getMonth() == 0 && new Date().getDate() == 1) {
    return "Happy New Year's! 🎉";
  } else if (new Date().getMonth() == 0 && new Date().getDate() == 1) {
    return "Happy New Year's! 🎉";
  } else if (new Date().getMonth() == 5 && Math.random() > 0.1) {
    return "Happy Pride Month! 🏳️‍🌈";
  } else {
    return newFileMessages[Math.floor(Math.random() * newFileMessages.length)];
  }
}

function generatePreferenceArrays() {
  document.querySelectorAll("#preferences-form input[type=\"checkbox\"]").forEach((node) => {
    checkboxPreferences.push(node.getAttribute("name"));
  });
  document.querySelectorAll("#preferences-form input[type=\"radio\"]").forEach((node) => {
    let name = node.getAttribute("name");
    if (!radioPreferences.includes(name)) {
      radioPreferences.push(name);
    }
  });
  Array.from(preferencesForm.getElementsByTagName("textarea")).forEach((node) => {
    textareas.push(node.getAttribute("name"));
  });
  document.querySelectorAll("#preferences-form input[type=\"radio\"][name=\"theme\"]").forEach((node) => {
    theme.push(node.getAttribute("value"));
  });
  document.querySelectorAll("#preferences-form input[type=\"radio\"][name=\"font\"]").forEach((node) => {
    font.push(node.getAttribute("value"));
  });
}

function openModal(node) {
  node.classList.add("modal-open");
}

function closeModal(node) {
  node.classList.remove("modal-open");
}

function hideUI() {
  if (preferences["hide-ui"] !== "false") {
    document.body.style.cursor = "none"; // Hide mouse cursor
    root.classList.add("hide-scrollbars"); // Hide scrollbars - not working
    toolbox.classList.add("quick-fade-out"); // Hide toolbox
  }
}

function showUI() {
  document.body.style.cursor = "auto"; // Show mouse cursor
  root.classList.remove("hide-scrollbars"); // Show scrollbars - not working
  toolbox.classList.remove("quick-fade-out");
}

function backwardsCompat() {
  var deprecatedStorage = ["userStyles", "hideMouse", "spellcheck", "typewriterSounds", "focusMode"];
  deprecatedStorage.forEach((key) => {
    if (key === "userStyles") {
      if (localStorage.getItem("userStyles") != null && localStorage.getItem("userStyles") != "") {
        document.getElementById("user-styles").value = localStorage.getItem("userStyles");
      }
    }
    localStorage.removeItem(key);
  });
}

// EVENTLISTENERS

// Key press detection (for keyboard shortcuts and sound effects)
document.addEventListener("keydown", (event) => {
  let keys = ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) ? "ctrl + " : "") + (event.altKey ? "alt + " : "") + (event.shiftKey ? "shift + " : "") + event.key.toLowerCase();

  if (event.key == "Escape") {
    let openModals = document.getElementsByClassName("modal-open");
    let currentModal = openModals[openModals.length - 1];
    if (currentModal != undefined) {
      closeModal(currentModal);
    }
  }

  if (event.key == "Tab") {
    showUI();
  }

  if (editor.contains(event.target)) {
    switch (keys) {
      case "ctrl + s":
        event.preventDefault();
        exportFileDialog();
        break;

      case "ctrl + o":
        event.preventDefault();
        document.getElementById("file-item").click();
        break;

      case "ctrl + b":
        event.preventDefault();
        document.execCommand("bold", false, null);
        break;

      case "ctrl + i":
        event.preventDefault();
        document.execCommand("italic", false, null);
        break;

      case "ctrl + 0":
        event.preventDefault();
        document.execCommand("formatBlock", false, "<p>");
        break;

      case "ctrl + 1":
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h1>");
        break;

      case "ctrl + 2":
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h2>");
        break;

      case "ctrl + 3":
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h3>");
        break;

      case "ctrl + 4":
        event.preventDefault();
        document.execCommand("formatBlock", false, "<h4>");
        break;

      case "ctrl + u": // Unlisted
        event.preventDefault();
        document.execCommand("underline", false, null);
        break;

      case "ctrl + k":
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

      case "ctrl + alt + h": // Unlisted
        event.preventDefault();
        var hiliteColor = prompt("What color should the highlight be? (type r to remove highlighting)", "#ffff00");
        if (hiliteColor !== null) {
          if (hiliteColor == "r") {
            document.execCommand("hiliteColor", false, "#ffffff00");
          } else {
            document.execCommand("hiliteColor", false, "#ffff00");
            /* let element = window.getSelection()).rangeCount.getRangeAt(0).commonAncestorContainer;
                      element.outerHTML = element.innerHTML; */
          }
        }
        break;

      case "ctrl + \\":
        event.preventDefault(); // Unlisted
        document.execCommand("removeFormat", false, null);
        break;

      case "ctrl + alt + -":
        event.preventDefault();
        document.execCommand("strikeThrough", false, null);
        break;

      case "ctrl + shift + <": // Unlisted
        event.preventDefault();
        document.execCommand("subscript", false, null);
        break;

      case "ctrl + shift + >": // Unlisted
        event.preventDefault();
        document.execCommand("superscript", false, null);
        break;

      case "ctrl + shift + l":
        event.preventDefault();
        document.execCommand("insertOrderedList", false, null);
        break;

      case "ctrl + alt + l":
        event.preventDefault();
        document.execCommand("insertUnorderedList", false, null);
        break;

      case "ctrl + alt + r": // Unlisted, broken
        event.preventDefault();
        document.execCommand("insertHorizontalRule", false, null);
        break;

      case "ctrl + shift + ?":
        alert("hi");
        break;
    }
  }
});

editor.addEventListener("input", (event) => {
  if (preferences["typewriter-sounds"] == "true") {
    switch (event.key) {
      case "Enter":
        playSound(linebreak, 1.5, 1);
        break;

      case " ":
        playSound(space, 1.5, 1);
        break;

      case "Backspace":
        playSound(backspace, 1.5, 1);
        break;

      default:
        if ((moduloKey % 2) == 0) { // Allow for two key sounds to overlap, to accommodate fast typing
          playSound(keystroke, 0.3, 0.2);
        } else {
          playSound(keystroke2, 0.3, 0.2);
        }
        moduloKey++;
    }
  }
  clearTimeout(saveTimeout);
  if ((Date.now() - lastSave) > 2000) { // When edited: if it has been over 2 seconds since the last autosave, save now, otherwise schedule it to be saved in 500 milliseconds (which will be cancelled if more edits are made before then.)
    save();
  } else {
    saveTimeout = setTimeout(save, 500);
  }
  hideUI();
});

document.body.addEventListener("mousemove", showUI);

// submit handler

preferencesForm.addEventListener("submit", (event) => { // https://developer.mozilla.org/en-US/docs/Web/API/FormDataEvent/formData
  event.preventDefault();
  processPreferences();
  updatePreferences();
  closeModal(preferencesModal);
});

document.addEventListener("selectionchange", updateSelectionContainer); // Trigger focus detection
