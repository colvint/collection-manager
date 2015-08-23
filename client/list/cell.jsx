CollectionManager.ListCell = ReactMeteor.createClass({
  render: function () {
    var fieldSchema = this.props.fieldSchema,
        item        = this.props.item,
        value       = item[this.props.fieldName],
        content;

    if (fieldSchema.type === 'url') {
      content = <a href={value}>{value}</a>;
    } else {
      content = value;
    }

    return (
      <td>{content}</td>
    );
  }
});
