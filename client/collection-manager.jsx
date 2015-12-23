CollectionManager = {
  compose(collection, options) {
    if (typeof options === 'undefined') options = {};

    var templateName = options.templateName || (collection._name + 'Manager'),
        selector = options.selector || (() => ({})),
        subscriptions = options.subscriptions || (() => ({})),
        allowManage = typeof(options.allowManage) === 'undefined' ? true : options.allowManage,
        allowEdit = typeof(options.allowEdit) === 'undefined' ? true : options.allowEdit,
        allowImport = typeof(options.allowImport) === 'undefined' ? true : options.allowImport,
        allowNew = typeof(options.allowNew) === 'undefined' ? true : options.allowNew,
        hideItemActions = typeof(options.hideItemActions) === 'undefined' ? false : options.hideItemActions,
        fieldConfig = typeof(options.fieldConfig) === 'undefined' ? {} : options.fieldConfig,
        columns = typeof(options.columns) === 'undefined' ? [] : options.columns;

    var Component = ReactMeteor.createClass({
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
        var cursor = collection.find(
          _.extend(selector.apply(this.props), this.state.itemFilter)
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

      filterChangedFor(field, schema, eventOrObject) {
        var filterVal     = typeof(eventOrObject.target) === 'undefined' ?  eventOrObject.value : eventOrObject.target.value,
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

        editModalToggles = ReactUpdate(editModalToggles, {
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

      render() {
        var fromIndex = this.state.perPage * this.state.currentPage,
            toIndex = Math.min(fromIndex + this.state.perPage - 1, this.state.itemCount - 1),
            shownItems = this.state.items.slice(fromIndex, toIndex + 1),
            selectorControlStyle = {textAlign: 'center'},
            schema       = collection.simpleSchema().schema(),
            filterFields = {}, itemActionHeader;

        _.each(schema, (fieldSchema, fieldName) => {
          if (fieldSchema.allowFilter) {
            filterFields[fieldName] = fieldSchema;
          }
        });

        if (!hideItemActions) {
          itemActionHeader = (<th className='col-md-3'></th>);
        }

        return (
          <div className="form-inline">
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
                        actions={options.collectionActions}
                        allowImport={allowImport}
                        allowNew={allowNew}
                        {...this.props} />
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
                            if (!(fieldConfig[fieldName] || {}).hidden) {
                              return (
                                <th key={fieldName} className='col-md-2'>
                                  <CollectionManager.Field
                                    key={fieldName}
                                    isFilter={true}
                                    fieldName={fieldName}
                                    fieldSchema={fieldSchema}
                                    schema={schema}
                                    objectName={collection._name}
                                    placeholder={'Filter for ' + fieldSchema.label}
                                    onChange={this.filterChangedFor.bind(this, fieldName, fieldSchema)}/>
                                </th>
                              );
                            }
                          })}
                          {itemActionHeader}
                          {_.map(columns, (column, i) => {
                            return (<th key={i}>{column.title}</th>);
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {_.map(shownItems, (item) => {
                          var itemActions;

                          if (!hideItemActions) {
                            itemActions = (
                              <CollectionManager.ItemActions
                                item={item}
                                actions={options.itemActions}
                                collection={collection}
                                allowManage={allowManage}
                                allowEdit={allowEdit} />
                            );
                          }
                          return (
                            <tr key={item._id}>
                              <td style={selectorControlStyle}>
                                <ReactBootstrap.Input
                                  type="checkbox"
                                  checked={_.contains(this.state.selectedItemIds, item._id)}
                                  onChange={this.onItemSelected.bind(this, item._id)}/>
                              </td>
                              {_.map(filterFields, (fieldSchema, fieldName) => {
                                if (!(fieldConfig[fieldName] || {}).hidden) {
                                  return (
                                    <CollectionManager.ListCell
                                      key={fieldName}
                                      item={item}
                                      fieldName={fieldName}
                                      fieldSchema={fieldSchema}/>
                                  );
                                }
                              })}
                              {itemActions}
                              {_.map(columns, (column, i) => {
                                return (
                                  <td key={i}>{column.cellContent.apply(item)}</td>
                                );
                              })}
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
                  perPageChanged={this.perPageChanged}
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
