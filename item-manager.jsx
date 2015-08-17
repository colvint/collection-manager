var ColumnFilter = ReactMeteor.createClass({
  render: function () {
    var filterWidget,
        column = this.props.column;

    if (column.type == 'number') {
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
          placeholder={column.label}
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
    var column = this.props.column,
        item   = this.props.item,
        value  = item[column.field],
        content;

    if (column.type == 'url') {
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
    var countOptions = [2, 10, 25, 50, 100];

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

ItemManagerMixin = {
  getInitialState: function () {
    return {
      currentPage:   0,
      perPage:       10,
      itemFilter:    {},
      selectedItems: []
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

  filterChangedFor: function (column, event) {
    var filterVal     = event.target.value,
        currentFilter = this.state.itemFilter,
        newFilter;

    if (column.type == 'number') {
      newFilter = {$lte: parseInt(filterVal)};
    } else {
      newFilter = new RegExp(filterVal, 'i');
    }

    currentFilter[column.field] = newFilter;

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

  render: function () {
    var currentPage   = this.state.currentPage,
        perPage       = this.state.perPage,
        itemCount     = this.state.itemCount,
        fromIndex     = perPage * currentPage,
        toIndex       = Math.min(fromIndex + perPage - 1, itemCount - 1),
        shownItems    = this.state.items.slice(fromIndex, toIndex + 1),
        selectedItems = this.state.selectedItems,
        columns       = this.columns,
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
                    <Button bsStyle="primary">New</Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="selector-control">
                        <ItemSelector onSelect={self.itemSelectorChanged} />
                      </th>
                      {columns.map(function (column, i) {
                        return (
                          <th key={i}>
                            <ColumnFilter
                              column={column}
                              onChange={self.filterChangedFor.bind(self, column)}
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
                          {columns.map(function (column, i) {
                            return (
                              <Cell key={i} item={item} column={column}/>
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
