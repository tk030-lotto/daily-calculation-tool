/**
 * 日常計算ツール - 日付ユーティリティ (js/utils.js)
 */
(function(root) {
  const DateUtils = {
    /**
     * YYYY-MM-DD 形式の文字列を分解して数値のオブジェクトを返す
     * @param {string} str
     * @returns {{year: number, month: number, day: number}|null}
     */
    parseDate(str) {
      if (!str || typeof str !== 'string') return null;
      const parts = str.trim().split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return null;
      const [year, month, day] = parts;
      if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;
      if (day > this.getDaysInMonth(year, month)) return null;
      return { year, month, day };
    },

    /**
     * 年月日を YYYY-MM-DD 形式の文字列にフォーマット
     */
    formatDate(year, month, day) {
      const y = String(year).padStart(4, '0');
      const m = String(month).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    /**
     * うるう年判定
     */
    isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

    /**
     * 指定された年・月の日数を取得（うるう年の2月対応）
     */
    getDaysInMonth(year, month) {
      const days = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return days[month - 1];
    },

    /**
     * 今日の日付文字列（YYYY-MM-DD）を取得
     */
    getTodayString() {
      const now = new Date();
      return this.formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    },

    /**
     * 基準エポック（UTC 1970-01-01）からの総日数を計算（タイムゾーンの影響を完全排除）
     */
    toDays(year, month, day) {
      return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
    },

    /**
     * 総日数から年月日を取得
     */
    fromDays(totalDays) {
      const d = new Date(totalDays * 86400000);
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate()
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateUtils;
  } else {
    root.DateUtils = DateUtils;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
