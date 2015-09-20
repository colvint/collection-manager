# collection-manager
Meteor package which provides a client-side collection manager

#### Features
- CRUD
- Import
- Item selection
- Auto-pagination
- Custom actions

![Screenshot](https://dl.dropboxusercontent.com/s/zen9ueyf0g39tkc/2015-08-17%20at%202.02%20AM%202x.png)

#### Demo
[Online demo](http://collection-manager.meteor.com/)

#### Example App
[Example app](https://github.com/colvint/collection-manager-example)

#### Installation

`meteor add tauruscolvin:collection-manager`

#### Usage

Create a collection and attach a schema use extended options:

```
allowEdit: true, // displays the field in the edit modal
allowFilter: true, // displays the field in the list
displayAs: BelongsToSchoolGroup, // pass an instance of Relation to handle associations
```

~~~js
// in some-file.jsx

Organizations = new Mongo.Collection('organizations');
SchoolGroups = new Mongo.Collection('school-groups');

BelongsToSchoolGroup = new Relation(SchoolGroups);

Organizations.attachSchema(new SimpleSchema({
  status: {
    type: String,
    label: 'status',
    allowedValues: ['active', 'archived', 'removed'],
    allowFilter: true
  },

  name: {
    type: String,
    label: 'name',
    allowFilter: true,
    allowEdit: true
  },

  url: {
    type: String,
    label: 'url',
    regEx: SimpleSchema.RegEx.Url,
    allowEdit: true,
    allowFilter: true
  },

  schoolGroupId: {
    type: String,
    label: 'School Group',
    allowEdit: true,
    allowFilter: true,
    displayAs: BelongsToSchoolGroup,
    optional: true
  }
}));

if (Meteor.isClient) {
  var FooModalAction = React.createClass({
    render() {
      return (
        <ReactBootstrap.Modal show={this.props.show} onHide={this.props.onHide}>
          <ReactBootstrap.Modal.Header closeButton>
            {this.props.title}
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            foo on ids: {this.props.selectedIds.join(', ')}
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer>
            &nbsp;
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal>
      );
    }
  });

  CollectionManager.compose(Organizations, 'OrganizationsManager', {
    actions: {
      fooAction: {
        title: "Foo Action",
        modal: FooModalAction
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Organizations.find().count() == 0) {

      console.log('Adding startup data...');

      var organizations = [
        {name: 'Foobar Group, Inc.', url: 'http://foobar.example.com', memberCount: 50},
        {name: 'Bazzy Group, Inc.', url: 'http://bazzy.example.com', memberCount: 20},
        {name: 'Vertigo Group, Inc.', url: 'http://vertigo.example.com', memberCount: 3},
      ];

      organizations.map(function (obj, i) {
        Organizations.insert(obj);
        console.log('Inserted organization: ', obj);
      });
    }
  });
}
~~~

*Note the `.jsx` extension on the file above*

## Now simply place the `OrganizationManager` into any Meteor template

```html
<div>
  {{> OrganizationManager}}
</div>
```
