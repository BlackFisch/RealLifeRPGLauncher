const {ipcRenderer} = require('electron');

var App = angular.module('App', []);

App.controller('navbarController', ['$scope', function ($scope) {
    $scope.slide = 0;

    $scope.tabs = [
        {
            icon: 'glyphicon glyphicon-home', target: 'home', slide: 0
        }, {
            icon: 'glyphicon glyphicon-tasks', target: 'servers', slide: 1
        }];

    $scope.switchSlide = function (tab) {
        $scope.slide = tab.slide;
    };

    $scope.$watch(
        "slide", function () {
            $("#carousel-main").carousel($scope.slide);
        }, true);

    $scope.refresh = function () {
        getMods();
        getServers();
    };
}]);

App.controller('modController', ['$scope', function ($scope) {
    ipcRenderer.on('to-app', (event, args) => {
        switch (args.type) {
        case "mod-callback":
            $scope.mods = args.data.data;
            $scope.loading = false;
            $scope.$apply();
            break;
    }
});

    $scope.downloading = false;

    $scope.progress = 0;
    $scope.fileProgress = 0;
    $scope.fileName = 0;

    $scope.chart = null;

    $scope.init = function () {
        $scope.loading = true;
        getMods();
    };

    $scope.initDownload = function (mod) {
        var args = {
            type: "start-mod-dwn",
            mod: mod,
            target : "E:\\Steam\\steamapps\\common\\Arma 3\\"
        };
        ipcRenderer.send('to-dwn', args);
    };

    $scope.initGraph = function () {
        $scope.chart = new SmoothieChart({
            millisPerPixel: 27,
            grid: {fillStyle: '#ffffff', strokeStyle: 'transparent', borderVisible: false},
            labels: {fillStyle: '#000000', disabled: true}
        }),
            canvas = document.getElementById('smoothie-chart');

        var random = new TimeSeries();
        setInterval(function () {
            random.append(new Date().getTime(), Math.random() * 10000);
        }, 500);

        chart.addTimeSeries(random, {lineWidth: 2, strokeStyle: '#2780e3'});
        chart.streamTo(canvas, 500);
    };
}]);

App.controller('serverController', ['$scope', function ($scope) {
    ipcRenderer.on('to-app', (event, args) => {
        switch (args.type) {
        case "servers-callback":
            $scope.servers = args.data.data;
            $scope.loading = false;
            $scope.$apply();
            for(var i = 0; i < $scope.servers.length; i++) {
                $scope.redrawChart($scope.servers[i]);
            }
            break;
        }
    });

    $scope.redrawChart = function (server) {
        console.log(server);
        var data = {
            labels: [
                "Zivilisten",
                "Polizisten",
                "Medics",
                "ADAC"
            ],
            datasets: [
                {
                    data: [server.Civilians, server.Cops, server.Medics, server.Adac],
                    backgroundColor: [
                        "#8B008B",
                        "#0000CD",
                        "#228B22",
                        "#C00100"
                    ]
                }]
        };

        var xhx = $("#serverChart" + server.Id);
        var serverChart1 = new Chart(xhx, {
            type: 'pie',
            data: data,
            options: {
                responsive: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    };

    $scope.init = function () {
        $scope.loading = true;
        getServers();
    };

    $scope.showTab = function (tabindex) {
        $('.serverTab').removeClass('active');
        $('.serverPane').removeClass('active');
        $('#serverTab' + tabindex).addClass('active')
        $('#serverPane' + tabindex).addClass('active');
    };
}]);

function getMods() {
    var args = {
        type: "get-url",
        callback: "mod-callback",
        url: APIBaseURL + APIModsURL,
        callBackTarget: "to-app"
    };
    ipcRenderer.send('to-web', args);
}

function getServers() {
    var args = {
        type: "get-url",
        callback: "servers-callback",
        url: APIBaseURL + APIServersURL,
        callBackTarget: "to-app"
    };
    ipcRenderer.send('to-web', args);
}