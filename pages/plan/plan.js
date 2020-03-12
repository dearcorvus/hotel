// pages/plan/plan.js
const app=getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    info:[]
  },
  /**
   * 获取列表信息
  */
  planListFunction:function(e = 1){
    var that = this;
    var uid = wx.getStorageSync("user");
    // 暂存数据
    let ranklistBefore = that.data.info;

    wx.request({
      url: app.url +'plan/planList',
      data: {
        userid:uid.userid,
        page:e
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        if(res.data.code == 200){

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
            info: ranklistBefore.concat(eachData),
            loadText: "加载更多",
            loading: false,
            page: res.data.data.current_page
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 删除
   */
  updateFunction:function(e){
    var that = this;
    var uid = wx.getStorageSync("user");

    wx.request({
      url: app.url + 'plan/delPlan',
      data: {
        userid: uid.userid,
        id: e.target.dataset.value
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            icon: 'none',
            title: '删除成功',
          })

          that.setData({
            info:[]
          })

          setTimeout(function(){
            that.planListFunction();
          },1000)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.planListFunction();
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
    var that = this;
    var page = that.data.page;
    that.planListFunction(Number(page) +Number(1));
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})