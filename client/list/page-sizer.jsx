CollectionManager.ListPageSizer = ReactMeteor.createClass({
  render() {
    var countOptions = [10, 25, 50, 100];

    return (
      <ReactBootstrap.Panel>
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
        &nbsp;per page
      </ReactBootstrap.Panel>
    );
  }
});
