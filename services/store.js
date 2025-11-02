import { call } from '../utils/request';

export const fetchStores = (params) => call('store_list', params);
export const createStore = (payload) => call('store_create', payload);
