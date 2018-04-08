var CLIENT_ID = 'K8GGwldeOVoVtdOcsNPJBPgFwE0af8CeZRKGhaas';
var CLIENT_SECRET = '-YTaX-l3H6Z76dcieYDJ6uE-v7rqKqKfQC3FHC1d';

var BLACKLIST_URL = "https://raw.githubusercontent.com/ptwu/SmartSieve/master/blacklist.txt";

loadPreferences();
img_find();


function loadPreferences()
{
	chrome.storage.sync.get({
		autoMode: true,
		blacklistURL: 'https://raw.githubusercontent.com/ptwu/SmartSieve/master/blacklist.txt'
	  }, function(items) {
		  console.log("read blacklist url: " + items.blacklistURL);
		BLACKLIST_URL = items.blacklistURL;
	
	  });
}


function img_find() {
    var imgs = document.getElementsByTagName("img");
    var imgSrcs = [];
	//alert(imgs.length + "img tags found");
    for (var i = 0; i < imgs.length; i++) {
		run(imgs[i].src, imgs[i]);
    }
}

function run(imgurl, img) {
  if (Math.floor(Date.now() / 1000) - localStorage.getItem('tokenTimeStamp') > 86400
      || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
      postImage(imgurl, img);
    });
  } else {
    postImage(imgurl, img);
  }
}

function postImage(imgurl, img) {
  var accessToken = localStorage.getItem('accessToken');
  var data = {
    'url': imgurl
  };
  var url = 'https://api.clarifai.com/v1/tag';
  return axios.post(url, data, {
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    }
    /*'content-type': 'application/x-www-form-urlencoded'*/
  }).then(function(r) {
    parseResponse(r.data, img);
  }, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
}

function parseResponse(resp, img) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;

    loadTxtFile(function (text) {
      var badwords = text.split('\n');
      var isFlagged = function (tags, badwords) {
        return badwords.some(function (v) {
          return tags.indexOf(v) >= 0;
        });
      };
      if(isFlagged(tags, badwords)){
        img.parentNode.removeChild(img);
          console.log("removed " + img.src + " " + tags.toString());
      }
	  //console.log(img.src + " " + tags.toString());
    });
  } else {
    console.log('Sorry, something is wrong.');
  }
}

function getCredentials(cb) {
  var data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };
  var url = 'https://api.clarifai.com/v1/token';

  return axios.post(url, data, {
    'transformRequest': [
      function() {
        return transformDataToParams(data);
      }
    ]
  }).then(function(r) {
    localStorage.setItem('accessToken', r.data.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    cb();
  }, function(err) {
    console.log(err);
  });
}

function transformDataToParams(data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && data[p]) {
      if (typeof data[p] === 'string'){
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
      }
      if (typeof data[p] === 'object'){
        for (var i in data[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p][i]));
        }
      }
    }
  }
  return str.join('&');
}

function loadTxtFile(callback) {   
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", BLACKLIST_URL, false);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState == 4 && rawFile.status == "200")
		{
		    var text = rawFile.responseText;
		    callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
}  
