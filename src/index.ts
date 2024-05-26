export default (function(){

  const COLON = ":";
  // HH:MMフォーマットの正規表現
  const TIME_FORMATE_REGEXP = /[0-9]{2}\:[0-5][0-9]/;
  // 入力値チェック用の正規表現
  const INPUT_CHECK_REGEXP = /[0-9]{1,2}\:[0-9]{1,2}/;
  // 時間入力要素の対象クラス名
  const TARGET_CLASS_NAME = "input.time-input";
  // 入力前の値補完用（時間）
  let previousHours = "";
  // 入力前の値補完用（分）
  let previousMinutes = "";
  // 直前に時間に変更があったか
  let isChangingHourJustBefore = false;
  // 直前に分に変更があったか
  let isChangingMinuteJustBefore = false;

  const timeInputs = document.querySelectorAll<HTMLInputElement>(TARGET_CLASS_NAME);
  // 入力要素にイベントハンドラを登録する
  timeInputs.forEach((element) => {
      const timeInput = element;
      if (!checkDefaultValue(timeInput.defaultValue)) {
          timeInput.defaultValue = `00${COLON}00`;
      }
      if (!checkType(timeInput.type)) {
          timeInput.type = "text"
      }

      timeInput.addEventListener("input", inputEvent);
      timeInput.addEventListener("focus", focusEvent);
      timeInput.addEventListener("click", clickEvent);
      timeInput.addEventListener("dblclick", clickEvent);
      timeInput.addEventListener("keydown", keydownEvent);
  })


  /**
   * デフォルト値をチェックする
   * @param {string} defaultValue
   * @returns {boolean}
   */
  function checkDefaultValue(defaultValue: string)
  {
      return TIME_FORMATE_REGEXP.test(toHalfWidth(defaultValue));
  }

  /**
   * type属性をチェックする
   * @param {string} type 
   * @returns {boolean}
   */
  function checkType(type: string|null)
  {
      return type === "text";
  }

  /**
   * 右矢印と左矢印キーを押下時のイベントハンドラ
   * @param {*} event 
   * @returns 
   */
  function keydownEvent(event: KeyboardEvent)
  {
      if (
          event.code !== "ArrowRight"
          && event.code !== "ArrowLeft"
          && event.code !== "ArrowUp"
          && event.code !== "ArrowDown"
      ) {
          return;
      }

      // TODO: ArrowUpでカウントアップ、ArrowDownで１カウントダウン

      const activeElement = document.activeElement as HTMLInputElement;
      const selectionStart = activeElement.selectionStart ?? 0;

      if (selectionStart <= 2) {
          activeElement.setSelectionRange(3, 5);
      } 
      if (3 <= selectionStart) {
          activeElement.setSelectionRange(0, 2);
      }

      init(activeElement);
      event.preventDefault();
  }

  /**
   * クリック時のイベントハンドラ
   * @param {*} event 
   * @returns 
   */
  function clickEvent(event: Event)
  {
      const activeElement = document.activeElement as HTMLInputElement;
      const selectionStart = activeElement.selectionStart ?? 0;

      // カーソルの位置がコロンより前なら前半２桁を範囲選択
      if (selectionStart <= 2) {
          activeElement.setSelectionRange(0, 2);
          return;
      }

      // カーソルの位置がコロンより後なら後半２桁を範囲選択
      if (3 <= selectionStart) {
          activeElement.setSelectionRange(3, 5);
          return;
      }
      event.preventDefault();

      init(activeElement);
  }


  /**
   * 入力要素に変更があった場合のイベントハンドラ
   */
  function inputEvent()
  {
      const activeElement = document.activeElement as HTMLInputElement;
      const inputValues = toHalfWidth(activeElement.value);
      if (!isValidInput(inputValues)){
          activeElement.value = 
          (previousHours.length === 1 ? "0" + previousHours : previousHours)
          + COLON
          + (previousMinutes.length === 1 ? "0" + previousMinutes : previousMinutes);
  
          activeElement.setSelectionRange(0, 2);
          return;
      }

      const maxHour = activeElement.getAttribute("maxHour") ?? "99";
      const {inputHours, inputMinutes} = getHourAndMinute(inputValues);
      const colonIndex = inputValues.search(COLON);
      const selectionStart = activeElement.selectionStart ?? 0;

      if (selectionStart <= colonIndex) {

          if (!isChangingHourJustBefore && inputHours.length === 1) {

              activeElement.value = "0" + inputHours + COLON + inputMinutes;

              isChangingHourJustBefore = true;
              previousHours = inputHours;
              previousMinutes = inputMinutes;

              activeElement.setSelectionRange(0, 2);
          } else {
              const hh = inputHours.length === 2 ? inputHours : previousHours + inputHours;
              activeElement.value = (Number(maxHour) < Number(hh) ? "00" : hh) + COLON + inputMinutes;

              isChangingHourJustBefore = false;
              previousHours = hh;
              previousMinutes = inputMinutes;

              activeElement.setSelectionRange(3, 5);
          }
      }

      if (colonIndex < selectionStart) {

          if (!isChangingMinuteJustBefore && inputMinutes.length === 1) {

              activeElement.value = inputHours + COLON + "0" + inputMinutes;

              isChangingMinuteJustBefore = true;
              previousHours = inputHours;
              previousMinutes = inputMinutes;

              activeElement.setSelectionRange(3, 5);
          } else {

              const mm = inputMinutes.length === 2 ? inputMinutes : previousMinutes + inputMinutes;
              activeElement.value = inputHours + COLON + (60 <= Number(mm) ? "00" : mm);
              
              isChangingMinuteJustBefore = false;
              previousHours = inputHours;
              previousMinutes = mm;

              activeElement.setSelectionRange(0, 2);
          }
      }
  }

  /**
   * 入力値チェック
   * @param {string} inputValues 
   * @returns {boolean}
   */
  function isValidInput(inputValues: string) 
  {
      // 入力値が５桁以上の場合が前回の入力値にする
      if (5 < inputValues.length) {
          return false;
      }

      // 入力値チェック（主にコピペ用）
      if (!INPUT_CHECK_REGEXP.test(inputValues)) {
          return false;
      }

      return true;
  }

  /**
   * 入力要素にフォーカスが当たった場合のイベントハンドラ
   */
  function focusEvent()
  {
      const activeElement = document.activeElement as HTMLInputElement;
      activeElement.setSelectionRange(0, 2);

      init(activeElement);
  }


  /**
   * コロンを起点に時間と分数を特定する
   * @param {string} inputValue 
   * @returns {{inputHours: string, inputMinutes: string}}
   */
  function getHourAndMinute(inputValue: string)
  {
      const colonIndex = inputValue.search(COLON);
      const inputHours = inputValue.slice(0, colonIndex);
      const inputMinutes = inputValue.slice(colonIndex + 1);
      return {
          inputHours: inputHours === "" ? "00" : inputHours,
          inputMinutes: inputMinutes === "" ? "00" : inputMinutes
      };
  }
  /**
   * 全角英数字を半角に変換
   * @param {string} str
   * @returns {string}
   */
  function toHalfWidth(str: string)
  {
      str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });
      return str;
  }


  /**
   * 初期化する
   * @param {*} activeElement 
   */
  function init(activeElement: HTMLInputElement)
  {
      // フォーカスが当たった要素の入力値を取っておく
      const {inputHours, inputMinutes} = getHourAndMinute(activeElement.value);
      previousHours = inputHours;
      previousMinutes = inputMinutes;

      // 初期化
      isChangingHourJustBefore = false;
      isChangingMinuteJustBefore = false;
  }

})();