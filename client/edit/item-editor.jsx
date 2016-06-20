CollectionManager.ItemEditor = ReactMeteor.createClass({
  mixins: [ReactLinkedStateMixin],
  displayName: 'ItemEditor',
  templateName: 'ItemEditor',

  getInitialState() {
    var schema = this.props.collection.simpleSchema(),
        item   = _.pick(this.props.item || {}, _.keys(schema.schema()));

    return {item: item, hasChanged: false};
  },

  getDefaultProps() {
    return {
      numRenderedColumns: 1,
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
    var item = _.clone(this.state.item),
        invalidFieldNames,
        fieldIsInvalid = false;

    this.props.collection.simpleSchema().clean(item, {trimStrings: false});
    this.validationContext().validate(item);

    invalidFieldNames = _.pluck(this.validationContext().invalidKeys(), 'name');

    if (_.contains(invalidFieldNames, fieldName)) {
      fieldIsInvalid = true;
    }

    return fieldIsInvalid ? 'error' : 'success';
  },

  handleChange(fieldName, eventOrObject) {
    var pathSegments = fieldName.split('.').reverse()
    var fieldRoot    = pathSegments.pop()
    var fieldKey     = pathSegments.shift()
    var fieldSchema  = this.props.collection.simpleSchema().schema()[fieldName]
    var fieldValue, newFieldState, newItem

    if (eventOrObject === null) {
      fieldValue = null;
    } else if (fieldSchema.type === Boolean) {
      fieldValue = eventOrObject.target.checked;
    } else if (fieldSchema.type.name === 'Array') {
      fieldValue = _.pluck(eventOrObject, 'value');
    } else if (fieldSchema.displayAs && fieldSchema.displayAs instanceof Relation) {
      fieldValue = eventOrObject.value;
    } else if (fieldSchema.allowedValues) {
      fieldValue = eventOrObject.value;
    } else if (fieldSchema.isRichTextArea) {
      fieldValue = eventOrObject.target.getContent();
    } else {
      fieldValue = eventOrObject.target.value;
    }

    if (_.isObject(this.state.item[fieldRoot])) {
      newFieldState = _.reduce(pathSegments,
        (currentObj, field) => { return {[field]: currentObj} },
        {$merge: {[fieldKey]: fieldValue}}
      )

      newFieldState = {[fieldRoot]: ReactUpdate(this.state.item[fieldRoot], newFieldState)}
    } else {
      newFieldState = {[fieldRoot]: fieldValue}
    }

    newItem = ReactUpdate(this.state.item, {$merge: newFieldState})

    this.setState({item: newItem, hasChanged: true});
  },

  afterSave(error, result) {
    var callBack = this.props.onHide || (() => {})

    this.setState({hasChanged: false})

    return error ? console.log(error) : callBack()
  },

  create() {
    return this.props.collection.insert(this.state.item, this.afterSave)
  },

  update() {
    var updatedItem = {}
    var itemId = this.props.item._id
    var itemCollection = this.props.collection
    var editableKeys = MeteorSite.Collection.permittedKeys(itemCollection)
    var updatedItem = _.pick(this.state.item, editableKeys)

    return itemCollection.update(itemId, {$set: updatedItem}, this.afterSave)
  },

  isSaveable() {
    return this.state.hasChanged && this.validationContext().isValid()
  },

  saveItem() {
    return this.props.item._id ? this.update() : this.create();
  },

  render() {
    var editFields = []
    var schema = this.props.collection.simpleSchema().schema()
    var numCols = this.props.numRenderedColumns
    var colSize = (12 / numCols)
    var colClass = 'col-md-' + colSize

    _.each(schema, (fieldSchema, fieldName) => {
      if (fieldSchema.allowEdit && !fieldSchema.denyQuickEdit) {
        editFields.push({fieldName: fieldName, fieldSchema: fieldSchema});
      }
    });

    var chunkSize = editFields.length / numCols
    var fieldGroups = _.toArray(_.groupBy(editFields, (field, i) => { return Math.floor(i / chunkSize) }))

    return (
      <form>
        <div className="row">
          {_.map(fieldGroups, (fieldList, i) => {
            return (
              <div key={i} className={colClass}>
                {_.map(fieldList, (field) => {
                  let fieldName = field.fieldName
                  let fieldValue = fieldName.split('.').reduce(function (obj, i) { return obj && obj[i] }, this.state.item)
                  let fieldSchema = field.fieldSchema
                  let label = fieldName

                  if (fieldSchema.label) label = fieldSchema.label

                  return (
                    <CollectionManager.Field
                      key={fieldName}
                      fieldName={fieldName}
                      fieldSchema={fieldSchema}
                      schema={schema}
                      label={label.capitalize()}
                      value={fieldValue}
                      onChange={this.handleChange.bind(this, fieldName)}
                      bsStyle={this.validationState(fieldName)}
                      help={this.validationMessage(fieldName)}
                      placeholder={'Enter the ' + this.props.collection._name + ' ' + label}
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
          disabled={!this.isSaveable()}>
          Save
        </ReactBootstrap.ButtonInput>
      </form>
    );
  }
});
