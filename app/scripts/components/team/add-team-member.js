import template from './add-team-member.html';
import './add-team-member.scss';

const addTeamMember = {
  template,
  bindings: {
    close: '&',
    resolve: '<'
  },
  controller: class AddTeamMemberDialogController {
    constructor(customerPermissionsService, projectPermissionsService, blockUI, $q, ENV, ErrorMessageFormatter, $filter) {
      // @ngInject
      this.$q = $q;
      this.customerPermissionsService = customerPermissionsService;
      this.projectPermissionsService = projectPermissionsService;
      this.blockUI = blockUI;
      this.ENV = ENV;
      this.ErrorMessageFormatter = ErrorMessageFormatter;
      this.$filter = $filter;
    }

    $onInit() {
      this.roles = this.ENV.roles;
      this.addText = gettext('Save');
      this.addTitle = gettext('Edit team member');
      this.helpText = gettext('You cannot change your own role.');
      this.userModel = {
        expiration_time: null
      };

      this.canChangeRole = this.resolve.currentUser.is_staff ||
        this.resolve.editUser.uuid !== this.resolve.currentUser.uuid;

      this.roleField = {
        name: 'role',
        disableInput: !this.canChangeRole,
        choices: [
          { value: 'admin', display_name: this.ENV.roles.admin },
          { value: 'manager', display_name: this.ENV.roles.manager },
        ]
      };
      this.expirationTimeField = {
        name: 'expiration_time',
        disableInput: !this.canChangeRole,
        options: {
          format: 'dd.MM.yyyy',
          altInputFormats: ['M!/d!/yyyy'],
          dateOptions: {
            minDate: moment().add(1, 'days').toDate(),
            startingDay: 1
          }
        }
      };

      this.formatData();
    }

    formatData() {
      this.projects = [];
      this.userModel.user = this.resolve.editUser;
      this.userModel.role = this.resolve.editUser.role;
      this.userModel.expiration_time = this.resolve.editUser.expiration_time ?
        new Date(this.resolve.editUser.expiration_time) :
        null;

      this.projects = angular.copy(this.resolve.currentCustomer.projects).map(project => {
        let displayProject = {
          role: null,
          permission: null,
          expiration_time: null,
          uuid: project.uuid,
          name: project.name,
          url: project.url
        };
        this.resolve.editUser.projects.some(permissionProject => {
          if (permissionProject.uuid === project.uuid) {
            displayProject.role = permissionProject.role;
            displayProject.permission = permissionProject.permission;
            displayProject.expiration_time = permissionProject.expiration_time ?
              new Date(permissionProject.expiration_time) :
              null;
          }
          return permissionProject.uuid === project.uuid;
        });
        return displayProject;
      });

      this.emptyProjectList = !this.projects.length;
    }

    saveUser() {
      this.errors = [];
      let block = this.blockUI.instances.get('add-team-member-dialog');
      block.start({delay: 0});
      return this.$q.all([
        this.saveCustomerPermission(),
        this.saveProjectPermissions()
      ]).then(() => {
        block.stop();
        this.close();
      }, error => {
        block.stop();
        this.errors = this.ErrorMessageFormatter.formatErrorFields(error);
      });
    }

    saveCustomerPermission() {
      let model = {};
      model.url = this.resolve.editUser.permission;
      model.expiration_time = this.userModel.expiration_time;

      if (this.userModel.role !== this.resolve.editUser.role && !this.userModel.role) {
        return this.customerPermissionsService.deletePermission(this.resolve.editUser.permission);
      } else if (!this.resolve.editUser.role && this.userModel.role) {
        return this.createCustomerPermission();
      } else if (this.userModel.expiration_time !== this.resolve.editUser.expiration_time) {
        return this.customerPermissionsService.update(model);
      }
    }

    createCustomerPermission() {
      let instance = this.customerPermissionsService.$create();
      instance.user = this.resolve.editUser.url;
      instance.role = this.userModel.role;
      instance.customer = this.resolve.currentCustomer.url;
      instance.expiration_time = this.userModel.expiration_time;
      return instance.$save();
    }

    saveProjectPermissions() {
      let updatePermissions = [],
        createdPermissions = [],
        permissionsToDelete = [];

      this.projects.forEach(project => {
        let exists = false,
          update = false;
        this.resolve.editUser.projects.forEach(existingPermission => {
          if (project.permission === existingPermission.permission) {
            exists = true;
            if (project.role === existingPermission.role &&
              project.expiration_time !== existingPermission.expiration_time) {
              update = true;
            } else if ((!project.role && existingPermission.role) ||
              (project.role && existingPermission.role && project.role !== existingPermission.role)) {
              permissionsToDelete.push(existingPermission.permission);
            }
            if (project.role && project.role !== existingPermission.role) {
              createdPermissions.push(project);
            }
          }
        });

        if (update) {
          updatePermissions.push(project);
        } else if (project.role && !exists) {
          createdPermissions.push(project);
        }
      });

      let removalPromises = permissionsToDelete.map(permission => {
        return this.projectPermissionsService.deletePermission(permission);
      });

      let renewalPromises = updatePermissions.map(permission => {
        let model = {};
        model.role = permission.role;
        model.expiration_time = permission.expiration_time;
        model.url = permission.permission;
        return this.projectPermissionsService.update(model);
      });

      return this.$q.all(removalPromises).then(() => {
        let creationPromises = createdPermissions.map(permission => {
          let instance = this.projectPermissionsService.$create();
          instance.user = this.resolve.editUser.url;
          instance.role = permission.role;
          instance.project = permission.url;
          instance.expiration_time = permission.expiration_time;
          return instance.$save();
        });
        return this.$q.all(renewalPromises.concat(creationPromises));
      });
    }
  }
};

export default addTeamMember;
