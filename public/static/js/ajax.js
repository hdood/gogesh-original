$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var lan = {
        ar: {
            title: "هل انت متأكد؟",
            yes: "نعم",
            cancel: "الغاء",
            approved: "مقبول!",
            approved_message: "هذا العنصر تم قبوله",
            delete: "هل تريد حذف هذا من قاعدة البيانات",
            deleted: "تم الحذف",
            delete_message: "هذا العنصر تم حذفه",
        },
        en: {
            title: "are yoy sure ?",
            yes: "yes",
            cancel: "cancel",
            approved: "Approved!",
            approved_message: "Your item has been Approved.",
            delete: "do you want delete this item ",
            deleted: "Deleted",
            delete_message: "Your file has been deleted.",
        },
    };
    $code = $("body").data("lang");
    if ($code == "ar") {
        var title = lan.ar.title;
        var yes = lan.ar.yes;
        var cancel = lan.ar.cancel;
        var approved = lan.ar.approved;
        var approved_message = lan.ar.approved_message;
        var delete_qus = lan.ar.delete;
        var delete_message = lan.ar.delete_message;
        var deleted = lan.ar.deleted;
    } else {
        var title = lan.en.title;
        var yes = lan.en.yes;
        var cancel = lan.en.cancel;
        var approved = lan.en.approved;
        var approved_message = lan.en.approved_message;
        var delete_qus = lan.en.delete;
        var delete_message = lan.en.delete_message;
        var deleted = lan.en.deleted;
    }
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

    const fireApproved = {
        icon: "warning",
        title: title,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: yes,
        cancelButtonText: cancel,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
    };

    const fireDelete = {
        icon: "warning",
        title: title,
        text: delete_qus,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: yes,
        cancelButtonText: cancel,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
    };
    //  ! Update passwored customer
    $("#update-password").click(function (e) {
        const url = $(this).data("url");
        const password = $("#input-password").val();
        const confirm_password = $("#input-confirmation").val();

        // console.log(password);
        $.ajax({
            url: url,
            type: "PUT",
            data: {
                password: password,
                password_confirmation: confirm_password,
            },
        })
            .done(function (data) {
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

    //  ! Payment

    $(".checkPayment").click(function (e) {
        const isChecked = $(this).is(":checked");
        const student = $(this)
            .parents("td")
            .parents("tr")
            .attr("data-student");
        const month = $(this).parents("td").parents("tr").attr("data-month");
        const year = $(this).parents("td").parents("tr").attr("data-year");
        const url = $(this).attr("data-url");
        console.log(url);
        $.post(
            url,
            {
                year: year,
                month: month,
                check: isChecked,
                student: student,
            },
            function (data, status) {
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
                Toast.fire({
                    icon: data["icon"],
                    title: data["success"],
                });
                // alert("Data: " + data['succses'] + "\nStatus: " + status);
            }
        );
    });

    //  ! Search bar

    $(document).on("input", "#search_input", function () {
        if ($.trim($(this).val()) == "") {
            $(".search-bar").removeClass("active");
        } else {
            $(".search-bar").addClass("active");
            $.get(
                `${document.location.origin}/ajax/student/${$(this).val()}`,
                function (data, status) {
                    $(".table1 tr").remove();
                    $.each(data.data, function (index, value) {
                        $(".table1 tbody").append(`
                <tr data-month="${value.month}" data-year="${value.year}"
                data-student="${value.id}">
                    <td>#${value.id}</td>
                    <td><a href="/student/${value.id}/details">${value.name} </a></td>
                    <td>${value.gender}</td>
                    <td>${value.group}</td>
                    <td>${value.section}</td>
                    <td>${value.birthday}</td>
                    <td width="10">
                    <div class="form-check form-check-success">
                        <input type="checkbox" value="${value.id}"
                            class="form-check-input checkPayment"
                            data-url="${document.location.origin}/ajax/payment" onclick='const isChecked = $(this).is(":checked");const student = $(this).parents("td").parents("tr").attr("data-student");const month = $(this).parents("td").parents("tr").attr("data-month");const year = $(this).parents("td").parents("tr").attr("data-year");const url = $(this).attr("data-url");console.log(url);$.post(url,{year: year,month: month,check: isChecked,student: student,},function (data, status) {const Toast = Swal.mixin({toast: true,position: "top-end",showConfirmButton: false,timer: 3000,timerProgressBar: true,didOpen: (toast) => {toast.addEventListener("mouseenter", Swal.stopTimer);toast.addEventListener("mouseleave", Swal.resumeTimer);},});Toast.fire({icon: data["icon"],title: data["success"],});});' id="checkPayment"
                            ${value.checked} >
                        <label class="form-check-label">
                        ${value.monthName}
                        </label>
                    </div>
                </td>
            </tr>`);
                    });
                }
            );
        }
    });

    //  ! Message

    $(".checkMessge").click(function (e) {
        $(".checkMessge").not(this).prop("checked", false);
    });

    //  ! Delete Item
    $("body").on("click", "#del", function () {
        var userURL = $(this).data("url");
        var trObj = $(this);
        Swal.fire(fireDelete).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: userURL,
                    type: "DELETE",
                    success: function (response) {
                        trObj.parents("tr").remove();
                        Swal.fire(deleted, delete_message, "success");
                    },
                    error: function (xhr, status, error) {
                        // Handle errors if any
                        Toast.fire({
                            icon: "error",
                            title: xhr["error"],
                        });
                    },
                });
            }
        });
    });

    //  ! Delete Image
    $("body").on("click", "#del_image", function () {
        var userURL = $(this).data("url");

        var trObj = $(this).parent(".div-img");
        Swal.fire(fireDelete).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: userURL,
                    type: "PUT",
                    success: function (response) {
                        trObj.remove();
                        Swal.fire(
                            "Deleted!",
                            "Your file has been deleted.",
                            "success"
                        );
                    },
                });
            }
        });
    });

    $("body").on("change", "#addCountry", function () {
        const selectedCountry = $(this).val();
        const url = document.location.origin + "/ajax/city/" + selectedCountry;
        const citySelect = $("#addCity");
        $("#addCity > option").remove();
        $("#addRegion > option").remove();

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (response) {
                $("#addCity > option").remove();
                citySelect.html("<option value=''>Select City</option>");

                response.data.forEach((city) => {
                    const option = $("<option></option>")
                        .val(city["id"])
                        .text(city["name"]);
                    citySelect.append(option);
                });
            },
        });
    });

    $("body").on("change", "#addCity", function () {
        const selectedCity = $(this).val();
        const url = document.location.origin + "/ajax/region/" + selectedCity;
        const regionSelect = $("#addRegion");

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (response) {
                $("#addRegion > option").remove();
                regionSelect.html("<option value=''>Select Region</option>");

                response.data.forEach((region) => {
                    const option = $("<option></option>")
                        .val(region["id"])
                        .text(region["name"]);
                    regionSelect.append(option);
                });
            },
        });
    });

    $("body").on("change", "#sector_id", function () {
        const selectedCountry = $(this).val();
        const url =
            document.location.origin + "/ajax/sub-sector/" + selectedCountry;
        const Select = $("#sub_sector_id");
        $("#sub_sector_id > option").remove();
        $("#activity_id > option").remove();
        $("#speciality_id > option").remove();
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (response) {
                $("#sub_sector_id > option").remove();
                Select.html("<option value=''>Select activity</option>");

                response.data.forEach((data) => {
                    const option = $("<option></option>")
                        .val(data["id"])
                        .text(data["name"]);
                    Select.append(option);
                });
            },
        });
    });

    $("body").on("change", "#sub_sector_id", function () {
        const selectedCity = $(this).val();
        const url = document.location.origin + "/ajax/activity/" + selectedCity;
        const Select = $("#activity_id");

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (response) {
                $("#activity_id > option").remove();
                Select.html("<option value=''>Select speciality</option>");

                response.data.forEach((data) => {
                    const option = $("<option></option>")
                        .val(data["id"])
                        .text(data["name"]);
                    Select.append(option);
                });
            },
        });
    });
    $("body").on("change", "#activity_id", function () {
        const selectedCity = $(this).val();
        const url =
            document.location.origin + "/ajax/speciality/" + selectedCity;
        const Select = $("#speciality_id");

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (response) {
                $("#speciality_id > option").remove();
                Select.html("<option value=''>Select speciality</option>");

                response.data.forEach((data) => {
                    const option = $("<option></option>")
                        .val(data["id"])
                        .text(data["name"]);
                    Select.append(option);
                });
            },
        });
    });

    $("#commercial_activity").select2({
        width: "100%",
        placeholder: "Select an Commercial Acivity",
        ajax: {
            url:
                document.location.origin +
                "/ajax/autocomplete/commercial_activity",
            dataType: "json",
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.name,
                            id: item.id,
                        };
                    }),
                };
            },
            cache: true,
        },
    });

    $("#seller").select2({
        width: "100%",
        placeholder: "Select an Seller",
        ajax: {
            url: document.location.origin + "/ajax/autocomplete/seller",
            dataType: "json",
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.firstname + " " + item.lastname,
                            id: item.id,
                        };
                    }),
                };
            },
            cache: true,
        },
    });
    //  ! Approved Item
    $("body").on("click", "#approved", function () {
        var userURL = $(this).data("url");
        var id = $(this).data("id");
        var trObj = $(this);
        Swal.fire(fireApproved).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: userURL,
                    type: "get",
                    success: function (response) {
                        $("#spanStatus_" + id).html(response);
                        trObj.remove();
                        Swal.fire(approved, approved_message, "success");
                    },
                    error: function (xhr, status, error) {
                        // Handle errors if any
                        Toast.fire({
                            icon: "error",
                            title: xhr["error"],
                        });
                    },
                });
            }
        });
    });
});
