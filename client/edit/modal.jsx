CollectionManager.EditModal = ReactMeteor.createClass({
  mixins: [React.addons.LinkedStateMixin],

  isNewItem: function () {
    return typeof(this.props.itemId) === 'undefined';
  },

  getInitialState: function () {
    if (this.isNewItem()) {
      return {};
    } else {
      return _.pick(
        this.props.item,
        _.keys(this.props.schema.schema())
      );
    }
  },

  modalTitle: function () {
    var actionVerb;

    if (this.isNewItem()) {
      actionVerb = 'New';
    } else {
      actionVerb = 'Edit';
    }

    return actionVerb + ' ' + this.props.objectName;
  },

  inputTypeFor: function (fieldSchemaType) {
    if (fieldSchemaType.regEx === SimpleSchema.RegEx.Url) {
      return 'url';
    } else {
      return 'text';
    }
  },

  validationContext: function () {
    var contextKey;

    if (this.isNewItem()) {
      contextKey = 'new-modal';
    } else {
      contextKey = "edit-modal-" + this.props.item._id;
    }

    return this.props.schema.namedContext(contextKey);
  },

  validationMessage: function (fieldName) {
    return this.validationContext().keyErrorMessage(fieldName);
  },

  validationState: function (fieldName) {
    this.validationContext().validate(this.state);

    var invalidField = _.find(this.validationContext().invalidKeys(),
      function (invalidKey) {
        return invalidKey.name === fieldName;
      }
    );

    return invalidField ? 'error' : 'success';
  },

  onHide: function () {
    if (this.isNewItem()) {
      this.replaceState({});
    }
    this.props.onHide();
  },

  afterSave: function (error, result) {
    if (error) {
      console.log(error);
    } else {
      this.onHide();
    }
  },

  create: function () {
    this.props.collection.insert(
      this.state,
      this.afterSave
    );
  },

  update: function () {
    this.props.collection.update(
      this.props.itemId,
      {$set: this.state},
      this.afterSave
    );
  },

  saveItem: function () {
    if (this.isNewItem()) {
      this.create();
    } else {
      this.update();
    }
  },

  render: function () {
    var component = this,
        placeholder;

    return (
      <ReactBootstrap.Modal
        show={component.props.show}
        onHide={component.props.onHide}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>
            {component.modalTitle()}
          </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
          <form>
            {_.map(component.props.schema.schema(), function (fieldSchema, fieldName) {
              placeholder = 'Enter the ' + component.props.objectName + ' ' + fieldName;

              return (
                <ReactBootstrap.Input
                  key={fieldName}
                  type={component.inputTypeFor(fieldSchema)}
                  label={fieldSchema.label}
                  placeholder={placeholder}
                  valueLink={component.linkState(fieldName)}
                  bsStyle={component.validationState(fieldName)}
                  help={component.validationMessage(fieldName)}
                  hasFeedback/>
              );
            })}
          </form>
        </ReactBootstrap.Modal.Body>
        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button
            onClick={component.props.onHide}>
            Close
          </ReactBootstrap.Button>
          <ReactBootstrap.Button
            onClick={component.saveItem}
            bsStyle='primary'
            disabled={!component.validationContext().isValid()}>
            Save
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
});
