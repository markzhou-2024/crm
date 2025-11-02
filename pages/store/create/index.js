import { createStore } from '../../../services/store';

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    submitting: false,
    form: {
      name: '',
      manager: '',
      phone: '',
      address: '',
      remark: ''
    }
  },
  onNameInput(event) {
    this.setData({ 'form.name': event.detail.value });
  },
  onManagerInput(event) {
    this.setData({ 'form.manager': event.detail.value });
  },
  onPhoneInput(event) {
    this.setData({ 'form.phone': event.detail.value });
  },
  onAddressInput(event) {
    this.setData({ 'form.address': event.detail.value });
  },
  onRemarkInput(event) {
    this.setData({ 'form.remark': event.detail.value });
  },
  validate() {
    const { name, manager, phone, address } = this.data.form;
    if (!name) {
      wx.showToast({ title: '请输入门店名称', icon: 'none' });
      return false;
    }
    if (!manager) {
      wx.showToast({ title: '请输入店长姓名', icon: 'none' });
      return false;
    }
    if (!/^\d{7,}$/.test(phone)) {
      wx.showToast({ title: '请输入有效电话', icon: 'none' });
      return false;
    }
    if (!address) {
      wx.showToast({ title: '请输入门店地址', icon: 'none' });
      return false;
    }
    return true;
  },
  submit() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    this.setData({ submitting: true });
    createStore(this.data.form)
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
