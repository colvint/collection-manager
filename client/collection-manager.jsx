CollectionManager = {
  Mixin: {
    getInitialState: function () {
      return {
        currentPage:       0,
        perPage:           10,
        itemFilter:        {},
        selectedItemIds:   [],
        importModalIsOpen: false,
        newModalIsOpen:    false,
        editModalToggles:  {}
      };
    },

    getMeteorState: function () {
      var cursor     = this.collection.find(this.state.itemFilter, {}),
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

    onItemSelected: function (itemId) {
      var selectedItemIds = this.state.selectedItemIds,
          itemPosition    = this.state.selectedItemIds.indexOf(itemId);

      if (itemPosition === -1) {
        // select the  item
        selectedItemIds.push(itemId);
      } else {
        // de-select the item
        selectedItemIds.splice(itemPosition, 1);
      }
      this.setState({
        selectedItemIds: selectedItemIds
      });
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
        selectedItemIds: _.pluck(this.state.items, '_id')
      });
    },

    selectNone: function () {
      this.setState({
        selectedItemIds: []
      });
    },

    selectInverse: function () {
      var inverseSelection = _.difference(
        _.pluck(this.state.items, '_id'),
        this.state.selectedItemIds
      );

      this.setState({
        selectedItemIds: inverseSelection
      });
    },

    toggleEditModal: function (itemId, flag) {
      var editModalToggles = this.state.editModalToggles,
          modalToggle      = {};

      modalToggle[itemId] = flag;

      editModalToggles = React.addons.update(editModalToggles, {
        $merge: modalToggle
      });

      this.setState({
        editModalToggles: editModalToggles
      });
    },

    toggleImportModal: function (open) {
      this.setState({importModalIsOpen: open});
    },

    toggleNewModal: function (open) {
      this.setState({newModalIsOpen: open});
    },

    render: function () {
      var component            = this,
          fromIndex            = component.state.perPage * component.state.currentPage,
          toIndex              = Math.min(fromIndex + component.state.perPage - 1, component.state.itemCount - 1),
          shownItems           = component.state.items.slice(fromIndex, toIndex + 1),
          selectorControlStyle = {textAlign: 'center'};

      return (
        <div className="form-inline">
          <div className="row">
            <div className="col-md-12">
              <CollectionManager.ListPageSizer
                perPage={component.state.perPage}
                perPageChanged={component.perPageChanged}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ReactBootstrap.Panel>
                <div className="panel-heading">
                  <ReactBootstrap.ButtonToolbar>
                    <ReactBootstrap.ButtonGroup>
                      <CollectionManager.ListActionMenu
                        selectedItemIds={component.state.selectedItemIds}/>
                    </ReactBootstrap.ButtonGroup>
                    <ReactBootstrap.ButtonGroup className="pull-right">
                      <ReactBootstrap.Button
                        bsStyle="info"
                        onClick={component.toggleImportModal.bind(component, true)}>
                        Import
                      </ReactBootstrap.Button>
                      <CollectionManager.ImportModal
                        show={component.state.importModalIsOpen}
                        onHide={component.toggleImportModal.bind(component, false)}
                        objectName={component.documentPlural}
                        schema={component.schema}
                        connection={component.connection}
                        actionMethod={component.createMethod}/>
                      <ReactBootstrap.Button
                        bsStyle="primary"
                        onClick={component.toggleNewModal.bind(component, true)}>
                        New
                      </ReactBootstrap.Button>
                      <CollectionManager.EditModal
                        show={component.state.newModalIsOpen}
                        onHide={component.toggleNewModal.bind(component, false)}
                        objectName={component.documentSingular}
                        schema={component.schema}
                        connection={component.connection}
                        actionMethod={component.createMethod}/>
                    </ReactBootstrap.ButtonGroup>
                  </ReactBootstrap.ButtonToolbar>
                </div>
                <div className="table-responsive">
                  <ReactBootstrap.Table className="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th style={selectorControlStyle}>
                          <CollectionManager.ListItemSelector
                            onSelect={component.itemSelectorChanged}/>
                        </th>
                        {_.map(component.schema.schema(), function (schema, name) {
                          return (
                            <th key={name}>
                              <CollectionManager.ListColumnFilter
                                fieldSchema={schema}
                                onChange={component.filterChangedFor.bind(component, name, schema)}/>
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
                                checked={_.contains(component.state.selectedItemIds, item._id)}
                                onChange={component.onItemSelected.bind(component, item._id)}/>
                            </td>
                            {_.map(component.schema.schema(), function (schema, name) {
                              return (
                                <CollectionManager.ListCell
                                  key={name}
                                  item={item}
                                  fieldName={name}
                                  fieldSchema={schema}/>
                              );
                            })}
                            <td>
                              <ReactBootstrap.Button
                                onClick={component.toggleEditModal.bind(component, item._id, true)}>
                                Edit
                              </ReactBootstrap.Button>
                              <CollectionManager.EditModal
                                show={component.state.editModalToggles[item._id]}
                                onHide={component.toggleEditModal.bind(component, item._id, false)}
                                objectName={component.documentSingular}
                                schema={component.schema}
                                connection={component.connection}
                                actionMethod={component.updateMethod}
                                item={item}/>
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
                itemCount={component.state.itemCount}/>
            </div>
            <div className="col-md-6">
              <CollectionManager.ListPaginator
                itemCount={component.state.itemCount}
                perPage={component.state.perPage}
                currentPage={component.state.currentPage}
                onPageChange={component.setCurrentPage}/>
            </div>
          </div>
        </div>
      );
    }
  }
}
