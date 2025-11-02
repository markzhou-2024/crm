import {call} from '../utils/request';export const fetchStores=p=>call('store_list',p);export const createStore=b=>call('store_create',b);
