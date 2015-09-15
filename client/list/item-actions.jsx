"use strict";

CollectionManager.ItemActions = ReactMeteor.createClass({
  mixins: [CollectionManager.ActionableMixin],

  getInitialState() {
    return {
      actionModalStates: {}
    }
  },

  render() {
    let item = this.props.item;

    return (
      <td>
        <ReactBootstrap.ButtonGroup>
          <ReactBootstrap.Button
            onClick={this.openActionModal.bind(this, 'editItem')}>
            Edit
          </ReactBootstrap.Button>
          <ReactBootstrap.DropdownButton
            title='Actions'
            onSelect={this.openActionModal}>
            {_.map(this.props.actions, (action, key) => {
              return (
                <ReactBootstrap.MenuItem key={key} eventKey={key}>
                  {action.title}
                </ReactBootstrap.MenuItem>
              );
            })}
          </ReactBootstrap.DropdownButton>
        </ReactBootstrap.ButtonGroup>
        <CollectionManager.EditModal
          show={this.actionModalIsOpen('editItem')}
          onHide={this.closeActionModal}
          collection={this.props.collection}
          itemId={item._id}
          item={item}/>
        {_.map(this.props.actions, (action, key) => {
          return (
            <action.modal
              key={key}
              title={action.title}
              show={this.actionModalIsOpen(key)}
              onHide={this.closeActionModal}
              item={item}/>
          );
        })}
      </td>
    );
  }
});
