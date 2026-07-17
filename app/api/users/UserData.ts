export const UserData = (data: any) => {
  const a = {
    name: data.name,
    email: data.email,
    mobileNumber: data.mobileNumber,
    role: data.role,
    username: data.username,
    isActive: data.isActive,
    credits: Number(data.credits),
    agreeToTerms: data.agreeToTerms,
    status: data.status,
  };

  return a;
};
