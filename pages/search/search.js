// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    inputValue:'',
    imgshopUrl: "http://cangdu.org:8001/img/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  doSearch: function () {
    var self = this;
    console.log("input", self.data.inputValue)
    if (self.data.inputValue) {
      wx.request({
        url: 'http://cangdu.org:8001/shopping/restaurants?latitude=31.22967&longitude=121.4762', //仅为示例，并非真实的接口地址
        data: {
          x: '',
          y: ''
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var shoplist = res.data;
          var arr=[];
          shoplist.filter(function (item) {
            if (item.name.indexOf(self.data.inputValue) >= 0) {
              arr.unshift(item);
            }
          })
          self.setData({
            list: arr
          })
          console.log("1",self.data.list)
        }
      })
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    console.log(e)
  },
})