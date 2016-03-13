angular.module('app').controller('mvResultCtrl', function($scope, $location, mvVote) {
    
    $scope.results = [];
    
    $scope.prerender = mvVote.query(function() {
        for(i = 0; i < $scope.prerender.length; i++) {
            var tuple = $scope.prerender[i];
            
            var r = null;
            for(x = 0; x < $scope.results.length; x++) {
                if($scope.results[x].project == tuple.project) {
                    r = $scope.results[x];
                }
            }
            
            if(r === null) {
                r = {
                    project: tuple.project,
                    concept: 0,
                    implementation: 0,
                    presentation: 0,
                    total: 0,
                    count: 0
                }
                $scope.results.push(r);
            }
            
            r.concept = (r.concept + Number(tuple.concept));
            r.implementation = (r.implementation + Number(tuple.implementation))
            r.presentation = (r.presentation + Number(tuple.presentation))
            r.count++;
        }
        
        for(i = 0; i < $scope.results.length; i++) {
            var r = $scope.results[i];
            r.total = (r.concept, r.implementation, r.presentation) / r.count
            r.concept /= r.count;
            r.implementation /= r.count;
            r.presentation /= r.count;
        }
        
    });
});