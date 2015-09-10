"use strict";

CollectionManager = {
  compose(collection, templateName, options) {
    const Composite = ReactMeteor.createClass({
      templateName: templateName,

      getInitialState() {
        return {
          itemFilter:        collection.simpleSchema().clean({}),
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
          this.state.itemFilter
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
          currentFilter[field] = {$lte: Number(filterVal)};
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
        let component = this,
            fromIndex = this.state.perPage * this.state.currentPage,
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
                  perPage={component.state.perPage}
                  perPageChanged={component.perPageChanged}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <ReactBootstrap.Panel>
                  <div className="panel-heading">
                    <ReactBootstrap.ButtonToolbar>
                      <CollectionManager.SelectedItemsActionsMenu
                        selectedItemIds={component.state.selectedItemIds}
                        collection={collection}
                        actions={options.actions}
                        onActionCompleted={component.selectNone}/>
                      <ReactBootstrap.ButtonGroup className="pull-right">
                        <ReactBootstrap.Button
                          bsStyle="info"
                          onClick={component.toggleImportModal.bind(component, true)}>
                          Import
                        </ReactBootstrap.Button>
                        <CollectionManager.ImportModal
                          show={component.state.importModalIsOpen}
                          onHide={component.toggleImportModal.bind(component, false)}
                          collection={collection}/>
                        <ReactBootstrap.Button
                          bsStyle="primary"
                          onClick={component.toggleNewModal.bind(component, true)}>
                          New
                        </ReactBootstrap.Button>
                        <CollectionManager.EditModal
                          show={component.state.newModalIsOpen}
                          onHide={component.toggleNewModal.bind(component, false)}
                          collection={collection}/>
                      </ReactBootstrap.ButtonGroup>
                    </ReactBootstrap.ButtonToolbar>
                  </div>
                  <div className="table-responsive">
                    <ReactBootstrap.Table className="table table-bordered table-striped table-hover">
                      <thead>
                        <tr>
                          <th style={selectorControlStyle} className='col-md-1'>
                            <CollectionManager.ListItemSelector
                              onSelect={component.itemSelectorChanged}/>
                          </th>
                          {_.map(filterFields, (fieldSchema, fieldName) => {
                            return (
                              <th key={fieldName} className='col-md-3'>
                                <CollectionManager.Field
                                  key={fieldName}
                                  fieldSchema={fieldSchema}
                                  objectName={collection._name}
                                  placeholder={'Filter for ' + fieldSchema.label}
                                  onChange={component.filterChangedFor.bind(component, fieldName, fieldSchema)}/>
                              </th>
                            );
                          })}
                          <th className='col-md-1'></th>
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
                              {_.map(filterFields, function (schema, name) {
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
                                  collection={collection}
                                  itemId={item._id}
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
              <div className="col-md-3">
                <CollectionManager.ListInfo
                  fromIndex={fromIndex}
                  toIndex={toIndex}
                  itemCount={component.state.itemCount}/>
              </div>
              <div className="col-md-9">
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
    });

    return Composite;
  }
}
