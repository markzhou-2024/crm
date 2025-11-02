import { fetchStores } from '../../../services/store';

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    keyword: '',
    loading: false,
    list: [],
    filtered: []
  },
  onLoad() {
    this.loadData();
  },
  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },
  loadData() {
    this.setData({ loading: true });
    return fetchStores()
      .then((res) => {
        const list = res.list || [];
        this.setData({ list });
        this.applyFilter(this.data.keyword, list);
      })
      .catch(() => {
        wx.showToast({ title: '获取门店数据失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  applyFilter(keyword, source) {
    const list = source || this.data.list;
    if (!keyword) {
      this.setData({ filtered: list });
      return;
    }
    const lower = keyword.toLowerCase();
    const filtered = list.filter((item) =>
      (item.name || '').toLowerCase().includes(lower) ||
      (item.manager || '').toLowerCase().includes(lower)
    );
    this.setData({ filtered });
  },
  onKeywordInput(event) {
    const keyword = event.detail.value.trim();
    this.setData({ keyword });
    this.applyFilter(keyword);
  },
  clearKeyword() {
    this.setData({ keyword: '' });
    this.applyFilter('');
  },
  goCreate() {
    wx.navigateTo({ url: '/pages/store/create/index' });
  },
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
