var groups = [];
var activeGroup;

var defaultGroup = {
  name:"Default Group",
  tabs:[],
  open:false,
  active:true
}

var refreshUI = function(){
  $(".group").remove();
  for(var i = 0;i<groups.length;i++){
      $(".container").append("<div class='group group"+i+"'><a href='#'><h3>"+groups[i].name+"</h3></a></div>");
      
      $(".group"+i).click({groupnum:i},function(event){
	var i = event.data.groupnum;
	if(groups[i].open===false){
 	  groups[i].open=true;
      $(".group"+i).append("<input class='tab"+i+"' id='remove"+i+"' type='button' value='Remove Group' />");
      $("#remove"+i).click({groupnum:i},function(event){
            deleteGroup(event.data.groupnum);
        });
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
};

$(document).ready(function(){
  $(".create").click(function(event){
     createGroup($("#name").val());
  });

  chrome.tabs.query({currentWindow:true},function(tabarray){
    chrome.storage.local.get(['groups','activeGroup'],function(items){
      defaultGroup.tabs = tabarray;
      if(items.groups){
        groups = items.groups;
        console.log('Restoring Saved Groups');
      } else {
        groups = [defaultGroup];
        console.log('No Saved Groups Found');
      }
      if(items.activeGroup){
        console.log('Restoring Saved Active Group');
        activeGroup = items.activeGroup;
      } else {
        console.log('No Saved Active Group Found, defaulting to 0');
        activeGroup = 0;
      }
      groups[activeGroup].tabs = tabarray;
      refreshUI();
    });
  });  
});

function storeGroups(){
  chrome.storage.local.set({'groups': groups,'activeGroup':activeGroup},refreshUI);
}

// IMPORTANT:  this could be totally wrong.
// I have no idea how to test.  Plz help.
//
// Intended to move tab from one group to another
// If the source or dest group is open, modifies tab state
// Does nothing with the UI at this time 
function moveTab(sourceGroupID, tabID, destGroupID){
  var destGroup, sourceGroup, tab;
  sourceGroup = groups[sourceGroupID];
  destGroup = groups[destGroupID];
  tab = sourceGroup.tabs[tabID];
  if(sourceGroupID===activeGroup){
    chrome.tabs.remove(tab.id);
  }
  console.log(tab);
  destGroup.tabs.push(tab);
  sourceGroup.tabs.splice(tabID,1);
  storeGroups();
  if(destGroupID===activeGroup){
    chrome.tabs.create({url:tab.url,selected:false});
  }
}

//Used for switching in between groups
//Check me on this
//Can be used to switch in between groups using a keyboard shortcut
function switchGroup(groupID) {
  var destGroup;
  for (var i = 0; i < groups.length; i++) { 
    if  (groups[i].id == groupID) {
	destGroup = groups[i];
    }
    if (groups[i].active) {
        groups[i].active = false;
        var tabs = groups[i].tabs;
        //Removes Tabs
	for (var j = 0; j < tabs.length; j++){
	    chrome.tabs.remove(tabs[j].id);
	}
    }
  }
  activeGroup = groupID;
  storeGroups();
  destGroup.active = true
  //Creates tabs and selects the first tab
  for (var k = 0; k < destGroups.tabs.length; k++) {
      if (k = 0) chrome.tabs.create({url:destGroups.tabs[k].url,selected:true})
      else chrome.tabs.create({url:destGroups.tabs[k].url,selected:false})
  }
}

//Um. I probably have to fix everything here.
//Used for creating a group
function createGroup(groupName){
  var newGroup = {
  name: groupName,
  tabs:[],
  open:false,
  active:true
  }
  groups.push(newGroup);
  storeGroups();
}

//Used for deleting a group
function deleteGroup(groupID){
    //TODO: UPDATE ACTIVE GROUP ID IF NEEDED
  	groups.splice(groupID,1); 
    storeGroups();
}

//Used for naming a group
function nameGroup(groupID,label){
      groups[groupID].name=label;
      storeGroups();
}
