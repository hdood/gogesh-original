$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });
  var contact_id;

  $("#conversation").scrollTop($("#conversation").prop("scrollHeight"));
  const pusher = new Pusher("03bc938e1f50ad1ec1a2", {
    cluster: "eu",
  });
  var privateChannels = [];
  function subscribeToChannel(contactID) {
    var channelName = "chat" + contactID;
    var privateChannel = pusher.subscribe(channelName);
    privateChannels.push(privateChannel);
    privateChannel.bind("chat", function (data) {
      console.log(data);
      $.post("/contact/receive", {
        message: data.message,
      }).done(function (res) {
        $("#conversation").append(res);
        $("#conversation").scrollTop($("#conversation").prop("scrollHeight"));
      });
    });
  }
  function unsubscribeFromChannel() {
    privateChannels.forEach((element) => {
      element.unsubscribe();
    });
    privateChannels = [];
  }
  $(".icon-around").click(function (e) {
    e.preventDefault();
    $(".messages").removeClass("d-block");
  });
  $("#contact*").click(function (e) {
    e.preventDefault();
    $(this).find("#active").remove();
    $(".messages").addClass("d-block");
    var contactID;
    $("#message_title").text($(this).find("#contact_title").text());
    const id = $(this).data("id");
    const url = $(this).data("url");
    $.get(url, function (data, textStatus, jqXHR) {
      $("#conversation").empty();
      $(".answer-send-button").data("id", id);
      $("#conversation").data("url", url);
      $("#conversation").data("id", id);
      $("#conversation").append(data);
      contactID = $("#conversation").data("id");
      $("#conversation").scrollTop($("#conversation").prop("scrollHeight"));
    }).done(function () {
      unsubscribeFromChannel();
      subscribeToChannel(contactID);
    });
    page = 2;
    has_data = true;
  });

  var defaultContactID = $("#conversation").data("id");
  if (defaultContactID) {
    subscribeToChannel(defaultContactID);
  }
  $("#conversation").scroll(function () {
    // Get the current scroll position
    var scrollTop = $(this).scrollTop();
    const url = $(this).data("url");
    if (scrollTop === 0) {
      // Increment the page number
      if (has_data == true) {
        $.get(url + "?page=" + page, function (data, textStatus, jqXHR) {
          $("#conversation").prepend(data);
          page++;
          if (data) {
            $("#conversation").scrollTop(scrollTop + 500);
            has_data = true;
          } else {
            $("#conversation").find("p").first().remove();

            $("#conversation").prepend(
              '<p class="p-3" style="text-align:center">No More Data</p>'
            );
            has_data = false;
          }
        });
      }
    }
  });
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
  //Broadcast messages
  $(".answer-send-button").click(function (e) {
    e.preventDefault();
    // Get the selected image file
    const inputFile = $("#imageFileInput")[0];
    const file = inputFile.files[0];
    console.log(file);
    if (file || $("#message").val().trim() != "") {
      const formData = new FormData();
      if (file) {
        formData.append("attachment", file);
      } else {
        formData.append("attachment", null);
      }
      formData.append("message", $("#message").val());
      formData.append("contact_id", $(this).data("id"));
      const url = $(this).data("url");
      var currentTime = new Date();
      var hours = currentTime.getHours();
      var minutes = currentTime.getMinutes();

      // Add leading zero if needed
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      var formattedTime = hours + ":" + minutes;
      try {
        var content = `<div class="row message-body" id="last_message">
                <div class="col-sm-12 message-main-sender">
                    <div class="sender">
                        <div class="message-text"> ${$("#message").val()}</div>
                        <div class="message-text">
                                <img src="${URL.createObjectURL(
                                  file
                                )}" alt="" srcset="">
                            </div>
                        <span class="message-time pull-right"> Sun </span>
                    </div>
                </div>
            </div>`;
      } catch (error) {
        var content = `<div class="row message-body" id="last_message">
                <div class="col-sm-12 message-main-sender">
                    <div class="sender">
                        <div class="message-text"> ${$("#message").val()}</div>

                        <span class="message-time pull-right"> ${formattedTime} </span>
                    </div>
                </div>
            </div>`;
      }

      $("#conversation").append(content);
      $("#message").val("");
      $("#imageFileInput").val("");
      $("output").html("");
      $("#conversation").scrollTop($("#conversation").prop("scrollHeight"));
      $.ajax({
        url: url,
        method: "POST",
        headers: {
          "X-Socket-Id": pusher.connection.socket_id,
        },
        data: formData,
        processData: false, // Important! Don't process the data
        contentType: false, //
        success: function (res) {
          // Handle the server response after form submission
          $("#conversation").scrollTop($("#conversation").prop("scrollHeight"));
        },
        error: function (xhr, status, error) {
          // Handle errors if any
          Toast.fire({
            icon: "error",
            title: xhr["responseJSON"]["message"],
          });
          $("#last_message:last-child").remove();
          $("#conversation").scrollTop($("#conversation").prop("scrollHeight"));
        },
      });
    } else {
    }
  });
  $("#message").keypress(function (e) {
    var key = e.key || String.fromCharCode(e.which || e.keyCode);

    if (key === "Enter") {
      $(".answer-send-button").trigger("click");
    }
  });

  
});
