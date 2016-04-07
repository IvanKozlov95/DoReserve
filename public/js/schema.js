(function() {
  var Schema, btnExport, btnSave, iconsPath, schema, tableSize;

  iconsPath = 'icons.svg';

  tableSize = 20;

  Schema = (function() {
    function Schema(owner, data) {
      this.parent = $('.schema-container')[0];
      this.paper = Snap(this.parent.children[0]);
      this.paper.attr({
        width: 800,
        height: 500
      });
      this.tables = this.paper.g();
      this.owner = owner;
      this.fromJSON(data);
      this._bindEvents();
    }

    Schema.prototype._bindEvents = function() {
      return this.paper.node.addEventListener('click', this.createTable.bind(this));
    };

    Schema.prototype.createTable = function(e) {
      return this.addTable(e.offsetX, e.offsetY, tableSize);
    };

    Schema.prototype.addTable = function(x, y, r, id) {
      var table;
      table = this.paper.circle(x, y, r).addClass('schema-table').attr('id', id).click((function(_this) {
        return function(e) {
          _this._tableInfo(e.target.id);
          return e.stopPropagation();
        };
      })(this));
      return this.tables.add(table);
    };

    Schema.prototype._tableInfo = function(tableId) {
      return window.location = '/table?p=' + this.id + '&t=' + tableId;
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

  btnExport = $('.btn-export-schema')[0];

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

  btnExport.onclick = function() {
    return schema.toJSON();
  };

}).call(this);
