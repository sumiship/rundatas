"use strict";

function dateShape(date) {
  const year = date.substr(0, 4);
  const month = date.substr(5, 2);
  const day = date.substr(8, 2);
  return year + "/" + month + "/" + day;
}

function digit(num) {
  if (Number(num) < 10) {
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
      this.newItem.date = dateShape(this.newItem.date);
      this.newItem.time =
        digit(this.newItem.min) + ":" + digit(this.newItem.sec);
      delete this.newItem.min;
      delete this.newItem.sec;
      this.runDatas.push(this.newItem);
      this.runDatas.sort(compareDate);
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
