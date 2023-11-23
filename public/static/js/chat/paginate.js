var page_contact = 2;
var has_data = true;
const scrollableDiv = $("#contacts");

scrollableDiv.scroll(function () {
  const scrollTop = scrollableDiv.scrollTop();
  const scrollHeight = scrollableDiv[0].scrollHeight;
  const clientHeight = scrollableDiv.height();
  const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

  // Define a small threshold value to account for potential rounding errors
  const threshold = 1;
  const url = $(this).data("url");
  if (has_data) {
    if (distanceFromBottom <= threshold) {
      $.get(url + "?page=" + page_contact, function (data, textStatus, jqXHR) {
        $("#contacts").append(data);
        
        $("#contacts").scrollTop(scrollTop - 30);
        page_contact++;
        if (data) {
          has_data = true;
        } else {
          $("#contacts").find("p").last().remove();

          $("#contacts").append(
            '<p class="p-3" style="text-align:center">No More Data</p>'
          );
          has_data = false;
        }
      });
    }
  }
});
