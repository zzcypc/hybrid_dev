mycontrol.controller('MainCtrl', function ($scope, $http, $ionicModal, $ionicScrollDelegate,
                                           $interval, $ionicPopup, $ionicSlideBoxDelegate, $timeout,
                                           HttpClient) {

	var alertPopup = null;
    function toast(title, template) {
        alertPopup = $ionicPopup.alert({
            title: title,
            template: template
        });
        alertPopup.then(function (res) {
        	
        });
        
        /*$timeout(function() {
	      alertPopup.close(); 
	   	}, 1000);*/
    }

    $scope.page = 1;
    $scope.kind = 'all';
    $scope.bookmark = "全部";

	$scope.$watch('kind', function(newValue, oldValue) {
		switch (newValue){
			case 'all':
				$scope.bookmark = '全部';
				break;
			case 'A':
				$scope.bookmark = '日常';
				break;
			case 'B':
				$scope.bookmark = '书籍';
				break;
			case 'C':
				$scope.bookmark = '运动';
				break;
			case 'D':
				$scope.bookmark = '代步';
				break;
			case 'E':
				$scope.bookmark = '家电';
				break;
			case 'F':
				$scope.bookmark = '衣包';
				break;
			case 'G':
				$scope.bookmark = '其他';
				break;
			default:
				break;
		}
	});
	
	


    /*零食拼单*/
    $scope.sorry = function () {
        toast("客官", "此功能稍后上线(o´・ェ・｀)");
    };


    /*搜索界面*/

    $scope.searchs = [];

    $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: $scope,
        animation: 'slide-in-up' //'slide-left-right', 'slide-left-right-ios7', 'slide-in-up'。
    }).then(function (modal) {
        $scope.searchmodal = modal
    });

    $scope.opensearchmodal = function () {
        $scope.searchmodal.show();
    };
    $scope.backsearchmodal = function () {
        $scope.searchmodal.hide();
    };

    var timer = null;
    $scope.change = function (keyword) {

        $timeout.cancel(timer);
        timer = $timeout(function () {
            config = {
                method: 'GET',
                url: API.SEARCH,
                params: {
                    keyword: keyword
                }
            };
            HttpClient.async(config).then(function (data) {
                console.log(data);
                $scope.searchs = data.data;
            });

        }, 500);

    };


    /*下拉刷新*/
    $scope.doRefresh = function () {
        console.log("do-refresh");

        $scope.kind = 'all';
        $scope.page = 1;

        var config = {
            method: 'GET',
            url: API.MAIN_MENU,
            params: {'kind': $scope.kind, 'page': $scope.page}
        };

        HttpClient.async(config).then(function (data) {
            $scope.items = data.data;
            $scope.page = 2;
        })
            .finally(function () {
                // 停止广播ion-refresher
                $scope.$broadcast('scroll.refreshComplete');
            });

        /*$http(config)
         .success(function (data, status, headers, config) {
         $scope.items = data.data;
         $scope.page = 2;
         })
         .finally(function () {
         // 停止广播ion-refresher
         $scope.$broadcast('scroll.refreshComplete');
         });*/
    };

    /*商品初始化展示*/


    $scope.items = [
        {
            current_price1: "",
            current_price2: "",
            goods_name1: "",
            goods_name2: "",
            goods_id1: "",
            goods_id2: "",
            picture1: "",
            picture2: "",
            view1: "",
            view2: ""
        }
    ];
    var config = {
        method: 'GET',
        url: API.MAIN_MENU,
        params: {'page': $scope.page, 'kind': $scope.kind}
    };
    HttpClient.async(config).then(function (data) {
        $scope.items = data.data;
        console.log("已经加载了page:" + $scope.page);
        console.log($scope.items);
        $scope.page += 1;
    }, function (r) {
        toast("初始化商品列表失败", r);
    });

    function load_info() {
        temp = [];
        var config = {
            method: 'GET',
            url: API.MAIN_MENU,
            params: {'page': $scope.page, 'kind': $scope.kind}
        };
        HttpClient.async(config).then(function (data) {
        	
            temp = data.data;

            if (temp.length == 0) {
            	/*toast("dear", "没有更多数据了~");*/
            	$ionicScrollDelegate.scrollBy(0, -100 ,true);
                
                
            } else {
                $scope.items = $scope.items.concat(temp);
                console.log("已经加载了page:" + $scope.page);
                console.log($scope.items);
                $scope.page += 1;
            }
        }).
            finally(function (r) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
    }

    $scope.load_kind = function (kind) {

        console.log(kind);

        $scope.kind = kind;
        $scope.page = 1;

        var config = {
            method: 'GET',
            url: API.MAIN_MENU,
            params: {'kind': $scope.kind, 'page': $scope.page}
        };
        HttpClient.async(config).then(function (data) {
            $scope.items = data.data;
            console.log("已经加载了page:" + $scope.page);
            console.log($scope.items);
            $scope.page += 1;
        }, function (r) {
            toast("初始化商品列表失败", data);
        });

    };

	var cy_timer = null;
    $scope.load_more = function () {
    	
    	$timeout.cancel(cy_timer);    	
    	if (alertPopup != null) 
    		alertPopup.close();
        cy_timer = $timeout(function(){
        	load_info();
        }, 500);
        
        
    };

    /*商品详情*/
    $ionicModal.fromTemplateUrl('templates/goods_info.html', {
        scope: $scope,
        animation: 'slide-left-right'//'slide-left-right', 'slide-left-right-ios7', 'slide-in-up'。
    }).then(function (modal) {
        $scope.detailmodal = modal
    });
    $scope.detailmodalshow = function () {
        $scope.detailmodal.show();
    };
    $scope.detailmodalhide = function () {
        $scope.detailmodal.hide();
    };

    $scope.detail =
    {
        picture1: 'img/pic_not_load.png',
        picture2: 'img/pic_not_load.png',
        picture3: 'img/pic_not_load.png',
        goods_name: '找不到信息',
        view: '找不到信息',
        postion: '找不到信息',
        original_price: '找不到信息',
        current_price: '找不到信息',
        owner: '找不到信息',
        major: '找不到信息',
        pub_date: '找不到信息',
        description: '找不到信息',
        cellphone: '找不到信息'

    };
    $scope.xiangqing = function (a) {

        $scope.detail.picture1 = "";
        $scope.detail.picture2 = "";
        $scope.detail.picture3 = "";

        console.log(a);

        $ionicSlideBoxDelegate.slide(0);

        config = {
            method: 'GET',
            url: API.DETAILS,
            params: {id: a}
        };
        HttpClient.async(config).then(function (data) {
            $scope.detail = data.data[0];
            console.log($scope.detail);
            if ($scope.detail.picture1 == "") {
                $scope.detail.picture1 = 'img/pic_not_load.png';
            }
            if ($scope.detail.picture2 == "") {
                $scope.detail.picture2 = 'img/pic_not_load.png';
            }
            if ($scope.detail.picture3 == "") {
                $scope.detail.picture3 = 'img/pic_not_load.png';
            }
            $scope.detailmodalshow();
        }, function (r) {

        });

        /*$http.get('http://2.zzcypc.sinaapp.com/display/details.php?id=' + a).
         success(function (data, status, headers, config) {
         $scope.detail = data.data[0];
         console.log($scope.detail);
         if ($scope.detail.picture1 == "") {
         $scope.detail.picture1 = 'img/pic_not_load.png';
         }
         if ($scope.detail.picture2 == "") {
         $scope.detail.picture2 = 'img/pic_not_load.png';
         }
         if ($scope.detail.picture3 == "") {
         $scope.detail.picture3 = 'img/pic_not_load.png';
         }
         $scope.detailmodalshow();
         }).
         error(function (data, status, headers, config) {

         });*/
    };


});
