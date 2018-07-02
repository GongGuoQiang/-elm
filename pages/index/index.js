//index.js
var zhuan_dingwei = require('../../lib/dingwei.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    filterId:1,
    address:"定位中...",
    longitude:'',
    imgshopUrl: "http://cangdu.org:8001/img/",
    latitude:'',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    banners:[
        {
            id: 3,
            img: 'http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com/creative/vcg/veer/800water/veer-141893340.jpg',
            url: '',
            name: '百亿巨惠任你抢'
        },
        {
            id: 1,
            img: 'http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com/creative/vcg/veer/800water/veer-140673364.jpg',
            url: '',
            name: '告别午高峰'
        },
        {
            id: 2,
            img: 'http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com/creative/vcg/veer/800water/veer-137956132.jpg',
            url: '',
            name: '金牌好店'
        }
    ],
    icons:[
            [
            {
                id:1,
                img:"../../imgs/index/icon_1.jpg",
                name:"美食",
            },
            {
                id: 2,
                img: '../../imgs/index/icon_2.jpg',
                name: '超市',
                url: ''
            },
            {
                id: 3,
                img: '../../imgs/index/icon_3.jpg',
                name: '鲜果购',
                url: ''
            },
            {
                id: 4,
                img: '../../imgs/index/icon_4.jpg',
                name: '下午茶',
                url: ''
            },
            {
                id: 5,
                img: '../../imgs/index/icon_5.jpg',
                name: '正餐优选',
                url: ''
            },
            {
                id: 6,
                img: '../../imgs/index/icon_6.jpg',
                name: '外卖专送',
                url: ''
            },
            {
                id: 7,
                img: '../../imgs/index/icon_7.jpg',
                name: '饮品站',
                url: ''
            },
            {
                id: 8,
                img: '../../imgs/index/icon_8.jpg',
                name: '小吃馆',
                url: ''
            }
        ],
        [
            {
                id: 9,
                img: '/imgs/index/icon_9.jpg',
                name: '新商家',
                url: ''
            },
            {
                id: 10,
                img: '/imgs/index/icon_10.jpg',
                name: '免配送费',
                url: ''
            },
            {
                id: 11,
                img: '/imgs/index/icon_11.jpg',
                name: '鲜花蛋糕',
                url: ''
            },
            {
                id: 12,
                img: '/imgs/index/icon_12.jpg',
                name: '名气餐厅',
                url: ''
            },
            {
                id: 13,
                img: '/imgs/index/icon_13.jpg',
                name: '异国料理',
                url: ''
            },
            {
                id: 14,
                img: '/imgs/index/icon_14.jpg',
                name: '家常菜',
                url: ''
            },
            {
                id: 15,
                img: '/imgs/index/icon_15.jpg',
                name: '能量西餐',
                url: ''
            },
            {
                id: 16,
                img: '/imgs/index/icon_16.jpg',
                name: '无辣不欢',
                url: ''
            }
        ]
    ]
  },
  getlocal_dingweui:function(e){
   var that=this;
   wx.getLocation({
     type: 'gcj02',
     success: function (res) {
       that.setData({
         longitude : res.longitude,
        latitude : res.latitude
       })
       //进行地理位置坐标的转化
       var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
       that.setData({
         longitude: gcj02tobd09[0],
         latitude: gcj02tobd09[1]
       })
       that.get_baidu_dingwei()
     }
   })
 },
 onLoad: function () {
      this.getlocal_dingweui();
        var self = this;
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
            var data = res.data;
            console.log(data)
            self.setData({
              shops: data
            })
          }
        })
        // console.log(.data.shops)
     },
     get_baidu_dingwei:function(){
       var that = this;
      //通过后台进行转化当前地理位置的详细情况
       wx.request({
         url: 'https://baoxian.grwlkj.com/home/index/get_user_city',
         method: 'get',
         data: {
           longitude: that.data.longitude,
           latitude: that.data.latitude
         },
         success(res) {
           var info = res.data;
           if (info.status==1){
             that.setData({
               address: info.data.street_number,
             })
           }
         }
       })
     },
     location: function () {
       var self = this;
       // 地图选择
       wx.chooseLocation({
         success: function (res) {
           //  console.log(res, "location")
           //  console.log(res.name)
           //  console.log(res.latitude)
           //  console.log(res.longitude)
           self.setData({
             address: res.name
           })
         },
         fail: function () {
           // fail
           wx.showToast({
             title: '定位失败',
             icon: 'fail',
             duration: 2000
           })
         },
         complete: function () {
           // complete
         }
       })
     },
     scroll:function(e){
       if (e.detail.scrollTop > 100 && !this.data.scrollDown){
         this.setData({
           scrollDown: true
         });
       } else if (e.detail.scrollTop < 100 && this.data.scrollDown){
         this.setData({
           scrollDown: false
         });
       }
     },
     tapFilter:function(e){
       var self=this;
       self.setData({
         filterId: e.target.dataset.id
       });
       console.log(self.data.filterId)
       if (e.target.dataset.id==1){
          self.data.shops.sort(function(a,b){
          return a.id-b.id
         })
          self.setData({
            shops: self.data.shops
          });
          console.log(self.data.shops)
       } else if (e.target.dataset.id == 2) {
         self.data.shops.sort(function (a, b) {
           return b.recent_order_num - a.recent_order_num
         })
         self.setData({
           shops: self.data.shops
         });
         console.log(self.data.shops)
       } else if (e.target.dataset.id == 3) {
         self.data.shops.sort(function (a, b) {
           var as = a.distance;
           var bs = b.distance;
           return as.substring(0, as.length - 2) - bs.substring(0, bs.length - 2)
         })
         self.setData({
           shops: self.data.shops
         });
         console.log(self.data.shops)
       }
     },
     tapSearch:function(){
       wx.navigateTo({
         url: '../search/search',
       })
     },

})
