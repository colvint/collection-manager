var SelectField = ReactMeteor.createClass({
  render: function () {
    return (
      <ReactBootstrap.Input
        type="select"
        {...this.props}>
        {this.props.fieldSchema.allowedValues.map(function (allowedValue) {
          return (
            <option
              key={allowedValue}
              value={allowedValue}>
              {allowedValue}
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
      return 'range';
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
    if (typeof(this.props.fieldSchema.allowedValues) === 'undefined') {
      return (<InputField {...this.props}/>);
    } else {
      return (<SelectField {...this.props}/>);
    }
  }
});
