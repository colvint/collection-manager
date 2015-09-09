CollectionManager.EditModal = ReactMeteor.createClass({
  mixins: [React.addons.LinkedStateMixin],

  isNewItem: function () {
    return typeof(this.props.itemId) === 'undefined';
  },

  getInitialState: function () {
    var schema = this.props.collection.simpleSchema();

    if (this.isNewItem()) {
      return schema.clean({});
    } else {
      return _.pick(this.props.item, _.keys(schema.schema()));
    }
  },

  modalTitle: function () {
    var actionVerb = this.isNewItem() ? 'New' : 'Edit';

    return actionVerb + ' ' + this.props.collection._name;
  },

  validationContext: function () {
    var contextKey = this.isNewItem() ? 'new-modal' : ('edit-modal-' + this.props.item._id);

    return this.props.collection.simpleSchema().namedContext(contextKey);
  },

  validationMessage: function (fieldName) {
    return this.validationContext().keyErrorMessage(fieldName);
  },

  validationState: function (fieldName) {
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

  onHide: function () {
    if (this.isNewItem()) {
      this.replaceState({});
    }
    this.props.onHide();
  },

  afterSave: function (error, result) {
    return error ? console.log(error) : this.onHide();
  },

  create: function () {
    return this.props.collection.insert(this.state, this.afterSave);
  },

  update: function () {
    return this.props.collection.update(this.props.itemId,
      {$set: this.state}, this.afterSave);
  },

  saveItem: function () {
    return this.isNewItem() ? this.create() : this.update();
  },

  render: function () {
    return (
      <ReactBootstrap.Modal
        show={this.props.show}
        onHide={this.props.onHide}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>
            {this.modalTitle()}
          </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
          <form>
            {_.map(this.props.collection.simpleSchema().schema(), (fieldSchema, fieldName) => {
              return (
                <CollectionManager.Field
                  key={fieldName}
                  fieldSchema={fieldSchema}
                  label={fieldSchema.label}
                  valueLink={this.linkState(fieldName)}
                  bsStyle={this.validationState(fieldName)}
                  help={this.validationMessage(fieldName)}
                  placeholder={'Enter the ' + this.props.collection._name + ' ' + fieldSchema.label}
                  hasFeedback/>
              );
            })}
          </form>
        </ReactBootstrap.Modal.Body>
        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button
            onClick={this.props.onHide}>
            Close
          </ReactBootstrap.Button>
          <ReactBootstrap.Button
            onClick={this.saveItem}
            bsStyle='primary'
            disabled={!this.validationContext().isValid()}>
            Save
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
});
