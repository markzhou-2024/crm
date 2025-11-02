import { getHomeStats } from '../../services/common';

const app = getApp();

const ICONS = {
  store: "data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 24L30 12L48 24V48C48 49.1046 47.1046 50 46 50H14C12.8954 50 12 49.1046 12 48V24Z' stroke='%23ffffff' stroke-width='4' stroke-linejoin='round'/><path d='M22 34H38' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'/><path d='M22 42H38' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'/></svg>",
  customer: "data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M30 30C36.6274 30 42 24.6274 42 18C42 11.3726 36.6274 6 30 6C23.3726 6 18 11.3726 18 18C18 24.6274 23.3726 30 30 30Z' stroke='%23ffffff' stroke-width='4'/><path d='M12 54C13.9752 46.1865 21.2507 40 30.0001 40C38.7495 40 46.025 46.1865 48.0001 54' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'/></svg>",
  purchase: "data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 16H48L44 48H16L12 16Z' stroke='%23ffffff' stroke-width='4' stroke-linejoin='round'/><path d='M20 16L24 8H36L40 16' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  consume: "data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14 30C14 20.0589 22.0589 12 32 12C41.9411 12 50 20.0589 50 30C50 39.9411 41.9411 48 32 48' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'/><path d='M22 48L32 36L26 54L32 50' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>"
};

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    stats: null,
    loading: false,
    greeting: '',
    actions: [
      {
        key: 'store',
        title: '门店管理',
        desc: '门店档案 · 人员配置',
        icon: ICONS.store,
        gradient: 'linear-gradient(135deg, #f6d9b4 0%, #d8b980 100%)',
        url: '/pages/store/list/index'
      },
      {
        key: 'customer',
        title: '顾客管理',
        desc: '会员信息 · 维护提醒',
        icon: ICONS.customer,
        gradient: 'linear-gradient(135deg, #f6c9d4 0%, #d89bc4 100%)',
        url: '/pages/customer/list/index'
      },
      {
        key: 'purchase',
        title: '项目购卡',
        desc: '产品售卖 · 收款记录',
        icon: ICONS.purchase,
        gradient: 'linear-gradient(135deg, #cfe6ff 0%, #93bdf2 100%)',
        url: '/pages/purchase/list/index'
      },
      {
        key: 'consume',
        title: '项目消耗',
        desc: '服务核销 · 次数管理',
        icon: ICONS.consume,
        gradient: 'linear-gradient(135deg, #d8f5d0 0%, #8fd88f 100%)',
        url: '/pages/consume/list/index'
      }
    ],
    highlights: [
      {
        id: 'hl1',
        title: '今日预约提醒',
        subtitle: '共有 8 位顾客预约到店服务',
        icon: 'calendar'
      },
      {
        id: 'hl2',
        title: '续卡预警',
        subtitle: '5 位顾客余额不足 2 次，需要回访',
        icon: 'alert'
      }
    ]
  },
  onLoad() {
    this.updateGreeting();
    this.loadStats();
  },
  onShow() {
    this.updateGreeting();
  },
  onPullDownRefresh() {
    this.loadStats().finally(() => wx.stopPullDownRefresh());
  },
  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '您好';
    if (hour < 11) {
      greeting = '早上好';
    } else if (hour < 14) {
      greeting = '中午好';
    } else if (hour < 19) {
      greeting = '下午好';
    } else {
      greeting = '晚上好';
    }
    this.setData({ greeting });
  },
  loadStats() {
    this.setData({ loading: true });
    return getHomeStats()
      .then((stats) => {
        this.setData({ stats });
      })
      .catch(() => {
        wx.showToast({ title: '获取数据失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  handleActionTap(event) {
    const { url } = event.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    }
  }
});
