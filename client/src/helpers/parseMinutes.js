export default minutes => {
  const d = Math.floor(minutes / (60 * 24));
  const h = Math.floor((minutes % (60 * 24)) / 60);
  const m = (minutes % (60 * 24)) % 60;

  return { d, h, m };
}