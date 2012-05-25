document.addEventListener
(
	'mousedown',
	function (e)
	{
		var target = e.target
		
		var ne = document.createEvent('Event')
		ne.initEvent('touchstart', true, true)
		
		ne.pageX = e.pageX
		ne.pageY = e.pageY
		
		var touches = [ne]
		ne.touches = touches
		
		if (!target.dispatchEvent(ne))
			e.preventDefault()
	},
	true
)

document.addEventListener
(
	'mouseup',
	function (e)
	{
		var target = e.target
		
		var ne = document.createEvent('Event')
		ne.initEvent('touchend', true, true)
		
		ne.pageX = e.pageX
		ne.pageY = e.pageY
		
		var touches = [ne]
		ne.touches = touches
		
		if (!target.dispatchEvent(ne))
			e.preventDefault()
	},
	true
)
