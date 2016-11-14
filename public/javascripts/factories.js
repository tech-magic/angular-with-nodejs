techMagicApp.factory('ControlTowerUtils', function() {
    var isInteger = function(value) {
      return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
    };

    return {
      isInteger: isInteger
    }
});
