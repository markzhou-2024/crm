import { createCustomer } from '../../../services/customer';
import { getStoreOptions } from '../../../services/common';

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    submitting: false,
    storeOptions: [],
    storeIndex: -1,
    genderOptions: ['女士', '先生'],
    genderIndex: 0,
    sourceOptions: ['自然到店', '老客转介绍', '线上推广'],
    sourceIndex: 0,
    form: {
      name: '',
      phone: '',
      gender: '女士',
      storeId: '',
      storeName: '',
      birthday: '',
      source: '自然到店',
      remark: ''
    }
  },
  onLoad() {
    this.loadStoreOptions();
  },
  loadStoreOptions() {
    getStoreOptions()
      .then((options) => {
        const storeOptions = options || [];
        this.setData({ storeOptions });
      })
      .catch(() => {
        wx.showToast({ title: '门店列表获取失败', icon: 'none' });
      });
  },
  onNameInput(event) {
    this.setData({ 'form.name': event.detail.value });
  },
  onPhoneInput(event) {
    this.setData({ 'form.phone': event.detail.value });
  },
  onRemarkInput(event) {
    this.setData({ 'form.remark': event.detail.value });
  },
  onStoreChange(event) {
    const index = Number(event.detail.value);
    const option = this.data.storeOptions[index];
    if (!option) return;
    this.setData({
      storeIndex: index,
      'form.storeId': option.id,
      'form.storeName': option.name
    });
  },
  onGenderChange(event) {
    const index = Number(event.detail.value);
    const gender = this.data.genderOptions[index];
    this.setData({ genderIndex: index, 'form.gender': gender });
  },
  onSourceChange(event) {
    const index = Number(event.detail.value);
    const source = this.data.sourceOptions[index];
    this.setData({ sourceIndex: index, 'form.source': source });
  },
  onBirthdayChange(event) {
    this.setData({ 'form.birthday': event.detail.value });
  },
  validate() {
    const { name, phone, storeId } = this.data.form;
    if (!name) {
      wx.showToast({ title: '请输入顾客姓名', icon: 'none' });
      return false;
    }
    if (!/^\d{7,}$/.test(phone)) {
      wx.showToast({ title: '请输入有效手机号', icon: 'none' });
      return false;
    }
    if (!storeId) {
      wx.showToast({ title: '请选择归属门店', icon: 'none' });
      return false;
    }
    return true;
  },
  submit() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    this.setData({ submitting: true });
    createCustomer(this.data.form)
      .then(() => {
        wx.showToast({ title: '创建成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 600);
      })
      .catch(() => {
        wx.showToast({ title: '创建失败，请稍后再试', icon: 'none' });
      })
      .finally(() => {
        this.setData({ submitting: false });
      });
  },
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
