angular.module('app').controller('mvMainCtrl', function($scope) {
  $scope.quotes = [
    {quote: 'Me fail english? Thats unpossible', person: 'Ralph Wiggum'},
    {quote: 'Robots dont say ye', person: 'Hermes Conrad'},
    {quote: 'Two oil changes for the price of one! Now if I could afford the one, and the car.', person: 'Dr John Zoidberg'},
    {quote: 'You there! Cut my milk.', person: 'Stewie Griffin'},
    {quote: 'You tried your best and you failed miserably. The lesson is: Never try', person: 'Homer Simpson'},
    {quote: 'If we can hit that bullseye the rest of the dominoes will fall like a house of cards. checkmate', person: 'Zapp Brannigan'},
    {quote: 'I hate Mondays', person: 'Garfield'}
  ]
  
  $scope.getOfThePage = function() {
      var quotesArr = $scope.quotes;
      return quotesArr[Math.floor(Math.random() * Object.keys($scope.quotes).length)];
  };
  
  $scope.quote = $scope.getOfThePage();
  
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