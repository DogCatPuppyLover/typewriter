var loadCheckbox = function (preference) {
  if (localStorage.getItem(preference) !== null) {
    document.getElementById(preference).checked = localStorage.getItem(preference);
  }
}

var loadTextarea = function (preference) {
  if (localStorage.getItem(preference) !== null) {
    document.getElementById(preference).value = localStorage.getItem(preference);
  }
}

var updateCheckbox = function (preference) {
  localStorage.setItem(preference, document.getElementById(preference).checked);
}

var updateTextarea = function (preference) {
  localStorage.setItem(preference, document.getElementById(preference).value);
}