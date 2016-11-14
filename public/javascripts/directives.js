'use strict';

techMagicApp
    .directive('magicNumberKpi', function() {
        return {
            scope: {
                enabled: '=',
                isNotFlippable: '@isNotFlippable',
                kpiInfo: '=kpiInfo'
            },
            restrict: 'EA',
            templateUrl: '/public/html/templates/magic.number.kpi.html',
            link: function(scope, element, attribute) {
                scope.enabled = attribute.enabled;
                scope.isNotFlippable = attribute.isNotFlippable;
                
                if(!scope.isNotFlippable) {
                    scope.flipClasses = 'flip flippable';
                } else {
                    scope.flipClasses = 'flip';
                }

                if(scope.kpiInfo) {
                    if(!scope.kpiInfo.kpiSettings) {
                        scope.kpiInfo.kpiSettings = {};
                        scope.kpiInfo.kpiSettings.title = 'Title Not Provided';
                        scope.kpiInfo.kpiSettings.helpText = 'Help Not Provided';
                    }
                    if(!scope.kpiInfo.kpiSettings.filter) {
                        scope.kpiInfo.kpiSettings.filter = 'cconumber';
                    }
                } 
            }
        }
    });

$(function() {
    $(document).on("click", ".flippable a", function() {
        if (!e.stopPropagation) {
            e.cancelBubble = true;
            return;
        }
        e.stopPropagation();
    });

    $(document).on("click", ".flippable", function() {
        $(this).toggleClass("flipped");
        return false;
    });

    $(document).on({
        'mouseenter': function (e) {
            $(this).tooltip('show');
        },
        'mouseeleave': function (e) {
            $(this).tooltip('hide');
        }
    }, '*[rel=tooltip]');
});


