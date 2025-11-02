const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight
  },
  onLogin() {
    wx.showLoading({ title: '登录中', mask: true });
    setTimeout(() => {
      wx.setStorageSync('token', 'beauty-crm-demo');
      wx.hideLoading();
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/index/index' });
      }, 400);
    }, 500);
  }
});
