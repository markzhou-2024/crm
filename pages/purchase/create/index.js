import { createPurchase } from '../../../services/purchase';
import { getStoreOptions, getCustomerOptions, getProductOptions, getPayMethods, getStaffOptions } from '../../../services/common';

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    submitting: false,
    storeOptions: [],
    storeIndex: -1,
    customerOptions: [],
    customerIndex: -1,
    productOptions: [],
    productIndex: -1,
    payMethodOptions: [],
    payMethodIndex: -1,
    staffOptions: [],
    staffIndex: -1,
    form: {
      storeId: '',
      storeName: '',
      customerId: '',
      customerName: '',
      productId: '',
      productName: '',
      staffId: '',
      staffName: '',
      payMethod: '',
      amountPaid: '',
      remark: ''
    }
  },
  onLoad() {
    this.initOptions();
  },
  initOptions() {
    getStoreOptions().then((storeOptions) => this.setData({ storeOptions: storeOptions || [] }));
    getCustomerOptions('').then((customerOptions) => this.setData({ customerOptions: customerOptions || [] }));
    getProductOptions().then((productOptions) => this.setData({ productOptions: productOptions || [] }));
    getPayMethods().then((payMethodOptions) => this.setData({ payMethodOptions: payMethodOptions || [] }));
  },
  onStoreChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.storeOptions[index];
    if (!option) return;
    this.setData({
      storeIndex: index,
      'form.storeId': option.id,
      'form.storeName': option.name,
      staffOptions: [],
      staffIndex: -1,
      'form.staffId': '',
      'form.staffName': ''
    });
    getStaffOptions(option.id).then((staffOptions) => this.setData({ staffOptions: staffOptions || [] }));
  },
  onCustomerChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.customerOptions[index];
    if (!option) return;
    this.setData({
      customerIndex: index,
      'form.customerId': option.id,
      'form.customerName': option.name
    });
  },
  onProductChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.productOptions[index];
    if (!option) return;
    this.setData({
      productIndex: index,
      'form.productId': option.id,
      'form.productName': option.name
    });
  },
  onStaffChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.staffOptions[index];
    if (!option) return;
    this.setData({
      staffIndex: index,
      'form.staffId': option.id,
      'form.staffName': option.name
    });
  },
  onPayMethodChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.payMethodOptions[index];
    if (!option) return;
    this.setData({
      payMethodIndex: index,
      'form.payMethod': option.code
    });
  },
  onAmountInput(event) {
    this.setData({ 'form.amountPaid': event.detail.value });
  },
  onRemarkInput(event) {
    this.setData({ 'form.remark': event.detail.value });
  },
  validate() {
    const { storeId, customerId, productId, payMethod, amountPaid } = this.data.form;
    if (!storeId) {
      wx.showToast({ title: '请选择门店', icon: 'none' });
      return false;
    }
    if (!customerId) {
      wx.showToast({ title: '请选择顾客', icon: 'none' });
      return false;
    }
    if (!productId) {
      wx.showToast({ title: '请选择项目/产品', icon: 'none' });
      return false;
    }
    if (!amountPaid) {
      wx.showToast({ title: '请输入实收金额', icon: 'none' });
      return false;
    }
    if (!payMethod) {
      wx.showToast({ title: '请选择收款方式', icon: 'none' });
      return false;
    }
    return true;
  },
  submit() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    this.setData({ submitting: true });
    createPurchase(this.data.form)
      .then(() => {
        wx.showToast({ title: '录入成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 600);
      })
      .catch(() => {
        wx.showToast({ title: '提交失败，请稍后再试', icon: 'none' });
      })
      .finally(() => {
        this.setData({ submitting: false });
      });
  },
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
