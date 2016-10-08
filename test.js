$.hydrate("create", "simpleP", {
	getInitialState: function(){
		return {data: {text: "This is initial"}};
	},
	componentDidMount: function() {
		var self = this;
		setTimeout(function(){ self.setState({data: {text: "Updated text!"}}) }, 3000);
	},
	render: function(){
		return $("<p/>").html(this.data.text);
	}
})

$(function() {
	$.hydrate("render", "simpleP", $("#container"), {text: "This is hydrated."});
});