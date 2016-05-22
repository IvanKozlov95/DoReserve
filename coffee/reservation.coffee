modalId = '#exampleModal'
user = {}

$(window).on 'load', () ->
	$(modalId).on 'show.bs.modal', (event) ->
		button = $ event.relatedTarget
		getCompanyInfo button.data('companyid'), (company) ->
			openModal company

	$(modalId).on 'shown.bs.modal', () ->
		$('#form-reserve').validator()
		$('#form-reserve')
			.validator()
			.on 'submit', (e) ->
				$('#form-reserve').validator 'validate'
				if ( !e.isDefaultPrevented() ) 
					do e.preventDefault

					if (grecaptcha.getResponse() == '')
						$(modalId + ' #message').text 'Please enter the captcha'
						return

					do makeReservation

	$(modalId).on 'hidden.bs.modal', () ->
		$('#form-reserve')
			.validator()
			.off 'submit'
		$('#form-reserve').validator 'destroy'

	$('#btn-reserve').click () ->
		$('#form-reserve').submit()

getCompanyInfo = (id, cb) ->
	$.ajax {
		url: '/company/info',
		method: 'GET',
		data: {
			id: id
		},
		complete: (jqXHR, status) ->
			cb jqXHR.responseJSON
	}

openModal = (company) ->
	$ modalId + ' .modal-title'
		.text company.name
	$ modalId + " input[name='company']"
		.val(company._id)

closeModal = () ->
	$(modalId).modal('hide')

makeReservation = () ->
	form = $(modalId + ' #form-reserve')
	$.ajax {
		url: '/reservation/create',
		method: 'POST',
		data: do form.serialize,
		complete: (jqXHR, status) -> 
			if (status == 'success') 
				msgType = "info"
				closeModal()
			else
				msgType = 'warn'
			$.notify jqXHR.responseJSON, msgType
	}


window.setUser = (user) ->
	user = user