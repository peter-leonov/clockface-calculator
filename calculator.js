function $ (q) { return document.querySelector(q) }
function $$ (q) { return document.querySelectorAll(q) }

// 1, 2, 5: банкир, банкира, банкиров
String.prototype.plural = Number.prototype.plural = function (a, b, c)
{
	if (this % 1)
		return b
	
	var v = Math.abs(this) % 100
	if (11 <= v && v <= 19)
		return c
	
	v = v % 10
	if (2 <= v && v <= 4)
		return b
	if (v == 1)
		return a
	
	return c
}

// debug only
$('.start-time').addEventListener('touchstart', function (e) { window.location.reload(true) }, false)

;(function(){

function preventDefault (e) { e.preventDefault() }

function Me ()
{
	this.hours = -1
	this.minutes = -1
}

Me.prototype =
{
	bind: function (nodes)
	{
		this.nodes = nodes
		
		if (!this.makeTest())
		{
			this.panic()
			return
		}
		
		// disable scrolling
		document.addEventListener('touchstart', preventDefault, false)
		
		var me = this
		this.bindButtons(nodes.hoursButtons, function (node) { me.hoursChosen(node) })
		this.bindButtons(nodes.minutesButtons, function (node) { me.minutesChosen(node) })
		
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
		
		var v = this.hours
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
		
		var v = this.minutes
		var node = nodes.clockMinutes
		if (v == -1)
		{
			node.firstChild.nodeValue = '00'
			node.classList.remove('chosen')
		}
		else
		{
			node.firstChild.nodeValue = v < 10 ? '0' + v : v
			node.classList.add('chosen')
		}
	},
	
	hoursChosen: function (node)
	{
		if (this.lastHourNode)
				this.lastHourNode.classList.remove('selected')
		node.classList.toggle('selected')
		this.lastHourNode = node
		
		var v = +node.getAttribute('data-value')
		
		this.hours = v
		this.timeChosen()
	},
	
	minutesChosen: function (node)
	{
		if (this.lastMinuteNode)
				this.lastMinuteNode.classList.remove('selected')
		node.classList.toggle('selected')
		this.lastMinuteNode = node
		
		var v = +node.getAttribute('data-value')
		
		this.minutes = v
		this.timeChosen()
	},
	
	timeChosen: function ()
	{
		this.renderClock()
		
		var h = this.hours
		if (h == -1)
			return
		
		var m = this.minutes
		if (m == -1)
			return
		
		window.clearTimeout(this.switchTimer)
		var me = this
		this.switchTimer = window.setTimeout(function () { me.showResults(h, m) }, 350)
	},
	
	showResults: function (sh, sm)
	{
		var now = new Date()
		
		var eh = now.getHours(),
			em = Math.floor(now.getMinutes() / 5) * 5
		
		var nodes = this.nodes
		nodes.root.classList.add('results')
		
		var start = nodes.start
		start.hours.firstChild.nodeValue = sh
		start.minutes.firstChild.nodeValue = sm < 10 ? '0' + sm : sm
		
		var end = nodes.end
		end.hours.firstChild.nodeValue = eh
		end.minutes.firstChild.nodeValue = em < 10 ? '0' + em : em
		
		
		var spent = this.calculateTimeSpent(sh, sm, eh, em),
			spentMinutes = spent % 60,
			spentHours = (spent - spentMinutes) / 60
		
		var sentence = spentHours + ' ' + spentHours.plural('час', 'часа', 'часов') + ' ' + spentMinutes + ' ' + spentMinutes.plural('минута', 'минуты', 'минут')
		sentence += ' = ' + spentHours * 60 + ' + ' + spentMinutes
		sentence += ' = ' + spent + ' ' + spent.plural('минута', 'минуты', 'минут')
		
		nodes.time.firstChild.nodeValue = sentence
		
		var add = 0
		if (spent < 60)
			add = spent
		else
			add = 60
		
		var costs = spent + add
		
		var sentence = spent + ' ' + spent.plural('рубль', 'рубля', 'рублей') + ' + ' + add + ' ' + add.plural('рубль', 'рубля', 'рублей')
		sentence += ' = ' + costs + ' ' + costs.plural('рубль', 'рубля', 'рублей')
		nodes.costs.firstChild.nodeValue = sentence
	},
	
	calculateTimeSpent: function (sh, sm, eh, em)
	{
		var start = sh * 60 + sm
		var end = eh * 60 + em
		
		if (start == end)
			return 24 * 60
		
		if (start < end)
			return end - start
		
		// start > end
		
		return 24 * 60 - start + end
	},
	
	reset: function ()
	{
		this.minutes = -1
		this.hours = -1
		this.renderClock()
		
		this.lastMinuteNode.classList.remove('selected')
		this.lastMinuteNode = null
		this.lastHourNode.classList.remove('selected')
		this.lastHourNode = null
		
		this.nodes.root.classList.remove('results')
	},
	
	makeTest: function ()
	{
		if
		(
			this.calculateTimeSpent(22, 0, 22, 0) == 1440 &&
			this.calculateTimeSpent(17, 15, 22, 30) == 315 &&
			this.calculateTimeSpent(22, 0, 1, 30) == 210
		)
		{
			return true
		}
		
		return false
	},
	
	panic: function ()
	{
		document.removeEventListener('touchstart', preventDefault, false)
		this.nodes.root.classList.add('panic')
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
		hours: $('#results-panel .start .hours'),
		minutes: $('#results-panel .start .minutes')
	},
	end:
	{
		hours: $('#results-panel .end .hours'),
		minutes: $('#results-panel .end .minutes')
	},
	
	time: $('#results-panel .time'),
	costs: $('#results-panel .costs')
}

var widget = new Calculator()
widget.bind(nodes)

// hide adressbar
window.onload = function () { setTimeout(function () { window.scrollTo(0, 0) }, 1000) }

})();
