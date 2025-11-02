import {call} from '../utils/request';export const fetchPurchases=p=>call('purchase_list',p);export const createPurchase=b=>call('purchase_create',b);
