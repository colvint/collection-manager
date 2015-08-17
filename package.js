Package.describe({
  name: 'tauruscolvin:item-manager',
  version: '0.0.1',
  summary: 'A drop-in collection manager for your client.',
  git: 'git@github.com:colvint/item-manager.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('reactjs:react', 'client');
  api.use('firfi:meteor-react-bootstrap', 'client');

  api.export('ItemManagerMixin', 'client');

  api.addFiles('item-manager.jsx');
  api.addFiles('item-manager.less');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tauruscolvin:item-manager');
  api.addFiles('item-manager-tests.js');
});
