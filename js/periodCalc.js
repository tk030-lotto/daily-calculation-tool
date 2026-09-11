/**
 * 日常計算ツール - 期間計算モジュール (js/periodCalc.js)
 */
(function(root) {
  const DateUtils = (typeof module !== 'undefined' && module.exports)
    ? require('./utils.js')
    : root.DateUtils;

  const PeriodCalculator = {
    /**
     * 開始日から終了日までの期間・総日数を計算
     * @param {string} startStr - 開始日 (YYYY-MM-DD)
     * @param {string} endStr - 終了日 (YYYY-MM-DD)
     * @returns {object} 計算結果またはエラー
     */
    calculate(startStr, endStr) {
      const start = DateUtils.parseDate(startStr);
      const end = DateUtils.parseDate(endStr);

      if (!start || !end) {
        return { error: '開始日と終了日を正しい日付で入力してください。' };
      }

      const startDays = DateUtils.toDays(start.year, start.month, start.day);
      const endDays = DateUtils.toDays(end.year, end.month, end.day);

      if (endDays < startDays) {
        return { error: '終了日は開始日以降の日付を指定してください。' };
      }

      const totalDays = endDays - startDays;

      // 暦上の期間（○年○か月○日）の計算
      let years = end.year - start.year;
      let months = end.month - start.month;
      let days = end.day - start.day;

      if (days < 0) {
        months--;
        let prevMonth = end.month - 1;
        let prevYear = end.year;
        if (prevMonth < 1) {
          prevMonth = 12;
          prevYear--;
        }
        days += DateUtils.getDaysInMonth(prevYear, prevMonth);
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      return {
        totalDays,
        years,
        months,
        days,
        periodText: `${years}年${months}か月${days}日`
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeriodCalculator;
  } else {
    root.PeriodCalculator = PeriodCalculator;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
