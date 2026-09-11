/**
 * 日常計算ツール - 時間計算モジュール (js/timeCalc.js)
 */
(function(root) {
  const TimeCalculator = {
    /**
     * HH:mm 文字列をパース
     * @param {string} str
     * @returns {{hours: number, minutes: number, totalMinutes: number}|null}
     */
    parseTime(str) {
      if (!str || typeof str !== 'string') return null;
      const parts = str.trim().split(':').map(Number);
      if (parts.length < 2 || parts.some(isNaN)) return null;
      const [hours, minutes] = parts;
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
      return { hours, minutes, totalMinutes: hours * 60 + minutes };
    },

    /**
     * 経過時間を計算
     * @param {string} startTimeStr - 開始時刻 (HH:mm)
     * @param {string} endTimeStr - 終了時刻 (HH:mm)
     * @param {boolean} isNextDay - 翌日（日付またぎ）判定
     * @returns {object} 計算結果またはエラー
     */
    calculate(startTimeStr, endTimeStr, isNextDay = false) {
      const start = this.parseTime(startTimeStr);
      const end = this.parseTime(endTimeStr);

      if (!start || !end) {
        return { error: '開始時刻と終了時刻を正しい形式（HH:mm）で入力してください。' };
      }

      let startMin = start.totalMinutes;
      let endMin = end.totalMinutes;

      if (isNextDay) {
        endMin += 24 * 60;
      }

      if (endMin < startMin) {
        return { error: '終了時刻が開始時刻より前です。日をまたぐ場合は「翌日」にチェックを入れてください。' };
      }

      const diffMin = endMin - startMin;
      const hours = Math.floor(diffMin / 60);
      const minutes = diffMin % 60;

      return {
        totalMinutes: diffMin,
        hours,
        minutes,
        formattedText: `${hours}時間${minutes}分`
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimeCalculator;
  } else {
    root.TimeCalculator = TimeCalculator;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
