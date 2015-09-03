var SelectField = ReactMeteor.createClass({
  render: function () {
    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {this.props.selectOptions.map(function (selectOption) {
          if (_.isObject(selectOption)) {
            return (
              <option key={selectOption._id} value={selectOption._id}>
                {selectOption.name}
              </option>
            );
          } else {
            return (
              <option key={selectOption} value={selectOption}>
                {selectOption}
              </option>
            );
          }
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
    var placeholder = 'Enter the ' + this.props.objectName + ' ' + this.props.key;

    return (
      <ReactBootstrap.Input
        type={this.inputTypeFor(this.props.fieldSchema)}
        placeholder={placeholder}
        {...this.props}/>
    );
  }
});

CollectionManager.Field = ReactMeteor.createClass({
  render: function () {
    var allowedValues = this.props.fieldSchema.allowedValues;

    if (_.isFunction(allowedValues)) {
      return (
        <SelectField {...this.props}
          selectOptions={allowedValues({listType: 'Object'})}/>
      );
    } else if (_.isArray(allowedValues)){
      return (
        <SelectField {...this.props}
          selectOptions={allowedValues}/>
      );
    } else {
      return (<InputField {...this.props}/>);
    }
  }
});
