var RelationField = ReactMeteor.createClass({
  render() {
    var selectOptions = this.props.fieldSchema.displayAs.allowedOptions();

    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {selectOptions.map((option) => {
          return (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          );
        })}
      </ReactBootstrap.Input>
    );
  }
});

var SelectField = ReactMeteor.createClass({
  render() {
    var selectOptions = this.props.fieldSchema.allowedValues;

    return (
      <ReactBootstrap.Input type="select" {...this.props}>
        <option></option>
        {selectOptions.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </ReactBootstrap.Input>
    );
  }
});

var InputField = ReactMeteor.createClass({
  inputTypeFor(fieldSchema) {
    if (fieldSchema.regEx === SimpleSchema.RegEx.Url) {
      return 'url';
    } else if (fieldSchema.type === Number) {
      return 'number';
    } else {
      return 'text';
    }
  },

  render() {
    return (
      <ReactBootstrap.Input
        type={this.inputTypeFor(this.props.fieldSchema)}
        {...this.props}/>
    );
  }
});

CollectionManager.Field = ReactMeteor.createClass({
  render() {
    if (this.props.fieldSchema.displayAs instanceof Relation) {
      return (<RelationField {...this.props}/>);
    } else if (this.props.fieldSchema.allowedValues) {
      return (<SelectField {...this.props}/>);
    } else {
      return (<InputField {...this.props}/>);
    }
  }
});
