Page({
  data:{ storeCount: 0, customerCount: 0 },
  onShow(){
    try {
      if (wx.cloud) {
        wx.cloud.callFunction({ name: 'usage-stats' }).then(res => {
          const d = (res && res.result) || {};
          this.setData({
            storeCount: d.storeCount || 0,
            customerCount: d.customerCount || 0
          });
        }).catch(()=>{});
      }
    } catch(e) {}
  }
})
