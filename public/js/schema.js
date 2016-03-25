(function() {
  var Schema, schema;

  console.log('Hello from schema.js');

  Schema = (function() {
    function Schema() {
      this.paper = Snap($("svg")[0]);
    }

    Schema.prototype._bindEvents = function() {
      return window.addEventListener('resize', (function(_this) {
        return function() {
          return _this.paper.attr({
            width: window.innerWidth,
            height: window.innerHeight
          });
        };
      })(this));
    };

    return Schema;

  })();

  schema = new Schema();

}).call(this);
