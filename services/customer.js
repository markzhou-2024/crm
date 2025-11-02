import {call} from '../utils/request';export const fetchCustomers=p=>call('customer_list',p);export const createCustomer=b=>call('customer_create',b);
