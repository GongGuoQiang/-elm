//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    shops: [
      {
        id: 1,
        img: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=186275978,3305460070&fm=27&gp=0.jpg',
        distance: 1.8,
        sales: 1475,
        logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_1.jpg',
        name: '杨国福麻辣烫(东四店)',
        desc: '满25减8；满35减10；满60减15（在线支付专享）'
      },
      {
        id: 2,
        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3430868778,3203121985&fm=200&gp=0.jpg',
        distance: 2.4,
        sales: 2039,
        logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_2.jpg',
        name: '忠友麻辣烫(东四店)',
        desc: '满25减8；满35减10；满60减15（在线支付专享）'
      },
      {
        id: 3,
        img: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2307000433,604982627&fm=27&gp=0.jpg',
        distance: 2.3,
        sales: 1000,
        logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_3.jpg',
        name: '粥面故事(东大桥店)',
        desc: '满25减8；满35减10；满60减15（在线支付专享）'
      },
      {
        id: 4,
        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4075461317,2031736952&fm=27&gp=0.jpg',
        distance: 3.4,
        sales: 400,
        logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_4.jpg',
        name: '兄鸡',
        desc: '满25减8；满35减10；满60减15（在线支付专享）'
      }
    ]
  }
})