(function() {
  var fillModalFields, getCompanyInfo, modalId;

  modalId = '#exampleModal';

  $(document).ready(function() {
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
    return $('#btn-reserve').on('click', function() {
      var form;
      $(modalId + ' #message').text('');
      form = $('#form-reserve');
      return $.ajax({
        url: '/reservation/create',
        method: 'POST',
        data: form.serialize(),
        complete: function(jqXHR, status) {
          if (status !== 'success') {
            return $(modalId + ' #message').text(jqXHR.responseText);
          }
        }
      });
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

}).call(this);
