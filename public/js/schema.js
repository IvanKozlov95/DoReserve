(function() {
  var Schema, btnExport, btnSave, iconsPath, schema, tableSize,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  iconsPath = 'icons.svg';

  tableSize = 20;

  Schema = (function() {
    function Schema() {
      this.toJSON = bind(this.toJSON, this);
      this.parent = $('.schema-container')[0];
      this.paper = Snap(this.parent.children[0]);
      this.paper.attr({
        width: 800,
        height: 500
      });
      this.tables = this.paper.g();
      this._bindEvents();
    }

    Schema.prototype._bindEvents = function() {
      return this.paper.node.addEventListener('click', this.createTable.bind(this));
    };

    Schema.prototype.createTable = function(e) {
      return this.addTable(e.offsetX, e.offsetY, tableSize);
    };

    Schema.prototype.addTable = function(x, y, r) {
      var table;
      table = this.paper.circle(x, y, r).addClass('schema-table');
      return this.tables.add(table);
    };

    Schema.prototype.toJSON = function() {
      var attr, i, len, query, ref, res, table, x;
      res = {
        id: this.parent.id,
        tables: []
      };
      x = Snap.parse(schema.paper.innerSVG());
      query = x.selectAll(".schema-table");
      ref = query.items;
      for (i = 0, len = ref.length; i < len; i++) {
        table = ref[i];
        attr = table.node.attributes;
        res.tables.push({
          x: attr.cx.value,
          y: attr.cy.value,
          r: attr.r.value
        });
      }
      return res;
    };

    Schema.prototype.fromJSON = function(data) {
      var i, len, ref, results, table;
      $(this.parent).attr('id', data._id);
      if (data.tables) {
        ref = data.tables;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          table = ref[i];
          results.push(this.addTable(table.x, table.y, table.r));
        }
        return results;
      }
    };

    return Schema;

  })();

  schema = new Schema;

  window.loadPlan = function(data) {
    if (data != null) {
      return schema.fromJSON(data);
    }
  };

  btnSave = $('.btn-save-schema')[0];

  btnExport = $('.btn-export-schema')[0];

  btnSave.onclick = function(event) {
    return $.ajax({
      url: '/company/plan',
      method: 'POST',
      dataType: 'json',
      data: schema.toJSON(),
      statusCode: {
        404: function() {
          return alert('Not Found');
        },
        200: function() {
          return alert('Saved');
        }
      }
    });
  };

  btnExport.onclick = function() {
    return schema.toJSON();
  };

}).call(this);
