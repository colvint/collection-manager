"use strict";

CollectionManager.SelectedItemsActionsMenu = ReactMeteor.createClass({
  getInitialState() {
    return {
      actionModalStates: {}
    }
  },

  actionModalIsOpen(key) {
    return this.state.actionModalStates[key];
  },

  openActionModal(key) {
    var actionModalStates = this.state.actionModalStates;

    actionModalStates[key] = true;

    this.setState({
      actionModalStates: actionModalStates
    });
  },

  closeActionModal(key) {
    this.setState({actionModalStates: {}});
  },

  render() {
    let Actions;

    if (!_.isEmpty(this.props.actions)) {
      Actions = (
        <ReactBootstrap.ButtonGroup>
          <ReactBootstrap.DropdownButton
            disabled={this.props.selectedItemIds.length === 0}
            title={this.props.selectedItemIds.length + ' selected'}
            onSelect={this.openActionModal}>
            {_.map(this.props.actions, (action, key) => {
              return (
                <ReactBootstrap.MenuItem
                  key={key}
                  eventKey={key}>
                  {action.title}
                </ReactBootstrap.MenuItem>
              );
            })}
          </ReactBootstrap.DropdownButton>
          {_.map(this.props.actions, (action, key) => {
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
      Actions = <ReactBootstrap.ButtonGroup/>;
    }

    return (Actions);
  }
});
