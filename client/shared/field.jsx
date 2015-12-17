var SelectField = ReactMeteor.createClass({
  render() {
    var label, classes = {
      'form-group':   !this.props.isFilter,
      'has-feedback': this.props.hasFeedback,
      'has-success':  this.props.bsStyle === 'success',
      'has-warning':  this.props.bsStyle === 'warning',
      'has-error':    this.props.bsStyle === 'error'
    };

    return (
      <div className={classNames(classes)}>
        <label className='control-label'>
          {this.props.label}
        </label>
        <ReactSelect options={this.props.options} {...this.props} />
        <span className='help-block'>
          {this.props.help}
        </span>
      </div>
    );
  }
});

var InputField = ReactMeteor.createClass({
  inputTypeFor(fieldSchema) {
    if (fieldSchema.regEx === SimpleSchema.RegEx.Url) {
      return 'url';
    } else if (fieldSchema.type === Number) {
      return 'number';
    } else if (fieldSchema.type === Date) {
      return 'date';
    } else if (fieldSchema.displayAs === 'time') {
      return 'time';
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

var CheckboxField = React.createClass({
  render() {
    var checked = this.props.value;

    return (
      <ReactBootstrap.Input
        type="checkbox"
        checked={checked}
        {...this.props}/>
    );
  }
});

CollectionManager.Field = ReactMeteor.createClass({
  render() {
    var fieldSchema   = this.props.fieldSchema,
        fieldName     = this.props.fieldName,
        fullSchema    = this.props.schema,
        subSchema     = fullSchema[fieldName + '.$'],
        allowedValues = fullSchema[fieldName].allowedValues,
        options       = [];

    if (subSchema && subSchema.allowedValues) {
      allowedValues = subSchema.allowedValues;
    }

    if (fieldSchema.displayAs instanceof Relation) {
      options = _.map(fieldSchema.displayAs.allowedOptions(), (option) => {
        label = _.isFunction(option.label) ? option.label() : option.label;
        return {value: option._id, label: label};
      });

      return (
        <SelectField
          options={options}
          multi={fieldSchema.type.name === 'Array'}
          {...this.props}/>
      );
    } else if (allowedValues) {
      options = _.map(allowedValues, (value) => (
        {value: value, label: value}
      ));

      return (
        <SelectField
          options={options}
          multi={fieldSchema.type.name === 'Array'}
          {...this.props}/>
      );
    } else if (fieldSchema.type === Boolean) {
      return (<CheckboxField {...this.props}/>);
    } else {
      return (<InputField {...this.props}/>);
    }
  }
});
