// pages/info/info.js
import PublicFun from '../../utils/PublicFun.js';

const app = getApp()

const phoneRexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options);

    that.setData({
      type: options.type
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  formSubmit: function (e) {
    var that = this
    var type = e.detail.value.type
    var tel = e.detail.value.tel
    var username = e.detail.value.username
    var user = wx.getStorageSync('user')
    var errMsg=''

    if (tel) {
      if (!phoneRexp.test(tel)) {
        errMsg = '手机号格式有误！'; 
      }
    }else{
        errMsg = '请输入手机号！';
    }

    if (username == '') {
      errMsg = '请输入姓名！';
    }


    if (errMsg) {
      that.setData({
        Loading: false
      })
      PublicFun._showToast(errMsg);
      return false
    }



    if (tel == '' || username == ''){
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 2000
      })
    }else{

      wx.request({
        url: app.url +'login/update_info',
        data: {
          js_userid:user.userid,
          js_type:type,
          js_tel:tel,
          js_username:username, 
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
            console.log(res)
            if(res.data.code == 200){
              wx.showToast({
                title: '申请已提交',
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateBack();
              }, 2000)
            } else{
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })        
            }      
        }
      })

    }

  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})