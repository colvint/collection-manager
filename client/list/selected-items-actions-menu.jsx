CollectionManager.SelectedItemsActionsMenu = ReactMeteor.createClass({
  setStatus: function (newStatus) {
    this.props.connection.call(
      this.props.statusChangeMethod,
      this.props.selectedItemIds,
      newStatus,
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
          onSelect={actionMenu.setStatus.bind(actionMenu, 'archived')}>
          Archive
        </ReactBootstrap.MenuItem>
        <ReactBootstrap.MenuItem
          onSelect={actionMenu.setStatus.bind(actionMenu, 'active')}>
          Activate
        </ReactBootstrap.MenuItem>
      </ReactBootstrap.DropdownButton>
    );
  }
});
