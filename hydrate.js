(function($) {
	var components = [];

	var publicActions = {

        create : function(componentName, component) {               
        	var Constructor = function(){ 
        		BaseComponent.apply(this);
        	};
        	
        	Constructor.prototype = new BaseComponent();
        	$.extend(Constructor.prototype, component);
    		Constructor.prototype.constructor = Constructor;
    		
        	components[componentName] = new Constructor();        	
        },

        render: function(componentName, container, data) {
        	var component = components[componentName];
        	component.$root = $(container);
        	
        	if (component.componentDidMount && component.isUnmounted){
        		component.isUnmounted = false;
        		component.componentDidMount();
        	}

        	if (data){
        		component.setData(data);
    		}else{
    			component.setState(component.getInitialState());
    		}
            
            component.renderComponent();
        }

    }

    /**
     * BaseComponent is methods and properties shared by all components.  This will be extended upon
     * component creation.
     * @constructor
     */
    var BaseComponent = function(){
    	this.isUnmounted = true;
		this.$root = "";
		this.state = {};
    }

    /**
     * Set state updates the components data AND re-renders the component itself.  State chages always reflect
     * in the rendered component.
     */
    BaseComponent.prototype.setState = function(newState){
		$.extend(this.state, newState);
		
		if (newState.data){
			this.setData(newState.data);
			this.renderComponent();
		}

		return this.state;
	};

    /**
     * Sets the data used to render the component.
     */
	BaseComponent.prototype.setData = function(data){
		this.data = data;
	};

    /**
     * Renders the actual component using the current data obj on the instance of the component.  Calls the
     * 'render' function set by the component creator.
     */
    BaseComponent.prototype.renderComponent = function(){
        var $updatedComponent = this.render();
        if (this.renderedComponent){
            this.$root.find(this.renderedComponent).replaceWith($updatedComponent);
        }else{
            this.$root.append($updatedComponent);
        }
        this.renderedComponent = $updatedComponent;
    };

	$.extend({
		hydrate: function(method) {		
        

	        if (publicActions[method]) {
	            return publicActions[method].apply(this, Array.prototype.slice.call(arguments, 1));
	        } else if (typeof method === 'object' || !method) {
	            return publicActions.create.apply(this, arguments);
	        } else {
	            $.error( 'Method "' +  method + '" could not be found.');
	        }


			return this;
		}
	})
}(jQuery))