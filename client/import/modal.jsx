var ImportPreviewer = ReactMeteor.createClass({
  render: function () {
    var self        = this,
        previewSize = this.props.previewSize;

    return (
      <ReactBootstrap.Table className="table table-condensed">
        <thead>
          <tr>
            {_.map(self.props.schema.schema(), function (fieldSchema, fieldName) {
              return (
                <th key={fieldName}>{fieldName}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {_.map(_.first(self.props.previewObjects, previewSize), function (obj, i) {
            return (
              <tr key={i}>
                {_.map(self.props.schema.schema(), function (fieldSchema, fieldName) {
                  return (
                    <td key={fieldName}>{obj[fieldName]}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </ReactBootstrap.Table>
    );
  }
});

CollectionManager.ImportModal = ReactMeteor.createClass({
  mixins: [React.addons.LinkedStateMixin],

  initialState: {
    processing: false,
    percentImported: 0,
    parseErrors: [],
    validObjects: [],
    invalidObjects: [],

    config: {
      delimiter: "",	// auto-detect
      newline: "",	// auto-detect
      header: true,
      dynamicTyping: false,
      preview: 0,
      encoding: "",
      worker: false,
      comments: true,
      step: undefined,
      complete: undefined,
      error: undefined,
      download: false,
      skipEmptyLines: true,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined
    }
  },

  getInitialState: function () {
    return this.initialState;
  },

  onHide: function () {
    this.replaceState(this.initialState);
    this.props.onHide.call();
  },

  onFileChosen: function (event) {
    var file = _.first(event.target.files);

    Papa.parse(file, _.extend(this.state.config, {
      complete: this.onFileParsed
    }));
  },

  onFileParsed: function (results, file) {
    var self           = this,
        validObjects   = [],
        invalidObjects = [];

    _.each(results.data, function (parsedObject, i) {
      if (self.validationContext().validate(parsedObject)) {
        validObjects.push(parsedObject);
      } else {
        invalidObjects.push(parsedObject);
      }
    });

    this.setState({
      validObjects: validObjects,
      invalidObjects: invalidObjects
    });
  },

  validationContext: function () {
    return this.props.schema.namedContext("importForm");
  },

  processImports: function () {
    var importableObjects = this.state.validObjects,
        self              = this;

    _.each(importableObjects, function (obj, i) {
      self.props.collectionService.call(self.props.createMethod, obj, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          self.setState({
            percentImported: parseInt(((i + 1) / importableObjects.length) * 100)
          });
        }
      });
    });
    this.onHide();
  },

  render: function () {
    var self                = this,
        importableObjects   = this.state.validObjects,
        unImportableObjects = this.state.invalidObjects;

    return (
      <ReactBootstrap.Modal show={this.props.show} onHide={this.onHide}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>
            Import {this.props.objectName}
          </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>

        <ReactBootstrap.Modal.Body>
          <form>
            <ReactBootstrap.Input
              type="file"
              label="Choose an Import File"
              help={'The file should be a CSV containing the ' + this.props.objectName + ' to import'}
              onChange={this.onFileChosen} />
          </form>
          <ReactBootstrap.TabbedArea defaultActiveKey={1}>
            <ReactBootstrap.TabPane
              eventKey={1}
              tab={importableObjects.length + ' importable'}>
              <ImportPreviewer
                previewObjects={importableObjects}
                previewSize={5}
                schema={self.props.schema}/>
            </ReactBootstrap.TabPane>
            <ReactBootstrap.TabPane
              eventKey={2}
              tab={unImportableObjects.length + ' un-importable'}>
              <ImportPreviewer
                previewObjects={unImportableObjects}
                previewSize={5}
                schema={self.props.schema}/>
            </ReactBootstrap.TabPane>
          </ReactBootstrap.TabbedArea>
          <ReactBootstrap.ProgressBar now={this.state.percentImported} />
        </ReactBootstrap.Modal.Body>

        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button onClick={this.onHide}>Close</ReactBootstrap.Button>
          <ReactBootstrap.Button
            onClick={this.processImports}
            bsStyle='primary'
            disabled={this.state.validObjects.length === 0 || this.state.processing}>
            Import {this.state.validObjects.length} {this.props.objectName}
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
});
