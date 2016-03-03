var mycontrol = angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.factories']);

mycontrol.controller('TabCtrl', function($scope, $cordovaCamera, $http, $ionicActionSheet, $window,
	$ionicPopup, $cordovaImagePicker, HttpClient, UserData, $interval,
	$cordovaFileTransfer, $q, $ionicModal, $ionicLoading) {


	var localstorage = window.localStorage;

	function toast(title, template) {
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: template
		});
		alertPopup.then(function(res) {});
	}

	function confirm(title, template, yes) {
		var confirmPopup = $ionicPopup.confirm({
			title: title,
			template: template
		});
		confirmPopup.then(function(res) {
			if (res) {
				yes();
			} else {}
		});
	}

	/**
	 *绑定部分
	 *
	 *
	 *
	 ********/
	$ionicModal.fromTemplateUrl('templates/bind.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.bindmodal = modal;
	});

	$scope.buser = {
		stuNum: '正在获取',
		name: '正在获取',
		college: '正在获取'
	};

	$scope.ver_text = '验证码';

	$scope.user = {
		schoolnum: '',
		password: '',
		phonenum: ''
	};

	/*获取用户信息*/
	function getinfo() {
		data = {
			user: localStorage["stuNum"]
		};

		config = {
			url: API.RETURN_INFO,
			method: 'POST',
			data: data
		};

		HttpClient.async(config).then(function(data) {
			console.log(data);
			var temp = data;
			localStorage["name"] = "";
			localStorage["sex"] = "";
			localStorage["call"] = "";
			localStorage["college"] = "";

			localStorage["name"] = data.name;
			localStorage["sex"] = data.sex;
			localStorage["call"] = data.call;
			localStorage["college"] = data.college;

			$scope.buser.stuNum = localStorage["stuNum"];
			$scope.buser.name = localStorage["name"];
			$scope.buser.college = localStorage["college"];

			UserData.updatainfo(localstorage['name'], localstorage['college']);

		}, function(r) {
			toast('dear', '服务器君开小差了(￣ ‘i ￣;)未能获取用户信息~');
		});
	}

	$scope.bindun = function() {
		$scope.bindmodal.show();

		/*界面初始化*/
		if (localStorage["stuNum"]) {
			$scope.beacon = true;
		} else {
			$scope.beacon = false;
		}


		/*监听界面的跳转*/
		$scope.$watch('beacon', function(newValue, oldValue) {
			if (newValue == true) {
				getinfo();
			}
		});


		//发送验证码
		$scope.sendvcode = function() {

			$ionicLoading.show({
				template: 'Loading...'
			});

			phonenum = $scope.user.phonenum;
			data = {
				phoneNum: phonenum
			};

			if (phonenum == undefined || phonenum.length == 0) {
				toast('dear', '手机号不能为空哦(*￣(エ)￣)');
				$ionicLoading.hide();
				return;
			}

			config = {
				url: API.SEND_SMS,
				method: 'POST',
				data: data,
				timeout: 3000
			};
			HttpClient.async(config).then(function(data) {
				console.log(data);

				if (data.length > 3) {

					$scope.ver_text = 60;

					document.getElementById("ver_bt").disabled = true;

					$interval(function() {
						$scope.ver_text -= 1;
						if ($scope.ver_text == 0) {
							$scope.ver_text = '验证码';
							document.getElementById("ver_bt").disabled = false;
						}
					}, 1000, 60);

					toast('dear', '验证码发送成功，请查收(づ￣ 3￣)づ');
					localStorage["vcode"] = "";
					localStorage["vcode"] = data;
					localStorage["phoneNum"] = "";
					localStorage["phoneNum"] = phonenum;
					console.log("phonenumber:" + localStorage["phoneNum"]);

				} else if (data.length == 2) {

					toast('dear', '短信发送失败，请重试(￣ ‘i ￣;)');

				} else {

					toast('dear', '发生了未知错误(￣ ‘i ￣;)');
				}
				$ionicLoading.hide();
			}, function(r) {
				console.log(r);
				toast('dear', '服务器出小差了(￣ ‘i ￣;)');
				$ionicLoading.hide();

			});

		};

		$scope.bind = function() {

			$ionicLoading.show({
				template: 'Loading...'
			});


			var vcode = $scope.user.vcode + "";

			if (vcode == undefined || vcode.length == 0) {
				toast('dear', '验证码不能为空哦(*￣(エ)￣)');
				$ionicLoading.hide();
				return;
			}

			var local_vcode = localStorage["vcode"] + "";

			if (hex_md5(vcode) != local_vcode) {
				toast('dear', '验证码不正确哦(*￣(エ)￣)');
				$ionicLoading.hide();
				return;
			}


			var schoolnum = $scope.user.schoolnum;
			var password = $scope.user.password;

			if (schoolnum == undefined || schoolnum.length == 0) {
				toast('dear', '学号不能为空哦(*￣(エ)￣)');
				$ionicLoading.hide();
				return;
			}
			if (password == undefined || password.length == 0) {
				toast('dear', '密码不能为空哦(*￣(エ)￣)');
				$ionicLoading.hide();
				return;
			}


			/*参数待定*/
			data = {
				user: schoolnum,
				password: password,
				phoneNum: localStorage["phoneNum"]
			};

			config = {
				method: 'POST',
				url: API.LOGIN,
				data: data,
				timeout: 4000
			};
			HttpClient.async(config).then(function(data) {
				console.log(data);
				data = parseInt(data);
				/*toast('result',data);   //测试
				 $ionicLoading.hide();    //测试*/

				if (angular.equals(data, 1) == true) {
					localStorage["stuNum"] = '';
					localStorage["password"] = '';

					localStorage["password"] = password; //原始密码
					localStorage["stuNum"] = schoolnum;

					$ionicLoading.hide();
					toast('dear', '绑定成功(づ￣ 3￣)づ');
					$scope.beacon = true;

				} else if (angular.equals(data, 3) == true) {

					$ionicLoading.hide();
					toast('dear', '学号或密码错误(￣ ‘i ￣;)');
				} else if (angular.equals(data, 4) == true) {

					$ionicLoading.hide();
					toast('dear', '学生信息插入失败(￣ ‘i ￣;)');
				} else {
					$ionicLoading.hide();
					toast('dear', '发生未知错误(￣ ‘i ￣;)');
				}
			}, function(r) {
				$ionicLoading.hide();
				toast('dear', '服务器君开小差了(￣ ‘i ￣;)');
			});

		};

		$scope.cancelbind = function() {
			$ionicLoading.show({
				template: 'Loading...'
			});

			data = {
				user: localStorage["stuNum"]
			};

			config = {
				method: 'POST',
				url: API.CANCEL_BIND,
				data: data,
				timeout: 3000
			};
			HttpClient.async(config).then(function(data) {
				console.log(data);
				data = parseInt(data);

				if (angular.equals(data, 1) == true) {

					localStorage["stuNum"] = '';
					localStorage["name"] = '';
					localStorage["college"] = '';
					$ionicLoading.hide();
					toast('dear', '解绑成功(づ￣ 3￣)づ');

					UserData.updatainfo("小尾巴", "你看不到我，看不到我~");

					$scope.beacon = false;
				} else if (angular.equals(data, 0) == true) {
					$ionicLoading.hide();
					toast('dear', '解绑失败，请重试(づ￣ 3￣)づ');
				}
			}, function(r) {

				$ionicLoading.hide();
				toast('dear', '服务器君开小差了(￣ ‘i ￣;)');

			});

		}
	};
	$scope.back1 = function() {
		$scope.bindmodal.hide();
	};

	/*绑定模块结束*/


	function judgebind() {
		if (localstorage["stuNum"]) {
			return true;
		} else
			return false;
	}


	$ionicModal.fromTemplateUrl('templates/publish.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.addgoodmodal = modal;
	});
	$scope.addmodalshow = function() {
		if (judgebind() == false) {
			confirm("dear", "请先完成与教务处的绑定~ (o´・ェ・｀)", $scope.bindun);
			return;
		}

		$scope.good = {
			name: '',
			oprice: '',
			cprice: '',
			des: '',
			type: ''
		};

		$scope.goods_id = '';
		
		$scope.goodtype = '';

		$scope.images = {
			count: 0,
			pic1: '',
			pic2: '',
			pic3: ''
		};

		$scope.addgoodmodal.show();
	};
	$scope.addmodalback = function() {
		$scope.addgoodmodal.hide();
	};

	function checktype(index) {
		index = parseInt(index);

		switch (index) {
			case 0:
				$scope.good.type = 'A';
				$scope.goodtype = "日常用品";
				break;
			case 1:
				$scope.good.type = 'B';
				$scope.goodtype = "书籍杂志";
				break;
			case 2:
				$scope.good.type = 'C';
				$scope.goodtype = "娱乐运动";
				break;
			case 3:
				$scope.good.type = 'D';
				$scope.goodtype = "代步工具";
				break;
			case 4:
				$scope.good.type = 'E';
				$scope.goodtype = "小型家电";
				break;
			case 5:
				$scope.good.type = 'F';
				$scope.goodtype = "衣服箱包";
				break;
			case 6:
				$scope.good.type = 'G';
				$scope.goodtype = "其他商品";
				break;
		}
	}

	// Triggered on a button click, or some other target
	$scope.showtype = function() {

		// Show the action sheet
		$ionicActionSheet.show({
			titleText: '选择类型',
			buttons: [{
				text: '<i class="icon ion-bag"></i> 日常用品'
			}, {
				text: '<i class="icon ion-university"></i> 书籍杂志'
			}, {
				text: '<i class="icon ion-ios-baseball-outline"></i> 娱乐运动'
			}, {
				text: '<i class="icon ion-android-bicycle"></i> 代步工具'
			}, {
				text: '<i class="icon ion-android-laptop"></i> 小型家电'
			}, {
				text: '<i class="icon ion-tshirt-outline"></i> 衣服箱包'
			}, {
				text: '<i class="icon ion-earth"></i> 其他商品'
			}],
			cancelText: '取消',
			cancel: function() {
				console.log('CANCELLED');
			},
			buttonClicked: function(index) {
				console.log(index);

				checktype(index);
				return true;
			}
		});
	};


	$scope.dele = function(index) {

		if ($scope.images.count == 1) {
			last = $scope.images.pic1;
		} else if ($scope.images.count == 2) {
			last = $scope.images.pic2;
		} else if ($scope.images.count == 3) {
			last = $scope.images.pic3;
		}

		if (index == 1) {
			temp = last;
			last = $scope.images.pic1;
			$scope.images.pic1 = temp;
		} else if (index == 2) {
			temp = last;
			last = $scope.images.pic2;
			$scope.images.pic2 = temp;
		}
		$scope.images.count = $scope.images.count - 1;
	};

	function uploadpic(fileURL, i, promises) {

		var deffered = $q.defer();

		var options = new FileUploadOptions();
		options.fileKey = "upfile" + i;
		options.chunkedMode = true;


		var params = {
			goods_id: $scope.goods_id,
			pw: hex_md5(localstorage["stuNum"] + localstorage["password"] + "neuq")
		};

		options.params = params;

		var url = API.UPLOAD_PIC;
		var ft = new FileTransfer();
		ft.upload(fileURL, encodeURI(url), win, fail, options);

		promises.push(deffered.promise);

		function win(r) {

			deffered.resolve(r.response);
			console.log(r);

			r = parseInt(r.response);

			if (r == 1) {
				console.log(i + "图片提交成功  " + r);
			} else if (r == 2) {
				$scope.result = 0;
				console.log(i + "图片提交失败  " + r);
			} else {
				console.log(i + "发生未知错误  " + r);
			}

		}

		function fail(error) {
			//提示 网络问题

			$scope.result = 0;
			deffered.reject();
			console.log(error);
		}
	}


	$scope.upload = function() {

		$ionicLoading.show({
			template: 'Loading...'
		});

		if ($scope.images.count == 0) {

			//提示 必须要上传图片哦
			$ionicLoading.hide();
			toast('dear', "必须要上传图片哦~~");
			console.log("必须要上传图片哦");
			return;
		}

		if ($scope.good.name == undefined || $scope.good.name.length == 0 ||
			$scope.good.oprice == undefined || $scope.good.oprice.length == 0 ||
			$scope.good.cprice == undefined || $scope.good.cprice.length == 0 ||
			$scope.good.des == undefined || $scope.good.des.length == 0 ||
			$scope.good.type == undefined || $scope.good.type.length == 0) {
			toast('dear', '信息不能为空哦(*￣(エ)￣)');
			$ionicLoading.hide();
			return;
		}


		params = {
			goods_name: $scope.good.name,
			original_price: $scope.good.oprice,
			current_price: $scope.good.cprice,
			description: $scope.good.des,
			piccount: $scope.images.count,
			type: $scope.good.type,
			pw: hex_md5(localstorage["stuNum"] + localstorage["password"] + "neuq")

		};

		config = {
			url: API.UPLOAD_FORM,
			method: 'POST',
			data: params
		};
		HttpClient.async(config).then(function(data) {
			console.log('data::' + data);

			if (data.length == 1) {
				//发布失败
				$ionicLoading.hide();
				toast('dear', "发布失败，再试一次吧~");
				console.log("upload form Failed");

			} else {
				//发布成功
				var strs = new Array();
				strs = data.split("##");
				console.log('strs' + strs);
				$scope.goods_id = strs[1];
				console.log('goods_id' + $scope.goods_id);

				var promises = [];

				for (var i = 0; i < $scope.images.count; i++) {

					if (i == 0) uploadpic($scope.images.pic1, 1, promises);
					if (i == 1) uploadpic($scope.images.pic2, 2, promises);
					if (i == 2) uploadpic($scope.images.pic3, 3, promises);
				}

				$q.all(promises).then(function(datas) {
						console.log(datas);
						var temp = 1;
						for (i = 0; i < datas.length; i++) {
							datas[i] = parseInt(datas[i]);
							if (datas[i] != 1) {
								temp = 0;
							}
						}
						if (temp == 1) {
							$ionicLoading.hide();
							toast('dear', '发布成功，快去看看吧~');
							$scope.addgoodmodal.hide();
							console.log("发布成功！！~");

						} else {
							$ionicLoading.hide();
							toast('dear', '有图片在路上走丢了，再试一次吧~');
							console.log("发布失败~~！！");
						}

					},
					function(errors) {
						$ionicLoading.hide();
						console.log(errors);
						toast('dear', '服务器的锅！~~');
						console.log("发布失败~~！！检查网络");
					});
			}
		}, function(r) {
			//检查您的网络
			$ionicLoading.hide();
			toast('dear', '服务器的锅！~~');
			console.log("error方法~！" + data);
		});



	};

	function takePicture() {

		var options = {

			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
			targetWidth: 1200,
			targetHeight: 1200,
			encodingType: 0
		};

		// udpate camera image directive
		$cordovaCamera.getPicture(options).then(function(imageURI) {
			/*temp = "data:image/jpeg;base64," + imageData;*/

			temp = imageURI;

			$scope.images.count = $scope.images.count + 1;
			if ($scope.images.count == 1) {
				$scope.images.pic1 = temp;
			} else if ($scope.images.count == 2) {
				$scope.images.pic2 = temp;
			} else if ($scope.images.count == 3) {
				$scope.images.pic3 = temp;
			}
			console.log($scope.images.count + "   " + temp);
		}, function(err) {
			console.log('Camera Failed because: ');
			console.log(err);
		});
	}

	function imagePicker() {
		var options = {
			maximumImagesCount: 3 - $scope.images.count,
			width: 1200,
			height: 1200,
			quality: 50
		};

		$cordovaImagePicker.getPictures(options)
			.then(function(results) {
				for (var i = 0; i < results.length; i++) {

					$scope.images.count = $scope.images.count + 1;
					if ($scope.images.count == 1) {
						$scope.images.pic1 = results[i];
					} else if ($scope.images.count == 2) {
						$scope.images.pic2 = results[i];
					} else if ($scope.images.count == 3) {
						$scope.images.pic3 = results[i];
					}

					console.log('Image URI: ' + results[i]);
				}
			}, function(error) {
				console.log('ImagePicker Failed because: ');
				console.log(error);
			});
	}

	function jump(index) {
		index = parseInt(index);
		if (index == 0) {
			takePicture();
		} else if (index == 1) {
			imagePicker();
		}
	}

	$scope.addpic = function() {

		$ionicActionSheet.show({
			titleText: '选择类型',
			buttons: [{
				text: '<i class="icon ion-camera"></i> 相机'
			}, {
				text: '<i class="icon ion-image"></i> 相册'
			}, ],
			cancelText: '取消',
			cancel: function() {
				console.log('CANCELLED');
			},
			buttonClicked: function(index) {
				console.log(index);
				jump(index);
				return true;
			}
		});
	};
});