function $ (q) { return document.querySelector(q) }
function $$ (q) { return document.querySelectorAll(q) }

// debug only
$('.start-time').addEventListener('touchstart', function (e) { window.location.reload(true) }, false)

;(function(){

function Me ()
{
	this.hour = -1
	this.minute = -1
}

Me.prototype =
{
	bind: function (nodes)
	{
		this.nodes = nodes
		
		var me = this
		this.bindButtons(nodes.hoursButtons, function (node) { me.hourChosen(node) })
		this.bindButtons(nodes.minutesButtons, function (node) { me.minuteChosen(node) })
		
		nodes.resultsPanel.addEventListener('touchend', function (e) { me.reset() }, false)
	},
	
	bindButtons: function (nodes, cb)
	{
		for (var i = 0, il = nodes.length; i < il; i++)
			nodes[i].addEventListener('touchstart', function () { cb(this) }, false)
	},
	
	renderClock: function ()
	{
		var nodes = this.nodes
		
		var v = this.hour
		var node = nodes.clockHours
		if (v == -1)
		{
			node.firstChild.nodeValue = '00'
			node.classList.remove('chosen')
		}
		else
		{
			node.firstChild.nodeValue = v
			node.classList.add('chosen')
		}
		
		var v = this.minute
		var node = nodes.clockMinutes
		if (v == -1)
		{
			node.firstChild.nodeValue = '00'
			node.classList.remove('chosen')
		}
		else
		{
			node.firstChild.nodeValue = v
			node.classList.add('chosen')
		}
	},
	
	hourChosen: function (node)
	{
		if (this.lastHourNode)
				this.lastHourNode.classList.remove('selected')
		node.classList.toggle('selected')
		this.lastHourNode = node
		
		var v = node.getAttribute('data-value')
		
		
		this.hour = v
		this.timeChosen()
	},
	
	minuteChosen: function (node)
	{
		if (this.lastMinuteNode)
				this.lastMinuteNode.classList.remove('selected')
		node.classList.toggle('selected')
		this.lastMinuteNode = node
		
		var v = node.getAttribute('data-value')
		
		
		this.minute = v
		this.timeChosen()
	},
	
	timeChosen: function ()
	{
		this.renderClock()
		
		var h = this.hour
		if (h == -1)
			return
		
		var m = this.minute
		if (m == -1)
			return
		
		window.clearTimeout(this.switchTimer)
		var me = this
		this.switchTimer = window.setTimeout(function () { me.showResults(h, m) }, 500)
	},
	
	showResults: function (sh, sm)
	{
		var now = new Date()
		
		var eh = now.getHours(),
			em = Math.floor(now.getMinutes() / 5) * 5
		
		var nodes = this.nodes
		nodes.root.classList.add('results')
		
		var start = nodes.start
		start.hour.firstChild.nodeValue = sh
		start.minute.firstChild.nodeValue = sm
		
		var end = nodes.end
		end.hour.firstChild.nodeValue = eh
		end.minute.firstChild.nodeValue = em < 10 ? '0' + em : em
	},
	
	reset: function ()
	{
		this.minute = -1
		this.hour = -1
		this.renderClock()
		
		this.lastMinuteNode.classList.remove('selected')
		this.lastMinuteNode = null
		this.lastHourNode.classList.remove('selected')
		this.lastHourNode = null
		
		this.nodes.root.classList.remove('results')
	}
}

window.Calculator = Me

})();


;(function(){

var nodes =
{
	root: $('body'),
	
	clockHours: $('.start-time .clock .hours'),
	clockMinutes: $('.start-time .clock .minutes'),
	
	hoursButtons: $$('.time-select .hours .button'),
	minutesButtons: $$('.time-select .minutes .button'),
	
	resultsPanel: $('#results-panel'),
	start:
	{
		hour: $('#results-panel .start .hours'),
		minute: $('#results-panel .start .minutes')
	},
	end:
	{
		hour: $('#results-panel .end .hours'),
		minute: $('#results-panel .end .minutes')
	}
}

var widget = new Calculator()
widget.bind(nodes)

// disable scrolling
document.addEventListener('touchstart', function (e) { e.preventDefault() }, false)
// hide adressbar
window.onload = function () { setTimeout(function () { window.scrollTo(0, 0) }, 1000) }

})();
