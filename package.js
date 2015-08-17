Package.describe({
  name: 'tauruscolvin:collection-manager',
  version: '0.0.1',
  summary: 'A drop-in collection manager for your client.',
  git: 'git@github.com:colvint/collection-manager.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('reactjs:react', 'client');
  api.use('firfi:meteor-react-bootstrap', 'client');

  api.export('CollectionManagerMixin', 'client');

  api.addFiles('collection-manager.jsx');
  api.addFiles('collection-manager.less');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tauruscolvin:collection-manager');
  api.addFiles('collection-manager-tests.js');
});
