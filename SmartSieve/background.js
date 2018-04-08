var AUTO_MODE = true;
function loadPreferences()
	{
		chrome.storage.sync.get({
			autoMode: true,
			blacklistURL: 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/blacklist.txt'
		  }, function(items) {
			  console.log("auto mode? " + items.autoMode);
			AUTO_MODE = items.autoMode;
		
		  });
	}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	

	loadPreferences();

	
	
	console.log("auto mod new e: " + AUTO_MODE);

	if (changeInfo.status == 'complete' && tab.active && AUTO_MODE) {
		chrome.tabs.executeScript(null, { file: "axios.js" }, function() {
			chrome.tabs.executeScript(null, { file: "clarifai.js" });
		});	
	}
});