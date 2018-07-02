// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var data= res;
              that.setData({
                user: data.userInfo,
                show:false
              })
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },
  onGotUserInfo: function (e) {
    this.setData({
      user: e.detail.userInfo,
      show:false
    })
    console.log(this.data.user)
  },
})