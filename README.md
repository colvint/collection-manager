# collection-manager
Meteor package which provides a client-side collection manager (CRUD)

![Screenshot](https://dl.dropboxusercontent.com/s/zen9ueyf0g39tkc/2015-08-17%20at%202.02%20AM%202x.png)

# Demo
[Online demo](http://collection-manager.meteor.com/)

# Example App
[Example app](https://github.com/colvint/collection-manager-example)

# Installation

`meteor add tauruscolvin:collection-manager`

## Use the `CollectionManagerMixin` to create your own collection manager

For example, to create a manager for an *existing* `Organizations` collection:

```javascript
ReactMeteor.createClass({
  mixins: [CollectionManagerMixin],

  templateName:   'OrganizationManager', // this will make an OrganizationsDataGrid template
  collectionName: 'Organizations', // this collection is assumed to already exist
  singularName:   'organization', // how you want the collection to be referred to in the singular
  pluralName:     'organizations', // ditto for plural

  // column config
  // field: the name of the field within your collection
  // label: how the column for that field should be labeled in the table
  // type: url, number or string (default)
  
  columns: [
    {field: 'name',        label: 'Name'},
    {field: 'url',         label: 'Website', type: 'url'},
    {field: 'memberCount', label: 'Members', type: 'number'}
  ]
});
```

## Use our new `OrganizationManager` in any Meteor template

```html
<div>
  {{> OrganizationManager}}
</div>
```
