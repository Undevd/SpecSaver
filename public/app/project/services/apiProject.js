angular.module('app').factory('apiProject', function($resource, identitySvc) {
    var projectResource = $resource('/api/projects/:projectCode', {projectCode: "@projectCode"}, {
        getAll: {method: 'GET', isArray: true, cancellable: true, url: '/api/projects/all'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/projects/one/:projectCode'},
        update: {method: 'PUT', isArray: false}
    });
    
    projectResource.prototype.isAdmin = function() {
        if (identitySvc.currentUser !== undefined) {
            return this.admins && this.admins.indexOf(identitySvc.currentUser.username) > -1;
        } else {
            return false;
        }
    }
    
    projectResource.prototype.isMember = function() {
        if (identitySvc.currentUser !== undefined) {
            return this.members && this.members.indexOf(identitySvc.currentUser.username) > -1;
        } else {
            return false;
        }
    }
    
    return projectResource;
});