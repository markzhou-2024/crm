import { call } from '../utils/request';

export const fetchPurchases = (params) => call('purchase_list', params);
export const createPurchase = (payload) => call('purchase_create', payload);
