'use strict';


var goldenApp = angular.module('userModule', []);

// Example layout config
var layoutConfig = [
    {r: 1, c: 1, width: '0.25', widgetId: 'w1', directive: 'directiveOne'},
    {r: 1, c: 2, width: '0.25', widgetId: 'w2', directive: 'directiveTwo'},
    {r: 1, c: 3, width: '0.25', widgetId: 'w3', directive: 'directiveThree'},
    {r: 2, c: 1, width: '0.25', widgetId: 'w4', directive: 'directiveFour'},
    {r: 2, c: 2, width: '0.25', widgetId: 'w5', directive: 'directiveFive'}
];


// Define Angular Controllers for widgets containers
_.forEach(layoutConfig, function (layoutItem) {
    goldenApp.controller(layoutItem.widgetId + 'Container' + 'Controller', function ($scope) {
        $scope.name = 'John Dee';
        $scope.age = 38;
        $scope.city = 'Seattle';
    });
});

// Create example directives for each widget normally these would be loaded as part of the application.  Using a forloop
// here to easily create > 1.
_.forEach(layoutConfig, function (layoutItem) {
    goldenApp.directive(layoutItem.directive, function () {
        return {
            template: '<div><h2>Directive ' + layoutItem.directive + '</h2></div>'
        };
    });
});

// Now create the templates that Golden Layout uses specifying the templates and directive.
_.forEach(layoutConfig, function (layoutItem) {
    var directiveEl = layoutItem.directive.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var templateStr = '';
    templateStr += '<template type="text/html" id="' + layoutItem.widgetId + 'Template">' ;
    templateStr += '<b>header: </b>';
    templateStr += '<a ng-click="closeWidget(this)">close</a>';
    templateStr += '<a ng-click="maximizeWidget(this)">maximize</a>';
    templateStr += '<' + directiveEl + '></' + directiveEl + '>';
    templateStr += '</template>';
    var newTemplate = $(templateStr);
    $('head').append(newTemplate);
});

// Generate GoldenLayout Config.
var goldenLayoutConfig = {
    settings: {
        hasHeaders: false
    },
    content: [{
        type: 'row',
        content: []
    }]
};

// Loop through cols and rows to see if a widget is configured.
for (var col = 1; col < 4; col++) {
    var goldenColumn = {
        type: 'column',
        content: []
    };
    for (var row = 1; row < 4; row++) {
        var widget = _.find(layoutConfig, function(config) {
            return (config.r === row && config.c === col);
        });
        if (widget) {
            goldenColumn.content.push({
                type: 'component',
                componentName: 'template',
                componentState: {templateId:  widget.widgetId + 'Template'}
            })
        } else {
            goldenColumn.content.push({
                type: 'component',
                componentName: 'template',
                componentState: {templateId:  'empty'}
            })
        }
    }
    goldenLayoutConfig.content[0].content.push(goldenColumn);
}

var myLayout = new GoldenLayout(goldenLayoutConfig);

myLayout.registerComponent('template', function (container, state) {
    var templateHtml = $('#' + state.templateId).html();
    container.getElement().html(templateHtml);
});

myLayout.on('initialised', function () {
    angular.bootstrap(document.body, ['userModule']);
});

myLayout.init();

// Interesting things left to do:
// 1. Save config to cookie store
// 2. Check config from the cookie store before loading (normally this would be server persisted).
// 3. Implement maximize and close code.
// 4. Add some more interesting data into the widgets.