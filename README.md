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

#### Installation (depends on `aldeed:collection2`)

`meteor add tauruscolvin:collection-manager aldeed:collection2`

#### Usage

Create a collection and attach a schema:

~~~js
// in some-file.jsx

Organizations = new Mongo.Collection('organizations');

Organizations.attachSchema(new SimpleSchema({
  status: {
    type: String,
    label: 'status'
  },

  name: {
    type: String,
    label: 'name'
  },

  url: {
    type: String,
    label: 'url'
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
~~~

*Note the `.jsx` extension on the file above*

## Now simply place the `OrganizationManager` into any Meteor template

```html
<div>
  {{> OrganizationManager}}
</div>
```
