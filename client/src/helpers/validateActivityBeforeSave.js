export default activity => {
  let isValid = true;
  let error = '';

  const shouldValidateAmount = ['pump', 'bottle', 'babyfood'].includes(activity.name);
  const shouldValidateType = ['bottle', 'babyfood', 'diaper'].includes(activity.name);
  const shouldValidateHeight = ['growth'].includes(activity.name);
  const shouldValidateWeight = ['growth'].includes(activity.name);
  const shouldValidateHead = ['growth'].includes(activity.name);

  if (shouldValidateAmount && !activity.amount) {
    return { isValid: false, error: 'error_NoAmount' };
  } else if (shouldValidateType && !activity.type) {
    return { isValid: false, error: `error_NoType_${activity.name}` };
  } else if (shouldValidateHeight && !activity.height) {
    return { isValid: false, error: 'error_NoHeight' };
  } else if (shouldValidateWeight && !activity.weight) {
    return { isValid: false, error: 'error_NoWeight' };
  } else if (shouldValidateHead && !activity.head) {
    return { isValid: false, error: 'error_NoHead' };
  }

  return { isValid, error };
}