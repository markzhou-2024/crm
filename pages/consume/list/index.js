import { fetchConsumes } from '../../../services/consume';

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
    return fetchConsumes()
      .then((res) => {
        const list = res.list || [];
        this.setData({ list });
      })
      .catch(() => {
        wx.showToast({ title: '获取消耗记录失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  goCreate() {
    wx.navigateTo({ url: '/pages/consume/create/index' });
  },
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
