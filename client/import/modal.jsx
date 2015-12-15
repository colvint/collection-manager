var ImportPreviewer = ReactMeteor.createClass({
  render() {
    var previewObjects = _.first(this.props.previewObjects, this.props.previewSize),
        schema = this.props.collection.simpleSchema().schema();

    return (
      <ReactBootstrap.Table className="table table-condensed">
        <thead>
          <tr>
            {_.map(schema, (fieldSchema, fieldName) => {
              return (
                <th key={fieldName}>
                  {fieldName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {_.map(previewObjects, (obj, i) => {
            return (
              <tr key={i}>
                {_.map(schema, (fieldSchema, fieldName) => {
                  return (
                    <td key={fieldName}>
                      {obj[fieldName]}
                    </td>
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

ImportPreviewer.defaultProps = {
  previewSize: 5
};

CollectionManager.ImportModal = ReactMeteor.createClass({
  mixins: [ReactLinkedStateMixin],

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

  getInitialState() {
    return this.initialState;
  },

  onHide() {
    this.replaceState(this.initialState);
    this.props.onHide.call();
  },

  onFileChosen(event) {
    var file = _.first(event.target.files);

    Papa.parse(file, _.extend(this.state.config, {
      complete: this.onFileParsed
    }));
  },

  onFileParsed(results, file) {
    var validObjects   = [],
        invalidObjects = [];

    _.each(results.data, (parsedObject, i) => {
      if (this.validationContext().validate(parsedObject)) {
        validObjects.push(parsedObject);
      } else {
        invalidObjects.push(parsedObject);
      }
    });

    this.setState({validObjects: validObjects, invalidObjects: invalidObjects});
  },

  validationContext() {
    return this.props.collection.simpleSchema().namedContext("importForm");
  },

  processImports() {
    var importableObjects = this.state.validObjects;

    _.each(importableObjects, (obj, i) => {
      this.props.collection.insert(obj, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          this.setState({
            percentImported: parseInt(((i + 1) / importableObjects.length) * 100)
          });
        }
      });
    });
    this.onHide();
  },

  render() {
    var importableObjects   = this.state.validObjects,
        unImportableObjects = this.state.invalidObjects;

    return (
      <ReactBootstrap.Modal show={this.props.show} onHide={this.onHide}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>
            Import {this.props.collection._name}
          </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>

        <ReactBootstrap.Modal.Body>
          <form>
            <ReactBootstrap.Input
              type="file"
              label="Choose an Import File"
              help={'The file should be a CSV containing the ' + this.props.collection._name + ' to import'}
              onChange={this.onFileChosen} />
          </form>
          <ReactBootstrap.Tabs defaultActiveKey={1}>
            <ReactBootstrap.Tab
              eventKey={1}
              tab={importableObjects.length + ' importable'}>
              <ImportPreviewer
                previewObjects={importableObjects}
                collection={this.props.collection}/>
            </ReactBootstrap.Tab>
            <ReactBootstrap.Tab
              eventKey={2}
              tab={unImportableObjects.length + ' un-importable'}>
              <ImportPreviewer
                previewObjects={unImportableObjects}
                collection={this.props.collection}/>
            </ReactBootstrap.Tab>
          </ReactBootstrap.Tabs>
          <ReactBootstrap.ProgressBar now={this.state.percentImported} />
        </ReactBootstrap.Modal.Body>

        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button onClick={this.onHide}>
            Close
          </ReactBootstrap.Button>
          <ReactBootstrap.Button
            onClick={this.processImports}
            bsStyle='primary'
            disabled={this.state.validObjects.length === 0 || this.state.processing}>
            Import {this.state.validObjects.length} {this.props.collection._name}
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
});
