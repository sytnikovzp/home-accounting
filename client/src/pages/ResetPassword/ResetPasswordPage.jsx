// import { useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// import { useResetPasswordMutation } from '../../store/services';

// import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
// import ModalWindow from '../../components/ModalWindow/ModalWindow';

// function ResetPasswordPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const token = params.get('token');

//   const [resetPassword, { isLoading: isSubmitting, error: submitError }] =
//     useResetPasswordMutation();

//   const handleModalClose = () => {
//     navigate('/');
//   };

//   const handleSubmitResetPassword = useCallback(
//     async (values) => {
//       const result = await resetPassword({ token, ...values });
//       if (result?.data) {
//         navigate(
//           `/notification?severity=${encodeURIComponent(
//             result.data.severity
//           )}&title=${encodeURIComponent(
//             result.data.title
//           )}&message=${encodeURIComponent(result.data.message)}`
//         );
//       }
//     },
//     [resetPassword, token, navigate]
//   );

//   const content = useMemo(() => (
//     <ChangePasswordForm
//       isSubmitting={isSubmitting}
//       onSubmit={handleSubmitResetPassword}
//     />
//   );

//   return (
//     <ModalWindow
//       isOpen
//       content={content}
//       error={submitError?.data}
//       title='Скидання паролю...'
//       onClose={handleModalClose}
//     />
//   );
// }

// export default ResetPasswordPage;

function ResetPasswordPage() {
  return <div>ResetPasswordPage</div>;
}

export default ResetPasswordPage;
