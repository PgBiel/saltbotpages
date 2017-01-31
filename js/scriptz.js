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
  var announcements = $("#announcements");
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
        var sh = new showdown.Converter({simplifiedAutoLink: true, excludeTrailingPunctuationFromURLs: true, strikethrough: true, tasklists: true, requireSpaceBeforeHeadingText: true});
        ann.map(o=>{
          o.title   = sh.makeHtml(o.title);
          o.content = sh.makeHtml(o.content);
        });
        ann.map(o=>{
          announcements.html(announcements.html()+"\n\n"+o.title);
          announcements.html(announcements.html()+"\n"+o.content);
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
  xhttp.open("GET", "announcements.json", true);
  xhttp.send();
};
