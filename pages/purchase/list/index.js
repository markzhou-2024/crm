import { fetchPurchases } from '../../../services/purchase';

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    list: [],
    loading: false
  },
  onLoad() {
    this.loadData();
  },
  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },
  loadData() {
    this.setData({ loading: true });
    return fetchPurchases()
      .then((res) => {
        const list = res.list || [];
        this.setData({ list });
      })
      .catch(() => {
        wx.showToast({ title: '获取购卡记录失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  goCreate() {
    wx.navigateTo({ url: '/pages/purchase/create/index' });
  },
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
