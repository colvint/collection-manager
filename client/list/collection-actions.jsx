"use strict";

CollectionManager.CollectionActions = ReactMeteor.createClass({
  mixins: [CollectionManager.ActionableMixin],

  getInitialState() {
    return {
      actionModalStates: {}
    }
  },

  render() {
    return (
      <ReactBootstrap.ButtonGroup className="pull-right">
        <ReactBootstrap.Button
          bsStyle='info'
          onClick={this.openActionModal.bind(this, 'importItems')}>
          Import
        </ReactBootstrap.Button>
        <CollectionManager.ImportModal
          show={this.actionModalIsOpen('importItems')}
          onHide={this.closeActionModal}
          collection={this.props.collection}/>
        <CollectionManager.EditModal
          show={this.actionModalIsOpen('newItem')}
          onHide={this.closeActionModal}
          collection={this.props.collection}/>
          {_.map(this.props.actions, (action, key) => {
            return (
              <action.modal
                key={key}
                title={action.title}
                show={this.actionModalIsOpen(key)}
                onHide={this.closeActionModal}
                collection={this.props.collection}/>
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
          <ReactBootstrap.Button
            bsStyle='primary'
            onClick={this.openActionModal.bind(this, 'newItem')}>
            New
          </ReactBootstrap.Button>
      </ReactBootstrap.ButtonGroup>
    );
  }
});
