CollectionManager.ListInfo = ReactMeteor.createClass({
    render() {
      var fromIndex    = this.props.fromIndex,
          toIndex      = this.props.toIndex,
          itemCount    = this.props.itemCount,
          gridIsEmpty  = (itemCount === 0),
          style        = { whiteSpace: 'nowrap' },
          countOptions = [10, 25, 50, 100],
          sizeSelector,
          label;

      if (gridIsEmpty) {
        label = 'No matching entries';
      } else {
        label = `Showing ${fromIndex + 1} to ${toIndex + 1} of ${itemCount} entries`;
        sizeSelector = (
          <ReactBootstrap.Input
            type="select"
            bsSize="small"
            value={this.props.perPage}
            onChange={this.props.perPageChanged}>
            {countOptions.map((option) => {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </ReactBootstrap.Input>
        );
      }

      return (
        <div style={style}>
          {label}
          &nbsp;
          {sizeSelector}
          &nbsp;per page
        </div>
      );
    }
});
