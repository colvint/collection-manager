# collection-manager
Meteor package which provides a client-side collection manager (CRUD)

![Screenshot](https://dl.dropboxusercontent.com/s/zen9ueyf0g39tkc/2015-08-17%20at%202.02%20AM%202x.png)

# Example App
[Example app](https://github.com/colvint/collection-manager-example)

# Installation

- Pull this repo into your `packages` directory:
  - `cd path/to/you/application/packages`
  - `git clone git@github.com:colvint/collection-manager.git`
- Run `meteor add tauruscolvin:collection-manager`

## Configure `ReactBootstrap` components

Add this code to a file within your `client/lib` directory:

```javascript
Button         = ReactBootstrap.Button;
ButtonGroup    = ReactBootstrap.ButtonGroup;
ButtonToolbar  = ReactBootstrap.ButtonToolbar;
DropdownButton = ReactBootstrap.DropdownButton;
Input          = ReactBootstrap.Input;
MenuItem       = ReactBootstrap.MenuItem;
Nav            = ReactBootstrap.Nav;
Navbar         = ReactBootstrap.Navbar;
NavItem        = ReactBootstrap.NavItem;
Panel          = ReactBootstrap.Panel;
```

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
