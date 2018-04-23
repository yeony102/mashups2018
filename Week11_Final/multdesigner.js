(function() { 

	let xmlhttp = new XMLHttpRequest();
	let itpJobs;
	let currentState;

	xmlhttp.open('GET', 'data/foritpers.json', true);
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4) {
	        if(xmlhttp.status == 200) {
	            usaJobs = JSON.parse(xmlhttp.responseText);
	            // console.log(usaJobs.Alabama.total);
	            // console.log(numberWithCommas(122222345));
	         }
	    }
	};
	xmlhttp.send(null);

})();