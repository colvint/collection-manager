CollectionManager.ItemActions = React.createClass({
  mixins: [CollectionManager.ActionableMixin],

  getInitialState() {
    return {
      actionModalStates: {}
    }
  },

  render() {
    var item = this.props.item,
        manageButton, editButton, actionButtons;

    if (this.props.allowManage) {
      manageButton = (
        <ReactBootstrap.Button
          href={'/admin/' + this.props.collection._name + '/' + item._id}>
          Manage
        </ReactBootstrap.Button>
      );
    }

    if (this.props.allowEdit) {
      editButton = (
        <ReactBootstrap.Button
          onClick={this.openActionModal.bind(this, 'editItem')}>
          Edit
        </ReactBootstrap.Button>
      );
    }

    if (_.size(this.props.actions) > 0) {
      actionButtons = (
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
      );
    }

    return (
      <td style={{textAlign: 'center'}}>
        <ReactBootstrap.ButtonGroup>
          {editButton}
          {manageButton}
          {actionButtons}
        </ReactBootstrap.ButtonGroup>
        <CollectionManager.EditModal
          show={this.actionModalIsOpen('editItem')}
          onHide={this.closeActionModal}
          collection={this.props.collection}
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
