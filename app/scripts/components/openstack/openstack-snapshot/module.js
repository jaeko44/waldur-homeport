import openstackSnapshotsService from './openstack-snapshots-service';

export default module => {
  module.service('openstackSnapshotsService', openstackSnapshotsService);
  module.config(actionConfig);
  module.config(stateConfig);
};

// @ngInject
function actionConfig(ActionConfigurationProvider, DEFAULT_EDIT_ACTION) {
  ActionConfigurationProvider.register('OpenStackTenant.Snapshot', {
    order: [
      'edit'
    ],
    options: {
      edit: angular.merge({}, DEFAULT_EDIT_ACTION, {
        successMessage: 'Snapshot has been updated'
      })
    }
  });
}

// @ngInject
function stateConfig(ResourceStateConfigurationProvider) {
  ResourceStateConfigurationProvider.register('OpenStackTenant.Snapshot', {
    error_states: [
      'error'
    ]
  });
}