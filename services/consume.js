import { call, createRequestId } from '../utils/request';

export const fetchConsumes = (params) => call('consume_list', params);

export const createConsume = (body) => {
  const payload = {
    ...body,
    requestId: body && body.requestId ? body.requestId : createRequestId('consume'),
  };

  return call('consume_create', payload);
};
