const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const COLLECTION_CONSUMES = 'consumes';
const COLLECTION_REQUESTS = 'consume_requests';

exports.main = async (event = {}) => {
  const { requestId } = event;
  if (!requestId) {
    throw new Error('requestId is required');
  }

  const db = cloud.database();
  const transaction = await db.startTransaction();
  let committed = false;

  try {
    const requestCollection = transaction.collection(COLLECTION_REQUESTS);
    const consumesCollection = transaction.collection(COLLECTION_CONSUMES);

    const existingRequest = await getExistingRequest(requestCollection, requestId);
    if (existingRequest && existingRequest.result) {
      await transaction.commit();
      committed = true;
      return existingRequest.result;
    }

    const { requestId: _omit, ...payload } = event;
    const now = new Date();
    const consumeData = {
      ...payload,
      request_id: requestId,
      created_at: now,
      updated_at: now,
    };

    const createResult = await consumesCollection.add({ data: consumeData });
    const result = { id: createResult._id };

    await requestCollection.doc(requestId).set({
      data: {
        requestId,
        result,
        createdAt: now,
      },
    });

    await transaction.commit();
    committed = true;

    return result;
  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed', rollbackError);
      }
    }
    throw error;
  }
};

async function getExistingRequest(requestCollection, requestId) {
  try {
    const { data } = await requestCollection.doc(requestId).get();
    return data;
  } catch (error) {
    if (isDocumentNotFound(error)) {
      return null;
    }
    throw error;
  }
}

function isDocumentNotFound(error) {
  const code = error && (error.errCode || error.code);
  if (code === 'DOCUMENT_NOT_FOUND' || code === 101) {
    return true;
  }

  const message = (error && error.errMsg) || '';
  return message.includes('document.get:fail') || message.includes('not found');
}
