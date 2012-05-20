;(function(){

function touchstart (e)
{
	e.preventDefault()
	window.location.reload(true)
}
document.addEventListener('touchstart', touchstart, false)

function tap (e)
{
	e.preventDefault()
	e.stopPropagation()
	this.classList.toggle('selected')
}

var buttons = document.querySelectorAll('.time-select .button')
for (var i = 0, il = buttons.length; i < il; i++)
	buttons[i].addEventListener('touchstart', tap, false)

})();

