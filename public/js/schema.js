(function() {
  var Schema, btnSave, iconsPath, schema, tableSize;

  iconsPath = 'icons.svg';

  tableSize = 20;

  Schema = (function() {
    function Schema(buttons) {
      this.parent = $('.schema-container')[0];
      this.paper = Snap(this.parent.children[0]);
      this.paper.attr({
        width: 800,
        height: 500
      });
      this.container = this.paper.g();
      this._bindEvents();
    }

    Schema.prototype._bindEvents = function() {
      return this.paper.node.addEventListener('click', this.addTable.bind(this));
    };

    Schema.prototype.addTable = function(e) {
      var table;
      table = this.paper.circle(e.offsetX, e.offsetY, tableSize).addClass('schema-table');
      return this.container.add(table);
    };

    return Schema;

  })();

  schema = new Schema;

  btnSave = $('.btn-save-schema')[0];

  btnSave.onclick = function(event) {
    return $.ajax({
      url: '/company',
      method: 'POST',
      data: {
        schema: schema.paper.innerSVG()
      },
      statusCode: {
        404: function() {
          return alert('Not Found');
        },
        200: function() {
          return alert('Saved');
        }
      }
    });
  };


  /*buttons = [	
  	{	
  		icon: 'pin'
  		action: (paper, container, x, y) -> 
  			 * paper - svg el
  			 * container - container to nest el
  			 * x,y mouse coords
  			table = paper
  				.circle x, y, tableSize
  				.addClass 'schema-table'
  			container.add table
  	}
  	 * {
  	 * 	icon: 'search'
  	 * 	action: -> console.log 'Seraching...'
  	 * }
  	 * {
  	 * 	icon: 'cloud'
  	 * 	action: -> console.log 'Connecting to cloud...'
  	 * }
  	 * {
  	 * 	icon: 'settings'
  	 * 	action: -> console.log 'Opening settings...'
  	 * }
  	 * {
  	 * 	icon: 'rewind'
  	 * 	action: -> console.log 'Rewinding...'
  	 * }
  	{
  		icon: 'preview'
  		action: -> console.log 'Preview activated...'
  	}
  	{
  		icon: 'delete'
  		action: -> console.log 'Deleting...'
  	}
  ]
   */

}).call(this);
