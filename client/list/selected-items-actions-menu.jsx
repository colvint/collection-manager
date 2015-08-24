CollectionManager.SelectedItemsActionsMenu = ReactMeteor.createClass({
  archiveItems: function () {
    this.props.connection.call(
      this.props.archiveMethod,
      this.props.selectedItemIds,
      this.props.onActionCompleted
    );
  },

  render: function () {
    var actionMenu = this,
        title      = `${actionMenu.props.selectedItemIds.length} selected`,
        disabled   = (actionMenu.props.selectedItemIds.length === 0);

    return (
      <ReactBootstrap.DropdownButton
        disabled={disabled}
        title={title}>
        <ReactBootstrap.MenuItem>
          Mass Update
        </ReactBootstrap.MenuItem>
        <ReactBootstrap.MenuItem
          onSelect={actionMenu.archiveItems}>
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
