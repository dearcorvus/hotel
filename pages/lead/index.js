//index.js
//获取应用实例
const app = getApp()
var template = require('../../tabbar.js');
Page({
  data: {
    nav:1,
    order_item:[]
  },
  /**
   * 加载页面内容
  */
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    })

    this.navFunction()
    wx.hideLoading()
    template.tabbar("tabBar", 0, this)//0表示第一个tabbar
  },
  /**
   * 扫码
   */
  Saom:function(){
    var that = this
    var uid = wx.getStorageSync("user");
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.errMsg == "scanCode:ok") {
          console.log(res.result)
          if (res.result) {
            wx.request({
              url: app.url + 'Saom/leadSaom',
              data: {
                goodsid: res.result,
                userid: uid.userid
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (r) {
                console.log(r)
                if (r.data.code == 200) {
                    wx.showToast({
                      title: r.data.massage,
                      icon: 'none',
                      duration: 2000,
                      success:function(){
                        setTimeout(function(){
                          that.onLoad();
                        },2000)
                      }
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
  onShow:function(){
    wx.hideHomeButton({
      success: function () {
        console.log(1)
      }
    })
  },

  /**
   *获取页面内容 
  * @page 分页
  */
  showFuntion:function(tid=1,page=1){
    var that = this
    var user = wx.getStorageSync("user");

    let ranklistBefore = that.data.order_item;

    wx.request({
      url: app.url + 'order/orderlist',
      data: {
        id: user.userid,
        tid: tid,
        page: page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
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
  navFunction: function (e) {
    var that = this
    var tid = '';
    if(e){
        tid = e.target.dataset.id
    }else{
      tid = 1;
    }

    if (that.data.nav != tid) {
      that.setData({
        nav: tid,
        order_item: []
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    that.showFuntion(tid,1);
  },

/**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    var tid = that.data.nav;
    // console.log(that.data)
    that.showFuntion(tid, Number(page) + Number(1));
  },
})
