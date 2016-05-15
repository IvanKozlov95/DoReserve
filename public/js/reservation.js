(function() {
  var fillModalFields, getCompanyInfo, makeReservation, modalId, user;

  modalId = '#exampleModal';

  user = {};

  $(window).on('load', function() {
    $(modalId).on('show.bs.modal', function(event) {
      var button;
      button = $(event.relatedTarget);
      return getCompanyInfo(button.data('companyid'), function(err, company) {
        if (typeof err === "function") {
          err(alert('err'));
        }
        return fillModalFields(company);
      });
    });
    $(modalId).on('shown.bs.modal', function() {
      $('#form-reserve').validator();
      return $('#form-reserve').validator().on('submit', function(e) {
        $('#form-reserve').validator('validate');
        if (!e.isDefaultPrevented()) {
          e.preventDefault();
          if (grecaptcha.getResponse() === '') {
            $(modalId + ' #message').text('Please enter the captcha');
            return;
          }
          return makeReservation();
        }
      });
    });
    $(modalId).on('hidden.bs.modal', function() {
      $('#form-reserve').validator().off('submit');
      return $('#form-reserve').validator('destroy');
    });
    return $('#btn-reserve').click(function() {
      return $('#form-reserve').submit();
    });
  });

  getCompanyInfo = function(id, cb) {
    return $.ajax({
      url: '/company/info',
      method: 'GET',
      data: {
        id: id
      },
      complete: function(jqXHR, status) {
        console.log(jqXHR.responseJSON);
        if (status === 'success') {
          return cb(null, jqXHR.responseJSON);
        } else {
          return cb(status);
        }
      }
    });
  };

  fillModalFields = function(company) {
    $(modalId + ' .modal-title').text(company.name);
    return $(modalId + " input[name='company']").val(company._id);
  };

  makeReservation = function() {
    var form;
    form = $(modalId + ' #form-reserve');
    return $.ajax({
      url: '/reservation/create',
      method: 'POST',
      data: form.serialize(),
      status: {
        200: function() {
          return alert('ok');
        },
        403: function() {
          return grecaptcha.reset();
        },
        409: function() {
          return $.notify('Email is alredy taken');
        }
      }
    });
  };

  window.setUser = function(user) {
    return user = user;
  };

}).call(this);
