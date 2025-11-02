App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('需要 2.2.3 或以上的基础库')
    } else {
      wx.cloud.init({ traceUser: true })
    }
    const token = wx.getStorageSync('token')
    wx.reLaunch({ url: token ? "/pages/index/index" : "/pages/login/login" })
  }
})
