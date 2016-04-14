(function() {
  var fillModalFields, getCompanyInfo, makeReservation, modalId;

  modalId = '#exampleModal';

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
      $('#form-reserve').validator({
        custom: {
          odd: function($el) {
            console.log('asd');
            return false;
          }
        },
        errors: {
          odd: 'asdasd'
        }
      });
      return $('#form-reserve').validator().on('submit', function(e) {
        e.preventDefault();
        if (grecaptcha.getResponse() === '') {
          $(modalId + ' #message').text('Please enter the captcha');
          return;
        }
        if (!e.isDefaultPrevented()) {
          return makeReservation();
        }
      });
    });
    return $(modalId).on('hidden.bs.modal', function() {
      $('#form-reserve').validator().off('submit');
      return $('#form-reserve').validator('destroy');
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
        if (status === 'success') {
          return cb(null, jqXHR.responseJSON.company);
        } else {
          return cb(status);
        }
      }
    });
  };

  fillModalFields = function(company) {
    $(modalId + ' .modal-title').text(company.name);
    return $(modalId + " input[name='companyid']").val(company._id);
  };

  makeReservation = function() {};

}).call(this);
