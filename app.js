const ENV_ID = 'cloud1-4g0plfb09d677569';

App({
  globalData: {
    statusBarHeight: 20,
    navBarHeight: 64,
    menuButtonRect: null
  },
  onLaunch() {
    if (!wx.cloud) {
      console.error('需要 2.2.3 或以上的基础库');
    } else {
      wx.cloud.init({
        traceUser: true,
        env: ENV_ID
      });
    }

    try {
      const systemInfo = wx.getSystemInfoSync();
      const menuRect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      let navBarExtra = 44;
      if (menuRect && menuRect.top) {
        navBarExtra = menuRect.height + (menuRect.top - statusBarHeight) * 2;
      }
      this.globalData.statusBarHeight = statusBarHeight;
      this.globalData.navBarHeight = statusBarHeight + navBarExtra;
      this.globalData.menuButtonRect = menuRect;
    } catch (error) {
      console.warn('获取系统信息失败', error);
    }

    const token = wx.getStorageSync('token');
    wx.reLaunch({
      url: token ? '/pages/index/index' : '/pages/login/login'
    });
  }
});
