import { call } from '../utils/request';

export const fetchCustomers = (params) => call('customer_list', params);
export const createCustomer = (payload) => call('customer_create', payload);
