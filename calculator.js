// 1, 2, 5: банкир, банкира, банкиров
Number.prototype.plural = function (a, b, c)
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

;(function(){

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
		nodes.timePanel.addEventListener('touchstart', function (e) { e.preventDefault() }, false)
		
		this.startClock = new Me.Clock(nodes.startClock)
		this.endClock = new Me.Clock(nodes.endClock)
		this.startClock.time(-1, -1)
		this.endClock.time(-1, -1)
		
		this.bindClockface()
		this.bindHoursSwitcher()
		this.bindResultsPanel()
		
		var me = this
		window.setInterval(function () { me.updateCurrentHour() }, 60000)
		window.addEventListener('pageshow', function () { me.updateCurrentHour() }, false)
		
		nodes.rotate.addEventListener('touchstart', function (e) { me.rotate() }, false)
		
		this.reset()
	},
	
	bindResultsPanel: function ()
	{
		var node = this.nodes.resultsPanel
		var me = this
		
		var y, scrolling, skip
		function touchstart (e)
		{
			y = e.pageY
			skip = scrolling
		}
		
		function touchmove (e)
		{
			if (Math.abs(y - e.pageY) < 10)
				return
			
			skip = scrolling = true
		}
		
		function touchend (e)
		{
			if (scrolling || skip)
				return
			
			me.setClockRotation(false)
			me.reset()
		}
		
		var timer
		function scrollend (e)
		{
			window.clearTimeout(timer)
			timer = window.setTimeout(function () { scrolling = false }, 100)
		}
		
		node.addEventListener('touchstart', touchstart, false)
		node.addEventListener('touchmove', touchmove, false)
		node.addEventListener('touchend', touchend, false)
		window.addEventListener('scroll', scrollend, false)
	},
	
	bindClockface: function ()
	{
		var nodes = this.nodes
		
		var me = this
		
		function over (e)
		{
			var target = e.target
			
			if (target.nodeType == 3)
				target = target.parentNode
			
			var type = target.dataset.type
			if (!type)
				return
			
			if (type == 'hour')
				me.hoursHovered(target)
			else
				me.minutesHovered(target)
		}
		
		function start (e)
		{
			me.timeChosen(false)
			over(e)
		}
		
		function end (e)
		{
			me.timeChosen()
		}
		
		
		nodes.clockface.addEventListener('touchover', over, false)
		nodes.clockface.addEventListener('touchstart', start, false)
		nodes.clockface.addEventListener('touchend', end, false)
		
		var lastNode
		function touchmove (e)
		{
			var touches = e.touches
			for (var i = 0, il = touches.length; i < il; i++)
			{
				var t = touches[i]
				
				var node = document.elementFromPoint(t.pageX, t.pageY)
				if (!node || node == lastNode)
					continue
				
				lastNode = node
				
				var ne = document.createEvent('Event')
				ne.initEvent('touchover', true, true)
				// ne.target = node
				node.dispatchEvent(ne)
			}
		}
		nodes.clockface.addEventListener('touchmove', touchmove, false)
	},
	
	bindHoursSwitcher: function ()
	{
		var hoursArray = Array.prototype.slice.apply(this.nodes.hoursButtons)
		hoursArray = [].concat(hoursArray, hoursArray, hoursArray, hoursArray)
		
		this.hoursArray = hoursArray
	},
	
	updateCurrentHour: function ()
	{
		this.renderCurrentHour(new Date().getHours())
	},
	
	renderCurrentHour: function (h)
	{
		h += this.rotated ? 36 : 24
		
		var hoursArray = this.hoursArray
		for (var i = 0; i <= 12; i++)
			hoursArray[h + i + 1].classList.add('hidden')
		for (var i = 0; i < 12; i++)
			hoursArray[h - i].classList.remove('hidden')
	},
	
	rotate: function ()
	{
		this.reset()
		this.setClockRotation(!this.rotated)
	},
	
	setClockRotation: function (rotated)
	{
		this.rotated = rotated
		this.updateCurrentHour()
		
		var cl = this.nodes.timePanel.classList
		if (this.rotated)
			cl.add('rotated')
		else
			cl.remove('rotated')
	},
	
	hoursHovered: function (node)
	{
		if (this.lastHourNode == node)
			return
		
		if (this.lastHourNode)
				this.lastHourNode.classList.remove('selected')
		node.classList.toggle('selected')
		this.lastHourNode = node
		
		var v = +node.dataset.value
		this.hours = v
		
		this.startClock.time(this.hours, this.minutes)
	},
	
	minutesHovered: function (node)
	{
		if (this.lastMinuteNode == node)
			return
		
		if (this.lastMinuteNode)
				this.lastMinuteNode.classList.remove('selected')
		node.classList.toggle('selected')
		this.lastMinuteNode = node
		
		var v = +node.dataset.value
		this.minutes = v
		
		this.startClock.time(this.hours, this.minutes)
	},
	
	timeChosen: function (ok)
	{
		if (ok === false)
		{
			window.clearTimeout(this.switchTimer)
			return
		}
		
		var h = this.hours
		if (h == -1)
			return
		
		var m = this.minutes
		if (m == -1)
			return
		
		window.clearTimeout(this.switchTimer)
		var me = this
		this.switchTimer = window.setTimeout(function () { me.showResults(h, m) }, 200)
	},
	
	showResults: function (sh, sm)
	{
		var now = new Date()
		
		var eh = now.getHours(),
			em = Math.floor(now.getMinutes() / 5) * 5
		
		var nodes = this.nodes
		nodes.root.classList.add('results')
		
		this.startClock.time(sh, sm)
		this.endClock.time(eh, em)
		
		
		var spent = this.calculateTimeSpent(sh, sm, eh, em),
			spentMinutes = spent % 60,
			spentHours = (spent - spentMinutes) / 60
		
		var sentence = spentHours + ' ' + spentHours.plural('час', 'часа', 'часов') + ' ' + spentMinutes + ' ' + spentMinutes.plural('минута', 'минуты', 'минут')
		sentence += ' = ' + spentHours * 60 + ' + ' + spentMinutes + ' ='
		
		nodes.time.calculations.textContent = sentence
		nodes.time.result.textContent = spent + ' ' + spent.plural('минута', 'минуты', 'минут')
		
		this.renderPersons(spent)
	},
	
	renderPersons: function (minutes)
	{
		var nodes = this.nodes
		
		var add = 0
		if (minutes < 60)
			add = minutes
		else
			add = 60
		
		var costs = minutes + add
		
		var sentence = minutes + ' ' + minutes.plural('рубль', 'рубля', 'рублей') + ' + ' + add + ' ' + add.plural('рубль', 'рубля', 'рублей') + ' ='
		
		nodes.costs.calculations.textContent = sentence
		nodes.costs.result.textContent = costs + ' ' + costs.plural('рубль', 'рубля', 'рублей')
		
		var persons = nodes.persons
		
		var child
		while (child = persons.firstChild)
			persons.removeChild(child)
		
		for (var i = 2; i <= 12; i++)
		{
			var li = document.createElement('li')
			li.textContent = i + ' ' + i.plural('гость', 'гостя', 'гостей') + ': ' + (costs * i)
			nodes.persons.appendChild(li)
		}
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
		this.startClock.time(-1, -1)
		this.endClock.time(-1, -1)
		
		this.timeChosen(false)
		this.updateCurrentHour()
		
		if (this.lastMinuteNode)
		{
			this.lastMinuteNode.classList.remove('selected')
			this.lastMinuteNode = null
		}
		if (this.lastHourNode)
		{
			this.lastHourNode.classList.remove('selected')
			this.lastHourNode = null
		}
		
		this.nodes.root.classList.remove('results')
		
		window.scrollTo(0, 0)
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
		this.nodes.root.classList.add('panic')
	}
}

window.Calculator = Me

})();


;(function(){

function Me (nodes)
{
	this.nodes = nodes
}

Me.prototype =
{
	time: function (h, m)
	{
		var nodes = this.nodes
		
		var node = nodes.hours
		if (h == -1)
		{
			node.textContent = '00'
			node.classList.remove('chosen')
		}
		else
		{
			node.textContent = h
			node.classList.add('chosen')
		}
		
		var node = nodes.minutes
		if (m == -1)
		{
			node.textContent = '00'
			node.classList.remove('chosen')
		}
		else
		{
			node.textContent = m < 10 ? '0' + m : m
			node.classList.add('chosen')
		}
	}
}

Calculator.Clock = Me

})();
