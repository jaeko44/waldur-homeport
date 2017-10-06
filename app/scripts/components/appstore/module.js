import AppStoreUtilsService from './appstore-utils';
import { AppStoreHeaderController, appstoreHeader } from './appstore-header';
import appstoreSummary from './appstore-summary';
import appstoreStore from './appstore-store';
import appstoreRoutes from './routes';
import AppstoreFieldConfiguration from './field-configuration';
import AppstoreResourceLoader from './appstore-resource-loader';
import appstoreCompareList from './appstore-compare-list';
import dialogModule from './dialog/module';
import providersModule from './providers/module';

export default module => {
  module.service('AppStoreUtilsService', AppStoreUtilsService);
  module.controller('AppStoreHeaderController', AppStoreHeaderController);
  module.directive('appstoreHeader', appstoreHeader);
  module.component('appstoreCompareList', appstoreCompareList);
  module.directive('appstoreSummary', appstoreSummary);
  module.directive('appstoreStore', appstoreStore);
  module.config(appstoreRoutes);
  module.provider('AppstoreFieldConfiguration', AppstoreFieldConfiguration);
  module.service('AppstoreResourceLoader', AppstoreResourceLoader);
  dialogModule(module);
  providersModule(module);
};
