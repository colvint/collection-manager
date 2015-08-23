CollectionManager.ListActionMenu = ReactMeteor.createClass({
  render: function () {
    var title    = `${this.props.selectedItemIds.length} selected`,
        disabled = (this.props.selectedItemIds.length === 0);

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
