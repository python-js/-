(function(angular){

    var app = angular.module('douban_controller',['ngRoute','douban_service']);

    app.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/',{
            redirectTo:'/home_page'
        }).when('/home_page',{
            templateUrl:'./views/home.html'
        }).when('/details/:id',{
            templateUrl:'./views/detail.html',
            controller:'detailsCtrl'
        }).when('/:tag/:pageIndex',{
            templateUrl:'./views/moveList.html',
            controller:'moveListCtrl'
        })
    }])

    //正在热映、即将上映、Top250电影、电影搜索列表
    app.controller('moveListCtrl',['$scope','doubanJsonp','$routeParams','$window','$route',function($scope,doubanJsonp,$routeParams,$window,$route){
        console.log($routeParams);
        // $scope.tag = $routeParams.tag;

        $scope.count = 10;
        // $scope.start = 0;
        $scope.isShow = true;
        $scope.pageIndex = ($routeParams.pageIndex || 1) - 0;
        doubanJsonp.Jsonp({
            url:'http://api.douban.com/v2/movie/'+$routeParams.tag,
            params:{
                q:$routeParams.q,
                count:$scope.count,
                start:($scope.pageIndex-1) * $scope.count
            },
            callback:function(data){
                // console.log(data);
                 $scope.isShow = false;
                $scope.movies = data;
                $scope.countPage = $window.Math.ceil(data.total / data.count);
                $scope.$apply();
            }
        })

        $scope.getPage = function(pageIndex){
            if(pageIndex<1 || pageIndex > $scope.countPage) return;
            $route.updateParams({
                pageIndex:pageIndex
            })
        }
    }])

    //电影详情信息
    app.controller('detailsCtrl',['$scope','doubanJsonp','$routeParams',function($scope,doubanJsonp,$routeParams){
        //  console.log($routeParams);
         $scope.isShow = true;
         doubanJsonp.Jsonp({
            url:'http://api.douban.com/v2/movie/subject/'+$routeParams.id,
            params:{},
            callback:function(data){
                // console.log(data);
                $scope.isShow = false;
                $scope.movie = data;
                $scope.$apply();
            }
        })
    }])
})(angular);
(function(angular){

    var app = angular.module('douban_service',[]);

    app.service('doubanJsonp',['$window',function($window){
        this.Jsonp = function(opts){
            var url = opts.url + '?';
            for(var key in opts.params){
                url += (key + "=" + opts.params[key] + "&");
            }

            var callbackName = 'Jsonp_'+$window.Math.random().toString().slice(2);
            $window[callbackName] = opts.callback;
            url += ("callback=" + callbackName);

            var script = $window.document.createElement('script');
            script.src = url;
            $window.document.body.appendChild(script);
        }
    }])

})(angular);
(function (angular) {
    // "use strict";

    // start your ride
    var app = angular.module('douban_movie',['douban_controller','douban_service']);

    app.config(['$locationProvider',function($locationProvider){
        $locationProvider.hashPrefix('');
    }])

    app.controller('searchList',['$scope','$window',function($scope,$window){
        $scope.searchMovie = function(val){
            if(!val){
                $window.alert('请输入影片名字！');
                return;
            }
            $window.location.hash = '#/search/1?q='+val
        }
    }])

    //自定一个指令，实现给指定元素添加样式
    app.directive('hmActive',[function(){
        return {
            restrict:'A',
            link:function(scope,element,attrs){
                element.on('click',function(){
                    element.parent().children().removeClass('active');
                    element.addClass('active');
                })
            }
        }
    }])

})(angular);