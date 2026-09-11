/**
 * 日常計算ツール - 日付計算モジュール (js/dateCalc.js)
 */
(function(root) {
  const DateUtils = (typeof module !== 'undefined' && module.exports)
    ? require('./utils.js')
    : root.DateUtils;

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  const DateCalculator = {
    /**
     * 基準日から指定日数後/前の日付を計算
     * @param {string} baseStr - 基準日 (YYYY-MM-DD)
     * @param {number|string} daysCount - 日数 (0以上の整数)
     * @param {string} direction - 'after' (後) または 'before' (前)
     * @returns {object} 計算結果またはエラー
     */
    calculate(baseStr, daysCount, direction = 'after') {
      const base = DateUtils.parseDate(baseStr);
      if (!base) {
        return { error: '基準日を正しい日付で入力してください。' };
      }

      const daysNum = Number(daysCount);
      if (isNaN(daysNum) || daysNum < 0 || !Number.isInteger(daysNum)) {
        return { error: '日数は0以上の整数を入力してください。' };
      }

      const baseDays = DateUtils.toDays(base.year, base.month, base.day);
      const targetDays = direction === 'after' ? baseDays + daysNum : baseDays - daysNum;
      const target = DateUtils.fromDays(targetDays);

      // 曜日計算 (UTCエポックからの曜日)
      // 1970-01-01 は木曜日 (index 4)
      const dayOfWeekIndex = ((((targetDays + 4) % 7) + 7) % 7);
      const weekday = WEEKDAYS[dayOfWeekIndex];

      const dateString = DateUtils.formatDate(target.year, target.month, target.day);
      const formattedJapanese = `${target.year}年${target.month}月${target.day}日 (${weekday})`;

      return {
        dateString,
        formattedJapanese,
        year: target.year,
        month: target.month,
        day: target.day,
        weekday
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateCalculator;
  } else {
    root.DateCalculator = DateCalculator;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
