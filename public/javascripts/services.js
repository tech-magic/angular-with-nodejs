techMagicApp.service('FilterBindingService', ['$rootScope', function($rootScope) {
  var data = {};
  var viewData = {};
  var durationRanges = {};


  function formatDateToString(date){
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
    return (yyyy + "" + MM + "" + dd);
  }

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  //Defaults
  data.loc = '';
  data.os = '';
  data.deviceModel = '';
  data.deviceManufacturer= '';
  data.duration = 'week';
  data.state;
  data.fromdate = formatDateToString(firstDay);
  data.todate = formatDateToString(lastDay);
  data.ajax_ieCacheFix = new Date().getTime();

  durationRanges.ranges = {
    'Today': [moment(), moment()],
    'Last day': [moment().subtract('days', 1), moment().subtract('days', 1)],
    'This week': [moment().startOf('week'), moment().endOf('week')],
    'This month': [moment().startOf('month'), moment().endOf('month')],
    'This year': [moment().startOf('year'), moment().endOf('year')]
  };

  durationRanges.rangesId = {
    'today': [moment(), moment()],
    'day': [moment().subtract('days', 1), moment().subtract('days', 1)],
    'week': [moment().startOf('week'), moment().endOf('week')],
    'month2': [moment().startOf('month'), moment().endOf('month')],
    'year': [moment().startOf('year'), moment().endOf('year')]
  };

  durationRanges.durations = [ {durationText: 'Last day', durationId: 'day'},
    {durationText: 'This week', durationId: 'week'},
    {durationText: 'This month', durationId: 'month2'},
    {durationText: 'This year', durationId: 'year'} ];

  //getters & setters for view data
  var getViewOs = function() {
    if (viewData.os) {
      return viewData.os;
    }
    else {
      return 'Operating System';
    }
  }

  var setViewOs = function(os) {
    if (os) {
      viewData.os = os;
    }
  }

  var getViewLocation = function() {
    return viewData.location || 'Location';
  }

  var setViewLocation = function(locationObj) {
    if (locationObj) {
      viewData.location = locationObj.location;
    }
  }

  var getViewDevice = function() {
    return viewData.device || 'Device';
  }

  var setViewDevice = function(deviceCode) {
    if (deviceCode) {
      viewData.device = deviceCode;
    }
  }

  var setViewDuration = function(duration, ranges) {
    if (duration) {
      viewData.duration = duration;
    }
  }

  var getViewDuration = function() {
    return viewData.duration || 'This week';
  }

  var setViewDurationRange = function(durationRange) {
    if (durationRange) {
      viewData.durationRange = durationRange;
    }
  }

  var getViewDurationRange = function() {
    return viewData.durationRange || moment(this.durationRanges.rangesId['week'][0]).format('YYYY-MM-DD') + '-' +
        moment(this.durationRanges.rangesId['week'][1]).format('YYYY-MM-DD');
  }

  //end of getters and setters for view data

  var update = function(code, filter) {
    broadcast(data);
  };

  var broadcast = function(data) {
    data.ajax_ieCacheFix = new Date().getTime();
    $rootScope.$broadcast('state-update', data);
  };

  var reset = function() {
    this.setViewLocation('Location');
    this.setViewDevice('Device');
    this.setViewDuration('This week');
    this.setViewOs('Operating system');
    this.setViewDurationRange(moment(this.durationRanges.rangesId['week'][0]).format('YYYY-MM-DD') + '-' +
        moment(this.durationRanges.rangesId['week'][1]).format('YYYY-MM-DD'));
  }

  return {
    data: data,
    viewData: viewData,
    durationRanges: durationRanges,
    getViewOs: getViewOs,
    setViewOs: setViewOs,
    getViewLocation: getViewLocation,
    setViewLocation: setViewLocation,
    getViewDevice: getViewDevice,
    setViewDevice: setViewDevice,
    setViewDuration: setViewDuration,
    getViewDuration: getViewDuration,
    setViewDurationRange: setViewDurationRange,
    getViewDurationRange: getViewDurationRange,
    update: update,
    reset: reset
  };

}]);

techMagicApp.service('DataManipulationService', function() {
    var validateNumberForSanity = function(value) {
        if (value === undefined || value === null || isNaN(value) || value === 'null' || value === 'Null') {
            return (0).toFixed(1);
        } else {
            return value;
        }
    };

    var getWrappedNumberKPIInfo = function(value, filterBindingService, title, helpText, translate, isEffortScoreKPI) {
      var currKPIInfo = {};
      currKPIInfo.kpiData = value; 
      currKPIInfo.kpiData.loaded = true;
      currKPIInfo.kpiData.error = false;
      
      currKPIInfo.kpiData.history = readHistory(currKPIInfo.kpiData);               
      
      currKPIInfo.kpiData.primary = {};
      resolveAndPopulateKPIBasedonDuration(
        currKPIInfo.kpiData.primary, 
        currKPIInfo.kpiData.history, 
        filterBindingService,
        isEffortScoreKPI);

      currKPIInfo.kpiSettings = {};
      currKPIInfo.kpiSettings.filter = 'cconumber';
      currKPIInfo.kpiSettings.title = title;

      translate(helpText).then(function(translation) {
        currKPIInfo.kpiSettings.helpText = translation;
      });

      return currKPIInfo;
    };    

  var readHistory = function(evalData) {
    
    var history = {};
    var direction = {};
    history.days = evalData.thisdaycount || 0;
    history.weeks = evalData.thisweekcount || 0;
    history.months = evalData.thismonthcount || 0;
    history.years = evalData.thisyearcount || 0;
    
    history.trendDays = evalData.day_pct || "0";
    direction = getDirection(history.trendDays);
    history.trendDays = parseFloat(history.trendDays);
    history.trendDays = Math.abs(validateNumberForSanity(history.trendDays)).toFixed(1);
    history.trendDaysDirectionCssCls = direction.cssCls;
    history.trendDaysDirectionSvg = direction.svg;
    
    history.trendWeeks = evalData.week_pct || "0";
    direction = getDirection(history.trendWeeks);
    history.trendWeeks = parseFloat(history.trendWeeks);
    history.trendWeeks = Math.abs(validateNumberForSanity(history.trendWeeks)).toFixed(1);
    history.trendWeeksDirectionCssCls = direction.cssCls;
    history.trendWeeksDirectionSvg = direction.svg;
    
    history.trendMonths = evalData.month_pct || "0";
    direction = getDirection(history.trendMonths);
    history.trendMonths = parseFloat(history.trendMonths);
    history.trendMonths = Math.abs(validateNumberForSanity(history.trendMonths)).toFixed(1);
    history.trendMonthsDirectionCssCls = direction.cssCls;
    history.trendMonthsDirectionSvg = direction.svg;
    
    history.trendYears = evalData.year_pct || "0";
    direction = getDirection(history.trendYears);
    history.trendYears = parseFloat(history.trendYears);
    history.trendYearsDirection = getDirection(parseFloat(history.trendYears));
    history.trendYears = Math.abs(validateNumberForSanity(history.trendYears)).toFixed(1);
    history.trendYearsDirectionCssCls = direction.cssCls;
    history.trendYearsDirectionSvg = direction.svg;
    
    return history;
  
  };

    var resolveAndPopulateKPIBasedonDuration = function(mainObj, history, filterBindingService) {

        var effortScore = 0;

        history.duration = filterBindingService.data.duration;
        history.underlineDay = false;
        history.underlineWeek = false;
        history.underlineMonth = false;
        history.underlineYear = false;

        switch (filterBindingService.data.duration) {
            case "day":
                {
                    mainObj.count = history.days !== 'null' ? history.days : 0;
                    effortScore = history.days;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendDays) + '%';
                    mainObj.trendDirectionCssCls = history.trendDaysDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendDaysDirectionSvg;
                    history.underlineDay = true;
                    break;
                }
            case "week":
                {
                    mainObj.count = history.weeks !== 'null' ? history.weeks : 0;
                    effortScore = history.weeks;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendWeeks) + '%';
                    mainObj.trendDirectionCssCls = history.trendWeeksDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendWeeksDirectionSvg;
                    history.underlineWeek = true;
                    break;
                }
            case "month2":
                {
                    mainObj.count = history.months !== 'null' ? history.months : 0;
                    effortScore = history.months;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendMonths) + '%';
                    mainObj.trendDirectionCssCls = history.trendMonthsDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendMonthsDirectionSvg;
                    history.underlineMonth = true;
                    break;
                }
            case "year":
                {
                    mainObj.count = history.years !== 'null' ? history.years : 0;
                    effortScore = history.years;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendYears) + '%';
                    mainObj.trendDirectionCssCls = history.trendYearsDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendYearsDirectionSvg;
                    history.underlineYear = true;
                    break;
                }
        }
    };

    return {
        validateNumberForSanity: validateNumberForSanity,
        readHistory: readHistory,
        resolveAndPopulateKPIBasedonDuration: resolveAndPopulateKPIBasedonDuration,
        getWrappedNumberKPIInfo: getWrappedNumberKPIInfo
    }
});


