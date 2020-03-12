//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isuserInfo: false,
  },
  onLoad: function () {
    var that = this
    that.setData({
      isuserInfo: true
    })
  },
  leadFunction:function(){
    var user = wx.getStorageSync('user');

    if (user.sf == 3) {
      wx.redirectTo({
        url: '../lead/index'
      })
    } else {
      wx.navigateTo({
        url: '../info/info?type=2',
      })
    }
  },
  hotelFunction:function(){
    var user = wx.getStorageSync('user');

    if (user.sf == 5) {
      wx.redirectTo({
        url: '../hotel/index'
      })
    } else {
      wx.navigateTo({
        url: '../info/info?type=4',
      })
    }
  },
  // 用户授权
  bindGetUserInfo: function (e) {
    var that = this;

    //此处授权得到userInfo
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.login({
        success: function (result) {
          if (result.code) {
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                wx.request({
                  url: app.url + 'login/getOpenid',
                  data: {
                    js_code: result.code
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (ress) {
                    console.log("获取用户信息？", ress.data);
                    //获取用户信息(头像,姓名，openid)
                    var usermsg = {};
                    usermsg.img = res.userInfo.avatarUrl;
                    usermsg.nickName = res.userInfo.nickName;
                    usermsg.openid = ress.data.openid;
                    usermsg.js_code = result.code;
                    wx.setStorageSync('user', usermsg);
                    wx.request({
                      url: app.url + 'login/login',
                      data: {
                        openid: ress.data.openid,
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function (res) {
                        console.log("保存成功", res);
                        usermsg.userid = res.data.userid;
                        usermsg.sf = res.data.sf;
                        usermsg.tel = res.data.tel;
                        wx.setStorageSync('user', usermsg);

                        that.setData({
                          isuserInfo: false,
                        });
                        if (res.data.code == 300) {
                          wx.showModal({
                            title: '提示',
                            content: '你的账号已被禁止登录',
                          })
                        }else{
                          if (res.data.sf == 3) {
                            wx.redirectTo({
                              url: '../lead/index'
                            })
                          }
                          if (res.data.sf == 5) {
                            wx.redirectTo({
                              url: '../hotel/index'
                            })
                        }

                        }

                      }
                    })
                  }
                })
              },
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })

    } else {
      that.setData({
        isuserInfo: false
      });
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取用户信息缓存
    wx.getStorage({
      key: "user",
      success: function (res) {
        if (res.data.userid) {
          that.setData({
            isuserInfo: false
          })
          if (res.data.sf == 3){
            wx.redirectTo({
              url: '../lead/index'
            })
          }
          if (res.data.sf == 5){
            wx.redirectTo({
              url: '../hotel/index'
            })
          }
        } else {
          that.setData({
            isuserInfo: true
          })
        }

      },
      fail: function (res) {
        console.log("获取缓存失败");
        that.setData({
          isuserInfo: true
        })
      }
    });
  },
  //验证登录是否过期
  checksession: function () {
    wx.checkSession({
      success: function (res) {
        console.log(res, '登录未过期')
        // wx.showToast({
        //   title: '登录未过期啊',
        // })
      },
      fail: function (res) {
        console.log(res, '登录过期了')
        wx.showModal({
          title: '提示',
          content: '你的登录信息过期了，请重新登录',
        })
        that.setData({
          isuserInfo: true
        })
      }
    })
  }
})
