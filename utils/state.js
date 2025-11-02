export function updateData(context, builder) {
  const updates = typeof builder === 'function' ? builder({ ...context.data }) : builder;
  if (!updates || typeof updates !== 'object') {
    return;
  }

  const payload = {};
  Object.keys(updates).forEach((key) => {
    const value = updates[key];
    if (value !== undefined) {
      payload[key] = value;
    }
  });

  if (Object.keys(payload).length > 0) {
    context.setData(payload);
  }
}
