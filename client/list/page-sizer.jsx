CollectionManager.ListPageSizer = ReactMeteor.createClass({
  render: function () {
    var countOptions = [10, 25, 50, 100];

    return (
      <p>
        <ReactBootstrap.Input
          type="select"
          bsSize="small"
          value={this.props.perPage}
          onChange={this.props.perPageChanged}>
          {countOptions.map(function (countOption) {
            return (
              <option key={countOption} value={countOption}>
                {countOption}
              </option>
            );
          })}
        </ReactBootstrap.Input>
        &nbsp;per page
      </p>
    );
  }
});
