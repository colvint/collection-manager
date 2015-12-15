CollectionManager.ListPaginator = ReactMeteor.createClass({
  changePage(page) {
    var currentPage = parseInt(page),
        pageCount   = Math.ceil(this.props.itemCount / this.props.perPage);

    if (currentPage >= 0 && currentPage < pageCount) {
      this.props.onPageChange(currentPage);
    }
  },

  render() {
    var currentPage  = parseInt(this.props.currentPage),
        pageCount    = Math.ceil(this.props.itemCount / this.props.perPage),
        prevDisabled = (currentPage <= 0),
        nextDisabled = (currentPage >= (pageCount - 1)),
        prevPage     = currentPage - 1,
        nextPage     = currentPage + 1;

    return (
      <ReactBootstrap.Nav
        onSelect={this.props.onPageChange}
        bsStyle="pills"
        bsSize="xsmall"
        pullRight>
        <ReactBootstrap.NavItem eventKey={prevPage} disabled={prevDisabled}>
          <span>«</span>
        </ReactBootstrap.NavItem>
        {_.range(0, pageCount).map((page, i) => {
          return (
            <ReactBootstrap.NavItem
              className={classNames({'active': (currentPage === page)})}
              key={i}
              eventKey={page}
              disabled={page === currentPage}>
              {page + 1}
            </ReactBootstrap.NavItem>
          );
        })}
        <ReactBootstrap.NavItem eventKey={nextPage} disabled={nextDisabled}>
          <span>»</span>
        </ReactBootstrap.NavItem>
      </ReactBootstrap.Nav>
    );
  }
});
