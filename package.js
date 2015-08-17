Package.describe({
  name: 'tauruscolvin:collection-manager',
  version: '0.0.1',
  summary: 'A drop-in collection manager for your client.',
  git: 'git@github.com:colvint/collection-manager.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('reactjs:react@0.2.4', 'client');
  api.use('firfi:meteor-react-bootstrap@0.0.5', 'client');
  api.use('maxharris9:classnames@0.0.1', 'client');
  api.use('fortawesome:fontawesome@4.3.0', 'client');

  api.imply('reactjs:react');
  api.imply('firfi:meteor-react-bootstrap');
  api.imply('maxharris9:classnames');
  api.imply('fortawesome:fontawesome');

  api.export('CollectionManagerMixin', 'client');

  api.addFiles('collection-manager.jsx');
  api.addFiles('collection-manager.less');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tauruscolvin:collection-manager');
  api.addFiles('collection-manager-tests.js');
});
