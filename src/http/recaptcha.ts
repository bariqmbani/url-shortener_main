const secret = process.env.RECAPTCHA_SECRET_KEY;

type RecaptchaResponse = {
  success: boolean;
};

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
  const data = (await response.json()) as RecaptchaResponse;
  return data.success;
};
