
const ticketCardArea = document.querySelector(".ticketCard-area");
const areaMenu = document.querySelector(".regionSearch");
const searchResult = document.querySelector("#searchResult-text");
const regionSearch = document.querySelector(".regionSearch");
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const addBtn = document.querySelector(".addTicket-btn");

let baseData = [];
let newData = [];//新套票資料
let listContent = "";//顯示套票資料內容
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (response) {
        let obj=response.data.data;
        obj.forEach(function (item) {
            baseData.push(item);
        })
        defaultTicket();
    })
    .catch(function (error) {
        console.log(error);
    });


function defaultTicket() {//初始畫面
    searchResult.textContent = `本次搜尋共 ${baseData.length} 筆資料`;
    newData = baseData;
    regionSearch.value = "全部地區";
    init();
}


function init() {//載入內容
    listContent = "";//清空資料
    newData.forEach(function (item, index) {
        let ticketCard =
            `<li class="ticketCard">
    <div class="ticketCard-img">
      <a href="#">
        <img src="${item.imgUrl}" alt="">
      </a>
      <div class="ticketCard-region">${item.area}</div>
      <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
      <div>
        <h3>
          <a href="#" class="ticketCard-name">${item.name}</a>
        </h3>
        <p class="ticketCard-description">
        ${item.description}
        </p>
      </div>
      <div class="ticketCard-info">
        <p class="ticketCard-num">
          <span><i class="fas fa-exclamation-circle"></i></span>
          剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
        </p>
        <p class="ticketCard-price">
          TWD <span id="ticketCard-price">${item.price}</span>
        </p>
      </div>
    </div>
  </li>`;
        listContent += ticketCard;
    });
    ticketCardArea.innerHTML = listContent;
    searchResult.textContent = `本次搜尋共 ${newData.length} 筆資料`
}
//套票地區篩選
regionSearch.addEventListener("change", function (e) {
    let region = e.target.value;
    if (region == "全部地區") {
        newData = baseData;
    } else {
        newData = baseData.filter(function (item, index) {
            return item.area == region;
        })
    }
    init();
})

//新增套票
let allTicketName = [
    "ticketName",
    "ticketImgUrl",
    "ticketRegion",
    "ticketPrice",
    "ticketNum",
    "ticketRate",
    "ticketDescription",
];

addBtn.addEventListener("click", function (e) {
    let newTicket = {};
    newTicket.id = baseData.length;
    newTicket.name = ticketName.value;
    newTicket.imgUrl = ticketImgUrl.value;
    newTicket.area = ticketRegion.value;
    newTicket.description = ticketDescription.value;
    newTicket.group = ticketNum.value;
    newTicket.price = ticketPrice.value;
    newTicket.rate = ticketRate.value;

    let hasValue = 0;

    allTicketName.forEach(function (item, index) {
      let message = `<span>必填!</span>`;
      let itemDom = document.querySelector(`#${item}`);
      let itemMessage = document.querySelector(`#${item}-message`);
  
      if (itemDom.value == "") {//若未填資料
        itemMessage.innerHTML = message;
        hasValue +=1;
      } else {//若有填資料
        itemMessage.innerHTML = "";
        hasValue += 0;
      }
    })
  
    if (ticketRate.value > 10 || ticketRate.value < 1) {//限制星級範圍
      document.querySelector(`#ticketRate-message`).innerHTML = `<span>請填寫${ticketRate.getAttribute("min")}到${ticketRate.getAttribute("max")}之間的數字</span>`;
      hasValue +=1;
    }
  
      if (hasValue >0) {
        return;//若有未填則不新增資料
      }
    baseData.push(newTicket);
    defaultTicket();

    allTicketName.forEach(function (item, index) {//清空表格
        document.querySelector(`#${item}`).value = "";
    })
})
