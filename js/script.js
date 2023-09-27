const form = document.forms.main;
const encryptBtn = form.encryption;
const dencryptBtn = form.dencryption;
const option = form.option;
const copyBtn = form.copy;

copyBtn.addEventListener("click", ()=>{
  let text = form.result.innerHTML;
  console.log(text);
  copyTextToClipboard(text);
})

encryptBtn.addEventListener("click", ()=>{
  let text = form.text.value;
  let key = form.key.value;
  if(checkInput(text, key)){
    showTable(text, key);
    let output;
    if(option.value == "regular"){
      output = columnarTranspositionCipher(text, key);
    }
    else if(option.value == "cezar"){
      initEncrypt();
      output = encrypt(text);
    }
    else{
      output = doubleTranspositionCipher(text, key, true);
    }
    showResult(output);
  }
  else{
    showResult("");
    const tablle = document.getElementById("table");
    if (tablle.style.display == "block") { 
    tablle.style.display = "none"; //Показываем элемент
  }
  }
})

dencryptBtn.addEventListener("click", ()=>{
  let text = form.text.value;
  let key = form.key.value;
  if(checkInput(text, key)){
    let output;
    if(option.value == "regular"){
      output = columnarTranspositionDecipher(text, key);
    }
    else if(option.value == "cezar"){
      output = decrypt(text);
    }
    else{
      output = doubleTranspositionDecipher(text, key);
    }
    showResult(output);
  }
  else{
    showResult("");
  }
})

function checkInput(text, key){
  let isCorrect = true;
  if(text == "" || text == " "){
    form.text.classList.add("input-mistake");
    form.text.classList.remove("input-success");
    isCorrect = false;
  }
  else{
    form.text.classList.add("input-success");
    form.text.classList.remove("input-mistake")
  }
  if(key == "" || key == " "){
    form.key.classList.add("input-mistake");
    form.key.classList.remove("input-success")
    isCorrect = false;
  }
  else{
    form.key.classList.add("input-success");
    form.key.classList.remove("input-mistake")
  }
  return isCorrect;
}

function showResult(result){
  let textArea = form.result;
  textArea.innerText = result;
}

function showTable(message, key) {
  const tablle = document.getElementById("table");
  if (tablle.style.display != "block") { 
    tablle.style.display = "block"; //Показываем элемент
  }
  var x = key.length;
  var y = message.length / x;
  var table = document.getElementById("myTable");
  table.innerHTML = '';
  var i, j, row, cell;
  for (i = 0; i < y; i++) {
    row = table.insertRow(i);
    for (j = 0; j < x; j++) {
      cell = row.insertCell(j);
      cell.innerHTML = message.charAt(i * x + j);
    }
  }
  var header = table.createTHead();
  var row = header.insertRow(0);
  for(i = 0; i < x; i++){
    cell = row.insertCell(i);
    cell.innerHTML = key.charAt(i);
  }
}

function advancedTranspositionCipher(text, key){
  hash = simpleHash(key) % 26;
  result = caesarCipher(text, hash);
  return columnarTranspositionCipher(result, key);
}

function advancedTranspositionDecipher(text, key){
  hash = simpleHash(key) % 26;
  result = caesarDecipher(text, hash);
  return columnarTranspositionDecipher(result, key);
}

function doubleTranspositionCipher(text, key, isDouble) {
  let columns = Array(key.length).fill("");
  let sortedKey = Array.from(key).sort().join("");
  let transposedText = "";
  // First transposition (by rows)
  if(isDouble){
    for (let i = 0; i < text.length; i += key.length) {
      let row = text.slice(i, i + key.length);
      for (let j = 0; j < key.length; j++) {
          transposedText += row[key.indexOf(sortedKey[j])] || " ";
      }
    }
    console.log(transposedText);
    console.log("12111");
  }
  else{
    transposedText = text;
    console.log(transposedText);
  }
  // Second transposition (by columns)
  for (let i = 0; i < transposedText.length; i++) {
      columns[i % key.length] += transposedText[i];
  }
  let ciphertext = "";
  for (let char of sortedKey) {
      let index = key.indexOf(char);
      ciphertext += columns[index];
      key = key.replace(char, " ");
  }
  return ciphertext;
}

function columnarTranspositionCipher(text, key) {
  let columns = Array(key.length).fill("");
  let sortedKey = Array.from(key).sort().join("");

  for (let i = 0; i < text.length; i++) {
      columns[i % key.length] += text[i];
  }

  let ciphertext = "";
  for (let char of sortedKey) {
      let index = key.indexOf(char);
      ciphertext += columns[index];
      key = key.replace(char, " ");
  }
  return ciphertext;
}

function simpleHash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
  }
  return hash;
}

function caesarCipher(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let ascii = text.charCodeAt(i);
        if (ascii >= 65 && ascii <= 90) {
            result += String.fromCharCode((ascii - 65 + shift) % 26 + 65);  // Uppercase
        } else if (ascii >= 97 && ascii <= 122) {
            result += String.fromCharCode((ascii - 97 + shift) % 26 + 97);  // Lowercase
        } else {
            result += text.charAt(i);
        }
    }
    return result;
}

function caesarDecipher(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let ascii = text.charCodeAt(i);
        if (ascii >= 65 && ascii <= 90) {
            result += String.fromCharCode((ascii - 65 - shift + 26) % 26 + 65);  // Uppercase
        } else if (ascii >= 97 && ascii <= 122) {
            result += String.fromCharCode((ascii - 97 - shift + 26) % 26 + 97);  // Lowercase
        } else {
            result += text.charAt(i);
        }
    }
    return result;
}

function doubleTranspositionDecipher(ciphertext, key) {
  let columns = Array(key.length).fill("");
  let sortedKey = Array.from(key).sort().join("");

  // Distribute the ciphertext into columns
  for (let i = 0; i < ciphertext.length; i++) {
      columns[i % key.length] += ciphertext[i];
  }
  console.log("11111111111");
  // Reorder the columns according to the original key
  let plaintext = "";
  for (let char of sortedKey) {
      let index = key.indexOf(char);
      plaintext += columns[index];
      // Replace with a character that's not in the key
      key = key.replace(char, " ");
  }
  console.log(plaintext);
  // Perform the second transposition (by rows)
  let transposedText = "";
  for (let i = 0; i < plaintext.length; i += sortedKey.trim().length) {
      let row = plaintext.slice(i, i + sortedKey.trim().length);
      for (let j = 0; j < sortedKey.trim().length; j++) {
          transposedText += row[sortedKey.trim().indexOf(sortedKey.trim()[j])] || " ";
      }
  }
  console.log(transposedText);
  return transposedText;
}

function columnarTranspositionDecipher(ciphertext, key) {
  let sortedKey = Array.from(key).sort().join("");
  let segmentLength = Math.ceil(ciphertext.length / key.length);
  let totalSegments = key.length - (segmentLength * key.length - ciphertext.length);
  let segments = Array(key.length).fill("");

  let index = 0;
  for (let char of sortedKey) {
      let originalIndex = key.indexOf(char);
      let length = originalIndex < totalSegments ? segmentLength : segmentLength - 1;
      segments[originalIndex] = ciphertext.substr(index, length);
      index += length;
      key = key.replace(char, " ");
  }
  let plaintext = "";
  for (let i = 0; i < segmentLength; i++) {
      for (let segment of segments) {
          if (segment[i] !== undefined) {
              plaintext += segment[i];
          }
      }
  }
  return plaintext;
}

async function copyTextToClipboard(text) {
  try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
  } catch (err) {
      console.error('Error in copying text: ', err);
  }
}


var OtherSymbols = [' ',',','.',':',';','!','?','-','_','=','+','(',')','[',']','@',
  '`',"'",'"','<','>','|','/','%','$','^','&','*','~'];
var Numbers = ['0','1','2','3','4','5','6','7','8','9'];
var RusAlfUp = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 
  'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
var RusAlfLower = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 
  'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
var EngAlfUp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var EngAlfLower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','m','o','p','q','r','s','t',
  'u','v','w','x','y','z'];
var RusAlfUpEncrypt = Array(33);
var RusAlfLowerEncrypt = Array(33);
var EngAlfUpEncrypt = Array(26); 
var EngAlfLowerEncrypt = Array(26);
var NumbersEncrypt = Array(10);
  
  initEncrypt();
  
function initEncrypt() {
  UserStep = 20
  RusAlfUpEncrypt = CezarEncrypt(UserStep, RusAlfUp);
  RusAlfLowerEncrypt = CezarEncrypt(UserStep, RusAlfLower);
  NumbersEncrypt = CezarEncrypt(UserStep, Numbers);
  EngAlfUpEncrypt = CezarEncrypt(UserStep, EngAlfUp);
  EngAlfLowerEncrypt = CezarEncrypt(UserStep, EngAlfLower);
}
  
function CezarEncrypt(stap, arr) {
  var CopyAlf = arr.slice();
  var i = 0;
  while ((i + stap) < (CopyAlf.length)) {
    var buff = CopyAlf[i];
    CopyAlf[i] = CopyAlf[i + stap];
    CopyAlf[i + stap] = buff;
    i++;     
  }
  return CopyAlf;
}
  
function contains(symb, arr) {
    var letter = symb;
    pos = 0;
    for (var i = 0; i < arr.length; i++) {
      if (letter === arr[i]) {
        pos = i;
        return true;
      }
    }
  }
  
function encrypt(text) {
  var result = '';
  for (var i = 0; i <= text.length; i++) {
    var symbol = text[i];
    if (contains(symbol, Numbers)) {
      symbol = NumbersEncrypt[pos];
    }
    else if (contains(symbol, RusAlfUp)) {
      symbol = RusAlfUpEncrypt[pos];
    }
    else if ((contains(symbol, RusAlfLower))) {
      symbol = RusAlfLowerEncrypt[pos];
    }
    else if (contains(symbol, EngAlfUp)) {
      symbol = EngAlfUpEncrypt[pos];
    }
    else if ((contains(symbol, EngAlfLower))) {
      symbol = EngAlfLowerEncrypt[pos];
    }
    if(symbol !== undefined){
      result += symbol;
    }
  }
  return result;
}
  
function decrypt(text) {
  var result = '';
  for (var i = 0; i <= text.length; i++) {
    var symbol = text[i];
    if (contains(symbol, NumbersEncrypt)) {
      symbol = Numbers[pos];
    }
    else if (contains(symbol, RusAlfUpEncrypt)) {
      symbol = RusAlfUp[pos];
    }
    else if ((contains(symbol, RusAlfLowerEncrypt))) {
      symbol = RusAlfLower[pos];
    }
    else if (contains(symbol, EngAlfUpEncrypt)) {
      symbol = EngAlfUp[pos];
    }
    else if ((contains(symbol, EngAlfLowerEncrypt))) {
      symbol = EngAlfLower[pos];
    }
    if(symbol !== undefined){
      result += symbol;
    }
  }
  return result;
}