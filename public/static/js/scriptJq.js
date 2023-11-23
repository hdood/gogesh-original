$(document).ready(function () {
    $("#selectReason").val(null);
    $("body").on("change", "#editstatus", function () {
        if ($(this).val() == "Rejected") {
            $("#reason").removeClass("d-none");
        } else {
            $("#reason").addClass("d-none");
            $("#selectReason").val(null);
        }
    });

    $("body").on("click", "#add-feature", function () {
        $("output").append(`
            <div class="col-12 row">
                <span id="del_feature" style=""><i class="fas fa-times text-danger" style="right:0"></i></span>

                <div class="col-md-6 form-group">
                    <label>Title En *</label>
                    <input type="text" name="features[]" id="price-change-offer" placeholder=""
                        class="form-control" value="" required>
                </div>
                <div class="col-md-6 form-group">
                    <label>Title Ar *</label>
                    <input type="text" name="features_ar[]" placeholder="" class="form-control"
                        value="">
                </div>
            </div>
    `);
    });

    $("body").on("click", "#del_feature", function () {
        $(this).parent("div").remove();
    });

    $("body").on("dblclick", ".table-customers tr", function () {
        var url = $(this).attr("id");
        window.open(url);
    });

    $("body").on("click", ".answer-trigger-button", function () {
        $(".answer-wrapper").toggleClass("d-block");
    });

    // Function to toggle password visibility

    // Add event listener to the button
    $("#toggleButton").on("click", function () {
        $(this).toggleClass("fa-unlock");
        const inputType = $("#password").attr("type");
        const newInputType = inputType === "password" ? "text" : "password";
        $("#password").attr("type", newInputType);
    });
});
