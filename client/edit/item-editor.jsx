CollectionManager.ItemEditor = ReactMeteor.createClass({
  mixins: [React.addons.LinkedStateMixin],
  displayName: 'ItemEditor',
  templateName: 'ItemEditor',

  getInitialState() {
    var schema = this.props.collection.simpleSchema();

    if (!this.props.item._id) {
      return schema.clean({});
    } else {
      return _.pick(this.props.item, _.keys(schema.schema()));
    }
  },

  validationContext() {
    var contextKey = this.props.item._id ? 'new-modal' : ('edit-modal-' + this.props.item._id);

    return this.props.collection.simpleSchema().namedContext(contextKey);
  },

  validationMessage(fieldName) {
    return this.validationContext().keyErrorMessage(fieldName);
  },

  validationState(fieldName) {
    var item = _.clone(this.state),
        invalidFieldNames,
        fieldIsInvalid = false;

    this.props.collection.simpleSchema().clean(item);
    this.validationContext().validate(item);

    invalidFieldNames = _.pluck(this.validationContext().invalidKeys(), 'name');

    if (_.contains(invalidFieldNames, fieldName)) {
      fieldIsInvalid = true;
    }

    return fieldIsInvalid ? 'error' : 'success';
  },

  handleChange(fieldName, e) {
    var newState = {},
        newValue = e.target.value,
        fieldSchema = this.props.collection.simpleSchema().schema()[fieldName];

    if (fieldSchema.type === Boolean) {
      newState[fieldName] = e.target.checked;
    } else {
      newState[fieldName] = newValue;
    }

    this.setState(newState);
  },

  afterSave(error, result) {
    var callBack = this.props.onHide || (() => {});

    return error ? console.log(error) : callBack();
  },

  create() {
    return this.props.collection.insert(
      this.state,
      this.afterSave
    );
  },

  update() {
    var updatedItem = {};

    _.each(this.props.collection.simpleSchema().schema(),
      (fieldSchema, fieldName) => {
        if (!fieldSchema.denyUpdate) {
          updatedItem[fieldName] = this.state[fieldName];
        }
      }
    );

    return this.props.collection.update(
      this.props.item._id,
      {$set: updatedItem},
      this.afterSave
    );
  },

  saveItem() {
    return this.props.item._id ? this.update() : this.create();
  },

  render() {
    var editFields = {}, label;

    _.each(this.props.collection.simpleSchema().schema(), (fieldSchema, fieldName) => {
      if (fieldSchema.allowEdit) {
        editFields[fieldName] = fieldSchema;
      }
    });

    return (
      <form>
        {_.map(editFields, (fieldSchema, fieldName) => {
          if (fieldSchema.label) label = fieldSchema.label.capitalize();

          return (
            <CollectionManager.Field
              key={fieldName}
              fieldSchema={fieldSchema}
              label={label}
              valueLink={this.linkState(fieldName)}
              bsStyle={this.validationState(fieldName)}
              help={this.validationMessage(fieldName)}
              placeholder={'Enter the ' + this.props.collection._name + ' ' + fieldSchema.label}
              hasFeedback/>
          );
        })}
        <ReactBootstrap.ButtonInput
          onClick={this.saveItem}
          bsStyle='primary'
          disabled={!this.validationContext().isValid()}>
          Save
        </ReactBootstrap.ButtonInput>
      </form>
    );
  }
});
