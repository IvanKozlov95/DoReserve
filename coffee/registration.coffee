displayedForm = null

$(document).ready () -> 
	$('#client').mouseenter showFrom 
	$('#company').mouseenter showFrom 
	# $('#client-form').hide();
	$('#company-form').hide();
	$('#client').trigger 'mouseenter'

	$('[name="phone"]').change (ev) ->
		target = $ ev.target 
		regexp = /^([1-9])\s?([0-9]{3})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})$/
		newVal = target.val().replace regexp, '$1 ($2) $3-$4-$5'
		target.val newVal 

	$('.btn-submit').click () ->
		$(this).closest('form').submit()
	
setBg = (bg) -> 
	$('body')
		.css('background-color', bg);

showFrom = (ev) ->
	target = $ ev.target
	bg = target.css 'background-color' 
	id = '#' + target.data 'formid'

	if displayedForm
		if id == "##{displayedForm.attr('id')}"
			return;
		do displayedForm.stop
		# removing validation
		displayedForm.off 'submit'
		displayedForm.validator 'destroy'
		displayedForm.hide 100

	setBg bg
	displayedForm = $(id).show 500
	displayedForm.validator()
	displayedForm.validator().on 'submit', (ev) ->
		formData = new FormData this
		if !ev.isDefaultPrevented()
			$.ajax {
				url: '/register',
				method: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				statusCode: {
					400: () ->
						$.notify "Current login is already taken", "warn"
					200: () ->
						window.location.href = '/'
				}
			}
			ev.preventDefault()