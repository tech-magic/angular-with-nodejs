var direction = {};
direction.UP = {
    cssCls: 'nr-positive',
    svg: 'public/svg/trend-up.svg'
};
direction.DOWN = {
    cssCls: 'nr-negative',
    svg: 'public/svg/trend-down.svg'
};
direction.FLAT = {
    cssCls: 'nr-flat',
    svg: 'public/svg/trend-flat.svg'
};

var ERROR = {};
ERROR.NODATA = "No data found!";

var getDirection = function(trendValue) {
    if (trendValue < 0) {
        return direction.DOWN;
    } else if (trendValue > 0) {
        return direction.UP;
    } else if (trendValue == 0) {
        return direction.FLAT;
    } else {
        return direction.FLAT;
    }
};
