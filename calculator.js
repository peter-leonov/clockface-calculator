function $ (q) { return document.querySelector(q) }
function $$ (q) { return document.querySelectorAll(q) }

;(function(){

// debug only
$('.time-result').addEventListener('touchstart', function (e) { window.location.reload(true) }, false)

})();


;(function(){

var result = $('.time-result')

function touchstart (e)
{
	e.preventDefault()
}
document.addEventListener('touchstart', touchstart, false)



function bindButtons (nodes, cb)
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
}

var nodes =
{
	hours: $('.time-result .hours').firstChild,
	minutes: $('.time-result .minutes').firstChild
}

function hours (v)
{
	nodes.hours.nodeValue = v
}

function minutes (v)
{
	nodes.minutes.nodeValue = v
}

bindButtons($$('.time-select .hours .button'), hours)
bindButtons($$('.time-select .minutes .button'), minutes)

window.onload = function () { setTimeout(function () { window.scrollTo(0, 0) }, 500) }

})();
