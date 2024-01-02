export const generateUserID = () => {
  return Math.floor(Math.random() * 77) + Date.now();
};
