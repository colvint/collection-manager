CollectionManager.SelectedItemsActionsMenu = ReactMeteor.createClass({
  mixins: [CollectionManager.ActionableMixin],

  getInitialState() {
    return {
      actionModalStates: {}
    }
  },

  render() {
    var SelectedItemActions;

    if (!_.isEmpty(this.props.selectedItemActions)) {
      SelectedItemActions = (
        <ReactBootstrap.ButtonGroup>
          <ReactBootstrap.DropdownButton
            disabled={this.props.selectedItemIds.length === 0}
            title={this.props.selectedItemIds.length + ' selected'}
            onSelect={this.openActionModal}>
            {_.map(this.props.selectedItemActions, (action, key) => {
              return (
                <ReactBootstrap.MenuItem
                  key={key}
                  eventKey={key}>
                  {action.title}
                </ReactBootstrap.MenuItem>
              );
            })}
          </ReactBootstrap.DropdownButton>
          {_.map(this.props.selectedItemActions, (action, key) => {
            return (
              <action.modal
                key={key}
                title={action.title}
                show={this.actionModalIsOpen(key)}
                onHide={this.closeActionModal}
                selectedIds={this.props.selectedItemIds}/>
            );
          })}
        </ReactBootstrap.ButtonGroup>
      );
    } else {
      SelectedItemActions = <ReactBootstrap.ButtonGroup/>;
    }

    return (SelectedItemActions);
  }
});
