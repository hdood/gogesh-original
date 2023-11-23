var cleave = new Cleave(".card-number", {
  creditCard: true,
  onCreditCardTypeChanged: function (type) {
    if (type == "unknown") {
      $("#type-card").text("");
    } else {
      $("#type-card").text(type);
    }
  },
});
var cleave = new Cleave(".card-date", {
  date: true,
  datePattern: ["m", "Y"],
});
