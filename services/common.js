import { call } from '../utils/request';

export const getStoreOptions = () => call('store_options');
export const getCustomerOptions = (keyword = '') =>
  call('customer_options', { keyword });
export const getServiceOptions = () => call('service_options');
export const getStaffOptions = (storeId) =>
  call('staff_options', { storeId });
export const getProductOptions = () => call('product_options');
export const getPayMethods = () => call('payment_methods');
export const getHomeStats = () => call('home_stats');
