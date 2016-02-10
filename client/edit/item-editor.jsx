CollectionManager.ItemEditor = ReactMeteor.createClass({
  mixins: [ReactLinkedStateMixin],
  displayName: 'ItemEditor',
  templateName: 'ItemEditor',

  getInitialState() {
    var schema = this.props.collection.simpleSchema(),
        item   = this.props.item || {};

    return _.pick(item, _.keys(schema.schema()));
  },

  getDefaultProps() {
    return {
      numRenderedColumns: 1
    };
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

  handleChange(fieldName, eventOrObject) {
    var newState    = {},
        fieldSchema = this.props.collection.simpleSchema().schema()[fieldName];

    if (eventOrObject === null) {
      newState[fieldName] = null;
    } else if (fieldSchema.type === Boolean) {
      newState[fieldName] = eventOrObject.target.checked;
    } else if (fieldSchema.type.name === 'Array') {
      newState[fieldName] = _.pluck(eventOrObject, 'value');
    } else if (fieldSchema.displayAs && fieldSchema.displayAs instanceof Relation) {
      newState[fieldName] = eventOrObject.value;
    } else if (fieldSchema.allowedValues) {
      newState[fieldName] = eventOrObject.value;
    } else if (fieldSchema.isRichTextArea) {
      newState[fieldName] = eventOrObject.target.getContent();
    } else {
      newState[fieldName] = eventOrObject.target.value;
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
    var editFields = [], label,
        schema = this.props.collection.simpleSchema().schema(),
        colSize = (12 / this.props.numRenderedColumns),
        colClass = 'col-md-' + colSize,
        fieldGroups;

    _.each(schema, (fieldSchema, fieldName) => {
      if (fieldSchema.allowEdit) {
        editFields.push({fieldName: fieldName, fieldSchema: fieldSchema});
      }
    });

    fieldGroups = _.map(_.range(0, this.props.numRenderedColumns), (col) => {
      var colIdx = col * colSize;
      return editFields.slice(colIdx, colIdx + colSize);
    });

    return (
      <form>
        <div className="row">
          {_.map(fieldGroups, (fieldList, i) => {
            return (
              <div key={i} className={colClass}>
                {_.map(fieldList, (field) => {
                  var fieldName = field.fieldName, fieldSchema = field.fieldSchema;

                  if (fieldSchema.label) label = fieldSchema.label.capitalize();

                  return (
                    <CollectionManager.Field
                      key={fieldName}
                      fieldName={fieldName}
                      fieldSchema={fieldSchema}
                      schema={schema}
                      label={label}
                      value={this.state[fieldName]}
                      onChange={this.handleChange.bind(this, fieldName)}
                      bsStyle={this.validationState(fieldName)}
                      help={this.validationMessage(fieldName)}
                      placeholder={'Enter the ' + this.props.collection._name + ' ' + fieldSchema.label}
                      hasFeedback/>
                  );
                })}
              </div>
            );
          })}
        </div>
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
