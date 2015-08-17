# item-manager
Meteor package which provides a client-side collection manager (CRUD)

### Screenshot

![Screenshot](https://dl.dropboxusercontent.com/s/uwlw21p0q5ysq7y/2015-08-17%20at%201.30%20AM%202x.png)

# Installation

- Pull this repo into your `packages` directory:
  - `cd path/to/you/application/packages`
  - `git clone git@github.com:colvint/item-manager.git`
- Run `meteor add tauruscolvin:item-manager`

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

## Use the `ItemManagerMixin` to create your own Item Manager

For example, to create an item manager for an existing `Organizations` collection:

```javascript
OrganizationsDataGrid = ReactMeteor.createClass({
  mixins: [ItemManagerMixin],

  templateName:   'OrganizationsDataGrid', // this will make an OrganizationsDataGrid template
  collectionName: 'Organizations', // this collection is assumed to already exist
  itemSingular:   'organization', // how you want the collection to be referred to in the singular
  itemPlural:     'organizations', // ditto for plural

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

## Use our new ReactJS component template

```html
<div>
  {{> OrganizationsDataGrid}}
</div>
```
