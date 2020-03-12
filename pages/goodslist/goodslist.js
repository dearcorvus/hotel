// pages/goodslist/goodslist.js
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods_item:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    var user = wx.getStorageSync('user')
    wx.showLoading({
      title: '加载中...',
    })
    that.showGoods();
  },

  showGoods:function(e=0,page=1){
    var that = this
    var user = wx.getStorageSync('user')
    let ranklistBefore = that.data.goods_item;

    wx.request({
      url: app.url + 'goods/shopCenter/',
      data: {
        shopid: user.userid,
        type:e,
        page:page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function(res) {

        // 每次加载数据,请求一次就发送10条数据过来
        let eachData = res.data.data.data;
        if (eachData.length == 0) {
          wx.showToast({
            title: '没有更多数据了!~',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '数据加载中...',
            icon: 'none'
          })
        }

        that.setData({
          loadText: "数据请求中",
          loading: true,
          goods_item: ranklistBefore.concat(eachData),
          loadText: "加载更多",
          loading: false,
          page: res.data.data.current_page
        });

      },
    })

  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;

    that.showGoods(0, Number(page) + Number(1));
  },

})