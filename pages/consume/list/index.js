import { fetchConsumes } from '../../../services/consume';
import { updateData } from '../../../utils/state';

const INITIAL_PAGE = 1;

Page({
  data: {
    list: [],
    total: 0,
    page: INITIAL_PAGE,
    pageSize: 20,
    loading: false,
    finished: false,
    refreshing: false,
    error: ''
  },

  onLoad() {
    this.loadConsumes(true);
  },

  onPullDownRefresh() {
    this.loadConsumes(true);
  },

  onReachBottom() {
    if (!this.data.loading && !this.data.finished) {
      this.loadConsumes(false);
    }
  },

  async loadConsumes(refresh = false) {
    if (this.data.loading) {
      return;
    }

    const targetPage = refresh ? INITIAL_PAGE : this.data.page;

    updateData(this, () => ({
      loading: true,
      error: '',
      ...(refresh
        ? {
            refreshing: true,
            finished: false,
            page: INITIAL_PAGE
          }
        : {})
    }));

    try {
      const { list = [], total = 0 } = await fetchConsumes({
        page: targetPage,
        pageSize: this.data.pageSize
      });

      updateData(this, (data) => {
        const baseList = refresh ? [] : data.list;
        const mergedList = baseList.concat(list);
        const hasMore = mergedList.length < total && list.length === data.pageSize;

        return {
          list: mergedList,
          total,
          page: targetPage + 1,
          loading: false,
          refreshing: false,
          finished: !hasMore
        };
      });
    } catch (error) {
      updateData(this, () => ({
        loading: false,
        refreshing: false,
        error: error?.message || '加载失败'
      }));
    } finally {
      if (refresh) {
        wx.stopPullDownRefresh();
      }
    }
  }
});
