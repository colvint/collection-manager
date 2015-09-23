CollectionManager.ListInfo = ReactMeteor.createClass({
    render() {
      var fromIndex     = this.props.fromIndex,
          toIndex       = this.props.toIndex,
          itemCount     = this.props.itemCount,
          gridIsEmpty   = (itemCount === 0),
          style         = { whiteSpace: 'nowrap' },
          label;

      if (gridIsEmpty) {
        label = 'No matching entries';
      } else {
        label = `Showing ${fromIndex + 1} to ${toIndex + 1} of ${itemCount} entries`;
      }

      return (
        <div style={style}>
          {label}
        </div>
      );
    }
});
