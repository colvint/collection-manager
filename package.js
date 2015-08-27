Package.describe({
  name: 'tauruscolvin:collection-manager',
  version: '0.0.16',
  summary: 'A drop-in collection manager for your client.',
  git: 'git@github.com:colvint/collection-manager.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('tauruscolvin:meteor-react-bootstrap@0.0.1', 'client');
  api.use('aldeed:simple-schema@1.3.3', 'client');
  api.use('tauruscolvin:papaparse@4.2.1', 'client');
  api.use('fortawesome:fontawesome@4.3.0', 'client');

  api.addFiles([
    'client/collection-manager.jsx',
    'client/shared/field.jsx',
    'client/list/cell.jsx',
    'client/list/selected-items-actions-menu.jsx',
    'client/list/info.jsx',
    'client/list/item-selector.jsx',
    'client/list/page-sizer.jsx',
    'client/list/paginator.jsx',
    'client/edit/modal.jsx',
    'client/import/modal.jsx'
  ], 'client');

  api.export('CollectionManager', 'client');
});
