CollectionManager.SelectedItemsActionsMenu = ReactMeteor.createClass({
  archiveItems: function () {
    this.props.connection.call(
      this.props.archiveMethod,
      this.props.selectedItemIds,
      this.props.onActionCompleted
    );
  },

  activateItems: function () {
    this.props.connection.call(
      this.props.activateMethod,
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
        <ReactBootstrap.MenuItem
          onSelect={actionMenu.archiveItems}>
          Archive
        </ReactBootstrap.MenuItem>
        <ReactBootstrap.MenuItem
          onSelect={actionMenu.activateItems}>
          Activate
        </ReactBootstrap.MenuItem>
      </ReactBootstrap.DropdownButton>
    );
  }
});
