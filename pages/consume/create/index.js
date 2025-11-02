import { createConsume } from '../../../services/consume';
import { getStoreOptions, getCustomerOptions, getServiceOptions, getStaffOptions } from '../../../services/common';

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
    serviceOptions: [],
    serviceIndex: -1,
    staffOptions: [],
    staffIndex: -1,
    form: {
      storeId: '',
      storeName: '',
      customerId: '',
      customerName: '',
      serviceId: '',
      serviceName: '',
      staffId: '',
      staffName: '',
      times: 1,
      date: '',
      remark: ''
    }
  },
  onLoad() {
    this.initOptions();
  },
  initOptions() {
    getStoreOptions().then((storeOptions) => this.setData({ storeOptions: storeOptions || [] }));
    getCustomerOptions('').then((customerOptions) => this.setData({ customerOptions: customerOptions || [] }));
    getServiceOptions().then((serviceOptions) => this.setData({ serviceOptions: serviceOptions || [] }));
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
  onServiceChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.serviceOptions[index];
    if (!option) return;
    this.setData({
      serviceIndex: index,
      'form.serviceId': option.id,
      'form.serviceName': option.name
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
  onTimesChange(event) {
    this.setData({ 'form.times': Number(event.detail.value) || 1 });
  },
  onDateChange(event) {
    this.setData({ 'form.date': event.detail.value });
  },
  onRemarkInput(event) {
    this.setData({ 'form.remark': event.detail.value });
  },
  validate() {
    const { storeId, customerId, serviceId, times } = this.data.form;
    if (!storeId) {
      wx.showToast({ title: '请选择门店', icon: 'none' });
      return false;
    }
    if (!customerId) {
      wx.showToast({ title: '请选择顾客', icon: 'none' });
      return false;
    }
    if (!serviceId) {
      wx.showToast({ title: '请选择项目', icon: 'none' });
      return false;
    }
    if (!times || times <= 0) {
      wx.showToast({ title: '请输入正确的消耗次数', icon: 'none' });
      return false;
    }
    return true;
  },
  submit() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    this.setData({ submitting: true });
    createConsume(this.data.form)
      .then(() => {
        wx.showToast({ title: '登记成功', icon: 'success' });
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
