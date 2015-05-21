'use strict';
// This file contains controllers of base pages attributes: header, footer, body, common menu and so on

(function() {
  angular.module('ncsaas')
    .controller('HeaderController', [
      '$rootScope', '$scope', '$state', 'currentStateService', 'customersService', 'usersService', 'ENV', HeaderController]);

  function HeaderController($rootScope, $scope, $state, currentStateService, customersService, usersService, ENV) {
    var vm = this;

    vm.customers = [];
    vm.currentUser = {};
    vm.currentCustomer = {};
    vm.menuToggle = menuToggle;
    vm.mobileMenu = mobileMenu;
    vm.setCurrentCustomer = setCurrentCustomer;

    // XXX: for top menu customers viewing
    customersService.pageSize = ENV.topMenuCustomersCount;
    customersService.getList().then(function(response) {
      vm.customers = response;
    });
    // reset pageSize
    customersService.pageSize = ENV.pageSize;

    // initiate current user
    usersService.getCurrentUser().then(function(response) {
      vm.currentUser = response;
    });

    // initiate current customer
    currentStateService.getCustomer().then(function(customer) {
      vm.currentCustomer = customer;
    });

    function setCurrentCustomer(customer) {
      currentStateService.setCustomer(customer);
      vm.currentCustomer = customer;
      $rootScope.$broadcast('currentCustomerUpdated');
    }

    // top-level menu
    vm.menuState = {
      addSomethingMenu : false,
      customerMenu : false,
      profileMenu : false
    };
    // top-level menu active state
    vm.menuItemActive = currentStateService.getActiveItem($state.current.name);

    function menuToggle(active, event) {
      for (var property in vm.menuState) {
        if (vm.menuState.hasOwnProperty(property)) {
          if (property !== active) {
            vm.menuState[property] = false;
          }
        }
      }
      event.stopPropagation();
      vm.menuState[active] = !vm.menuState[active];
    }

    function mobileMenu() {
      vm.showMobileMenu = !vm.showMobileMenu;
    }

    window.onclick = function() {
      for (var property in vm.menuState) {
        if (vm.menuState.hasOwnProperty(property)) {
          vm.menuState[property] = false;
        }
      }
      $scope.$apply();
    };

  }

  angular.module('ncsaas')
    .controller('MainController', [
      '$q', '$rootScope', '$state', 'authService', 'currentStateService', 'customersService', 'usersService',
      'baseControllerClass', MainController]);

  function MainController(
    $q, $rootScope, $state, authService, currentStateService, customersService, usersService, baseControllerClass) {
    var controllerScope = this;
    var Controller = baseControllerClass.extend({

      init: function() {
        this.setSignalHandler('$stateChangeSuccess', this.stateChangeSuccessHandler.bind(controllerScope));
        this._super();
        $rootScope.logout = this.logout;
      },
      logout: function() {
        authService.signout();
        currentStateService.isCustomerDefined = false;
        $state.go('home.login');
      },
      stateChangeSuccessHandler: function(event, toState) {
        $rootScope.bodyClass = currentStateService.getBodyClass(toState.name);
        // if user is authenticated - he should have selected customer
        if (authService.isAuthenticated() && !currentStateService.isCustomerDefined) {
          var deferred = $q.defer();
          usersService.getCurrentUser().then(function(user) {
            customersService.getPersonalOrFirstCustomer(user.username).then(function(customer) {
              deferred.resolve(customer);
            });
          });
          currentStateService.setCustomer(deferred.promise);
        }
        /*jshint camelcase: false */
        if (toState.auth) {
          usersService.getCurrentUser().then(function(response) {
            if (!response.full_name || !response.email) {
              $state.go('initialdata.view');
            }
          });
        }
      }
    });

    controllerScope.__proto__ = new Controller();
  }

})();

