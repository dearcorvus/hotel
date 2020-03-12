// pages/planUpdate/planUplate.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    arrayValue: '',
    arrayId: '',
    objList: [],
    goodsid:''
  },

  /**
   * 商品系列选择--监听页面加载
   */
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e)
    this.setData({
      arrayValue: this.data.array[e.detail.value].title,
      arrayId: this.data.array[e.detail.value].id
    })
  },
  /**
   * 商品系列选择--监听页面加载
   */
  bindPickerDayChange: function (e) {
    // 获取当前点击下标    
    var Index = e.currentTarget.dataset.index;
    var Val = this.data.objList[Index].day[e.detail.value].title;

    // data中获取列表   
    var shopArr = this.data.objList;
    for (let i in shopArr) {
      //遍历列表数据      
      if (i == Index) {
        //根据下标找到目标,改变状态  
        shopArr[i].dayVal = Val;
      }
    }

    //数组重新赋值
    this.setData({
      objList: shopArr
    })
  },

  /**
   * 商店选择--监听页面加载
   */
  bindPickerShopChange: function (e) {
    // 获取当前点击下标    
    var Index = e.currentTarget.dataset.index;
    var Val = this.data.objList[Index].shop[e.detail.value].title;

    // data中获取列表   
    var shopArr = this.data.objList;
    for (let i in shopArr) {
      //遍历列表数据      
      if (i == Index) {
        //根据下标找到目标,改变状态  
        shopArr[i].shopVal = Val;
      }
    }

    //数组重新赋值
    this.setData({
      objList: shopArr
    })
  },

  /**
 * 获取页面选项
 */
  addWeb: function (id) {
    var that = this;
    wx.request({
      url: app.url + 'plan',
      data: {
        id:id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        that.setData({
          array: res.data.goods,
          objList: res.data.data,
          arrayValue: res.data.goodsVal,
          goodsid: res.data.goodsid
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 划店 主店切换--加载
   */
  selectShop1: function (e) {
    // 获取当前点击下标    
    var Index = e.currentTarget.dataset.index;

    // data中获取列表   
    var shopArr = this.data.objList;
    for (let i in shopArr) {
      //遍历列表数据      
      if (i == Index) {
        //根据下标找到目标,改变状态  
        if (shopArr[i].status == 1) {
          shopArr[i].status = parseInt(shopArr[i].status) + 1
        }
      }
    }

    //数组重新赋值
    this.setData({
      objList: shopArr
    })
  },

  /**
   * 划店 主店切换--加载
   */
  selectShop2: function (e) {
    // 获取当前点击下标    
    var Index = e.currentTarget.dataset.index;

    // data中获取列表   
    var shopArr = this.data.objList;
    for (let i in shopArr) {
      //遍历列表数据      
      if (i == Index) {
        //根据下标找到目标,改变状态  
        if (shopArr[i].status == 2) {
          shopArr[i].status = parseInt(shopArr[i].status) - 1
        }
      }
    }

    //数组重新赋值
    this.setData({
      objList: shopArr
    })
  },

  /**
   * 提交页面
   */
  submitFunction: function (e) {
    var that = this;
    var objList = that.data;
    var obj = that.data.objList;
    var uid = wx.getStorageSync("user");
    var id = e.target.dataset.id;

    var arr = '';
    for (let i in obj) {
      let value = '';
      arr = arr + obj[i].shopVal + '//' + obj[i].dayVal + '//' + obj[i].status + ',';
    }
    // console.log(uid);

    if (objList.arrayValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请选择产品系列',
      })
    } else {
      wx.request({
        url: app.url + 'plan/updatePlan',
        data: {
          series: objList.arrayValue,
          valList: arr,
          userid: uid.userid,
          id:id
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({
              icon: 'none',
              title: '提交成功',
            })
            console.log(id)
            setTimeout(function () {
              that.addWeb(id);
            }, 1000)
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.addWeb(options.id);
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})