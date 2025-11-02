import {call} from '../utils/request';export const fetchConsumes=p=>call('consume_list',p);export const createConsume=b=>call('consume_create',b);
