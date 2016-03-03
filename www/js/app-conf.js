var API_HOST = 'http://zzcypc.sinaapp.com/display/';

var API = {

	/**
	 * 搜索框
	 *
	 */
	SEARCH: API_HOST + 'search.php',

	/**
	 * 主界面
	 *
	 */
	MAIN_MENU: API_HOST + 'main_menu.php',

	/**
	 * 商品详情
	 *
	 */
	DETAILS: API_HOST + 'details.php',

	/**
	 * 反馈
	 *
	 */
	FEEDBACK: 'http://zzcypc.sinaapp.com/feedback/feedback.php',

	/**
	 * 改变商品状态
	 *
	 */
	CHANGE_STATU: API_HOST + 'sell.php',

	/**
	 * 我发布的二手商品
	 */
	MY_GOODS: API_HOST + 'my_publication.php',

	/**
	 * 修改商品信息时提交图片
	 */
	AMEND_PIC: API_HOST + 'amend_pic.php',

	/**
	 * 修改商品信息时提交表单
	 */
	AMEND: API_HOST + 'amend.php',

	/**
	 * 获取用户信息
	 */
	RETURN_INFO: 'http://zzcypc.sinaapp.com/datapro/returninfo.php',

	/**
	 * 发送验证短信
	 */
	SEND_SMS: 'http://zzcypc.sinaapp.com/smsverify/sendsms.php',


	/**
	 * 绑定学号
	 */
	LOGIN:'http://tujinote.com/hackjwc/hack-login.php',

	/**
	 * 取消绑定
	 */
	CANCEL_BIND:'http://zzcypc.sinaapp.com/datapro/cancelbind.php',

	/**
	 * 上传图片
	 */
	UPLOAD_PIC: API_HOST + 'add_pic.php',

	/**
	 * 发布时提交表单
	 *
	 */
	UPLOAD_FORM: API_HOST + 'add_form.php'
};
