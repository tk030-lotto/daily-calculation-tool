/**
 * 日常計算ツール - コアロジック自動検証テストスイート (tests/test-logic.js)
 * 実行方法: node tests/test-logic.js
 */

const assert = require('assert');
const DateUtils = require('../js/utils.js');
const AgeCalculator = require('../js/ageCalc.js');
const DateCalculator = require('../js/dateCalc.js');
const PeriodCalculator = require('../js/periodCalc.js');
const TimeCalculator = require('../js/timeCalc.js');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failCount++;
  }
}

console.log('=== 日常計算ツール ロジック検証開始 ===\n');

// 1. DateUtils
test('DateUtils: うるう年判定', () => {
  assert.strictEqual(DateUtils.isLeapYear(2024), true);
  assert.strictEqual(DateUtils.isLeapYear(2026), false);
  assert.strictEqual(DateUtils.isLeapYear(2000), true);
  assert.strictEqual(DateUtils.isLeapYear(1900), false);
});

test('DateUtils: 月末日算出', () => {
  assert.strictEqual(DateUtils.getDaysInMonth(2024, 2), 29);
  assert.strictEqual(DateUtils.getDaysInMonth(2026, 2), 28);
  assert.strictEqual(DateUtils.getDaysInMonth(2026, 4), 30);
  assert.strictEqual(DateUtils.getDaysInMonth(2026, 8), 31);
});

// 2. 年齢計算
test('AgeCalc: 仕様書例 (1965/04/10 生まれ、2026/09/09 基準日)', () => {
  const res = AgeCalculator.calculate('1965-04-10', '2026-09-09');
  assert.strictEqual(res.age, 61);
  assert.strictEqual(res.periodText, '61年4か月30日');
});

test('AgeCalc: 誕生日当日は加算される', () => {
  const res = AgeCalculator.calculate('1990-09-11', '2026-09-11');
  assert.strictEqual(res.age, 36);
  assert.strictEqual(res.periodText, '36年0か月0日');
});

test('AgeCalc: 誕生日前日はまだ加算されない', () => {
  const res = AgeCalculator.calculate('1990-09-12', '2026-09-11');
  assert.strictEqual(res.age, 35);
});

test('AgeCalc: うるう年生まれ (2000-02-29) の平年加算', () => {
  // 2026年は平年。2/28時点では25歳、3/1時点で26歳
  const resBefore = AgeCalculator.calculate('2000-02-29', '2026-02-28');
  assert.strictEqual(resBefore.age, 25);

  const resAfter = AgeCalculator.calculate('2000-02-29', '2026-03-01');
  assert.strictEqual(resAfter.age, 26);
});

test('AgeCalc: 基準日が生年月日より前はエラー', () => {
  const res = AgeCalculator.calculate('2026-01-01', '2025-01-01');
  assert.ok(res.error);
});

// 3. 日付計算
test('DateCalc: 仕様書例 (2026-09-09 の 30日後)', () => {
  const res = DateCalculator.calculate('2026-09-09', 30, 'after');
  assert.strictEqual(res.dateString, '2026-10-09');
});

test('DateCalc: 30日前', () => {
  const res = DateCalculator.calculate('2026-09-09', 30, 'before');
  assert.strictEqual(res.dateString, '2026-08-10');
});

test('DateCalc: 月末またぎ (2026-03-31 の 1日後)', () => {
  const res = DateCalculator.calculate('2026-03-31', 1, 'after');
  assert.strictEqual(res.dateString, '2026-04-01');
});

test('DateCalc: 年末年始またぎ (2025-12-31 の 1日後)', () => {
  const res = DateCalculator.calculate('2025-12-31', 1, 'after');
  assert.strictEqual(res.dateString, '2026-01-01');
});

test('DateCalc: うるう年またぎ (2024-02-28 の 1日後と2日後)', () => {
  const res1 = DateCalculator.calculate('2024-02-28', 1, 'after');
  assert.strictEqual(res1.dateString, '2024-02-29');

  const res2 = DateCalculator.calculate('2024-02-28', 2, 'after');
  assert.strictEqual(res2.dateString, '2024-03-01');
});

// 4. 期間計算
test('PeriodCalc: 仕様書例 (2025/04/10 〜 2026/09/09)', () => {
  const res = PeriodCalculator.calculate('2025-04-10', '2026-09-09');
  assert.strictEqual(res.totalDays, 517);
  assert.strictEqual(res.periodText, '1年4か月30日');
});

test('PeriodCalc: 同一日は0日', () => {
  const res = PeriodCalculator.calculate('2026-09-11', '2026-09-11');
  assert.strictEqual(res.totalDays, 0);
  assert.strictEqual(res.periodText, '0年0か月0日');
});

test('PeriodCalc: 終了日 < 開始日はエラー', () => {
  const res = PeriodCalculator.calculate('2026-09-11', '2026-09-10');
  assert.ok(res.error);
});

// 5. 時間計算
test('TimeCalc: 仕様書例1 (09:30 → 17:45)', () => {
  const res = TimeCalculator.calculate('09:30', '17:45', false);
  assert.strictEqual(res.hours, 8);
  assert.strictEqual(res.minutes, 15);
  assert.strictEqual(res.formattedText, '8時間15分');
  assert.strictEqual(res.totalMinutes, 495);
});

test('TimeCalc: 仕様書例2 日付またぎ (22:00 → 02:30 翌日ON)', () => {
  const res = TimeCalculator.calculate('22:00', '02:30', true);
  assert.strictEqual(res.hours, 4);
  assert.strictEqual(res.minutes, 30);
  assert.strictEqual(res.formattedText, '4時間30分');
  assert.strictEqual(res.totalMinutes, 270);
});

test('TimeCalc: 翌日OFFで終了時刻が前の場合はエラー', () => {
  const res = TimeCalculator.calculate('22:00', '02:30', false);
  assert.ok(res.error);
});

console.log(`\n=== テスト完了: 合格 ${passCount}件 / 失敗 ${failCount}件 ===`);
if (failCount > 0) {
  process.exit(1);
}
