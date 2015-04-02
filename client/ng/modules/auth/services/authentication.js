(function (angular, asm) {
    'use strict';

    angular.module(asm.modules.auth.name).factory(asm.modules.auth.services.authentication, [
        '$q',
        '$timeout',
        '$http',
        'eventbus',
        asm.modules.core.services.userService,
        function ($q, $timeout, $http, eventbus, userSvc) {
            var currentUser,
                login = function (email, password) {
                    var defer = $q.defer();

                    userSvc.login(email, password).then(function (response) {
                        userSvc.token = response.data.token;
                        console.log('in userSvc login');
                        $http.defaults.headers.common['X-Auth'] = response.data.token;

                        currentUser = response.data.user;
                        currentUser.permissions = response.data.permissions;
                        eventbus.broadcast(asm.modules.auth.events.userLoggedIn, currentUser);
                        defer.resolve(currentUser);
                        //userSvc.getUser().then(function (user) {
                        //    currentUser = user.data;
                        //    defer.resolve(currentUser);
                        //    eventbus.broadcast(asm.modules.auth.events.userLoggedIn, currentUser);
                        //}).catch(function (msg) {
                        //    if (msg && msg.data) {
                        //        console.log('get user error = ' + msg)
                        //    } else {
                        //        console.log('error getting user')
                        //    }
                        //    throw msg;
                        //});

                    }, function (val) {
                        console.log('login error = ' + val.data)
                    });
                    return defer.promise;
                },
                logout = function () {
                    // we should only remove the current user.
                    // routing back to login login page is something we shouldn't
                    // do here as we are mixing responsibilities if we do.
                    userSvc.token = null;
                    console.log('in userSvc logout');
                    delete $http.defaults.headers.common['X-Auth'];
                    currentUser = undefined;
                    eventbus.broadcast(asm.modules.auth.events.userLoggedOut);
                },
                getCurrentLoginUser = function () {
                    return currentUser;
                };

            return {
                login: login,
                logout: logout,
                getCurrentLoginUser: getCurrentLoginUser
            };
        }
    ]);
}(angular, asm));