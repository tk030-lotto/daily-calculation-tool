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

      // 満年齢の計算
      let age = base.year - birth.year;
      
      // 平年のうるう年生まれ（2/29）の場合、平年の誕生日基準日は3/1とみなす
      let birthMonth = birth.month;
      let birthDay = birth.day;
      if (birthMonth === 2 && birthDay === 29 && !DateUtils.isLeapYear(base.year)) {
        birthMonth = 3;
        birthDay = 1;
      }

      const isBeforeBirthday = (base.month < birthMonth) ||
        (base.month === birthMonth && base.day < birthDay);

      if (isBeforeBirthday) {
        age--;
      }

      // 経過期間（○年○か月○日）の暦上計算
      let years = base.year - birth.year;
      let months = base.month - birth.month;
      let days = base.day - birth.day;

      if (days < 0) {
        months--;
        let prevMonth = base.month - 1;
        let prevYear = base.year;
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
