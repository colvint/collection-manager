CollectionManager.EditModal = ReactMeteor.createClass({
  displayName: 'EditModal',

  isNewItem() {
    return typeof(this.props.item._id) === 'undefined';
  },

  modalTitle() {
    var actionVerb = this.isNewItem() ? 'New' : 'Edit';

    return actionVerb + ' ' + this.props.collection._name;
  },

  onHide() {
    if (this.isNewItem()) {
      this.replaceState({});
    }
    this.props.onHide();
  },

  render() {
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
          <CollectionManager.ItemEditor
            item={this.props.item}
            collection={this.props.collection}
            onHide={this.onHide} />
        </ReactBootstrap.Modal.Body>
      </ReactBootstrap.Modal>
    );
  }
});
