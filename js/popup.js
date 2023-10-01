const sleep = ms => new Promise(r => setTimeout(r, ms));

const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    document.getElementsByTagName('body')[0].appendChild(textarea);
    textarea.value = text;
    textarea.select()
    textarea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.getElementsByTagName('body')[0].removeChild(textarea);
};

const readAsyncMeow = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) resolve([]);
        else resolve(result[key]);
      });
    });
  };

async function doCopyStuff() {
    const res = await readAsyncMeow("data");
    let s = ""; res.map(x => {s+=`${x}\n`});
    copyToClipboard(s);
}

async function getFId(username){
    const htmlContent = await (await fetch(`https://codeforces.com/profile/${username}`)).text();
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(htmlContent, 'text/html').documentElement;
    const ele = parsedHtml.getElementsByClassName('main-info')[0].getElementsByTagName('h1')[0].getElementsByClassName("friendStar")[0].getAttribute("frienduserid");
    return ele;
}

async function getCsrfToken(){
    const htmlContent = await (await fetch(`https://codeforces.com/`)).text();
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(htmlContent, 'text/html').documentElement;
    const ele = parsedHtml.getElementsByTagName('meta');
    for(i of ele) if(i.getAttribute("name")=="X-Csrf-Token") return i.getAttribute("content");
}

async function beMyFriendPls(username){
    let friendId = await getFId(username);
    let csrfToken = await getCsrfToken();
    await fetch("https://codeforces.com/data/friend", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-csrf-token": csrfToken,
            "x-requested-with": "XMLHttpRequest"
        },
        "body": `friendUserId=${friendId}&isAdd=true&csrf_token=${csrfToken}`,
        "method": "POST"
    });
    // dost bana lo idhar :yayy:
    console.log("bana liya :)) yayyyy");
    const hoGaya = document.getElementById("hoGaya");
    const el = document.createElement("p");
    el.innerText = username+" added.";
    hoGaya.appendChild(el);
}

async function doSetStuff(){
    console.log("dost banaunga! :))");
    const res = await readAsyncMeow("data");
    for(i in res){
        // don't use map as predicate async captures promise resolve
        if(i==res.length-1) continue;
        await beMyFriendPls(res[i]);
        if(i%3==0 && i!=0) await sleep(5000*(i/3));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const copyE = document.getElementById('copy');
    const setE = document.getElementById('set');
    copyE.addEventListener('click', doCopyStuff);
    setE.addEventListener('click', doSetStuff);
});