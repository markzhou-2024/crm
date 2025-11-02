Page({onLogin(){wx.setStorageSync('token','t');wx.reLaunch({url:'/pages/index/index'});}})
