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



var lastHour = null
function hour (e)
{
	if (lastHour)
		lastHour.classList.remove('selected')
	this.classList.toggle('selected')
	lastHour = this
}

var hours = $$('.time-select .hours .button')
for (var i = 0, il = hours.length; i < il; i++)
	hours[i].addEventListener('touchstart', hour, false)

})();
