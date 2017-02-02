//Main JS file
function disabledOnclick(obj) {
  $(obj).addClass("disabled");
  var thing = setTimeout(function() {
    $(obj).removeClass("disabled");
  }, 100);
  return true;
}

function XHR() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
}

window.getAnnouncements = function() {
  var xhttp = XHR();
  var loader = $("#theloader");
  var announcements = $("#announcements")[0];
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.responseText;
      var ann;
      try {
        ann = JSON.parse(response);
      } catch (err) {
        ann = null;
        console.error("Error while parsing announcements, at parsing: " + err.toString());
        loader.html("Could not load announcements!");
        loader.removeClass("alert-info");
        loader.addClass("alert-danger");
        var dieSlowlyAndPainfully = setTimeout(function(){
          loader.fadeOut(2800);
        }, 5000);
      }
      if (ann) {
        ann = _.take(ann, 25);
        var sh = new showdown.Converter({
          simplifiedAutoLink: true,
          excludeTrailingPunctuationFromURLs: true,
          strikethrough: true,
          tasklists: true,
          requireSpaceBeforeHeadingText: true,
          tables: true,
          simpleLineBreaks: true
        });
        ann.map(o => {
          o.rawTitle = o.title;
          o.title   = document.createElement("h1");
          o.title.setAttribute("class", "announcement-title");
          o.title.innerHTML = o.rawTitle;
          o.description = document.createElement("span");
          o.description.setAttribute("class", "announcement-description");
          o.description.innerHTML = o.poster + " posted this " + moment(o.timestamp).fromNow() + moment(o.timestamp).format(" on LLLL");
          o.title.appendChild(o.description);
          o.content = sh.makeHtml(o.content);
        });
        ann.map(o => {
          var container = document.createElement("div");
          container.setAttribute("class", "announcement-container");
          container.innerHTML = o.title.outerHTML + "\n" + o.content;
          announcements.appendChild(container);
        });
        loader.html("Loaded announcements!");
        loader.removeClass("alert-info");
        loader.addClass("alert-success");
        var dieSlowlyAndPainfully = setTimeout(function(){ //eslint-disable-line no-redeclare
          loader.fadeOut(2800);
        }, 5000);
      }
    } else if (this.status !== 200 && this.readyState == 4) {
      console.error("Error while fetching announcements (Status: " + this.status + "): " + this.statusText);
      loader.html("Could not load announcements!");
      loader.removeClass("alert-info");
      loader.addClass("alert-danger");
      var dieSlowlyAndPainfully = setTimeout(function(){ //eslint-disable-line no-redeclare
        loader.fadeOut(2800);
      }, 5000);
    }
  };
  xhttp.open("GET", "info/announcements.json", true);
  xhttp.send();
};

var messages = ["We all love Salt"];

window.getMessages = function() {
  var xhttp = XHR();
  var message = $("#salt-message")[0];
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.responseText;
      var ann;
      try {
        ann = JSON.parse(response);
      } catch (err) {
        ann = null;
      }
      if (ann) {
        messages = ann;
        message.innerHTML = _.sample(messages);
        $("#salt-message")[0] ? $("#salt-message")[0].addEventListener("click", function() {
          theMessage = $("#salt-message")[0];
          theMessage.setAttribute("class", "salt-message fade-in-out");
          setTimeout(function() {
            theMessage.innerHTML = _.sample(messages);
          }, 2000);
          setTimeout(function() {
            theMessage.setAttribute("class", "salt-message");
          }, 4000);
        }) : "";
      }
    } else if (this.status !== 200 && this.readyState == 4) {
      console.error("Error while fetching messages (Status: " + this.status + "): " + this.statusText);
    }
  };
  xhttp.open("GET", "info/messages.json", true);
  xhttp.send();
};

function pgThings() {
  var origin = window.location.origin;
  $("#back").attr("href", origin+(/\/$/.test(origin)?"saltbotpages":"/saltbotpages"));
}
