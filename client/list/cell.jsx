CollectionManager.ListCell = ReactMeteor.createClass({
  render() {
    var fieldSchema = this.props.fieldSchema,
        item        = this.props.item,
        value       = item[this.props.fieldName],
        content;

    if (fieldSchema.displayAs instanceof Relation) {
      content = fieldSchema.displayAs.relatedValue(value);
    } else if (fieldSchema.regEx === SimpleSchema.RegEx.Url) {
      content = <a href={value} target="_blank">{value}</a>;
    } else {
      content = value;
    }

    return (
      <td>{content}</td>
    );
  }
});
