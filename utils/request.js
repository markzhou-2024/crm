export function call(name, data = {}, loading = true) {
  if (loading) {
    wx.showLoading({ title: '加载中', mask: true });
  }

  return wx.cloud
    .callFunction({ name, data })
    .then((res) => res.result)
    .finally(() => {
      if (loading) {
        wx.hideLoading();
      }
    });
}

export function createRequestId(prefix = 'req') {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}

export async function withRetry(task, options = {}) {
  const { retries = 3, delay = 500, shouldRetry } = options;
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      return await task({ attempt });
    } catch (error) {
      lastError = error;
      const retryable =
        typeof shouldRetry === 'function'
          ? shouldRetry(error, attempt)
          : isNetworkError(error);

      if (attempt === retries || !retryable) {
        throw error;
      }

      await wait(delay * (attempt + 1));
      attempt += 1;
    }
  }

  throw lastError;
}

function isNetworkError(error) {
  if (!error) {
    return false;
  }

  const message = (error.errMsg || error.message || '').toLowerCase();
  return (
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('fail')
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
