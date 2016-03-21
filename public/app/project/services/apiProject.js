angular.module('app').factory('apiProject', function($resource, mvIdentity) {
    var projectResource = $resource('/api/projects/:projectId', {projectId: "@projectId"}, {
        query: {method: 'GET', isArray: true, cancellable: true},
        queryOne: {method: 'GET', isArray: false, cancellable: true},
        update: {method: 'PUT', isArray: false}
    });
    
    projectResource.prototype.isAdmin = function() {
        if (mvIdentity.currentUser !== undefined) {
            return this.admins && this.admins.indexOf(mvIdentity.currentUser.username) > -1;
        } else {
            return false;
        }
    }
    
    projectResource.prototype.isMember = function() {
        if (mvIdentity.currentUser !== undefined) {
            return this.members && this.members.indexOf(mvIdentity.currentUser.username) > -1;
        } else {
            return false;
        }
    }
    
    return projectResource;
});