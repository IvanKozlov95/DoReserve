(function() {
  $(document).ready(function() {
    return $('#reply').click(function(ev) {
      var resId;
      resId = $(ev.target).closest('tr').attr('id');
      return $.ajax({
        url: '/reservation/update',
        method: 'POST',
        data: {
          company: $('div .profile').attr('id'),
          reservation: resId,
          status: 'asd'
        }
      });
    });
  });

}).call(this);
