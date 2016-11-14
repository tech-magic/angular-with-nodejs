techMagicApp.filter('formatter', ['$filter', function($filter) {
  return function(value, filterName) {
    if(value === parseInt(value, 10)) {
      return $filter(filterName)(value);
    } else {
      if(filterName) {
        return $filter(filterName)(value, 2);
      } else {
        return "";
      }
    }
  };
}]);

techMagicApp.filter('cconumber', ['$filter', 'ControlTowerUtils', function ($filter, ControlTowerUtils) {
  return function (input, decimals) {
    if(ControlTowerUtils.isInteger(input)) {
      return $filter('number')(input);
    } else {
      return $filter('number')((Math.round(input * 100) / 100));
    }
  };
}]);
