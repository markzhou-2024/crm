import { call } from '../utils/request';

export const fetchConsumes = (params) => call('consume_list', params);
export const createConsume = (payload) => call('consume_create', payload);
