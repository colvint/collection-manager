CollectionManager = {
  Mixin: {
    getInitialState: function () {
      return {
        currentPage:       0,
        perPage:           10,
        itemFilter:        {},
        selectedItems:     [],
        newModalIsOpen:    false,
        importModalIsOpen: false
      };
    },

    getMeteorState: function () {
      var cursor     = window[this.collectionName].find(this.state.itemFilter, {}),
          items      = cursor.fetch(),
          itemCount  = cursor.count();

      return {
        items:     items,
        itemCount: itemCount
      };
    },

    perPageChanged: function (event) {
      this.setState({
        perPage: event.target.value
      });
    },

    setCurrentPage: function (page) {
      this.setState({currentPage: page});
    },

    filterChangedFor: function (field, schema, event) {
      var filterVal     = event.target.value,
          currentFilter = this.state.itemFilter,
          newFilter;

      if (schema.type === 'number') {
        newFilter = {$lte: parseInt(filterVal)};
      } else {
        newFilter = new RegExp(filterVal, 'i');
      }

      currentFilter[field] = newFilter;

      this.setState({itemFilter: currentFilter});
    },

    toggleSelect: function (itemId) {
      var selectedItems = this.state.selectedItems,
          itemPosition  = selectedItems.indexOf(itemId);

      if (itemPosition === -1) {
        // select the  item
        selectedItems.push(itemId);
      } else {
        // de-select the item
        selectedItems.splice(itemPosition, 1);
      }

      this.setState({selectedItems: selectedItems});
    },

    itemSelectorChanged: function (selectionCommand) {
      switch (selectionCommand) {
        case 'all':
          this.selectAll();
          break;
        case 'none':
          this.selectNone();
          break;
        case 'inverse':
          this.selectInverse();
          break;
      }
    },

    selectAll: function () {
      this.setState({
        selectedItems: _.pluck(this.state.items, '_id')
      });
    },

    selectNone: function () {
      this.setState({
        selectedItems: []
      });
    },

    selectInverse: function () {
      var inverseSelection = _.difference(
        _.pluck(this.state.items, '_id'),
        this.state.selectedItems
      );

      this.setState({
        selectedItems: inverseSelection
      });
    },

    openNewModal: function () {
      this.setState({newModalIsOpen: true});
    },

    closeNewModal: function () {
      this.setState({newModalIsOpen: false})
    },

    openImportModal: function () {
      this.setState({importModalIsOpen: true});
    },

    closeImportModal: function () {
      this.setState({importModalIsOpen: false})
    },

    render: function () {
      var currentPage          = this.state.currentPage,
          perPage              = this.state.perPage,
          itemCount            = this.state.itemCount,
          fromIndex            = perPage * currentPage,
          toIndex              = Math.min(fromIndex + perPage - 1, itemCount - 1),
          shownItems           = this.state.items.slice(fromIndex, toIndex + 1),
          selectedItems        = this.state.selectedItems,
          selectorControlStyle = {textAlign: 'center'},
          self                 = this;

      return (
        <div className="form-inline">
          <div className="row">
            <div className="col-md-12">
              <CollectionManager.ListPageSizer
                perPage={perPage}
                perPageChanged={self.perPageChanged}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ReactBootstrap.Panel>
                <div className="panel-heading">
                  <ReactBootstrap.ButtonToolbar>
                    <ReactBootstrap.ButtonGroup>
                      <CollectionManager.ListActionMenu
                        selectedItems={selectedItems}/>
                    </ReactBootstrap.ButtonGroup>
                    <ReactBootstrap.ButtonGroup className="pull-right">
                      <ReactBootstrap.Button
                        bsStyle="info"
                        onClick={self.openImportModal}>
                        Import
                      </ReactBootstrap.Button>
                      <ReactBootstrap.Button
                        bsStyle="primary"
                        onClick={self.openNewModal}>
                        New
                      </ReactBootstrap.Button>
                    </ReactBootstrap.ButtonGroup>
                    <CollectionManager.EditModal
                      show={self.state.newModalIsOpen}
                      onHide={self.closeNewModal}
                      objectName={self.documentSingular}
                      schema={self.schema}
                      collectionService={self.collectionService}
                      createMethod={self.createMethod}/>
                    <CollectionManager.ImportModal
                      show={self.state.importModalIsOpen}
                      onHide={self.closeImportModal}
                      objectName={self.documentPlural}
                      schema={self.schema}
                      collectionService={self.collectionService}
                      createMethod={self.createMethod}/>
                  </ReactBootstrap.ButtonToolbar>
                </div>
                <div className="table-responsive">
                  <ReactBootstrap.Table className="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th style={selectorControlStyle}>
                          <CollectionManager.ListItemSelector
                            onSelect={self.itemSelectorChanged}/>
                        </th>
                        {_.map(self.schema.schema(), function (schema, name) {
                          return (
                            <th key={name}>
                              <CollectionManager.ListColumnFilter
                                fieldSchema={schema}
                                onChange={self.filterChangedFor.bind(self, name, schema)}/>
                            </th>
                          );
                        })}
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {shownItems.map(function (item) {
                        return (
                          <tr key={item._id}>
                            <td style={selectorControlStyle}>
                              <ReactBootstrap.Input
                                type="checkbox"
                                checked={_.contains(selectedItems, item._id)}
                                onChange={self.toggleSelect.bind(self, item._id)}/>
                            </td>
                            {_.map(self.schema.schema(), function (schema, name) {
                              return (
                                <CollectionManager.ListCell
                                  key={name}
                                  item={item}
                                  fieldName={name}
                                  fieldSchema={schema}/>
                              );
                            })}
                            <td>
                              <ReactBootstrap.Button>Manage</ReactBootstrap.Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </ReactBootstrap.Table>
                </div>
              </ReactBootstrap.Panel>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <CollectionManager.ListInfo
                fromIndex={fromIndex}
                toIndex={toIndex}
                itemCount={itemCount}/>
            </div>
            <div className="col-md-6">
              <CollectionManager.ListPaginator
                itemCount={itemCount}
                perPage={perPage}
                currentPage={currentPage}
                onPageChange={self.setCurrentPage}/>
            </div>
          </div>
        </div>
      );
    }
  }
}
