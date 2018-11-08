import validator from 'validator';

const validate = (fields, rules) => {
  const validationResult = {};

  Object.keys(rules).forEach((item) => {
    const rule = rules[item].validator;
    const field = fields[item] || '';
    let isValid = validator[rule](field);
    if (rule === 'isEmpty') {
      isValid = !isValid;
    }

    if (!isValid) {
      validationResult[item] = rules[item].errorMessage;
    }
  });

  if (Object.keys(validationResult).length === 0) {
    return true;
  }

  return validationResult;
};

export default validate;
