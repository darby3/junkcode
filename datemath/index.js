var curDate = new Date();
console.log(curDate.toString());
console.log(curDate.toDateString());

function getNewDateString() {
  var curDate = new Date();
  var curYear = curDate.getFullYear();
  var curMonth = curDate.getMonth() + 1;
  var curDay = curDate.getDate();
  var curHours = curDate.getHours();
  var curMinutes = curDate.getMinutes();

  var dateString = "dist--";

  dateString += curYear.toString();
  dateString += (curMonth <= 9) ? "0" + curMonth.toString() : (curMonth).toString();
  dateString += (curDay <= 9) ? "0" + curDay.toString() : (curDay).toString();

  dateString += "_";

  dateString += (curHours <= 9) ? "0" + curHours.toString() : (curHours).toString();
  dateString += (curMinutes <= 9) ? "0" + curMinutes.toString() : (curMinutes).toString();

  return dateString;
};


console.log(
  "getNewDateString() -- " + 
   getNewDateString()
);