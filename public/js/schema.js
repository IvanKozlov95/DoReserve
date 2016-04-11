(function() {
  var Schema, btnSave, schema, tableSize;

  tableSize = 20;

  Schema = (function() {
    function Schema(owner, data) {
      this.parent = $('.schema-container');
      this.paper = Snap(this.parent.children()[0]);
      this.paper.attr({
        width: this.parent.width(),
        height: this.parent.height()
      });
      this.tables = this.paper.g();
      this.owner = owner;
      this.fromJSON(data);
      this._bindEvents();
    }

    Schema.prototype._bindEvents = function() {
      return this.paper.node.addEventListener('dblclick', this.createTable.bind(this));
    };

    Schema.prototype._tableInfo = function(tableId) {
      var asd, form;
      form = $('form#table-info');
      return asd = form.serialize();
    };

    Schema.prototype._hint = function(ind, x, y, r) {
      var hint;
      hint = this.paper.text(0, 0, ind).addClass('schema-table-hint').attr({
        textpath: "M " + (x - r) + "," + y + " L" + (x + r) + "," + y
      });
      hint.select('*').attr({
        startOffset: '40%'
      });
      return hint;
    };

    Schema.prototype._sector = function(x, y, r) {
      return this.paper.circle(x, y, r).addClass('schema-table');
    };

    Schema.prototype._table = function(sector, hint, id) {
      return this.paper.g(sector, hint).attr('id', id).data('number', hint.text).drag(this._moveTable, function() {
        return this.data('origTransform', this.transform().local);
      }).dblclick((function(_this) {
        return function(e) {
          _this._tableInfo(e.target.id);
          return e.stopPropagation();
        };
      })(this));
    };

    Schema.prototype._moveTable = function(dx, dy) {
      return this.attr({
        transform: "" + (this.data('origTransform')) + (this.data('origTransform') ? 't' : 'T') + dx + "," + dy
      });
    };

    Schema.prototype.createTable = function(e) {
      return this.addTable(e.offsetX, e.offsetY, tableSize, null, this.tables.children().length);
    };

    Schema.prototype.addTable = function(x, y, r, id, num) {
      return this.tables.add(this._table(this._sector(x, y, r), this._hint(num, x, y, r), id));
    };

    Schema.prototype.toJSON = function() {
      var attr, i, len, query, ref, res, table, x;
      res = {
        company: this.owner,
        id: this.id,
        tables: []
      };
      x = Snap.parse(schema.paper.innerSVG());
      query = x.selectAll(".schema-table");
      ref = query.items;
      for (i = 0, len = ref.length; i < len; i++) {
        table = ref[i];
        attr = table.node.attributes;
        res.tables.push({
          id: attr.id.value,
          x: attr.cx.value,
          y: attr.cy.value,
          r: attr.r.value
        });
      }
      console.log(res);
      return res;
    };

    Schema.prototype.fromJSON = function(data) {
      var i, len, ref, results, table;
      if (data) {
        this.id = data._id;
        if (data.tables) {
          ref = data.tables;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            table = ref[i];
            results.push(this.addTable(table.x, table.y, table.r, table._id));
          }
          return results;
        }
      }
    };

    return Schema;

  })();

  schema = {};

  window.createSchema = function(owner, data) {
    return schema = new Schema(owner, data);
  };

  btnSave = $('.btn-save-schema')[0];

  btnSave.onclick = function(event) {
    return $.ajax({
      url: '/plan',
      method: 'POST',
      dataType: 'json',
      data: {
        plan: schema.toJSON()
      },
      statusCode: {
        404: function() {
          return alert('Not Found');
        },
        200: function() {
          return window.location.reload();
        }
      }
    });
  };

}).call(this);
