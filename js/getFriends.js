async function fetchFriends() {
  const htmlContent = await (await fetch("https://codeforces.com/friends")).text();
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(htmlContent, 'text/html').documentElement;
  const datatableElement = parsedHtml.getElementsByClassName('datatable')[0].getElementsByClassName('rated-user');
  return Array.from(datatableElement).map(x => x.innerText);
}

async function getUsername() {
  const htmlContent = await (await fetch("https://codeforces.com")).text();
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(htmlContent, 'text/html').documentElement;
  return parsedHtml.getElementsByClassName('lang-chooser')[0].children[1].children[0].text;
}

const readAsync = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (result[key] === undefined) resolve([]);
      else resolve(result[key]);
    });
  });
};

// key, array
async function appendToStorage(key, value){
  let s = await readAsync(key);
  value.map((x) => s.push(x));
  let r = Array.from(new Set(s));
  let obj = {}; obj[key]=r;
  chrome.storage.sync.set(obj, () => {console.log("kar diya");});
}

async function checkAndPut(username){
  if((await readAsync("usernames")).includes(username)) return 1;
  appendToStorage("usernames", [username]);
  return 0;
}

async function doStuff() {
  const username = await getUsername();
  console.log(username);
  // if(await checkAndPut(username)) return;
  console.log("abe kitte alt hai bhai :((");
  const res = await fetchFriends();
  await appendToStorage("data", res);
}

doStuff();