export const compareWithToday = (date: string) => {
  const today = new Date().toDateString();

  return new Date(date).toDateString() === today;
};
