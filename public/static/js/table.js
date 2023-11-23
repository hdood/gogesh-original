$(document).ready(function () {
    function newexportaction(e, dt, button, config) {
        var self = this;
        var oldStart = dt.settings()[0]._iDisplayStart;
        dt.one("preXhr", function (e, s, data) {
            // Just this once, load all data from the server...
            data.start = 0;
            data.length = 2147483647;
            dt.one("preDraw", function (e, settings) {
                // Call the original action function
                if (button[0].className.indexOf("buttons-copy") >= 0) {
                    $.fn.dataTable.ext.buttons.copyHtml5.action.call(
                        self,
                        e,
                        dt,
                        button,
                        config
                    );
                } else if (button[0].className.indexOf("buttons-excel") >= 0) {
                    $.fn.dataTable.ext.buttons.excelHtml5.available(dt, config)
                        ? $.fn.dataTable.ext.buttons.excelHtml5.action.call(
                              self,
                              e,
                              dt,
                              button,
                              config
                          )
                        : $.fn.dataTable.ext.buttons.excelFlash.action.call(
                              self,
                              e,
                              dt,
                              button,
                              config
                          );
                } else if (button[0].className.indexOf("buttons-csv") >= 0) {
                    $.fn.dataTable.ext.buttons.csvHtml5.available(dt, config)
                        ? $.fn.dataTable.ext.buttons.csvHtml5.action.call(
                              self,
                              e,
                              dt,
                              button,
                              config
                          )
                        : $.fn.dataTable.ext.buttons.csvFlash.action.call(
                              self,
                              e,
                              dt,
                              button,
                              config
                          );
                } else if (button[0].className.indexOf("buttons-pdf") >= 0) {
                    $.fn.dataTable.ext.buttons.pdfHtml5.available(dt, config)
                        ? $.fn.dataTable.ext.buttons.pdfHtml5.action.call(
                              self,
                              e,
                              dt,
                              button,
                              config
                          )
                        : $.fn.dataTable.ext.buttons.pdfFlash.action.call(
                              self,
                              e,
                              dt,
                              button,
                              config
                          );
                } else if (button[0].className.indexOf("buttons-print") >= 0) {
                    $.fn.dataTable.ext.buttons.print.action(
                        e,
                        dt,
                        button,
                        config
                    );
                }
                dt.one("preXhr", function (e, s, data) {
                    // DataTables thinks the first item displayed is index 0, but we're not drawing that.
                    // Set the property to what it was before exporting.
                    settings._iDisplayStart = oldStart;
                    data.start = oldStart;
                });
                // Reload the grid with the original page. Otherwise, API functions like table.cell(this) don't work properly.
                setTimeout(dt.ajax.reload, 0);
                // Prevent rendering of the full data to the DOM
                return false;
            });
        });
        // Requery the server with the new one-time export settings
        dt.ajax.reload();
    }
    const locale = $("body").data("lang");
    var lang = "";

    var active = "Active";
    var inactive = "Inactive";
    var approved = "Approved";
    var pending = "Pending";
    var rejected = "Rejected";
    var not_paid = "Not_Paid";
    if (locale == "ar") {
        var active = "مفعلة";
        var inactive = "غير مفعلة";
        not_paid = "غير مدفوعة";
        approved = "مقبول";
        pending = "قيد الانتظار";
        rejected = "مرفوض";
        var lang = {
            sProcessing: "جاري التحميل...",
            sLengthMenu: "أظهر مُدخلات _MENU_",
            sZeroRecords: "لم يُعثر على أية سجلات",
            sInfo: "إظهار _START_ إلى _END_ من أصل _TOTAL_ مُدخل",
            sInfoEmpty: "يعرض 0 إلى 0 من أصل 0 سجلّ",
            sInfoFiltered: "(منتقاة من مجموع _MAX_ مُدخل)",
            sInfoPostFix: "",
            sSearch: "ابحث:",
            sUrl: "",
            oPaginate: {
                sFirst: "الأول",
                sPrevious: "السابق",
                sNext: "التالي",
                sLast: "الأخير",
            },
        };
    }
    function initializeDataTable(tableSelector) {
        var columns = [];
        const index = $(tableSelector).find("th[data-sort]").index();
        var lastColumnIndex = $(tableSelector).find("th:last-child").index();
        $(tableSelector)
            .find("th")
            .each(function () {
                var columnData = {
                    data: $(this).data("name"), // Assuming the data attribute contains the column name.
                    name: $(this).data("name"), // You can adjust this based on your requirements.
                };
                columns.push(columnData);
            });
        var table = $(tableSelector).DataTable({
            language: lang,
            processing: true,
            serverSide: true,
            dom: "Bfrtip",
            iDisplayLength: 25,
            // order: index != -1 ? [[index, "asc"]] : 0,
            buttons: [
                {
                    extend: "copy",
                    text: '<i class="fa fa-files-o" style="color: green;"></i>',
                    titleAttr: "Copy",
                    exportOptions: {
                        columns: ":not(:last-child)",
                    },
                    action: newexportaction,
                },
                {
                    extend: "excel",
                    text: '<i class="fa fa-file-excel-o" style="color: green;"></i>',
                    titleAttr: "Excel",
                    exportOptions: {
                        columns: ":not(:last-child)",
                    },
                    action: newexportaction,
                },
                {
                    extend: "csv",
                    text: '<i class="fa fa-file-text-o" style="color: green;"></i>',
                    titleAttr: "CSV",
                    exportOptions: {
                        columns: ":not(:last-child)",
                    },
                    action: newexportaction,
                },
            ],
            ajax: $(tableSelector).data("url"),
            columns: columns,
            columnDefs: [
                {
                    targets: lastColumnIndex,
                    orderable: false, // Enable sorting for this column
                },
            ],
        });

        // Add column filtering
        $(tableSelector + " thead th:not(:first-child, :last-child)").each(
            function () {
                var name = $(this).data("filter");
                var title = $(this).text();
                var spanWidth = $(this).find("span").width() + 10;
                if (name == "apr") {
                    $(this).html(
                        `<select class="select2 select2-hidden-accessible" id='" + this.id + "' style="outline: none;border: none;">
                            <option value=''>${title}</option>
                            <option value='${approved}'>${approved}</option>
                            <option value='${pending}'>${pending}</option>
                            <option value='${rejected}'>${rejected}</option>
                            <option value='${not_paid}'>${not_paid}</option>
                        </select>`
                    );
                } else if (name == "ai") {
                    $(this).html(
                        `<select class="select2 select2-hidden-accessible" id='" + this.id + "' style="outline: none;border: none;">
                            <option value=''>${title}</option>
                            <option value='${active}'>${active}</option>
                            <option value='${inactive}'>${inactive}</option>
                        </select>`
                    );
                } else {
                    $(this).html(
                        '<input type="text" placeholder="' +
                            title +
                            '" style="outline: none;border: none;"/>'
                    );
                }
                $(".select2").select2({
                    width: "100%",
                    minimumResultsForSearch: -1,
                });
                var titleWidth = $(this).outerWidth();
                $("input", this).css("width", spanWidth + "px");
            }
        );

        // Apply column filtering
        table.columns().every(function () {
            var that = this;

            $("input", this.header()).on("keyup change", function () {
                if (that.search() !== this.value) {
                    that.search(this.value).draw();
                }
            });

            $("select", this.header()).on("change", function () {
                if (that.search() !== this.value) {
                    that.search(this.value).draw();
                }
            });
        });
    }
    initializeDataTable(".table-data");
});
