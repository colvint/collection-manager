CollectionManager.ListCell = ReactMeteor.createClass({
  render() {
    var fieldSchema = this.props.fieldSchema,
        item        = this.props.item,
        value       = item[this.props.fieldName],
        content;

    if (fieldSchema.displayAs instanceof Relation) {
      value = _.isArray(value) ? value : [value];
      content = fieldSchema.displayAs.relatedValues(value);
    } else if (fieldSchema.regEx === SimpleSchema.RegEx.Url) {
      content = <a href={value} target="_blank">{value}</a>;
    } else if (fieldSchema.type === Date) {
      content = value ? moment(value).format('L') : '';
    } else {
      content = value;
    }

    return (
      <td>{content}</td>
    );
  }
});
