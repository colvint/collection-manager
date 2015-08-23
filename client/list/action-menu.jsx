CollectionManager.ListActionMenu = ReactMeteor.createClass({
  render: function () {
    var selectedItems = this.props.selectedItems,
        title         = `${selectedItems.length} selected`,
        disabled      = (selectedItems.length === 0);

    return (
      <ReactBootstrap.DropdownButton
        disabled={disabled}
        title={title}>
        <ReactBootstrap.MenuItem>
          Mass Update
        </ReactBootstrap.MenuItem>
        <ReactBootstrap.MenuItem>
          Archive
        </ReactBootstrap.MenuItem>

        <ReactBootstrap.MenuItem divider />

      <ReactBootstrap.MenuItem>
          Custom Action 1
        </ReactBootstrap.MenuItem>
      </ReactBootstrap.DropdownButton>
    );
  }
});
