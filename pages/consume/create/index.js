import { createConsume } from '../../../services/consume';
import { withRetry, createRequestId } from '../../../utils/request';

Page({
  data: {
    form: {
      customer_id: 'c1',
      service_id: 'sv1',
      staff_id: 'st1',
      store_id: 's1',
      times: 1,
      consume_at: '',
    },
    submitting: false,
    lastConsumeId: '',
  },

  async handleSubmit() {
    if (this.data.submitting) {
      return;
    }

    this.setData({ submitting: true });

    const payload = {
      ...this.data.form,
      requestId: createRequestId('consume'),
      consume_at: new Date().toISOString(),
    };

    try {
      const result = await withRetry(() => createConsume(payload), {
        retries: 2,
      });

      this.setData({ lastConsumeId: result.id });
      wx.showToast({ title: '提交成功' });
    } catch (error) {
      console.error('提交消费记录失败', error);
      wx.showToast({ title: '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
