// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     car:[],
     imgshopUrl: "http://cangdu.org:8001/img/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var car = wx.getStorageSync('cartItems');
       this.setData({
         car:car
       })
       console.log(this.data.car)
    
  },
  onShow: function () {
    var car = wx.getStorageSync('cartItems');
      this.setData({
        car: car
      })
      console.log(this.data.car)
    
  },
   
})