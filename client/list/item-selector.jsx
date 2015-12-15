CollectionManager.ListItemSelector = ReactMeteor.createClass({
  render() {
    return (
      <ReactBootstrap.DropdownButton
        id="list-item-selector"
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
