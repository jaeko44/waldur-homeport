import issuesService from './issues-service';
import IssueNavigationService from './issue-navigation-service';
import { attachStateUtils } from './issue-navigation-service';
import issueDetail from './issue-detail';
import issueRoutes from './routes';
import issuesWorkspace from './issues-workspace';
import { issuesDashboard } from './issues-dashboard';
import issuesActivityStream from './issues-activity-stream';
import issuesHelpdesk from './issues-helpdesk';
import issueCommentsModule from './comments/module';
import issueCreateModule from './create/module';
import issueListModule from './list/module';
import issueTypesModule from './types/module';
import requestServiceButton from './request-service-button';
import registerExtensionPoint from './extend-appstore-selector';

export default module => {
  module.service('issuesService', issuesService);
  module.service('IssueNavigationService', IssueNavigationService);
  module.run(attachStateUtils);
  module.component('issueDetail', issueDetail);
  module.component('issuesWorkspace', issuesWorkspace);
  module.component('issuesDashboard', issuesDashboard);
  module.directive('issuesActivityStream', issuesActivityStream);
  module.directive('issuesHelpdesk', issuesHelpdesk);
  module.component('requestServiceButton', requestServiceButton);
  module.config(issueRoutes);
  module.run(registerExtensionPoint);
  issueTypesModule(module);
  issueCommentsModule(module);
  issueCreateModule(module);
  issueListModule(module);
};
