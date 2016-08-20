var workerBlob;
var scanWorker;
var brokenItems = 0;

function itemBreak(){
	var elem = document.querySelector('#breaksound');
	elem.play();
	//append('An item has low durability');
}

//listener to receive text of the worker
//this creates a blob that is later used to create the worker
document.addEventListener('intervalWorkerText', function(e){
	if(!workerBlob) //do nothing i we've already got the blob
	{
		//otherwise create it
		try {
			workerBlob = new Blob([e.detail], {type: 'application/javascript'});
		} catch (e) { // Backwards-compatibility
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			workerBlob = new BlobBuilder();
			workerBlob.append(e.detail);
			workerBlob = workerBlob.getBlob();
		}
	}

	scanWorker = new Worker(URL.createObjectURL(workerBlob));
	scanWorker.onmessage = function(){
		if(!inv) 
			return;
		var newBrokenItems = 0;
		for(var c = 0;c<inv.length;c++)
			if(inv[c].equip==2 && /\S/.test(inv[c].title.text))
				newBrokenItems++;
		if(newBrokenItems>0)
			itemBreak();

		brokenItems = newBrokenItems;

		if(hp_status && hp_status.val<25)
		{
			var elem = document.querySelector('#healthsound');
			elem.play();
		}
	};
	scanWorker.postMessage(500);
});