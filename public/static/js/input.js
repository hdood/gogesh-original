var cleave = new Cleave("#credits", {
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#price-change-offer", {
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#price-addOffer", {
    numeral: true,
    numeralPositiveOnly: true,
});
var cleave = new Cleave("#change-offer", {
    suffix: "PREFIX",
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#price_add_speciality", {
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#number_speciality", {
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#free_ads", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#duration_ads", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#send_notification", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#number_notification", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});
var cleave = new Cleave("#number_user", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});
var cleave = new Cleave("#discount_ads", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});
var cleave = new Cleave("#price_ads", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});

var cleave = new Cleave("#ads_sector_baner", {
    numericOnly: true,
    numeral: true,
    numeralPositiveOnly: true,
});

new Cleave(".phone", {
    numeral: true,
    numeralPositiveOnly: true,
    delimiter: "",
    numeralIntegerScale: 15,
    stripLeadingZeroes: true,
    numeralThousandsGroupStyle: "lakh",
});
