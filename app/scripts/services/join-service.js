'use strict';


(function () {
  angular.module('ncsaas')
    .service('joinService', [
      '$q',
      '$http',
      'baseServiceClass',
      'cloudsService',
      'digitalOceanService',
      joinService
    ]);

  function joinService(
    $q,
    $http,
    baseServiceClass,
    cloudsService,
    digitalOceanService
  ) {
    var ServiceClass = baseServiceClass.extend({
      providers: [cloudsService, digitalOceanService],

      getList: function(filter) {
        var self = this;
        var promises = [];
        for (var i = 0; i < this.providers.length; i++) {
          var promise = this.providers[i].getList(filter);
          promises.push(promise);
        };
        var deferred = $q.defer();
        $q.all(promises).then(function(responses) {
          var services = self.flattenList(responses);
          for (var i = 0; i < services.length; i++) {
            self.setDescription(services[i]);
          }
          deferred.resolve(services);
        });
        return deferred.promise;
      },

      $get: function(provider, uuid) {
        var self = this;
        if (provider == 'DigitalOcean') {
          return digitalOceanService.$get(uuid).then(function(response){
            self.setDescription(response);
            return response;
          })
        } else if (provider == 'IaaS') {
          return cloudsService.$get(uuid).then(function(response){
            self.setDescription(response);
            return response;
          })
        }
      },

      createService: function(url, options) {
        return $http.post(url, options);
      },

      flattenList: function(items) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
          for (var j = 0; j < items[i].length; j++) {
            result.push(items[i][j]);
          }
        }
        return result;
      },

      setDescription: function(service) {
        if (service.url.indexOf('digitalocean') > -1) {
          service.provider = 'DigitalOcean';
          service.icon = '/static/images/icons/icon_digitalocean_small.png';
          service.resource_type = 'DigitalOcean.Droplet';
        } else if (service.url.indexOf('cloud') > -1) {
          service.provider = 'IaaS';
          service.icon = '/static/images/icons/icon_openstack_small.png';
          service.resource_type = 'IaaS.Instance';
        }
      }
    });
    return new ServiceClass();
  }
})();
