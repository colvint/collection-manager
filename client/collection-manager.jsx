"use strict";

CollectionManager = {
  compose(collection, options) {
    if (typeof options === 'undefined') options = {};

    let templateName = options.templateName || (collection._name + 'Manager'),
        selector = options.selector || (() => ({})),
        subscriptions = options.subscriptions || (() => ({}));

    const Component = ReactMeteor.createClass({
      displayName: templateName,
      templateName: templateName,

      startMeteorSubscriptions: subscriptions,

      getInitialState() {
        return {
          itemFilter:        {},
          currentPage:       0,
          perPage:           10,
          selectedItemIds:   [],
          importModalIsOpen: false,
          newModalIsOpen:    false,
          editModalToggles:  {}
        };
      },

      getMeteorState() {
        let cursor = collection.find(
          _.extend(selector(), this.state.itemFilter)
        );

        return {
          items: cursor.fetch(),
          itemCount: cursor.count(),
        }
      },

      perPageChanged(event) {
        this.setState({
          perPage: event.target.value
        });
      },

      setCurrentPage(page) {
        this.setState({currentPage: page});
      },

      filterChangedFor(field, schema, event) {
        var filterVal     = event.target.value,
            currentFilter = this.state.itemFilter;

        if (schema.type === Number && Number(filterVal)) {
          currentFilter[field] = {$gte: Number(filterVal)};
        } else if (schema.type === String && filterVal) {
          currentFilter[field] = new RegExp(filterVal, 'i');
        } else if (schema.type instanceof Relation && filterVal) {
          currentFilter[field] = filterVal;
        } else if (schema.type === Boolean) {
          currentFilter[field] = filterVal;
        } else {
          delete currentFilter[field];
        }

        this.setState({itemFilter: currentFilter});
      },

      onItemSelected(itemId) {
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

      itemSelectorChanged(selectionCommand) {
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

      selectAll() {
        this.setState({
          selectedItemIds: _.pluck(this.state.items, '_id')
        });
      },

      selectNone() {
        this.setState({
          selectedItemIds: []
        });
      },

      selectInverse() {
        var inverseSelection = _.difference(
          _.pluck(this.state.items, '_id'),
          this.state.selectedItemIds
        );

        this.setState({
          selectedItemIds: inverseSelection
        });
      },

      toggleEditModal(itemId, flag) {
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

      toggleImportModal(open) {
        this.setState({importModalIsOpen: open});
      },

      toggleNewModal(open) {
        this.setState({newModalIsOpen: open});
      },

      render () {
        let fromIndex = this.state.perPage * this.state.currentPage,
            toIndex = Math.min(fromIndex + this.state.perPage - 1, this.state.itemCount - 1),
            shownItems = this.state.items.slice(fromIndex, toIndex + 1),
            selectorControlStyle = {textAlign: 'center'},
            filterFields = {};

        _.each(collection.simpleSchema().schema(), (fieldSchema, fieldName) => {
          if (fieldSchema.allowFilter) {
            filterFields[fieldName] = fieldSchema;
          }
        });

        return (
          <div className="form-inline">
            <div className="row">
              <div className="col-md-12">
                <CollectionManager.ListPageSizer
                  perPage={this.state.perPage}
                  perPageChanged={this.perPageChanged}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <ReactBootstrap.Panel>
                  <div className="panel-heading">
                    <ReactBootstrap.ButtonToolbar>
                      <CollectionManager.SelectedItemsActionsMenu
                        selectedItemIds={this.state.selectedItemIds}
                        collection={collection}
                        actions={options.selectedItemActions}
                        onActionCompleted={this.selectNone}/>
                      <CollectionManager.CollectionActions
                        collection={collection}
                        actions={options.collectionActions}/>
                    </ReactBootstrap.ButtonToolbar>
                  </div>
                  <ReactBootstrap.Table className="table table-bordered table-striped table-hover">
                      <thead>
                        <tr>
                          <th style={selectorControlStyle} className='col-md-1'>
                            <CollectionManager.ListItemSelector
                              onSelect={this.itemSelectorChanged}/>
                          </th>
                          {_.map(filterFields, (fieldSchema, fieldName) => {
                            return (
                              <th key={fieldName} className='col-md-3'>
                                <CollectionManager.Field
                                  key={fieldName}
                                  fieldSchema={fieldSchema}
                                  objectName={collection._name}
                                  placeholder={'Filter for ' + fieldSchema.label}
                                  onChange={this.filterChangedFor.bind(this, fieldName, fieldSchema)}/>
                              </th>
                            );
                          })}
                          <th className='col-md-2'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {_.map(shownItems, (item) => {
                          return (
                            <tr key={item._id}>
                              <td style={selectorControlStyle}>
                                <ReactBootstrap.Input
                                  type="checkbox"
                                  checked={_.contains(this.state.selectedItemIds, item._id)}
                                  onChange={this.onItemSelected.bind(this, item._id)}/>
                              </td>
                              {_.map(filterFields, (fieldSchema, fieldName) => {
                                return (
                                  <CollectionManager.ListCell
                                    key={fieldName}
                                    item={item}
                                    fieldName={fieldName}
                                    fieldSchema={fieldSchema}/>
                                );
                              })}
                              <CollectionManager.ItemActions
                                item={item}
                                actions={options.itemActions}
                                collection={collection}/>
                            </tr>
                          );
                        })}
                      </tbody>
                    </ReactBootstrap.Table>
                </ReactBootstrap.Panel>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <CollectionManager.ListInfo
                  fromIndex={fromIndex}
                  toIndex={toIndex}
                  itemCount={this.state.itemCount}/>
              </div>
              <div className="col-md-9">
                <CollectionManager.ListPaginator
                  itemCount={this.state.itemCount}
                  perPage={this.state.perPage}
                  currentPage={this.state.currentPage}
                  onPageChange={this.setCurrentPage}/>
              </div>
            </div>
          </div>
        );
      }
    });

    return Component;
  }
}
