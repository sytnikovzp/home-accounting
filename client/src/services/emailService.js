import { requestHandler } from '../utils/sharedFunctions';

const resendVerifyEmail = async (email) => {
  const response = await requestHandler({
    url: '/email/resend-verify',
    method: 'POST',
    data: { email },
  });
  return response;
};

export { resendVerifyEmail };
