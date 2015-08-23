CollectionManager.ListColumnFilter = ReactMeteor.createClass({
  render: function () {
    var filterWidget,
        fieldSchema = this.props.fieldSchema;

    if (fieldSchema.type === 'number') {
      filterWidget = (
        <ReactBootstrap.Input
          type="range"
          bsSize="small"
          onChange={this.props.onChange}
        />
      );
    } else {
      filterWidget = (
        <ReactBootstrap.Input
          type="search"
          bsSize="small"
          onChange={this.props.onChange}
          placeholder={fieldSchema.label}
        />
      );
    }

    return (
      <form className="form-inline">
        {filterWidget}
      </form>
    );
  }
});
