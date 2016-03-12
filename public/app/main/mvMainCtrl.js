angular.module('app').controller('mvMainCtrl', function($scope, $timeout, mvQuote) {
  
  $scope.getOfThePage = function() {
      var quotesArr = $scope.quotes;
      return quotesArr[Math.floor(Math.random() * $scope.quotes.length)];
  };
  
    $scope.quotes = mvQuote.query(function() {
        $timeout(function() {
            $scope.quote = $scope.getOfThePage();
            $scope.$apply($scope.quote);
        }, 2000);
    });
  
})
.directive('pageQuote', function() {
    return {
        template: `<div>
                    <div class="quote">
                        <h3>"{{quote.quote}}"<h3>
                        <div class="quoteperson">
                            <h4> - {{quote.person}}</h4>
                        </div>
                        </div>
                   </div>`
    };
});