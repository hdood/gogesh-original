const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

$(document).on("click", ".show_place", function () {
  const place = $(this).parents("tr").find("#place").text();
  const url = $(this).data("url");
  $.get(url).done(function (res) {
    $("#exampleModalLongTitle").text(place);
    $(".modal-body").empty();
    $(".modal-body").html(res);
    $("#status").select2({
      width: "100%",
    });
  });
});

$(document).on("click", "#update_place", function () {
  const url = $("#status").data("url");
  const id = $("#status").data("id");
  const status = $("#status").val();
  const price = $("#price").val();
  $.ajax({
    url: url,
    type: "PUT",
    data: {
      status: status,
      price: price,
    },
  })
    .done(function (data) {
      $("#span_price_" + id).text(price);
      $("#span_status_" + id).html(data["status"]);
      Toast.fire({
        icon: "success",
        title: data["success"],
      });
    })
    .fail(function (data) {
      Toast.fire({
        icon: "error",
        title: data["responseJSON"]["message"],
      });
    });
});
