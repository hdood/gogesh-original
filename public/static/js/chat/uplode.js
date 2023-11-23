$("#imageFileInput").css("opacity", "0");
$("#imageFileInput").css("width", "0");
$("#select_image").click(function (e) {
  e.preventDefault();
  $("#imageFileInput").trigger("click");
});
const input = document.querySelector("#imageFileInput");
const output = document.querySelector("output");
let imagesArray = [];
input.addEventListener("change", () => {
  const file = input.files;
  if (input.value == "") {
    output.innerHTML = "";
  }
  imagesArray = [];
  imagesArray.push(file[0]);
  displayImages();
});

function displayImages() {
  let images = "";
  imagesArray.forEach((image, index) => {
    images = `<div class="image">
                <img src="${URL.createObjectURL(image)}" alt="image">
                <span id="del_image" onclick="deleteImage(${index})"><i class="fas fa-times text-danger"
                style="right:0"></i></span>
              </div>`;
  });
  output.innerHTML = images;
}

function deleteImage(index) {
  imagesArray.splice(index, 1);
  displayImages();
  $("#imageFileInput").val("");
}
