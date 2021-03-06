CollectionManager.ListCell = ReactMeteor.createClass({
  render() {
    let fieldSchema = this.props.fieldSchema
    let item        = this.props.item
    let value       = this.props.fieldName.split('.').reduce(function (obj, i) { return obj && obj[i] }, item)
    let content

    if (fieldSchema.displayAs instanceof Relation) {
      value = _.isArray(value) ? value : [value];
      content = fieldSchema.displayAs.relatedValues(value);
    } else if (fieldSchema.regEx === SimpleSchema.RegEx.Url) {
      content = <a href={value} target="_blank">{value}</a>;
    } else if (fieldSchema.type === Date) {
      content = value ? moment(value).format('L') : '';
    } else if (fieldSchema.type === Boolean) {
      content = value ? fieldSchema.label : '';
    } else {
      content = value;
    }

    return (
      <td>{content}</td>
    );
  }
});
