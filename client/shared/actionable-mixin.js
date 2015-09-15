CollectionManager.ActionableMixin = {
  actionModalIsOpen: function (key) {
    return this.state.actionModalStates[key];
  },

  openActionModal: function (key) {
    var actionModalStates = this.state.actionModalStates;

    actionModalStates[key] = true;

    this.setState({
      actionModalStates: actionModalStates
    });
  },

  closeActionModal: function (key) {
    this.setState({actionModalStates: {}});
  }
}
