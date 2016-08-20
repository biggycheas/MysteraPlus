//we can't load the worker from disk via the constructor because CORS, so read its text
//we'll use the text to recreate it later
var workerText;
var client = new XMLHttpRequest();
client.open('GET', 'interval_worker.js');
client.onreadystatechange = function() {
 	workerText = client.responseText;
}
client.send();

//listener for messages coming from the page
//these are keystrokes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.type == 'intervalWorkerRequest'){
		sendResponse(workerText);
	}
});

//this querys for all active tabs in the current window and sends the request object to the first one
function messageActiveTab(request){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id,request);
	});
}