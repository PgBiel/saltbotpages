//Main JS file
function disabledOnclick(obj) {
  $(obj).addClass("disabled");
  var thing = setTimeout(function(){
    $(obj).removeClass("disabled");
  }, 100);
  return true;
}