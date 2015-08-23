CollectionManager.EditModal = ReactMeteor.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {};
  },

  onHide: function () {
    this.replaceState({});
    this.props.onHide.call();
  },

  validationContext: function () {
    return this.props.schema.namedContext("newForm");
  },

  validate: function () {
    return this.validationContext().validate(this.state);
  },

  isValid: function () {
    return this.validationContext().isValid();
  },

  invalidFieldFor: function (fieldName) {
    return _.find(this.validationContext().invalidKeys(), function (invalidKey) {
      return invalidKey.name === fieldName;
    });
  },

  validationState: function (fieldName) {
    this.validate();

    if (this.invalidFieldFor(fieldName)) {
      return 'error';
    } else {
      return 'success';
    }
  },

  validationMessage: function (fieldName) {
    return this.validationContext().keyErrorMessage(fieldName);
  },

  onSave: function () {
    if (this.isValid()) {
      this.props.collectionService.call(this.props.createMethod, this.state, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          self.onHide();
        }
      });
    } else {
      console.error("The thing you tried to save isn't valid -- save blocked.");
    }
  },

  inputTypeFor: function (fieldSchemaType) {
    if (fieldSchemaType.regEx === SimpleSchema.RegEx.Url) {
      return 'url';
    } else {
      return 'text';
    }
  },

  render: function () {
    var self = this;

    return (
      <ReactBootstrap.Modal show={this.props.show} onHide={this.onHide}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>
            New {this.props.objectName}
          </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>

        <ReactBootstrap.Modal.Body>
          <form>
            {_.map(this.props.schema.schema(), function (fieldSchema, fieldName) {
              return (
                <ReactBootstrap.Input
                  key={fieldName}
                  type={self.inputTypeFor(fieldSchema)}
                  label={fieldSchema.label}
                  placeholder={'Enter the ' + self.props.objectName + ' ' + fieldName}
                  valueLink={self.linkState(fieldName)}
                  bsStyle={self.validationState(fieldName)}
                  help={self.validationMessage(fieldName)}
                  hasFeedback/>
              );
            })}
          </form>
        </ReactBootstrap.Modal.Body>

        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button onClick={this.onHide}>Close</ReactBootstrap.Button>
          <ReactBootstrap.Button
            onClick={this.onSave}
            bsStyle='primary'
            disabled={!this.isValid()}>
            Save
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
});
