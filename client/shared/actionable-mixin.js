CollectionManager.ActionableMixin = {
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
  }
}
