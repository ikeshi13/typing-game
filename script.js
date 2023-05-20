//ランダムで取得してくるAPI
const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";

const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const incorrectSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

//入力値と表示されているテキスト内容が正しいか判定する
typeInput.addEventListener("input", () => {
  //テキストに入力されたタイミングでタイピング音を再生する
  typeSound.play();
  //タイピングをしたタイミングで再生できるように設定
  typeSound.currentTime = 0;
  //ランダムで表示された文字列（typeDisplay内のspanタグ）を全件取得
  const sentenceArray = typeDisplay.querySelectorAll("span");
  //入力した文字列を1文字づつ区切りarrayValueに格納
  const arrayValue = typeInput.value.split("");
  //タイピングされた文字列が正しいか判定するフラグ
  let correctFlg = true;
  //表示された文字列と入力値の不整合を判定
  sentenceArray.forEach((characterSpan, index) => {
    //入力値がない場合
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correctFlg = false;
      //入力値が正しい場合
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      //入力値が正しくない場合
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correctFlg = false;
      incorrectSound.volume = 0.3;
      incorrectSound.play();
      incorrectSound.currentTime = 0;
    }
  });
  if (correctFlg == true) {
    correctSound.play();
    RenderNextSentence();
  }
});

/**非同期でランダムな文字列を取得する */
function GetrandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((responce) => responce.json())
    .then((data) => data.content);
}

//取得したランダムな文章を表示する
async function RenderNextSentence() {
  const sentence = await GetrandomSentence();
  typeDisplay.innerText = "";
  //取得した文字列を1文字づつ切り分ける
  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    typeDisplay.appendChild(characterSpan);
  });

  //入力するテキストボックス内の文字列を削除する
  typeInput.value = "";

  //制限時間を表示
  StartTimer();
}

//時間を1秒づつ減らし表示する処理
let startTime;
let originTime = 30;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

//1秒を取得する
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

///timerに表示されている時間が0以下の場合次に移る
function TimeUp() {
  RenderNextSentence();
}

//関数を呼ぶ
RenderNextSentence();
