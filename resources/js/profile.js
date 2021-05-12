$(document).ready(function () {
  //display notification xinh dep
  function displaySuccessNotification() {
    swal.fire({
      position: "center",
      icon: "success",
      // iconColor: "#F51167",
      title: "Thay đổi thành công",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function displayFailNotification(message) {
    swal.fire({
      position: "center",
      icon: "error",
      // iconColor: "#F51167",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //clear all modal inputs
  function clearInputFields() {
    $(".form-control-input-password").each(function () {
      this.value = "";
    });
  }

  //show and hide button on input change
  function getValuesArray() {
    let values = [];
    $(".form-control-input").each(function () {
      values.push(this.value);
    });
    return values;
  }

  let former_state = getValuesArray();

  $(".form-control-input").each(function () {
    $(".save_change_btn").hide();
    let label_value = $(this).siblings(`label[for='${$(this).attr("id")}']`)[0]
      .innerHTML;
    $(this).on("input", function () {
      if ($(this).val() === "") {
        $(".save_change_btn").hide();
        $(this).addClass("is-invalid");
        $(this).siblings(`label[for='${$(this).attr("id")}']`)[0].innerHTML =
          "Không được để trống";
      } else {
        $(".save_change_btn").show();
        $(this).removeClass("is-invalid");
        $(this).siblings(`label[for='${$(this).attr("id")}']`)[0].innerHTML =
          label_value;
      }
      let new_state = getValuesArray();
      if (
        JSON.stringify(new_state) !== JSON.stringify(former_state) &&
        $(this).val() !== ""
      )
        $(".save_change_btn").show();
      else $(".save_change_btn").hide();
    });
  });

  //submit input change
  $("#input_changed_submitting").submit(function (event) {
    $(".save_change_btn").hide();
    former_state = getValuesArray();
    event.preventDefault(); // prevent actual form submit
    let form = $(this);
    let url = form.attr("action");
    let method = form.attr("method"); //get submit url [replace url here if desired]
    $.ajax({
      type: method,
      url,
      dataType: "json",
      data: form.serialize(), // serializes form input
      success: function (data) {
        console.log(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });

  $(".save_change_btn").click(function () {
    displaySuccessNotification();
    $("#input_changed_submitting").submit();
  });

  $(".close_modal_btn").click(function () {
    clearInputFields();
  });

  //submit password change
  $("#password_changed_submitting").submit(function (event) {
    event.preventDefault(); // prevent actual form submit
    let form = $(this);
    let url = form.attr("action");
    let method = form.attr("method"); //get submit url [replace url here if desired]
    $.ajax({
      type: method,
      url,
      dataType: "json",
      data: form.serialize(), // serializes form input
      success: function (response) {
        if (response.success)
          displaySuccessNotification(response.successMessage);
        else displayFailNotification(response.failMessage);
        $("#changePasswordModal").modal("toggle");
        clearInputFields();
      },
      error: function (err) {
        console.log(err);
      },
    });
  });

  $(".change_password_confirm").click(function () {
    //existing empty fields
    if (
      $(".form-control-input-password").filter(function () {
        return $.trim($(this).val()).length === 0;
      }).length !== 0
    ) {
      displayFailNotification("Mật khẩu không được để trống");
      return;
    }
    //password coincided
    if (
      $(".form-control-input-password")[0].value ===
      $(".form-control-input-password")[1].value
    ) {
      displayFailNotification("Mật khẩu mới phải khác mật khẩu cũ");
      clearInputFields();
      return;
    }
    //incorrect confirm password
    if (
      $(".form-control-input-password")[1].value !==
      $(".form-control-input-password")[2].value
    ) {
      displayFailNotification("Mật khẩu xác nhận chưa chính xác");
      clearInputFields();
      return;
    }
    $("#password_changed_submitting").submit();
  });

  $(".avatar_holder").click(function () {
    $("#changeAvatarModal").modal("toggle");
  });

  $.fn.fileinputBsVersion = "3.3.7";

  $("#avatar").fileinput();

  $("#avatar").fileinput({'showUpload':false, 'previewFileType':'any'});

  var btnCust =
    '<button type="button" class="btn btn-secondary" title="Add picture tags" ' +
    "onclick=\"alert('Call your custom code here.')\">" +
    '<i class="glyphicon glyphicon-tag"></i>' +
    "</button>";
  $("#avatar").fileinput({
    overwriteInitial: true,
    maxFileSize: 1500,
    showClose: false,
    showCaption: false,
    showBrowse: false,
    browseOnZoneClick: true,
    removeLabel: "",
    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
    removeTitle: "Cancel or reset changes",
    elErrorContainer: "#kv-avatar-errors-2",
    msgErrorClass: "alert alert-block alert-danger",
    defaultPreviewContent:
      '<img src="/resources/images/default_avatar.png" alt="Your Avatar"><h6 class="text-muted">Click to select</h6>',
    layoutTemplates: { main2: "{preview} " + btnCust + " {remove} {browse}" },
    allowedFileExtensions: ["jpg", "png", "gif"],
  });
});