function $ (q) { return document.querySelector(q) }
function $$ (q) { return document.querySelectorAll(q) }

// function log (msg)
// {
// 	var li = document.createElement('li')
// 	li.textContent = msg
// 	$('#results-panel').appendChild(li)
// }


function preload ()
{
	if (window.navigator.standalone === false)
		document.documentElement.classList.add('in-browser')
	
	$('#clockface .reset').addEventListener('touchstart', function (e) { window.location.reload(true) }, false)
}


window.addEventListener('load', preload, false)

function ready ()
{

var nodes =
{
	root: $('body'),
	
	timePanel: $('#time-panel'),
	clockface: $('#clockface'),
	
	hoursButtons: $$('#clockface .hours .button'),
	minutesButtons: $$('#clockface .minutes .button'),
	
	resultsPanel: $('#results-panel'),
	startClock:
	{
		hours: $('#time-panel .period .start .hours'),
		minutes: $('#time-panel .period .start .minutes')
	},
	endClock:
	{
		hours: $('#time-panel .period .end .hours'),
		minutes: $('#time-panel .period .end .minutes')
	},
	
	time:
	{
		calculations: $('#results-panel .time .calculations'),
		result: $('#results-panel .time .result')
	},
	costs:
	{
		calculations: $('#results-panel .costs .calculations'),
		result: $('#results-panel .costs .result')
	},
	persons: $('#results-panel .persons')
}

var widget = new Calculator()
widget.bind(nodes)

document.body.classList.remove('hidden')
document.getElementById('viewport').setAttribute('content', 'user-scalable=no, initial-scale=1.0, width=device-width')

}

window.addEventListener('load', ready, false)

if (!/mobile/i.test(window.navigator.userAgent))
{
	var script = document.createElement('script')
	script.src = 'mouse-to-touch.js'
	document.body.appendChild(script)
}
