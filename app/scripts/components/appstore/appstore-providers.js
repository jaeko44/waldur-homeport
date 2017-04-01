import template from './appstore-providers.html';

const appstoreProviders = {
  template: template,
  bindings: {
    services: '<',
    onSelect: '&',
    loading: '<',
  },
  controller: class AppstoreProvidersController {
    constructor($state, $stateParams, $uibModal, AppStoreUtilsService, coreUtils, currentStateService) {
      // @ngInject
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$uibModal = $uibModal;
      this.AppStoreUtilsService = AppStoreUtilsService;
      this.coreUtils = coreUtils;
      this.currentStateService = currentStateService;
    }

    $onInit() {
      this.initNoProvidersMessage();
      this.initProvidersManagementMessage();
    }

    initNoProvidersMessage() {
      let category = this.$state.current.data.category || this.$stateParams.category;
      if (category) {
        category = this.AppStoreUtilsService.findOffering(category);
        this.noProvidersMessage = this.coreUtils.templateFormatter(
          gettext('There are no working {categoryLabel} providers available for the current project.'),
          { categoryLabel: category.label.toLowerCase() });
      }
    }

    initProvidersManagementMessage() {
      this.currentStateService.getCustomer().then(customer => {
        const link = this.$state.href('organization.providers', { uuid: customer.uuid });
        this.providerManagementMessage = this.coreUtils.templateFormatter(
          gettext('You can change that in <a href="{link}">provider management</a>.'), { link });
      });
    }

    showDetails(service) {
      this.$uibModal.open({
        component: 'providerDialog',
        size: 'lg',
        resolve: {
          provider_uuid: () => service.uuid,
          provider_type: () => service.type,
        }
      });
    }
  }
};

export default appstoreProviders;
