(function() {
  var displayedForm, setBg, showFrom;

  displayedForm = null;

  $(document).ready(function() {
    $('#client').mouseenter(showFrom);
    $('#company').mouseenter(showFrom);
    $('#company-form').hide();
    $('#client').trigger('mouseenter');
    $('[name="phone"]').change(function(ev) {
      var newVal, regexp, target;
      target = $(ev.target);
      regexp = /^([1-9])\s?([0-9]{3})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})$/;
      newVal = target.val().replace(regexp, '$1 ($2) $3-$4-$5');
      return target.val(newVal);
    });
    return $('.btn-submit').click(function() {
      return $(this).closest('form').submit();
    });
  });

  setBg = function(bg) {
    return $('body').css('background-color', bg);
  };

  showFrom = function(ev) {
    var bg, id, target;
    target = $(ev.target);
    bg = target.css('background-color');
    id = '#' + target.data('formid');
    if (displayedForm) {
      if (id === ("#" + (displayedForm.attr('id')))) {
        return;
      }
      displayedForm.stop();
      displayedForm.off('submit');
      displayedForm.validator('destroy');
      displayedForm.hide(100);
    }
    setBg(bg);
    displayedForm = $(id).show(500);
    displayedForm.validator();
    return displayedForm.validator().on('submit', function(ev) {
      var formData;
      formData = new FormData(this);
      if (!ev.isDefaultPrevented()) {
        $.ajax({
          url: '/register',
          method: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          statusCode: {
            400: function() {
              return $.notify("Current login is already taken", "warn");
            },
            200: function() {
              return window.location.href = '/';
            }
          }
        });
        return ev.preventDefault();
      }
    });
  };

}).call(this);
