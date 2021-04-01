"use strict";

function dateShape(date) {
  const year = date.substr(0, 4);
  const month = date.substr(5, 2);
  const day = date.substr(8, 2);
  return year + "/" + month + "/" + day;
}

function digit(num) {
  if (num < 10) {
    return "0" + num;
  }
  return num;
}

function compareDate(a, b) {
  a = a.date;
  b = b.date;
  const yearA = Number(a.substr(0, 4));
  const monthA = Number(a.substr(5, 2));
  const dayA = Number(a.substr(8, 2));
  const yearB = Number(b.substr(0, 4));
  const monthB = Number(b.substr(5, 2));
  const dayB = Number(b.substr(8, 2));
  if (yearA < yearB) {
    return 1;
  } else if (yearA > yearB) {
    return -1;
  } else if (monthA < monthB) {
    return 1;
  } else if (monthA > monthB) {
    return -1;
  } else if (dayA <= dayB) {
    return 1;
  } else {
    return -1;
  }
}

function validation(data) {
  let flag = false;
  let distance = Number(data.distance);
  let min = Number(data.min);
  let sec = Number(data.sec);
  if (distance > 0 && data.date != "") {
    if ((min >= 0 && min < 60) || (min == 60 && sec == 0)) {
      if (sec >= 0 && sec < 60) flag = true;
    }
  }
  return flag;
}

let vm = new Vue({
  el: "#run",
  data: {
    newItem: {
      date: "",
      distance: "",
      min: "",
      sec: "",
    },
    runDatas: [],
  },
  watch: {
    runDatas: {
      handler: function () {
        mainDo(vmChart.datas, vmChart.select);
        localStorage.setItem("runDatas", JSON.stringify(this.runDatas));
      },
      deep: true,
    },
  },
  mounted: function () {
    this.runDatas = JSON.parse(localStorage.getItem("runDatas")) || [];
  },
  methods: {
    addItem: function () {
      document.getElementById("error").innerHTML = "";
      if (validation(this.newItem)) {
        this.newItem.date = dateShape(this.newItem.date);
        this.newItem.time =
          digit(Number(this.newItem.min)) +
          ":" +
          digit(Number(this.newItem.sec));
        delete this.newItem.min;
        delete this.newItem.sec;
        this.runDatas.push(this.newItem);
        this.runDatas.sort(compareDate);
      } else {
        document.getElementById("error").innerHTML = "正しい入力をしてください";
      }
      this.newItem = {
        date: "",
        distance: "",
        time: "",
      };
    },
    deleteItem: function (index) {
      if (confirm("消しますか?")) {
        this.runDatas.splice(index, 1);
      }
    },
  },
});

function yearFilter(datas, year) {
  let retData = [];
  for (let data of datas) {
    if (data.date.substr(0, 4) == year) retData.push(data);
  }
  return retData;
}

function monthFilter(datas, month) {
  let retData = [];
  for (let data of datas) {
    if (data.date.substr(5, 2) == digit(month)) retData.push(data);
  }
  return retData;
}

function createViewData(datas, year) {
  let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let dataY = yearFilter(datas, year);
  let dataM;
  for (let i = 1; i <= 12; i++) {
    dataM = monthFilter(dataY, i);
    count[i - 1] = dataM.length;
    let distance = 0;
    dataM.forEach((data) => {
      distance += Number(data.distance);
    });
    sum[i - 1] = distance;
  }
  return { count, sum };
}

let myChart;

function mainDo(datas, select) {
  let ctx = document.getElementById("myChart").getContext("2d");
  if (myChart) {
    myChart.destroy();
  }
  let { count, sum } = createViewData(datas, select);

  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      datasets: [
        {
          label: "distance",
          data: sum,
          yAxisID: "y-axes-1",
          type: "line",
        },
        {
          label: "count",
          data: count,
          yAxisID: "y-axes-2",
          backgroundColor: "rgba(153,255,51,0.4)",
        },
      ],
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    },
    options: {
      scales: {
        yAxes: [
          {
            id: "y-axes-1",
            type: "linear",
            position: "left",
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              labelString: "総走行距離",
              display: true,
            },
          },
          {
            id: "y-axes-2",
            type: "linear",
            position: "right",
            ticks: {
              stepSize: 1,
              min: 0,
            },
            scaleLabel: {
              labelString: "走行回数",
              display: true,
            },
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
      },
    },
  });
}

let vmChart = new Vue({
  el: "#chart",
  data: {
    datas: vm.runDatas,
    select: "2021",
  },
  watch: {
    select: {
      handler: function () {
        mainDo(this.datas, this.select);
      },
      deep: true,
    },
  },
  mounted: function () {
    mainDo(this.datas, this.select);
  },
});
