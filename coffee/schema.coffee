tableSize = 20 # table size px

# =================================================
# Schema
# =================================================
class Schema
	constructor: (owner, data) ->
		@parent = $('.schema-container')
		@paper = Snap @parent.children()[0]

		@paper.attr
			width: do @parent.width
			height: do @parent.height
		@tables = do @paper.g

		@owner = owner
		@fromJSON(data)

		do @_bindEvents

	# =================
	# Private
	# =================
	_bindEvents: ->
		@paper.node.addEventListener 'dblclick', @.createTable.bind @

	_tableInfo: (tableId) ->
		# window.location = '/table?p='+@.id+'&t='+tableId
		form = $ 'form#table-info'
		asd = do form.serialize

	_hint: (ind, x, y, r) ->
		hint = @paper
				.text 0, 0, ind
				.addClass 'schema-table-hint'
				.attr textpath: "M #{x-r},#{y} L#{x+r},#{y}"
		hint.select('*').attr startOffset: '40%'
		hint

	_sector: (x, y, r) ->
		@paper
			.circle x, y, r
			.addClass 'schema-table'

	_table: (sector, hint, id) ->
		@paper
			.g sector, hint
			.attr 'id', id
			.data 'number', hint.text
			.drag @_moveTable, () -> @.data('origTransform', @.transform().local)
			.dblclick (e) => 
				@._tableInfo e.target.id
				do e.stopPropagation

	_moveTable: (dx, dy) ->
		this.attr 
			transform: "#{this.data('origTransform')}#{if this.data('origTransform') then 't' else 'T'}#{dx},#{dy}"

	# =================
	# Public
	# =================
	createTable: (e) ->
		@.addTable e.offsetX, e.offsetY, tableSize, null, @tables.children().length

	addTable: (x, y, r, id, num) ->
		@tables.add @_table @_sector(x, y, r), @_hint(num, x, y, r), id

	########################
	# Import/export to JSON
	########################
	toJSON: -> 
		res = {
			company: @owner
			id: @id,
			tables: []
		}

		x = Snap.parse do schema.paper.innerSVG
		query = x.selectAll ".schema-table"
		for table in query.items
			attr = table.node.attributes
			res.tables.push {
				id: attr.id.value
				x: attr.cx.value
				y: attr.cy.value
				r: attr.r.value
			}
		console.log res
		res

	fromJSON: (data) ->
		if (data)
			@.id = data._id  
			if data.tables
				for table in data.tables
					@addTable table.x, table.y, table.r, table._id

schema = {}

window.createSchema = (owner, data) ->
	schema = new Schema owner, data

btnSave = $('.btn-save-schema')[0]

btnSave.onclick = (event) ->
	$.ajax {
		url: '/plan'
		method: 'POST'
		dataType: 'json'
		data: {
			plan: do schema.toJSON
		}
		statusCode: {
			404: ->
				alert 'Not Found'
			200: ->
				do window.location.reload
		}
	}


