!function(){"use strict";var e,t,n=new showdown.Converter,a=0,r=0,o=Date.now();const l=["DIV","P","UL","OL","H1","H2","H3","H4","H5","H6"],c=["<p>It was a dark and stormy night . . .</p>","<p>Psst . . . remember to save your work to your computer! LocalStorage can be unreliable.</p>",'<p>If you find a bug or would like to request a feature, please submit an issue on GitHub: <a href="https://github.com/DogCatPuppyLover/typewriter/issues">https://github.com/DogCatPuppyLover/typewriter/issues</a></p>',"<p>Thank you for using Typewriter! <3</p>","<p>Never gonna give you up</p><p>Never gonna let you down</p><p>Never gonna run around and desert you</p><p>Never gonna make you cry</p><p>Never gonna say goodbye</p><p>Never gonna tell a lie and hurt you</p>"];var s=[],u=[],i=[],m=[],d=[];const p=document.getElementsByTagName("html")[0],f=document.getElementById("editor"),g=document.getElementById("toolbox"),h=document.getElementById("preferences-modal"),y=document.getElementById("preferences-form"),v=new Audio("assets/audio/typewriter keystroke.mp3"),b=new Audio("assets/audio/typewriter keystroke.mp3"),k=new Audio("assets/audio/typewriter space.mp3"),w=new Audio("assets/audio/typewriter linebreak.mp3"),E=new Audio("assets/audio/typewriter backspace.mp3"),L=new Audio("assets/audio/typewriter paper in.mp3"),D=new Audio("assets/audio/typewriter paper out.mp3");if(v.volume=.1,b.volume=.1,document.execCommand("defaultParagraphSeparator",!1,"p"),document.execCommand("insertBrOnReturn",!1,!1),document.execCommand("styleWithCSS",!1,!1),f.focus(),document.querySelectorAll('#preferences-form input[type="checkbox"]').forEach(e=>{s.push(e.getAttribute("name"))}),document.querySelectorAll('#preferences-form input[type="radio"]').forEach(e=>{let t=e.getAttribute("name");u.includes(t)||u.push(t)}),Array.from(y.getElementsByTagName("textarea")).forEach(e=>{i.push(e.getAttribute("name"))}),document.querySelectorAll('#preferences-form input[type="radio"][name="theme"]').forEach(e=>{m.push(e.getAttribute("value"))}),document.querySelectorAll('#preferences-form input[type="radio"][name="font"]').forEach(e=>{d.push(e.getAttribute("value"))}),null==localStorage.getItem("preferences")&&(["userStyles","hideMouse","spellcheck","typewriterSounds","focusMode"].forEach(e=>{"userStyles"===e&&null!=localStorage.getItem("userStyles")&&""!=localStorage.getItem("userStyles")&&(document.getElementById("user-styles").value=localStorage.getItem("userStyles")),localStorage.removeItem(e)}),M()),A(),Object.keys(t).forEach(e=>{s.includes(e)?document.querySelector('[name="'+e+'"]').checked="true"===t[e]:u.includes(e)?document.querySelector('[name="'+e+'"][value="'+t[e]+'"]').checked=!0:i.includes(e)&&(document.querySelector('[name="'+e+'"]').value=t[e])}),null===localStorage.getItem("file_0"))localStorage.setItem("file_0",B(f.innerHTML)),T(0);else{let e=0;for(;null!==localStorage.getItem("file_"+e);)T(e),e++}function S(){localStorage.setItem("file_"+a,B(f.innerHTML)),o=Date.now(),console.log("Autosaved")}function x(e,t,n){var a=new Blob([t],{type:n});if(window.navigator.msSaveOrOpenBlob)window.navigator.msSaveBlob(a,e);else{let t=window.document.createElement("a");t.href=window.URL.createObjectURL(a),t.download=e,document.body.appendChild(t),t.click(),document.body.removeChild(t)}"true"==localStorage.getItem("typewriter-sounds")&&D.play()}function I(){for(var e=0;null!==localStorage.getItem("file_"+e);)e++;localStorage.setItem("file_"+e,11==(new Date).getMonth()&&25==(new Date).getDate()?"Merry Christmas! 🎄":11==(new Date).getMonth()&&31==(new Date).getDate()?"Happy New Year's Eve! 🎉":0==(new Date).getMonth()&&1==(new Date).getDate()||0==(new Date).getMonth()&&1==(new Date).getDate()?"Happy New Year's! 🎉":5==(new Date).getMonth()&&Math.random()>.1?"Happy Pride Month! 🏳️‍🌈":c[Math.floor(Math.random()*c.length)]),T(e),C(e)}function C(e){var t=document.getElementById("file_"+a),n=document.getElementById("file_"+e);a=e,f.innerHTML=B(localStorage.getItem("file_"+e)),t.classList.remove("activeTab"),n.classList.add("activeTab"),n.scrollIntoView(),H(document)}function T(e){var t=document.createElement("button");t.innerHTML="File "+(e+1),t.id="file_"+e,t.className="tab",t.onclick=()=>{C(e)},document.getElementById("tabs").appendChild(t),document.getElementById("newfile").scrollIntoView()}function M(){var e=new FormData(y),t={};s.forEach(t=>{e.has(t)?e.set(t,"true"):e.append(t,"false")});for(let n of e)t[n[0]]=n[1];localStorage.setItem("preferences",JSON.stringify(t))}function A(){"true"==(t=JSON.parse(localStorage.getItem("preferences")))["focus-mode"]?f.classList.add("focus-mode"):f.classList.remove("focus-mode"),f.setAttribute("spellcheck",t.spellcheck),m.forEach(e=>{p.classList.remove(e)}),d.forEach(e=>{p.classList.remove(e)}),p.classList.add(t.theme),p.classList.add(t.font),document.getElementById("user-styles-element").innerHTML=t["user-styles"]}function B(e){let t=document.createElement("div");var n,a;t.innerHTML=e,n=t,a=["href"],Array.from(n.getElementsByTagName("*")).forEach(e=>{Array.from(e.attributes).forEach(t=>{a.includes(t.name)||e.removeAttribute(t.name)})});let r=t.innerHTML;if(r.includes("<br>")){let e=r.split("<br>"),n="";for(let t=0;t<e.length;t++)n+="<p>"+e[t]+"</p>";t.innerHTML=n}return function(e,t){Array.from(e.getElementsByTagName("*")).forEach(e=>{""!=e.innerHTML||t.includes(e.tagName)||e.remove()})}(t,["img"]),r=t.innerHTML,r=r.replace(/<div>/gi,"<p>").replaceAll(/<\/div>/gi,"</p>"),r=r.replace(/\s{2,}/g," "),r=r.replaceAll("\n",""),r=r.trim(),r}function H(e){e.querySelectorAll(".editable-focus").forEach(e=>{e.classList.remove("editable-focus"),0==e.classList.length&&e.removeAttribute("class")})}function N(e,t,n){e.currentTime=0,e.volume=Math.min(t+n*(Math.random()-.5),1),e.play()}function q(e){e.classList.remove("modal-open")}function _(){document.body.style.cursor="auto",p.classList.remove("hide-scrollbars"),g.classList.remove("quick-fade-out")}C(0),g.removeAttribute("hidden"),"true"==t["typewriter-sounds"]&&L.play(),document.addEventListener("keydown",e=>{if("true"==t["typewriter-sounds"])switch(e.key){case"Enter":N(w,1.5,1);break;case" ":N(k,1.5,1);break;case"Backspace":N(E,1.5,1);break;default:N(r%2==0?v:b,.3,.2),r++}let o=((window.navigator.platform.match("Mac")?e.metaKey:e.ctrlKey)?"ctrl + ":"")+(e.altKey?"alt + ":"")+(e.shiftKey?"shift + ":"")+e.key.toLowerCase();if("Escape"==e.key){let e=document.getElementsByClassName("modal-open"),t=e[e.length-1];null!=t&&q(t)}if("Tab"==e.key&&_(),f.contains(e.target))switch(o){case"ctrl + s":e.preventDefault(),function(){var e=prompt("Enter filename:","typewriter-file"+(a+1)+".html");if(null!==e){let t=e.split(".");switch(t[t.length]){case"html":x(e,f.innerHTML,"text/html");break;case"txt":x(e,f.innerText,"text/plain");break;case"md":x(e,n.makeMarkdown(f.innerHTML));break;default:x(e,f.innerText,"text/plain")}}}();break;case"ctrl + o":e.preventDefault(),document.getElementById("file-item").click();break;case"ctrl + b":e.preventDefault(),document.execCommand("bold",!1,null);break;case"ctrl + i":e.preventDefault(),document.execCommand("italic",!1,null);break;case"ctrl + 0":e.preventDefault(),document.execCommand("formatBlock",!1,"<p>");break;case"ctrl + 1":e.preventDefault(),document.execCommand("formatBlock",!1,"<h1>");break;case"ctrl + 2":e.preventDefault(),document.execCommand("formatBlock",!1,"<h2>");break;case"ctrl + 3":e.preventDefault(),document.execCommand("formatBlock",!1,"<h3>");break;case"ctrl + 4":e.preventDefault(),document.execCommand("formatBlock",!1,"<h4>");break;case"ctrl + u":e.preventDefault(),document.execCommand("underline",!1,null);break;case"ctrl + k":e.preventDefault();var l=prompt('Where should the text link to? (type "null" to unlink)');null!==l&&("null"==l?document.execCommand("unlink",!1,null):document.execCommand("createLink",!1,l));break;case"ctrl + alt + h":e.preventDefault();var c=prompt("What color should the highlight be? (type r to remove highlighting)","#ffff00");null!==c&&("r"==c?document.execCommand("hiliteColor",!1,"#ffffff00"):document.execCommand("hiliteColor",!1,"#ffff00"));break;case"ctrl + \\":e.preventDefault(),document.execCommand("removeFormat",!1,null);break;case"ctrl + alt + -":e.preventDefault(),document.execCommand("strikeThrough",!1,null);break;case"ctrl + shift + <":e.preventDefault(),document.execCommand("subscript",!1,null);break;case"ctrl + shift + >":e.preventDefault(),document.execCommand("superscript",!1,null);break;case"ctrl + shift + l":e.preventDefault(),document.execCommand("insertOrderedList",!1,null);break;case"ctrl + alt + l":e.preventDefault(),document.execCommand("insertUnorderedList",!1,null);break;case"ctrl + alt + r":e.preventDefault(),document.execCommand("insertHorizontalRule",!1,null);break;case"ctrl + shift + ?":alert("hi")}}),f.addEventListener("input",n=>{clearTimeout(e),Date.now()-o>2e3?S():e=setTimeout(S,500),"false"!==t["hide-ui"]&&(document.body.style.cursor="none",p.classList.add("hide-scrollbars"),g.classList.add("quick-fade-out"))}),document.body.addEventListener("mousemove",_),y.addEventListener("submit",e=>{e.preventDefault(),M(),A(),q(h)}),document.addEventListener("selectionchange",(function(){H(document);var e=window.getSelection();if(window.getSelection&&e.rangeCount){for(var t=e.getRangeAt(0).commonAncestorContainer;!(null==t||t.ELEMENT_NODE&&l.includes(t.tagName));)t=t.parentNode;null!=t&&(t.classList.add("editable-focus"),t)}})),addEventListener("beforeunload",()=>{event.preventDefault(),S()}),document.getElementById("preferences-button").addEventListener("click",()=>{h.classList.add("modal-open")}),document.getElementById("close-preferences-button").addEventListener("click",()=>{q(h)}),document.getElementById("newfile").addEventListener("click",I),document.getElementById("file-item").addEventListener("change",(function(){I();const e=new FileReader;var t=document.getElementById("file-item").files[0];e.readAsText(t),e.onload=function(e){var a=e.target.result,r=(t.name,t.name.split(".")),o=r[r.length];function l(){let t="";for(let n=0;n<a.split(/\n|\n\r|\r/).length;n++)t=t+"<p>"+e.target.result.split(/\n|\n\r|\r/)[n]+"</p>";f.innerHTML=t}function c(){a=B(a),f.innerHTML=a}function s(){f.innerHTML=n.makeHtml(a)}switch(t.type){case"text/x-markdown":s();break;case"text/html":c();break;case"text/plain":l();break;default:switch(o){case"md":s();break;case"html":case"htm":case"mhtml":c();break;case"txt":l();break;default:f.innerText=a}}S(),"true"==localStorage.getItem("typewriter-sounds")&&L.play()}}))}();