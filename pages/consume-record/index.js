import { fetchConsumes } from '../../services/consume';

const PAGE_SIZE = 10;
const SKELETON_COUNT = 3;
const AMOUNT_FIELDS = ['amount', 'totalAmount', 'paymentAmount', 'price'];
const TIME_FIELDS = ['date', 'consumeTime', 'createdAt'];

function normalizeRecord(record = {}) {
  const normalized = { ...record };

  let amountValue;
  for (const field of AMOUNT_FIELDS) {
    if (record[field] !== undefined && record[field] !== null && record[field] !== '') {
      amountValue = record[field];
      break;
    }
  }

  if (amountValue !== undefined) {
    let formatted = amountValue;

    if (typeof formatted === 'number') {
      formatted = formatted.toFixed(2);
    } else {
      formatted = String(formatted).trim().replace(/￥/g, '');
      if (!Number.isNaN(Number(formatted))) {
        formatted = Number(formatted).toFixed(2);
      }
    }

    const isNegative = String(formatted).startsWith('-');
    const amountText = isNegative ? String(formatted).slice(1) : String(formatted);
    normalized.displayAmount = `-￥${amountText}`;
  } else {
    normalized.displayAmount = '--';
  }

  normalized.displayTime = '--';
  for (const field of TIME_FIELDS) {
    if (record[field]) {
      normalized.displayTime = record[field];
      break;
    }
  }

  return normalized;
}

Page({
  data: {
    records: [],
    loading: false,
    nextCursor: null,
    hasMore: true,
    skeletons: Array.from({ length: SKELETON_COUNT }, (_, index) => index)
  },

  onLoad() {
    this.loadRecords({ reset: true });
  },

  onReachBottom() {
    if (this.data.loading || !this.data.hasMore) {
      return;
    }
    this.loadRecords();
  },

  onPullDownRefresh() {
    this.loadRecords({ reset: true });
  },

  loadRecords({ reset = false } = {}) {
    if (this.data.loading) {
      return Promise.resolve();
    }

    const previousRecords = reset ? [] : this.data.records;

    if (reset) {
      this.setData({
        records: [],
        nextCursor: null,
        hasMore: true
      });
    }

    this.setData({ loading: true });

    const params = { limit: PAGE_SIZE };
    const { nextCursor } = this.data;

    if (!reset && nextCursor !== null && nextCursor !== undefined) {
      params.cursor = nextCursor;
    }

    return fetchConsumes(params)
      .then((res = {}) => {
        const list = res.list || [];
        const normalizedList = list.map(normalizeRecord);
        const cursor = res.nextCursor ?? null;
        const records = reset ? normalizedList : previousRecords.concat(normalizedList);
        const hasExplicitCursor = cursor !== null && cursor !== undefined && cursor !== '';
        const hasMore =
          typeof res.hasMore === 'boolean'
            ? res.hasMore
            : hasExplicitCursor || list.length === PAGE_SIZE;

        this.setData({
          records,
          nextCursor: cursor,
          hasMore
        });
      })
      .catch((error) => {
        wx.showToast({
          icon: 'none',
          title: error?.message || '加载失败'
        });
      })
      .finally(() => {
        this.setData({ loading: false });
        if (typeof wx.stopPullDownRefresh === 'function') {
          wx.stopPullDownRefresh();
        }
      });
  }
});
