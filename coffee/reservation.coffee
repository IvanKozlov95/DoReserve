modalId = '#exampleModal'
user = {}

$(window).on 'load', () ->
	$(modalId).on 'show.bs.modal', (event) ->
		button = $ event.relatedTarget
		getCompanyInfo button.data('companyid'), (err, company) ->
			err? alert('err');
			fillModalFields company

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
			console.log(jqXHR.responseJSON)
			if status == 'success'
				cb null, jqXHR.responseJSON
			else
				cb status 
	}

fillModalFields = (company) ->
	$ modalId + ' .modal-title'
		.text company.name
	$ modalId + " input[name='company']"
		.val(company._id)

makeReservation = () ->
	form = $(modalId + ' #form-reserve')
	$.ajax {
		url: '/reservation/create',
		method: 'POST',
		data: do form.serialize,
		status: {
			200: () ->
				alert 'ok'
			403: () ->
				grecaptcha.reset()
			409: () -> 
				$.notify('Email is alredy taken')
		}
	}


window.setUser = (user) ->
	user = user