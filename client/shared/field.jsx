var RelationField = ReactMeteor.createClass({
  render: function () {
    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {this.props.selectOptions.map(function (selectOption) {
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
    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {this.props.selectOptions.map(function (selectOption) {
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
      <ReactBootstrap.Input type={this.inputTypeFor(this.props.fieldSchema)}
        {...this.props}/>
    );
  }
});

CollectionManager.Field = ReactMeteor.createClass({
  render: function () {
    var fieldType = this.props.fieldSchema.type;

    if (fieldType instanceof Relation) {
      return (
        <RelationField {...this.props}
          selectOptions={fieldType.allowedOptions()}/>
      );
    } else if (_.isArray(fieldType)) {
      return (
        <SelectField {...this.props}
          selectOptions={this.props.fieldSchema.allowedValues}/>
      );
    } else {
      return (<InputField {...this.props}/>);
    }
  }
});
