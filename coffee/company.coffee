$(document).ready () ->
	$('.btn-reply').click (ev) ->
		resId = $(ev.target).closest('tr').attr('id')
		$.ajax {
			url: '/reservation/update',
			method: 'POST',
			data: {
				company: $('input[name=company]').val(),
				reservation: resId,
				status: $('#'+resId+' option:selected').val()
			},
			statusCode: {
				200: () ->
					$.notify "Updated!", "info"
			}
		}
