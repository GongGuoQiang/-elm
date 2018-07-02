// pages/shop/shop.js
var app = getApp();
// var server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   shoplist:[],
   imgshopUrl: "http://cangdu.org:8001/img/",
   imgscore:"https://fuss10.elemecdn.com/",
   jpg:'.jpeg',
   filterId: 1,
   shop:[],
   goods:[],
   ison:2,
   toView: '1',
   rednum:0,
   cars:[],
   showcar:true,
   showcarbox:false,
   sunPrice:0,
   showjian:false,
   scorelist:'',
   scoretags:'',
   score:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var shopId=options.id;
     this.shoplist(shopId);
     this.shop();
     this.goods();
     this.scorelist();
     this.scoretags();
     this.score();
     var cartItems = wx.getStorageSync('cartItems') || []
     var sumNum=0;
     var sunPrice=0;
     for (var h = 0; h < cartItems.length; h++) {
       sumNum += parseInt(cartItems[h].quantity);
       sunPrice += parseInt((cartItems[h].price) * (cartItems[h].quantity))
     }
     this.setData({
       rednum: sumNum,
       sunPrice : sunPrice
     })
     if (cartItems.length > 0) {
       this.setData({
         showcar: false,
         cars: cartItems
       })
     } else {
       this.setData({
         showcar: true
       })
     }    
  },
  shoplist: function (shopId){
    var self=this;
    wx.request({
      url: 'http://cangdu.org:8001/shopping/restaurant/' + shopId, //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data;
        self.setData({
          shoplist: data
        })
      }
    })
  },
  shop: function () {
    var self = this;
    wx.request({
      url: 'http://cangdu.org:8001/shopping/v2/menu?restaurant_id=1', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data;
        self.setData({
          shop: data
        })
      }
    })
  },
  goods: function () {
    var self = this;
    wx.request({
      url: 'http://cangdu.org:8001/shopping/v2/menu?restaurant_id=1', //食物详情
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          for (var k = 0; k < data[i].foods.length; k++) {
            var isadd = true;                          //判断该商品是否在购物车
            for (var h = 0; h < self.data.cars.length; h++) {
              if (data[i].foods[k].name == self.data.cars[h].title) {
                data[i].foods[k].mynum = self.data.cars[h].quantity
                isadd = false;
              }
            }
             if (isadd) {
               data[i].foods[k].mynum = 0;
             }
          }
        }
        self.setData({
          goods: data
        })
      }
    })
  },
  tablist:function(e){
    var self = this;
    self.setData({
      filterId: e.target.dataset.id
    });
  },
  ison: function(e){
    var self=this;
    var index = e.currentTarget.dataset.index;
     self.setData({
       ison:index,
       toView:index
     });
  },
  onGoodsScroll:function(e){
    console.log(e)
  },
  //添加购物车事件方法
  toCart: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var current = e.currentTarget.dataset.food;
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    self.setData({
      showcar: false,
      rednum: self.data.rednum + 1
    })
      self.setData({
        cars: cartItems
      })
    //判断购物车缓存中是否已存在该货品
    var exist = cartItems.find(function (ele) {
      return ele.title === current.name
    })
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity = parseInt(exist.quantity) + 1;
      self.setData({
        cars: cartItems,
      })
    } else {
      //如果不存在，传入该货品信息
      cartItems.push({
        id: current._id,
        quantity: 1,
        price: current.specfoods[0].price,
        title: current.name,
        goodsPicsInfo: current.description,
        imgpath: current.image_path
      })
      self.setData({
        cars: cartItems,
      })
    }
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        //添加购物车的消息提示框
        
      }
    })

    for (var i = 0; i < self.data.goods.length; i++) {
      for (var k = 0; k < self.data.goods[i].foods.length; k++) {
        var isadd = true;                          //判断该商品是否在购物车
        for (var h = 0; h < self.data.cars.length; h++) {
          if (self.data.goods[i].foods[k].name == self.data.cars[h].title) {
            self.data.goods[i].foods[k].mynum = self.data.cars[h].quantity
            isadd = false;
          }
        }
        if (isadd) {
          self.data.goods[i].foods[k].mynum = 0;
        }
      }
    }
    var sumNum = 0;
    var sunPrice = 0;
    for (var h = 0; h < cartItems.length; h++) {
      sumNum += parseInt(cartItems[h].quantity);
      sunPrice += parseInt((cartItems[h].price) * (cartItems[h].quantity))
    }
    self.setData({
      rednum: sumNum,
      sunPrice: sunPrice,
      goods: self.data.goods
    })
  }, 
  showcar:function() {
     var self = this;
     if (self.data.showcarbox){
       self.setData({
         showcarbox: false
     })
     }else{
       self.setData({
         showcarbox: true
       })
     }
     
  },
  addcar:function(e){
    var self = this;
    var current = e.currentTarget.dataset.food;
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    self.setData({
      showcar: false,
      rednum: self.data.rednum + 1
    })
    //判断购物车缓存中是否已存在该货品
    var exist = cartItems.find(function (ele) {
      return ele.title === current
    })
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity = parseInt(exist.quantity) + 1;
      self.setData({
        cars: cartItems,
      })
    }
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        //添加购物车的消息提示框

      }
    })

    for (var i = 0; i < self.data.goods.length; i++) {
      for (var k = 0; k < self.data.goods[i].foods.length; k++) {
        var isadd = true;                          //判断该商品是否在购物车
        for (var h = 0; h < self.data.cars.length; h++) {
          if (self.data.goods[i].foods[k].name == self.data.cars[h].title) {
            self.data.goods[i].foods[k].mynum = self.data.cars[h].quantity
            isadd = false;
          }
        }
        if (isadd) {
          self.data.goods[i].foods[k].mynum = 0;
        }
      }
    }
    var sumNum = 0;
    var sunPrice = 0;
    for (var h = 0; h < cartItems.length; h++) {
      sumNum += parseInt(cartItems[h].quantity);
      sunPrice += parseInt((cartItems[h].price) * (cartItems[h].quantity))
    }
    self.setData({
      rednum: sumNum,
      sunPrice: sunPrice,
      goods: self.data.goods
    })
  },
  remove:function(){
    var self=this;
    wx.setStorageSync('cartItems', []);
    for (var i = 0; i < self.data.goods.length; i++) {
      for (var k = 0; k < self.data.goods[i].foods.length; k++) {
        for (var h = 0; h < self.data.cars.length; h++) {
          self.data.goods[i].foods[k].mynum = 0
        }
      }
    }
    self.setData({
      cars:[],
      rednum:0,
      showcar:true,
      showjian:false,
      goods: self.data.goods,
      showcarbox:false
    })
  },
  reduce:function (e) {
    var self = this;
    var current = e.currentTarget.dataset.food;
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    self.setData({
      rednum: self.data.rednum -1
    })
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].title == current.name) {
        cartItems[i].quantity == 1 ? cartItems.splice(i, 1) : (cartItems[i].quantity = cartItems[i].quantity - 1);
        break;
      }
    }
    self.setData({
      cars: cartItems
    })
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        //添加购物车的消息提示框

      }
    })

    for (var i = 0; i < self.data.goods.length; i++) {
      for (var k = 0; k < self.data.goods[i].foods.length; k++) {
        var isadd = true;                          //判断该商品是否在购物车
        for (var h = 0; h < self.data.cars.length; h++) {
          if (self.data.goods[i].foods[k].name == self.data.cars[h].title) {
            self.data.goods[i].foods[k].mynum = self.data.cars[h].quantity
            isadd = false;
          }
        }
        if (isadd) {
          self.data.goods[i].foods[k].mynum = 0;
        }
      }
    }
    var sumNum = 0;
    var sunPrice = 0;
    for (var h = 0; h < cartItems.length; h++) {
      sumNum += parseInt(cartItems[h].quantity);
      sunPrice += parseInt((cartItems[h].price) * (cartItems[h].quantity))
    }
    self.setData({
      rednum: sumNum,
      sunPrice: sunPrice,
      goods: self.data.goods
    })
    if (cartItems.length == 0) {
      self.setData({
        showcar: true
      })
    }
  },
  showcar: function () {
    var self = this;
    if (self.data.showcarbox) {
      self.setData({
        showcarbox: false
      })
    } else {
      self.setData({
        showcarbox: true
      })
    }
  },
  reducecar:function (e){
    var self = this;
    var current = e.currentTarget.dataset.food;
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    self.setData({
      showcar: false,
      rednum: self.data.rednum + 1
    })
    //判断购物车缓存中是否已存在该货品
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].title == current) {
        cartItems[i].quantity == 1 ? cartItems.splice(i, 1) : (cartItems[i].quantity = cartItems[i].quantity - 1);
        break;
      }
    }
    self.setData({
      cars: cartItems
    })
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        //添加购物车的消息提示框

      }
    })

    for (var i = 0; i < self.data.goods.length; i++) {
      for (var k = 0; k < self.data.goods[i].foods.length; k++) {
        var isadd = true;                          //判断该商品是否在购物车
        for (var h = 0; h < self.data.cars.length; h++) {
          if (self.data.goods[i].foods[k].name == self.data.cars[h].title) {
            self.data.goods[i].foods[k].mynum = self.data.cars[h].quantity
            isadd = false;
          }
        }
        if (isadd) {
          self.data.goods[i].foods[k].mynum = 0;
        }
      }
    }
    var sumNum = 0;
    var sunPrice = 0;
    for (var h = 0; h < cartItems.length; h++) {
      sumNum += parseInt(cartItems[h].quantity);
      sunPrice += parseInt((cartItems[h].price) * (cartItems[h].quantity))
    }
    self.setData({
      rednum: sumNum,
      sunPrice: sunPrice,
      goods: self.data.goods
    })
  },
   scorelist:function (){
     var self = this;
     wx.request({
       url: 'http://cangdu.org:8001/ugc/v2/restaurants/1/ratings/scores', //仅为示例，并非真实的接口地址
       data: {
         x: '',
         y: ''
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       success: function (res) {
         var data = res.data;
         self.setData({
           scorelist: data
         })
       }
     })
   },
   scoretags:function (){
     var self = this;
     wx.request({
       url: 'http://cangdu.org:8001/ugc/v2/restaurants/1/ratings/tags', //仅为示例，并非真实的接口地址
       data: {
         x: '',
         y: ''
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       success: function (res) {
         var data = res.data;
         self.setData({
           scoretags: data
         })
         console.log(self.data.scoretags)
       }
     })
   },
   score: function () {
     var self = this;
     wx.request({
       url: 'http://cangdu.org:8001/ugc/v2/restaurants/1/ratings?offset=0&limit=10', //仅为示例，并非真实的接口地址
       data: {
         x: '',
         y: ''
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       success: function (res) {
         var data = res.data;
         self.setData({
           score: data
         })
         console.log(self.data.score)
       }
     })
   }   
  
})