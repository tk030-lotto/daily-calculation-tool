/**
 * 日常計算ツール - 年齢計算モジュール (js/ageCalc.js)
 */
(function(root) {
  const DateUtils = (typeof module !== 'undefined' && module.exports)
    ? require('./utils.js')
    : root.DateUtils;

  const AgeCalculator = {
    /**
     * 年齢と経過期間を計算
     * @param {string} birthStr - 生年月日 (YYYY-MM-DD)
     * @param {string} baseStr - 基準日 (YYYY-MM-DD)
     * @returns {object} 計算結果またはエラー
     */
    calculate(birthStr, baseStr) {
      const birth = DateUtils.parseDate(birthStr);
      const base = DateUtils.parseDate(baseStr);

      if (!birth || !base) {
        return { error: '生年月日と基準日を正しい日付で入力してください。' };
      }

      const birthDays = DateUtils.toDays(birth.year, birth.month, birth.day);
      const baseDays = DateUtils.toDays(base.year, base.month, base.day);

      if (baseDays < birthDays) {
        return { error: '基準日は生年月日以降の日付を指定してください。' };
      }

      // 暦上の期間計算（共通関数を使用：平年の2月29日は2月28日へ末日丸め）
      const { years, months, days } = DateUtils.calculateCalendarPeriod(birth, base);
      const age = years;

      return {
        age,
        periodText: `${years}年${months}か月${days}日`,
        details: { years, months, days },
        totalDays: baseDays - birthDays
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeCalculator;
  } else {
    root.AgeCalculator = AgeCalculator;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
