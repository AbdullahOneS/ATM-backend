function isNotExpired(exp_date) {
    const currentDate = new Date();
    const [expMonth, expYear] = exp_date.split("/").map(Number);
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1
    const currentYear = currentDate.getFullYear() % 100; // Get the last two digits of the year
    console.log(currentMonth, currentYear, expMonth, expYear);
  
    if (currentYear < expYear) {
      return true;
    } else if (currentYear === expYear) {
      return currentMonth <= expMonth;
    } else {
      return false;
    }
}

module.exports = isNotExpired;