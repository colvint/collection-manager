CollectionManager.CollectionActions = ReactMeteor.createClass({
  mixins: [CollectionManager.ActionableMixin],

  getInitialState() {
    return {
      actionModalStates: {}
    }
  },

  render() {
    var importBtn, importModal, newBtn, newModal;

    if (this.props.allowImport) {
      importBtn = (
        <ReactBootstrap.Button
          bsStyle='info'
          onClick={this.openActionModal.bind(this, 'importItems')}>
          Import
        </ReactBootstrap.Button>
      );
      importModal = (
        <CollectionManager.ImportModal
          show={this.actionModalIsOpen('importItems')}
          onHide={this.closeActionModal}
          collection={this.props.collection}/>
      );
    }

    if (this.props.allowNew) {
      newBtn = (
        <ReactBootstrap.Button
          bsStyle='primary'
          onClick={this.openActionModal.bind(this, 'newItem')}>
          New
        </ReactBootstrap.Button>
      );
      newModal = (
        <CollectionManager.EditModal
          show={this.actionModalIsOpen('newItem')}
          onHide={this.closeActionModal}
          collection={this.props.collection}
          item={this.props.newItem.apply(this.props)}/>
      );
    }

    return (
      <ReactBootstrap.ButtonGroup className="pull-right">
        {importBtn}
        {importModal}
        {newModal}
        {_.map(this.props.actions, (action, key) => {
          return (
            <action.modal
              key={key}
              title={action.title}
              show={this.actionModalIsOpen(key)}
              onHide={this.closeActionModal}
              {...this.props}/>
          );
        })}
        {_.map(this.props.actions, (action, key) => {
          return (
            <ReactBootstrap.Button
              key={key}
              onClick={this.openActionModal.bind(this, key)}>
              {action.title}
            </ReactBootstrap.Button>
          );
        })}
        {newBtn}
      </ReactBootstrap.ButtonGroup>
    );
  }
});
