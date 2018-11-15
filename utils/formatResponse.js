const onSuccess = data => ({ success: true, error: null, data });
const onFail = error => ({ success: false, error, data: null });

module.exports = { onSuccess, onFail };