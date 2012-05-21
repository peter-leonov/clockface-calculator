function $ (q) { return document.querySelector(q) }
function $$ (q) { return document.querySelectorAll(q) }

// debug only
$('.time-result').addEventListener('touchstart', function (e) { window.location.reload(true) }, false)

;(function(){

function Me () {}

Me.prototype =
{
	bind: function (nodes)
	{
		this.nodes = nodes
		
		var me = this
		this.bindButtons(nodes.hoursButtons, function (v, node) { me.hourChosen(v) })
		this.bindButtons(nodes.minutesButtons, function (v, node) { me.minuteChosen(v) })
		
		nodes.resultsPanel.addEventListener('touchend', function (e) { me.reset() }, false)
	},
	
	bindButtons: function (nodes, cb)
	{
		var last = null
		function tap (e)
		{
			if (last)
				last.classList.remove('selected')
			this.classList.toggle('selected')
			last = this
			cb(this.getAttribute('data-value'), last)
		}
		
		for (var i = 0, il = nodes.length; i < il; i++)
			nodes[i].addEventListener('touchstart', tap, false)
	},
	
	hourChosen: function (v)
	{
		var node = this.nodes.clockHours
		node.firstChild.nodeValue = v
		node.classList.add('chosen')
		
		this.hour = v
		this.timeChosen()
	},
	
	minuteChosen: function (v)
	{
		var node = this.nodes.clockMinutes
		node.firstChild.nodeValue = v
		node.classList.add('chosen')
		
		this.minute = v
		this.timeChosen()
	},
	
	timeChosen: function ()
	{
		var h = this.hour
		if (h === undefined)
			return
		
		var m = this.minute
		if (m === undefined)
			return
		
		window.clearTimeout(this.switchTimer)
		var me = this
		this.switchTimer = window.setTimeout(function () { me.showResults(h, m) }, 500)
	},
	
	showResults: function (h, m)
	{
		this.nodes.root.classList.add('results')
	},
	
	reset: function ()
	{
		this.nodes.root.classList.remove('results')
	}
}

window.Calculator = Me

})();


;(function(){

var nodes =
{
	root: $('body'),
	
	clockHours: $('.time-result .hours'),
	clockMinutes: $('.time-result .minutes'),
	
	hoursButtons: $$('.time-select .hours .button'),
	minutesButtons: $$('.time-select .minutes .button'),
	
	resultsPanel: $('#results-panel')
}

var widget = new Calculator()
widget.bind(nodes)

// disable scrolling
document.addEventListener('touchstart', function (e) { e.preventDefault() }, false)
// hide adressbar
window.onload = function () { setTimeout(function () { window.scrollTo(0, 0) }, 1000) }

})();
