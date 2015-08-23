CollectionManager.ListItemSelector = ReactMeteor.createClass({
  render: function () {
    return (
      <ReactBootstrap.DropdownButton
        bsSize="small"
        noCaret
        title={<span className="fa fa-list"></span>}
        onSelect={this.props.onSelect}>
        <ReactBootstrap.MenuItem eventKey="all">
          All
        </ReactBootstrap.MenuItem>
        <ReactBootstrap.MenuItem eventKey="none">
          None
        </ReactBootstrap.MenuItem>
        <ReactBootstrap.MenuItem eventKey="inverse">
          Inverse
        </ReactBootstrap.MenuItem>
      </ReactBootstrap.DropdownButton>
    );
  }
});
