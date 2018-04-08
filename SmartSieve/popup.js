
loadPreferences();

function setActivationColor(elementID)
{
	document.getElementById('button_18blacklist').style.backgroundColor = '#3498db';
	document.getElementById('button_bloodblacklist').style.backgroundColor = '#3498db';
	document.getElementById('button_electionblacklist').style.backgroundColor = '#3498db';
	
	document.getElementById(elementID).style.backgroundColor = '#123684';
}

document.addEventListener('DOMContentLoaded', function() {
    
	document.getElementById('button_manualFilter').addEventListener('click', replaceImages);
	
	var slider = document.getElementById('filterSlider');
    slider.addEventListener('click', function() {
		console.log("Yea");
        toggleAutoMode();
    });
	
	var url = document.getElementById('blacklistURL');
    url.addEventListener('change', function() {
        updateBlacklistURL();
    });

    var eighteenfilter = document.getElementById('button_18blacklist');
    eighteenfilter.addEventListener('click', function() {
        document.getElementById('blacklistURL').value = 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/blacklist.txt';
        updateBlacklistURL();
		setActivationColor('button_18blacklist');
    });

    var electionsFilter = document.getElementById('button_electionblacklist');
    electionsFilter.addEventListener('click', function() {
        document.getElementById('blacklistURL').value = 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/electionblacklist.txt';
        updateBlacklistURL();
		setActivationColor('button_electionblacklist');
    });

    var bloodFilter = document.getElementById('button_bloodblacklist');
    bloodFilter.addEventListener('click', function() {
        document.getElementById('blacklistURL').value = 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/bloodblacklist.txt';
        updateBlacklistURL();
		setActivationColor('button_bloodblacklist');
    });
});

function replaceImages() {
	chrome.tabs.executeScript(null, { file: "axios.js" }, function() {
		chrome.tabs.executeScript(null, { file: "clarifai.js" });
	}); 
}

function savePreferences()
{
	var autoMode = document.getElementById('filterSlider').checked;
	var blacklistURL = document.getElementById('blacklistURL').value;
	chrome.storage.sync.set({
			autoMode: autoMode,
			blacklistURL: blacklistURL
		}, function() {
		console.log("SmartSieve: saved prefs");
	});

}

function loadPreferences()
{
	chrome.storage.sync.get({
		autoMode: true,
		blacklistURL: document.getElementById('blacklistURL').value+''
	  }, function(items) {
		  console.log("loaded blacklist url: " + items.blacklistURL);
		  console.log("loaded autoMode: " + items.autoMode);
		  
		document.getElementById('blacklistURL').value = items.blacklistURL;
		document.getElementById('filterSlider').checked = items.autoMode;
		document.getElementById('button_manualFilter').disabled = items.autoMode;

			//alert(items.blacklistURL);
	  if(items.blacklistURL == 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/bloodblacklist.txt'){
		  setActivationColor('button_bloodblacklist');
	  }
	  else if(items.blacklistURL == 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/blacklist.txt'){
		  setActivationColor('button_18blacklist');
	  }
	  else if(items.blacklistURL == 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/electionblacklist.txt'){
		  setActivationColor('button_electionblacklist');
	  }
		
	  });
}

function toggleAutoMode()
{	
	if(document.getElementById('filterSlider').checked == true)
	{
		document.getElementById('button_manualFilter').disabled = true;
	}
	else
	{
		document.getElementById('button_manualFilter').disabled = false;
	}
	savePreferences();
}

function updateBlacklistURL()
{
	savePreferences();
}
