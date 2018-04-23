let stateCode = {
		"AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", 
		"GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine",
		"MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
		"NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", 
		"OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
		"VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

(function() { 

	let xmlhttp = new XMLHttpRequest();
	let usaJobs;
	let currentState;

	xmlhttp.open('GET', 'data/intheus.json', true);
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4) {
	        if(xmlhttp.status == 200) {
	            usaJobs = JSON.parse(xmlhttp.responseText);
	            // console.log(usaJobs.Alabama.total);
	            handleInTheUSA();
	            // console.log(numberWithCommas(122222345));
	         }
	    }
	};
	xmlhttp.send(null);

	let usaTotal = {
			"total": 0,
			"average": 0,
			"topjobs": []
	};



	function handleInTheUSA() {

		let allTopJobs = {};

		// get the total number of jobs and the average number of jobs in the US
		// Also, integrate all top jobs in one object
		for(let key in usaJobs) {
			// console.log(key);
			// console.log(usaJobs[key].topjobs);
			usaTotal.total += usaJobs[key].total;
			for(let i=0; i<usaJobs[key].topjobs.length; i++) {
				// console.log(t);
				let jobName = usaJobs[key].topjobs[i].job;

				if(allTopJobs[jobName]) {
					allTopJobs[jobName].count += usaJobs[key].topjobs[i].count;		// the total number of this job through out the US
					allTopJobs[jobName].repeat = allTopJobs[jobName].repeat + 1;	// This is for checking how many states have this job as one of their top jobs
				} else {
					let entry = {
						"count": usaJobs[key].topjobs[i].count,
						"repeat": 0
					};
					allTopJobs[jobName] = entry;
				}
			}
		}
		usaTotal.average = usaTotal.total/50;
		// console.log(usaTotal.total);
		// console.log(usaTotal.average);
		// console.log(allTopJobs);

		changeTitles('United States', numberWithCommas(usaTotal.total));

		// Sort the allTopJobs array (Get the 10 most popular jobs in the entire US)	
		let top10jobs = [];
		for(let key in allTopJobs) {
			// console.log(key);
			let entry = {
					"job": key,
					"count": allTopJobs[key].count,
					"repeat": allTopJobs[key].repeat
			};
			// console.log(entry);
			if(!top10jobs[0]) {
				// console.log("initial input");
				top10jobs.push(entry)
			} else {
				let skip = false;
				for(let i=0; i<top10jobs.length && (!skip); i++) {
					// console.log(entry.repeat);
					// console.log(top10jobs[i].repeat);
					if(entry.repeat > top10jobs[i].repeat){
						// console.log("Bigger than " + i +"th element.")
						top10jobs.splice(i,0,entry);
						skip = true;
					} else if(i == (top10jobs.length - 1) && entry.repeat <= top10jobs[i].repeat) {
						// console.log("The smallest number");
						top10jobs.push(entry);
						skip = true;
					}
				}
			}
		}
		for(let i=0; i<10; i++) {
			usaTotal.topjobs.push(top10jobs[i]);
			console.log(usaTotal.topjobs[i].job + ": " + top10jobs[i].repeat + " (" + top10jobs[i].count + " jobs)");
		}

		colourMap();
		// popularInTheUSA();
		currentState = 'United States'
		drawPopularJobsChart(usaTotal.topjobs);
	}

	// Colour the svg map: the more jobs there are, the darker colour the state has
	function colourMap() {

		for(key in stateCode) {
			// debugger;
			let s = document.getElementById('us-map').getElementById(key);

			if(usaJobs[stateCode[key]].total > (usaTotal.average*2)) {	
				s.setAttribute('fill', '#383838');
				s.setAttribute('stroke', '#2C2C2C');
				s.setAttribute('stroke-width', '0.5px');
			} else if(usaJobs[stateCode[key]].total > (usaTotal.average*1.5)) {
				s.setAttribute('fill', '#5A5A5A');
				s.setAttribute('stroke', '#2C2C2C');
				s.setAttribute('stroke-width', '0.5px');
			} else if(usaJobs[stateCode[key]].total > usaTotal.average) {
				s.setAttribute('fill', '#878787');
				s.setAttribute('stroke', '#2C2C2C');
				s.setAttribute('stroke-width', '0.5px');
			} else if(usaJobs[stateCode[key]].total > (usaTotal.average*0.5)) {
				s.setAttribute('fill', '#C6C6C6');
				s.setAttribute('stroke', '#2C2C2C');
				s.setAttribute('stroke-width', '0.5px');
			} else {
				s.setAttribute('fill', '#E7E7E7');
				s.setAttribute('stroke', '#2C2C2C');
				s.setAttribute('stroke-width', '0.5px');
			}

		}
	}

	// Change the map title (Name of the states and the total number of jobs in there)
	function changeTitles(state, total) {

		let stateName = document.getElementById('locName');
		let nJobs = document.getElementById('jobcount_num');
		let chartState = document.getElementById('graph_state');

		stateName.innerHTML = state.toUpperCase();
		nJobs.innerHTML = numberWithCommas(total);
		// console.log("1. *********" + state);
		if(state == 'United States') {
			chartState.innerHTML = "THE US";
		} else {
			// console.log("2. *********" + state);
			chartState.innerHTML = state.toUpperCase();
		}
		

	}

	function drawPopularJobsChart(topJobs) {

		let jlist = document.getElementById('joblist').getElementsByTagName('li');
		// console.log(jlist);
		for(let i=0; i<10; i++) {
			// console.log()
			jlist[i].innerHTML = topJobs[i].job;
			// console.log(topJobs[i].job);
		}

		let blist = document.getElementById('barlist').getElementsByClassName('bar');
		let y2 = document.getElementById('y2');
		let y3 = document.getElementById('y3');

		let totalCounts = []
		for(let i=0; i<10; i++) {
			totalCounts.push(topJobs[i].count);
		}

		// get the maximum value for the y-axis 
		let max = Math.max(...totalCounts);
		console.log("Max count: " + max);

		let base;

		if(max > 100000) {
			base = 50000;
		} else if(max > 10000) {
			base = 5000;
		} else if(max > 1000) {
			base = 500;
		} else {
			base = 50;
		}
		maxLbl = Math.ceil(max/base);
		maxLbl = maxLbl * base;

		console.log("---------" + maxLbl);

		for(let i=0; i<10; i++) {
			let w = topJobs[i].count;
			w = (w/maxLbl)*100;
			// console.log("w= " + w);
			blist[i].style.width = w + '%';
		}

		// set the y-axis labels
		y2.innerHTML = (maxLbl/1000)/2 + 'k';
		y3.innerHTML = (maxLbl/1000) + 'k';
	}
/*
	function popularInTheUSA() {
		

		let jlist = document.getElementById('joblist').getElementsByTagName('li');
		// console.log(jlist);
		for(let i=0; i<10; i++) {
			// console.log()
			jlist[i].innerHTML = usaTotal.topjobs[i].job;
		}

		let blist = document.getElementById('barlist').getElementsByClassName('bar');
		let y2 = document.getElementById('y2');
		let y3 = document.getElementById('y3');

		let totals = []
		for(let i=0; i<10; i++) {
			totals.push(usaTotal.topjobs[i].total);
		}

		let max = Math.max(...totals);

		maxLbl = Math.ceil(max/50000);
		maxLbl = maxLbl * 50000;

		// console.log("---------" + maxLbl);

		for(let i=0; i<10; i++) {
			let w = usaTotal.topjobs[i].total;
			w = (w/maxLbl)*100;
			console.log(w);
			blist[i].style.width = w + '%';
		}

		y2.innerHTML = (maxLbl/1000)/2 + 'k';
		y3.innerHTML = (maxLbl/1000) + 'k';
	} 	*/

	// add Event Listeners to the map
	let p = document.getElementById('s2').getElementsByTagName('path');
	for(let i=0; i<p.length; i++) {

		// Mouse over: the state name appears 
		p[i].addEventListener('mouseover', function(e) {

			let state;
			for(key in stateCode) {
				if(key == this.id) {
					state = stateCode[key];
					break;
				}
			}
			let info = document.getElementById('state-info');
			info.innerHTML = state;
			info.style.top = (e.pageY-30) + 'px';
			info.style.left = (e.pageX-10) + 'px';
			info.style.opacity = 1;
			// info.setAttribute('opacity', '1');
			// info.style.zIndex = '50';

			// The State name text follows the cursor while the it is in the state's territory.
			document.addEventListener('mousemove', function(e){
				info.style.top = (e.pageY-30) + 'px';
				info.style.left = (e.pageX-10) + 'px';
			}, false);

		}, false);

		// Mouse Out: the state name disappears
		p[i].addEventListener('mouseout', function(e) {

			let info = document.getElementById('state-info');
			info.style.opacity = 0;
			document.removeEventListener('mousemove', function(e){}, false);

		}, false);

		// Click: Show the job information of the state
		p[i].addEventListener('click', selectState, false);

	}

	function selectState(e) {

		let existing = document.getElementsByClassName('selectedPath');
		if(existing[0]) {
			existing[0].classList.remove('selectedPath');
		}

		if(currentState == stateCode[e.target.id]) {
			currentState = 'United States';
			changeTitles(currentState, numberWithCommas(usaTotal.total));
			drawPopularJobsChart(usaTotal.topjobs);
		} else {
			e.target.setAttribute('class', 'selectedPath');
			currentState = stateCode[e.target.id]; 
			console.log(currentState);
			changeTitles(currentState, numberWithCommas(usaJobs[currentState].total));
			// debugger;
			console.log(usaJobs[currentState].topjobs);
			drawPopularJobsChart(usaJobs[currentState].topjobs);
		}
		

	}
	

			// 	s.addEventListener('mouseover', function(e) {
			// 	// console.log("IN!");
			// 	// console.log(e.clientX, + " " + e.clientY);
			// 	let info = document.getElementById('state-info');
			// 	info.innerHTML = key;
			// 	info.style.top = (e.clientY - 10) + 'px';
			// 	info.style.left = (e.clientX + 10) + 'px';
			// 	info.setAttribute('opacity', '1');
			// 	info.style.zIndex = '50';
			// 	// info.style.opacity = '1';
			// }, false);



})();