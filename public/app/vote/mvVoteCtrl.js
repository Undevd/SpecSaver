angular.module('app').controller('mvVoteCtrl', function($scope, $location, dbOps) {
    
    $scope.voter = "";
    $scope.scores = [],[];
    
    $scope.things = [
        {
            name: "Test some of the things",
            members: [
                {name: "Scott Hulme"},
                {name: "Simon Wallace"},
                {name: "Laura Soutar"}
        ]},
        {
            name: "Heat some of the house",
            members: [
                {name: "Colin Campbell"},
                {name: "Kenny Voughan"},
                {name: "Mellissa White"}
        ]},
        {
            name: "Gamify some of the things",
            members: [
                {name: "Roger Tinsley"}
        ]},
        {
            name: "Others",
            members: [
                {name: "Rachael Tuiam"},
                {name: "Alistair Massey"}
        ]}
    ]
    
    $scope.isListed = function(value) {
        for(i = 0; i < $scope.things.length; i++) {
            var project = $scope.things[i];
            for(x = 0; x < project.members.length; x++) {
                if(value == project.members[x].name) {
                    return true;
                }
            }
        }
        return false;
    }
    
    $scope.isMemberOf = function(name, projName) {
        for(i = 0; i < $scope.things.length; i++) {
            var project = $scope.things[i];
            if(project.name == projName) {
                var members = project.members;
                for(x = 0; x < members.length; x++) {
                    if(name == members[x].name) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    $scope.vote = function() {
        for(score in $scope.scores) {       
            var newVote = {
                voter: $scope.voter,
                project: score,
                concept: $scope.scores[score]['concept'],
                implementation: $scope.scores[score]['implementation'],
                presentation: $scope.scores[score]['presentation'],
            };
            
            dbOps.createVote(newVote).then(function() {
                $location.path('/');
            }, function(reason) {
                console.log("failed to add vote");
            });
        }
    }
});