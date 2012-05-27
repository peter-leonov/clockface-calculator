;(function(){

function ClassList (node)
{
	this.node = node
}

var R = RegExp, rexCache = {}

ClassList.prototype =
{
	add: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (!className)
			node.className = cn
		else
			node.className = className + ' ' + cn
		
		return cn
	},
	
	remove: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (className)
		{
			var rex = rexCache[cn]
			if (!rex)
			{
				// the following regexp has to be the exact copy of the regexp from hasClassName()
				// because these two methods have the same regexp cache
				rex = new R('(?:^| +)(?:' + cn + '(?:$| +))+', 'g')
				rexCache[cn] = rex
			}
			
			node.className = className.replace(rex, ' ').replace(/^\s+|\s+$/g, '') // trim
		}
		return cn
	},
	
	has: function (cn)
	{
		var node = this.node
		
		var className = this.className
		if (className == cn)
			return true
		
		// the following regexp has to be the exact copy of the regexp from removeClassName()
		// because these two methods have the same regexp cache
		var rex = rexCache[cn]
		if (rex)
			rex.lastIndex = 0
		else
		{
			rex = new R('(?:^| +)(?:' + cn + '(?:$| +))+', 'g')
			rexCache[cn] = rex
		}
		
		return rex.test(className)
	},
	
	toggle: function (cn)
	{
		if (this.has(cn))
			this.remove(cn)
		else
			this.add(cn)
	}
}

function getClassList ()
{
	var classList = this.__classList
	if (classList)
		return classList
	
	return this.__classList = new ClassList(this)
}

Object.defineProperty(Element.prototype, 'classList', {get: getClassList})

})();
