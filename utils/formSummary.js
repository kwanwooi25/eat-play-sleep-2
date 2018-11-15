module.exports = activities => {
  const summary = {
    breast: { count: 0, duration: 0 },
    bottle: { count: 0, amount: 0 },
    babyfood: { count: 0, amount: 0 },
    pump: { count: 0, amount: 0 },
    diaper: { count: 0, pee: 0, poo: 0 },
    sleep: { count: 0, duration: 0 },
  };

  activities.forEach(({
    name,
    duration_total,
    amount,
    type,
  }) => {
    if (name !== 'growth') summary[name].count ++;

    switch (name) {
      case 'breast':
      case 'sleep':
        summary[name].duration += duration_total;
        break;
      
      case 'bottle':
      case 'babyfood':
      case 'pump':
        summary[name].amount += amount;
        break;

      case 'diaper':
        if (type === 'peepoo') {
          summary[name].pee ++;
          summary[name].poo ++;
        } else {
          summary[name][type] ++;
        }
        break;

      default:
        break;
    }
  });

  return summary;
}