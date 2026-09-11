/**
 * 日常計算ツール - UIコントローラー (js/app.js)
 */
document.addEventListener('DOMContentLoaded', () => {
  const today = DateUtils.getTodayString();

  // ----------------------------------------------------
  // 1. タブナビゲーション制御
  // ----------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`panel-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // ----------------------------------------------------
  // 2. 年齢計算パネル
  // ----------------------------------------------------
  const ageBirthInput = document.getElementById('age-birth-date');
  const ageBaseInput = document.getElementById('age-base-date');
  const btnCalcAge = document.getElementById('btn-calc-age');
  const btnResetAge = document.getElementById('btn-reset-age');
  const resultAgeBox = document.getElementById('result-age');

  // 初期値
  ageBaseInput.value = today;

  function handleAgeCalculation() {
    const birthVal = ageBirthInput.value;
    const baseVal = ageBaseInput.value || today;

    if (!birthVal) {
      resultAgeBox.innerHTML = '<div class="result-placeholder">生年月日を入力すると結果がここに表示されます</div>';
      return;
    }

    const res = AgeCalculator.calculate(birthVal, baseVal);
    if (res.error) {
      resultAgeBox.innerHTML = `
        <div class="result-card error" role="alert">
          <strong>入力エラー:</strong> ${res.error}
        </div>`;
      return;
    }

    resultAgeBox.innerHTML = `
      <div class="result-card success">
        <span class="result-badge">年齢計算結果</span>
        <div class="result-main">
          <span class="result-value">${res.age}</span>
          <span class="result-unit">歳（満年齢）</span>
        </div>
        <div class="result-sub">
          <div class="result-row">
            <span>経過期間:</span>
            <strong>${res.periodText}</strong>
          </div>
          <div class="result-row">
            <span>生まれてからの総日数:</span>
            <span>${res.totalDays.toLocaleString()} 日</span>
          </div>
        </div>
      </div>`;
  }

  btnCalcAge.addEventListener('click', handleAgeCalculation);
  ageBirthInput.addEventListener('input', handleAgeCalculation);
  ageBaseInput.addEventListener('input', handleAgeCalculation);

  btnResetAge.addEventListener('click', () => {
    ageBirthInput.value = '';
    ageBaseInput.value = today;
    resultAgeBox.innerHTML = '<div class="result-placeholder">生年月日を入力すると結果がここに表示されます</div>';
  });

  // ----------------------------------------------------
  // 3. 日付計算パネル
  // ----------------------------------------------------
  const dateBaseInput = document.getElementById('date-base-date');
  const dateDaysInput = document.getElementById('date-days-count');
  const btnCalcDate = document.getElementById('btn-calc-date');
  const btnResetDate = document.getElementById('btn-reset-date');
  const resultDateBox = document.getElementById('result-date');

  dateBaseInput.value = today;

  function handleDateCalculation() {
    const baseVal = dateBaseInput.value;
    const daysVal = dateDaysInput.value;
    const direction = document.querySelector('input[name="date-direction"]:checked')?.value || 'after';

    if (!baseVal || daysVal === '') {
      resultDateBox.innerHTML = '<div class="result-placeholder">基準日と日数を入力すると結果がここに表示されます</div>';
      return;
    }

    const res = DateCalculator.calculate(baseVal, daysVal, direction);
    if (res.error) {
      resultDateBox.innerHTML = `
        <div class="result-card error" role="alert">
          <strong>入力エラー:</strong> ${res.error}
        </div>`;
      return;
    }

    const directionLabel = direction === 'after' ? `${daysVal} 日後` : `${daysVal} 日前`;

    resultDateBox.innerHTML = `
      <div class="result-card success">
        <span class="result-badge">${directionLabel} の日付</span>
        <div class="result-main">
          <span class="result-value" style="font-size: 1.5rem;">${res.formattedJapanese}</span>
        </div>
        <div class="result-sub">
          <div class="result-row">
            <span>ISO形式:</span>
            <strong>${res.dateString}</strong>
          </div>
          <div class="result-row">
            <span>基準日:</span>
            <span>${baseVal}</span>
          </div>
        </div>
      </div>`;
  }

  btnCalcDate.addEventListener('click', handleDateCalculation);
  dateBaseInput.addEventListener('input', handleDateCalculation);
  dateDaysInput.addEventListener('input', handleDateCalculation);
  document.querySelectorAll('input[name="date-direction"]').forEach(r => {
    r.addEventListener('change', handleDateCalculation);
  });

  btnResetDate.addEventListener('click', () => {
    dateBaseInput.value = today;
    dateDaysInput.value = '30';
    const defaultRadio = document.querySelector('input[name="date-direction"][value="after"]');
    if (defaultRadio) defaultRadio.checked = true;
    handleDateCalculation();
  });

  // ----------------------------------------------------
  // 4. 期間計算パネル
  // ----------------------------------------------------
  const periodStartInput = document.getElementById('period-start-date');
  const periodEndInput = document.getElementById('period-end-date');
  const btnCalcPeriod = document.getElementById('btn-calc-period');
  const btnResetPeriod = document.getElementById('btn-reset-period');
  const resultPeriodBox = document.getElementById('result-period');

  periodStartInput.value = today;
  periodEndInput.value = today;

  function handlePeriodCalculation() {
    const startVal = periodStartInput.value;
    const endVal = periodEndInput.value;

    if (!startVal || !endVal) {
      resultPeriodBox.innerHTML = '<div class="result-placeholder">開始日と終了日を入力すると結果がここに表示されます</div>';
      return;
    }

    const res = PeriodCalculator.calculate(startVal, endVal);
    if (res.error) {
      resultPeriodBox.innerHTML = `
        <div class="result-card error" role="alert">
          <strong>入力エラー:</strong> ${res.error}
        </div>`;
      return;
    }

    resultPeriodBox.innerHTML = `
      <div class="result-card success">
        <span class="result-badge">期間計算結果</span>
        <div class="result-main">
          <span class="result-value">${res.totalDays.toLocaleString()}</span>
          <span class="result-unit">日間（総日数）</span>
        </div>
        <div class="result-sub">
          <div class="result-row">
            <span>暦上の期間:</span>
            <strong>${res.periodText}</strong>
          </div>
          <div class="result-row">
            <span>期間:</span>
            <span>${startVal} 〜 ${endVal}</span>
          </div>
        </div>
      </div>`;
  }

  btnCalcPeriod.addEventListener('click', handlePeriodCalculation);
  periodStartInput.addEventListener('input', handlePeriodCalculation);
  periodEndInput.addEventListener('input', handlePeriodCalculation);

  btnResetPeriod.addEventListener('click', () => {
    periodStartInput.value = today;
    periodEndInput.value = today;
    handlePeriodCalculation();
  });

  // ----------------------------------------------------
  // 5. 時間計算パネル
  // ----------------------------------------------------
  const timeStartInput = document.getElementById('time-start');
  const timeEndInput = document.getElementById('time-end');
  const timeNextDayCheckbox = document.getElementById('time-next-day');
  const btnCalcTime = document.getElementById('btn-calc-time');
  const btnResetTime = document.getElementById('btn-reset-time');
  const resultTimeBox = document.getElementById('result-time');

  function handleTimeCalculation() {
    const startVal = timeStartInput.value;
    const endVal = timeEndInput.value;
    const isNextDay = timeNextDayCheckbox.checked;

    if (!startVal || !endVal) {
      resultTimeBox.innerHTML = '<div class="result-placeholder">時刻を入力すると結果がここに表示されます</div>';
      return;
    }

    const res = TimeCalculator.calculate(startVal, endVal, isNextDay);
    if (res.error) {
      resultTimeBox.innerHTML = `
        <div class="result-card error" role="alert">
          <strong>入力エラー:</strong> ${res.error}
        </div>`;
      return;
    }

    resultTimeBox.innerHTML = `
      <div class="result-card success">
        <span class="result-badge">経過時間</span>
        <div class="result-main">
          <span class="result-value">${res.hours}</span>
          <span class="result-unit">時間 ${res.minutes} 分</span>
        </div>
        <div class="result-sub">
          <div class="result-row">
            <span>合計分数:</span>
            <strong>${res.totalMinutes.toLocaleString()} 分</strong>
          </div>
          <div class="result-row">
            <span>対象区間:</span>
            <span>${startVal} → ${isNextDay ? '翌日 ' : ''}${endVal}</span>
          </div>
        </div>
      </div>`;
  }

  btnCalcTime.addEventListener('click', handleTimeCalculation);
  timeStartInput.addEventListener('input', handleTimeCalculation);
  timeEndInput.addEventListener('input', handleTimeCalculation);
  timeNextDayCheckbox.addEventListener('change', handleTimeCalculation);

  btnResetTime.addEventListener('click', () => {
    timeStartInput.value = '09:00';
    timeEndInput.value = '18:00';
    timeNextDayCheckbox.checked = false;
    handleTimeCalculation();
  });

  // 初期計算の実行
  handleDateCalculation();
  handlePeriodCalculation();
  handleTimeCalculation();
});
