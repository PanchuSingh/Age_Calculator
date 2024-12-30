// const form = document.getElementById('form');
const [inputDay, inputMonth, inputYear] = ['day', 'month', 'year'].map(id => document.getElementById(id));
const [outputDays, outputMonths, outputYears] = ['days', 'months', 'years'].map(id => document.getElementById(id));
const TODAY = new Date();

const errorMessages = {
  required: 'This field is required',
  invalid: (str) => `Must be a valid ${str}`,
  range: 'Must be in the past',
};

inputYear.setAttribute('max', TODAY.getFullYear());

const validateField = (input, validityChecks, message) => {
  input.setCustomValidity('');
  for (const check of validityChecks) if (check.condition) return input.setCustomValidity(message(check.type));
  input.nextElementSibling.textContent = input.validationMessage;
};

const validateForm = (e) => {
  e.preventDefault();
  const [dd, mm, yyyy] = [inputDay.value, inputMonth.value, inputYear.value];
  inputDay.setAttribute('max', new Date(yyyy, mm, 0).getDate());

  const isFuture = TODAY.getTime() < new Date(yyyy, mm - 1, dd).getTime();
  validateField(inputYear, [
    { condition: inputYear.validity.valueMissing, type: 'required' },
    { condition: inputYear.validity.rangeOverflow || isFuture, type: 'range' },
  ], (type) => errorMessages[type]('year'));

  validateField(inputMonth, [
    { condition: inputMonth.validity.valueMissing, type: 'required' },
    { condition: inputMonth.validity.rangeUnderflow, type: 'invalid' },
  ], (type) => errorMessages[type]('month'));

  validateField(inputDay, [
    { condition: inputDay.validity.valueMissing, type: 'required' },
    { condition: inputDay.validity.rangeOverflow, type: 'invalid' },
  ], (type) => errorMessages[type]('day'));

  if ([inputDay, inputMonth, inputYear].every((el) => el.checkValidity())) calculateAge(dd, mm, yyyy);
  else [outputDays, outputMonths, outputYears].forEach(el => el.textContent = '- -');
};

const calculateAge = (day, month, year) => {
  const birthDate = new Date(year, month - 1, day);
  let [years, months, days] = [
    TODAY.getFullYear() - birthDate.getFullYear(),
    TODAY.getMonth() - birthDate.getMonth(),
    TODAY.getDate() - birthDate.getDate()
  ];

  if (months < 0 || (months === 0 && days < 0)) years--, months += 12;
  if (days < 0) days += new Date(TODAY.getFullYear(), TODAY.getMonth(), 0).getDate(), months--;

  [outputYears, outputMonths, outputDays].forEach((el, i) => animateNumber(el, [years, months, days][i]));
};

const animateNumber = (el, num) => {
  let count = 0, interval = 2000 / num;
  const update = () => { el.textContent = ++count < num ? count : num; if (count < num) setTimeout(update, interval); };
  update();
};

form.addEventListener('submit', validateForm);
