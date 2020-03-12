// pages/hotel/index.js
const app = getApp()
var template = require('../../htabbar.js');
Page({
  data: {
    nav:1,
    order_item:[]
  },
  onLoad: function () {
    template.tabbar("tabBar", 0, this)//0表示第一个tabbar
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    wx.hideHomeButton({
      success: function () {
        console.log(1)
      }
    })
    // this.orderFunction();
    this.navFunction();
  },

  /**
   * 扫码获取
  */
  Saom: function () {
    var uid = wx.getStorageSync("user");

    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.errMsg == "scanCode:ok") {
          console.log(res)
          if (res.result) {
            wx.request({
              url: app.url + 'Saom/hotelSaom',
              data: {
                goodsid: res.result,
                shopid: uid.userid
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (r) {
                console.log(r)
                if (r.data.code == 200) {
                  wx.navigateTo({
                    url: "/pages/goods/goods?type=1&detail=" + r.data.data.goodsid + "&order_id=" + r.data.data.order_id
                  })
                } else {
                  wx.showToast({
                    title: r.data.massage,
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              fail: function (res) {
                console.log(res)
              },
            })
          }
        }
      }
    })
  },

  /**
   * 获取订单内容
  */
  orderFunction:function(e){
    var that = this 
    var user = wx.getStorageSync("user");
    var id = user.userid
    wx.request({
      url: app.url +'shop/shopOrder',
      data: {
        id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log(res)
        that.setData({
          order_item: res.data.data.data
        })
      }
    })
  },
  navFunction:function(e){
    var that = this
    var tid = '1';
    if (e) {
      tid = e.target.dataset.id
    }
    // var tid = e.target.dataset.id
    var user = wx.getStorageSync("user");
    var id = user.userid
    if (that.data.nav != tid){
      that.setData({
        nav:tid,
        order_item:[]
      })
    }
    that.showFuntion(tid, 1);
  },
  /**
 *获取页面内容 
* @page 分页
*/
  showFuntion: function (tid = 1, page = 1) {
    var that = this;
    var user = wx.getStorageSync("user");
    var id = user.userid;

    let ranklistBefore = that.data.order_item;
    wx.request({
      url: app.url + 'shop/shopOrder',
      data: {
        id: id,
        tid: tid,
        page:page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
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
          order_item: ranklistBefore.concat(eachData),
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
    var tid = that.data.nav;
    // console.log(that.data)
    that.showFuntion(tid,Number(page) + Number(1));
  },
})