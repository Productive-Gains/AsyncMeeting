(function (angular, asm) {
    'use strict';
    angular.module(asm.modules.navigation.name).controller(asm.modules.navigation.controllers.navigationCtrl, [
        '$scope',
        '$log',
        '$location',
        '$cookies',
        function ($scope, $log, $location, $cookies) {
            $scope.currentUser = $cookies.currentUser;

            $log.debug($location.path());
            // TODO: Dynamically create list of menu items based on permissions.
            $scope.menuItems = [
                { name: "My Home", path: "#/"},
                { name: "Meeting Areas", path: "#/meetingareas"},
                { name: "Meetings", path: "#/meetings"}
                ];

            $scope.isCurrentLocation = function(path) {
                return "#" + $location.path() === path;
            }

        }
    ]);
}(angular, asm));