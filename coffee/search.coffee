$(window).load () ->
	if xhr
		xhr.abort()

	xhr = $('#btn-search').click () ->
		name = $('.search-query').val()
		$.ajax {
			url: '/company/search?name=' + name,
			method: 'GET',
			complete: (jqXHR, status) ->
				if status == 'success' 
					fillTable 'companies-table', jqXHR.responseJSON
				else
					$.notify jqXHR.responseText, 'warn'
				xhr = null
		}

fillTable = (id, data) ->
	# removing all rows
	table = $('#' + id + ' tbody').empty()

	for row in data
		table.append fillRowTemplate row


fillRowTemplate = (data) -> 
	template = rowTemplate
	for name, field of data
		template = template.replace new RegExp("!#{name}"), field

	template


rowTemplate = """
<tr>
	<td>
		<a href='/company/profile/?id=!_id'>
			<img src=/logos/!logo height='50' width='50' class='img-circle' />
		</a>
	</td>
	<td>
		<p>!name</p>
	</td>
	<td>
		<p>!address</p>
	</td>
	<td>
		<p>!phone</p>
	</td>
</tr>
"""
		
