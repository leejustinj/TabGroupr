
var groups = [];

var defaultGroup = {
  name:"Default Group",
  tabs:[],
  open:false
}

$(document).ready(function(){
  chrome.tabs.query({currentWindow:true},function(tabarray){
    defaultGroup.tabs = tabarray;
    groups.push(defaultGroup);
    for(var i = 0;i<groups.length;i++){
      $(".container").append("<div class='group group"+i+"'><a href='#'><h3>"+groups[i].name+"</h3></a></div>");
      
      $(".group"+i).click({groupnum:i},function(event){
	var i = event.data.groupnum;
	if(groups[i].open===false){
 	  groups[i].open=true;
	  for(var j = 0;j<groups[i].tabs.length;j++){
	    $(".group"+i).append("<div class='tab"+i+"'><h5>"+groups[i].tabs[j].title+"</h5></div>");
	  }
	}
	else{
	  groups[i].open=false;
	  $(".tab"+i).remove();
	}
      });
      
    }
  });
  
});