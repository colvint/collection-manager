Package.describe({
  name: 'tauruscolvin:collection-manager',
  version: '0.1.5',
  summary: 'A drop-in collection manager for your client.',
  git: 'git@github.com:colvint/collection-manager.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use('ecmascript');

  api.use('aldeed:collection2@2.5.0');
  api.use('check@1.0.5');
  api.use('tauruscolvin:relations@0.0.1');
  api.imply('tauruscolvin:relations');
  api.use('tauruscolvin:meteor-react-bootstrap@0.0.2');
  api.use('twbs:bootstrap@3.3.5');
  api.use('fortawesome:fontawesome@4.4.0');
  api.use('tauruscolvin:papaparse@4.2.1', 'client');

  api.addFiles([
    'lib/simple-schema-extension.js'
  ]);

  api.addFiles([
    'client/collection-manager.jsx',
    'client/shared/actionable-mixin.js',
    'client/shared/field.jsx',
    'client/list/cell.jsx',
    'client/list/selected-items-actions-menu.jsx',
    'client/list/item-actions.jsx',
    'client/list/collection-actions.jsx',
    'client/list/info.jsx',
    'client/list/item-selector.jsx',
    'client/list/paginator.jsx',
    'client/edit/modal.jsx',
    'client/edit/item-editor.jsx',
    'client/import/modal.jsx'
  ], 'client');

  api.export('CollectionManager', 'client');
});
