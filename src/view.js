// import onChange from 'on-change';

// export default (elements, state, i18n) => {
//   const { field, errorField } = elements;

//   const renderValidation = (value) => {
//     switch (value) {
//       case 'error': errorField.textContent = i18n.t('validation.correctUrl');
//         break;
//       default:
//         break;
//     }
//   };

//   const handleError = () => {
//     field.classList.add('is-invalid');
//     errorField.textContent = i18n.t('validation.correctUrl');
//   };

//   const watchedState = onChange(state, (path) => {
//     switch (path) {
//       case 'form.status': renderValidation(value);
//         break;

//       case 'form.errors': handleError();
//         break;

//       default:
//         break;
//     }
//   });

//   return watchedState;
// };
