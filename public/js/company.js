(function() {
  $(document).ready(function() {
    return $('.btn-reply').click(function(ev) {
      var resId;
      resId = $(ev.target).closest('tr').attr('id');
      return $.ajax({
        url: '/reservation/update',
        method: 'POST',
        data: {
          company: $('input[name=company]').val(),
          reservation: resId,
          status: $('#' + resId + ' option:selected').val()
        },
        statusCode: {
          200: function() {
            return $.notify("Updated!", "info");
          }
        }
      });
    });
  });

}).call(this);
