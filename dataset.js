;(function(){

function getDataset ()
{
	var dataset = this.__dataset // yes, it's static
	if (dataset)
		return dataset
	
	dataset = this.__dataset = {}
	
	var attrs = this.attributes
	for (var i = 0, il = attrs.length; i < il; i++)
	{
		var attr = attrs[i]
		
		var name = attr.name
		if (!/^data-/.test(name))
			continue
		
		dataset[name.substr(5)] = attr.value
	}
	
	return dataset
}

Object.defineProperty(Element.prototype, 'dataset', {get: getDataset})

})();
