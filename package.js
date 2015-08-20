Package.describe({
  name: 'tauruscolvin:collection-manager',
  version: '0.0.2',
  summary: 'A drop-in collection manager for your client.',
  git: 'git@github.com:colvint/collection-manager.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('tauruscolvin:meteor-react-bootstrap@0.0.1', 'client');
  api.use('fortawesome:fontawesome@4.3.0', 'client');

  api.addFiles([
    'client/collection-manager.jsx',
    'client/collection-manager.less'
  ], 'client');

  api.export('CollectionManagerMixin', 'client');
});
