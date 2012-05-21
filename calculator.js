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
		this.bindButtons(nodes.hoursButtons, function (v) { me.hourSelected(v) })
		this.bindButtons(nodes.minutesButtons, function (v) { me.minuteSelected(v) })
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
			cb(this.getAttribute('data-value'))
		}
		
		for (var i = 0, il = nodes.length; i < il; i++)
			nodes[i].addEventListener('touchstart', tap, false)
	},
	
	hourSelected: function (v)
	{
		this.nodes.clockHours.firstChild.nodeValue = v
	},
	
	minuteSelected: function (v)
	{
		this.nodes.clockMinutes.firstChild.nodeValue = v
	}
}

window.Calculator = Me

})();


;(function(){

var nodes =
{
	clockHours: $('.time-result .hours'),
	clockMinutes: $('.time-result .minutes'),
	
	hoursButtons: $$('.time-select .hours .button'),
	minutesButtons: $$('.time-select .minutes .button')
}

var widget = new Calculator()
widget.bind(nodes)

// disable scrolling
document.addEventListener('touchstart', function (e) { e.preventDefault() }, false)
// hide adressbar
window.onload = function () { setTimeout(function () { window.scrollTo(0, 0) }, 1000) }

})();
