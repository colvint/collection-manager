var Button         = ReactBootstrap.Button,
    ButtonGroup    = ReactBootstrap.ButtonGroup,
    ButtonToolbar  = ReactBootstrap.ButtonToolbar,
    DropdownButton = ReactBootstrap.DropdownButton,
    Input          = ReactBootstrap.Input,
    MenuItem       = ReactBootstrap.MenuItem,
    Modal          = ReactBootstrap.Modal,
    Nav            = ReactBootstrap.Nav,
    Navbar         = ReactBootstrap.Navbar,
    NavItem        = ReactBootstrap.NavItem,
    Panel          = ReactBootstrap.Panel;

var ColumnFilter = ReactMeteor.createClass({
  render: function () {
    var filterWidget,
        fieldSchema = this.props.fieldSchema;

    if (fieldSchema.type == 'number') {
      filterWidget = (
        <Input
          type="range"
          bsSize="small"
          onChange={this.props.onChange}
        />
      );
    } else {
      filterWidget = (
        <Input
          type="search"
          bsSize="small"
          onChange={this.props.onChange}
          placeholder={fieldSchema.label}
        />
      );
    }

    return (
      <form className="form-inline">
        {filterWidget}
      </form>
    );
  }
});

var Cell = ReactMeteor.createClass({
  render: function () {
    var fieldSchema = this.props.fieldSchema,
        item        = this.props.item,
        value       = item[this.props.fieldName],
        content;

    if (fieldSchema.type == 'url') {
      content = <a href={value}>{value}</a>;
    } else {
      content = value;
    }

    return (
      <td>{content}</td>
    );
  }
});

var GridInfo = ReactMeteor.createClass({
    render: function () {
      var fromIndex     = this.props.fromIndex,
          toIndex       = this.props.toIndex,
          itemCount     = this.props.itemCount,
          gridIsEmpty   = (itemCount == 0),
          label;

      if (gridIsEmpty) {
        label = 'No matching entries';
      } else {
        label = `Showing ${fromIndex + 1} to ${toIndex + 1} of ${itemCount} entries`;
      }

      return (
        <div className="info" role="status" aria-live="polite">
          {label}
        </div>
      );
    }
});

var Paginator = ReactMeteor.createClass({
  changePage: function (page) {
    var currentPage  = parseInt(page),
        pageCount    = Math.ceil(this.props.itemCount / this.props.perPage);

    if (currentPage >= 0 && currentPage < pageCount) {
      this.props.onPageChange(currentPage);
    }
  },

  render: function () {
    var currentPage  = parseInt(this.props.currentPage),
        pageCount    = Math.ceil(this.props.itemCount / this.props.perPage),
        prevDisabled = (currentPage <= 0),
        nextDisabled = (currentPage >= (pageCount - 1)),
        prevPage     = currentPage - 1,
        nextPage     = currentPage + 1;

    return (
      <Nav
        onSelect={this.props.onPageChange}
        bsStyle="pills"
        bsSize="xsmall"
        right>
        <NavItem eventKey={prevPage} disabled={prevDisabled}>
          <span>«</span>
        </NavItem>
        {_.range(0, pageCount).map(function (page, i) {
          return (
            <NavItem
              className={classNames({'active': (currentPage == page)})}
              key={i}
              eventKey={page}
              disabled={page == currentPage}>
              {page + 1}
            </NavItem>
          );
        })}
        <NavItem eventKey={nextPage} disabled={nextDisabled}>
          <span>»</span>
        </NavItem>
      </Nav>
      );
    }
  });

var PageSizer = ReactMeteor.createClass({
  render: function () {
    var countOptions = [10, 25, 50, 100];

    return (
      <p>
        <Input
          type="select"
          bsSize="small"
          value={this.props.perPage}
          onChange={this.props.perPageChanged}
        >
          {countOptions.map(function (countOption) {
            return (
              <option key={countOption} value={countOption}>
                {countOption}
              </option>
            );
          })}
        </Input>
        &nbsp;per page
      </p>
    );
  }
});

var SelectedItemActionList = ReactMeteor.createClass({
  render: function () {
    var selectedItems = this.props.selectedItems,
        title         = `${selectedItems.length} selected`,
        disabled      = (selectedItems.length == 0);

    return (
      <DropdownButton disabled={disabled} title={title}>
        <MenuItem>Update</MenuItem>
        <MenuItem>Archive</MenuItem>
        <MenuItem divider />
        <MenuItem>Something else here</MenuItem>
      </DropdownButton>
    );
  }
});

var ItemSelector = ReactMeteor.createClass({
  render: function () {
    return (
      <DropdownButton
        bsSize="small"
        noCaret
        title={<span className="fa fa-list"></span>}
        onSelect={this.props.onSelect}
      >
        <MenuItem eventKey="all">All</MenuItem>
        <MenuItem eventKey="none">None</MenuItem>
        <MenuItem eventKey="inverse">Inverse</MenuItem>
      </DropdownButton>
    );
  }
});

var NewModal = ReactMeteor.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {};
  },

  onHide: function () {
    this.replaceState({});
    this.props.onHide.call();
  },

  validationContext: function () {
    return this.props.schema.namedContext("newForm");
  },

  validate: function () {
    return this.validationContext().validate(this.state);
  },

  isValid: function () {
    return this.validationContext().isValid();
  },

  validationState: function (fieldName) {
    this.validate();

    var invalidField = _.find(this.validationContext().invalidKeys(), function (invalidKey) {
      return invalidKey.name == fieldName;
    });

    if (invalidField) {
      return 'error';
    } else {
      return 'success';
    }
  },

  onSave: function () {
    var self = this;

    if (this.isValid()) {
      this.props.collectionService.call(this.props.createMethod, this.state, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          self.onHide();
        }
      });
    } else {
      console.error("The thing you tried to save isn't valid -- save blocked.");
    }
  },

  inputTypeFor: function (fieldSchemaType) {
    if (fieldSchemaType.regEx === SimpleSchema.RegEx.Url) {
      return 'url';
    } else {
      return 'text';
    }
  },

  render: function () {
    var self = this;

    return (
      <Modal show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>New {this.props.objectName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {_.map(this.props.schema.schema(), function (fieldSchema, fieldName) {
              return (
                <Input
                  key={fieldName}
                  type={self.inputTypeFor(fieldSchema)}
                  label={fieldSchema.label}
                  placeholder={'Enter the ' + self.props.objectName + ' ' + fieldName}
                  valueLink={self.linkState(fieldName)}
                  bsStyle={self.validationState(fieldName)}
                />
              );
            })}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onHide}>Close</Button>
          <Button
            onClick={this.onSave}
            bsStyle='primary'
            disabled={!this.isValid()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

CollectionManagerMixin = {
  getInitialState: function () {
    return {
      currentPage:    0,
      perPage:        10,
      itemFilter:     {},
      selectedItems:  [],
      newModalIsOpen: false
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

    if (schema.type == 'number') {
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

    if (itemPosition == -1) {
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

  render: function () {
    var currentPage   = this.state.currentPage,
        perPage       = this.state.perPage,
        itemCount     = this.state.itemCount,
        fromIndex     = perPage * currentPage,
        toIndex       = Math.min(fromIndex + perPage - 1, itemCount - 1),
        shownItems    = this.state.items.slice(fromIndex, toIndex + 1),
        selectedItems = this.state.selectedItems,
        self          = this;

    return (
      <div className="data-grid form-inline">
        <div className="row">
          <div className="col-md-12">
            <PageSizer
              perPage={perPage}
              perPageChanged={self.perPageChanged}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Panel>
              <div className="panel-heading">
                <ButtonToolbar>
                  <ButtonGroup>
                    <SelectedItemActionList selectedItems={selectedItems} />
                  </ButtonGroup>
                  <ButtonGroup className="pull-right">
                    <Button bsStyle="info">Import</Button>
                    <Button bsStyle="primary" onClick={self.openNewModal}>New</Button>
                  </ButtonGroup>
                  <NewModal
                    show={self.state.newModalIsOpen}
                    onHide={self.closeNewModal}
                    objectName={self.documentSingular}
                    schema={self.schema}
                    collectionService={self.collectionService}
                    createMethod={self.createMethod}
                  />
                </ButtonToolbar>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="selector-control">
                        <ItemSelector onSelect={self.itemSelectorChanged} />
                      </th>
                      {_.map(self.schema.schema(), function (schema, name) {
                        return (
                          <th key={name}>
                            <ColumnFilter
                              fieldSchema={schema}
                              onChange={self.filterChangedFor.bind(self, name, schema)}
                            />
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
                          <td className="selector-control">
                            <input
                              type="checkbox"
                              checked={_.contains(selectedItems, item._id)}
                              onChange={self.toggleSelect.bind(self, item._id)}
                            />
                          </td>
                          {_.map(self.schema.schema(), function (schema, name) {
                            return (
                              <Cell key={name} item={item} fieldName={name} fieldSchema={schema}/>
                            );
                          })}
                          <td>
                            <button type="button" className="btn btn-default btn-sm">Manage</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <GridInfo
              fromIndex={fromIndex}
              toIndex={toIndex}
              itemCount={itemCount}
            />
          </div>
          <div className="col-md-6">
            <Paginator
              itemCount={itemCount}
              perPage={perPage}
              currentPage={currentPage}
              onPageChange={self.setCurrentPage}
            />
          </div>
        </div>
      </div>
    );
  }
};
