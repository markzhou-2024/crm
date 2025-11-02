export class CloudFunctionError extends Error {
  constructor(message, { name, data, originalError }) {
    super(message);
    this.name = 'CloudFunctionError';
    this.cloudFunctionName = name;
    this.cloudFunctionPayload = data;
    this.originalError = originalError;
  }
}

export async function call(name, data = {}, loading = true) {
  if (loading) {
    wx.showLoading({ title: '加载中', mask: true });
  }

  try {
    const response = await wx.cloud.callFunction({ name, data });

    if (!response || typeof response.result === 'undefined') {
      throw new Error(`云函数 ${name} 未返回结果`);
    }

    return response.result;
  } catch (error) {
    const wrappedError = new CloudFunctionError(
      `云函数 ${name} 调用失败`,
      { name, data, originalError: error }
    );
    console.error(wrappedError);
    throw wrappedError;
  } finally {
    if (loading) {
      wx.hideLoading();
    }
  }
}
