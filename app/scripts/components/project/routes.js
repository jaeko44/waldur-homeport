// @ngInject
export default function projectRoutes($stateProvider) {
  $stateProvider
    .state('project', {
      url: '/projects/:uuid/',
      abstract: true,
      templateUrl: 'views/project/base.html',
      data: {
        auth: true,
        workspace: 'project'
      },
      resolve: {
        currentProject: function(CustomerUtilsService, $stateParams) {
          return CustomerUtilsService.getCurrentProject($stateParams.uuid);
        }
      }
    })

    .state('project-create', {
      url: '/projects/add/',
      template: '<project-create></project-create>',
      data: {
        pageTitle: 'Create project',
        workspace: 'organization',
        auth: true
      },
    })

    .state('project.details', {
      url: '',
      templateUrl: 'views/dashboard/project.html',
      controller: 'ProjectDashboardController',
      controllerAs: 'DashboardCtrl',
      bindToController: true,
      data: {
        pageTitle: 'Project dashboard',
        pageClass: 'gray-bg'
      }
    })

    .state('project.issues', {
      url: 'issues/',
      template: '<project-issues></project-issues>',
      data: {
        pageTitle: 'Issues',
        pageClass: 'gray-bg'
      }
    })

    .state('project.events', {
      url: 'events/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectEventTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Audit logs'
      }
    })

    .state('project.alerts', {
      url: 'alerts/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectAlertTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Alerts'
      }
    })

    .state('project.resources', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })

    .state('project.resources.vms', {
      url: 'virtual-machines/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectVirtualMachinesListController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Virtual machines'
      }
    })

    .state('project.resources.apps', {
      url: 'applications/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectApplicationsTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Applications'
      }
    })

    .state('project.resources.clouds', {
      url: 'private-clouds/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectPrivateCloudsTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Private clouds'
      }
    })

    .state('project.resources.storage', {
      url: 'storage/',
      templateUrl: 'views/project/storage.html',
      controller: 'StorageTabController',
      data: {
        pageTitle: 'Storage'
      },
      abstract: true
    })

    .state('project.resources.storage.tabs', {
      url: '',
      views: {
        volumes: {
          controller: 'VolumesListController as ListController',
          templateUrl: 'views/partials/filtered-list.html',
        },
        snapshots: {
          controller: 'SnapshotsListController as ListController',
          templateUrl: 'views/partials/filtered-list.html',
        }
      }
    })

    .state('project.delete', {
      url: 'delete/',
      template: '<project-manage></project-manage>',
      data: {
        pageTitle: 'Manage'
      }
    })

    .state('project.team', {
      url: 'team/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectUsersListController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Team'
      }
    })

    .state('import', {
      url: '/import/',
      templateUrl: 'views/project/base.html',
      abstract: true,
      data: {
        auth: true,
        workspace: 'project',
        pageTitle: 'Import resources from provider'
      }
    })

    .state('import.import', {
      url: '?service_type&service_uuid',
      templateUrl: 'views/import/import.html',
    });
};