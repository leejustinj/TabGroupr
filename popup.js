
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

// IMPORTANT:  this could be totally wrong.
// I have no idea how to test.  Plz help.
//
// Intended to move tab from one group to another
// If the source or dest group is open, modifies tab state
// Does nothing with the UI at this time 
function moveTab(tabID, destGroupID){
  var destGroup, sourceGroup, tab;
  for(var i = 0; i<groups.length;i++){
    if(groups[i].id===destGroupID){
      destGroup = groups[i];
    }
    for(var j = 0; j<groups[i].tabs.length;j++){
      if(groups[i].tabs[j].id===tabID){
        tab = groups[i].tabs[j];
        sourceGroup = groups[i];
        sourceGroup.tabs.splice(j,1);
        break;
      }
    } 
    destGroup.tabs.push(tab);
    if(sourceGroup.open){
      chrome.tabs.remove(tabID);
    }
    if(destGroup.open){
      chrome.tabs.create({url:tab.url,selected:false});
    }
  }
}

//Used for switching in between groups
//Check me on this
//Can be used to switch in between groups using a keyboard shortcut
function switchGroup(groupID) {
  var destGroup;
  for (var i = 0; i < groups.length;i++) { 
    if  (groups[i] == groupID) {
	destGroup = groups[i]
    }
    if (groups[i].open) {
	groups[i].open = false
    }
  }
  destGroup.open = true
 }
