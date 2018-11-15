export default seconds => {
  const hh = ('00' + Math.floor(seconds / 3600)).slice(-2);
  const mm = ('00' + Math.floor((seconds % 3600) / 60)).slice(-2);
  const ss = ('00' + ((seconds % 3600) % 60)).slice(-2);

  return hh === '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}