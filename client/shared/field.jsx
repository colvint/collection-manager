var RelationField = ReactMeteor.createClass({
  render: function () {
    var selectOptions = this.props.fieldSchema.displayAs.allowedOptions();

    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {selectOptions.map(function (selectOption) {
          return (
            <option key={selectOption._id} value={selectOption._id}>
              {selectOption.name}
            </option>
          );
        })}
      </ReactBootstrap.Input>
    );
  }
});

var SelectField = ReactMeteor.createClass({
  render: function () {
    var selectOptions = this.props.fieldSchema.allowedValues;

    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {selectOptions.map(function (selectOption) {
          return (
            <option key={selectOption} value={selectOption}>
              {selectOption}
            </option>
          );
        })}
      </ReactBootstrap.Input>
    );
  }
});

var InputField = ReactMeteor.createClass({
  inputTypeFor: function (fieldSchema) {
    if (fieldSchema.regEx === SimpleSchema.RegEx.Url) {
      return 'url';
    } else if (fieldSchema.type === Number) {
      return 'number';
    } else {
      return 'text';
    }
  },

  render: function () {
    return (
      <ReactBootstrap.Input
        type={this.inputTypeFor(this.props.fieldSchema)}
        {...this.props}/>
    );
  }
});

CollectionManager.Field = ReactMeteor.createClass({
  render: function () {
    if (this.props.fieldSchema.displayAs instanceof Relation) {
      return (<RelationField {...this.props}/>);
    } else if (this.props.fieldSchema.allowedValues) {
      return (<SelectField {...this.props}/>);
    } else {
      return (<InputField {...this.props}/>);
    }
  }
});
