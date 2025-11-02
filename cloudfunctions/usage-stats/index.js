const cloud = require('wx-server-sdk');
cloud.init();
exports.main = async (event, context) => {
  const db = cloud.database();
  const storeCount = await db.collection('stores').count();
  const customerCount = await db.collection('customers').count();
  return { storeCount: storeCount.total, customerCount: customerCount.total };
};
