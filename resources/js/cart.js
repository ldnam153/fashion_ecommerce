$(document).ready(function () {
  getProductsNumber();
  $(
    '<div class="quantity-nav"><button class="quantity-button quantity-up">+</button><button class="quantity-button quantity-down">-</button></div>'
  ).insertAfter(".quantity input");
  $(".quantity").each(function () {
    var spinner = $(this),
      input = spinner.find('input[type="number"]'),
      btnUp = spinner.find(".quantity-up:enabled"),
      btnDown = spinner.find(".quantity-down:enabled"),
      min = input.attr("min"),
      max = input.attr("max");

    btnUp.click(function () {
      $(this).prop('disable', true);
      $('.quantity').children('input').css({'color':'grey'});
      setTimeout(() => {
        var oldValue = +input.val();
        if (oldValue >= max) {
          var newVal = oldValue;
          swal.fire({
            position: "center",
            icon: "error",
            // iconColor: "#F51167",
            title: "Số lượng còn lại không đủ",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
        calculateSingleProductTotalPriceOnButtonClicked($(this), newVal);
        getProductsNumber();
        $(this)
          .parent()
          .parent()
          .siblings(".hidden_amount_changed_form")
          .submit();
        $(this).prop('disable', false);
        $('.quantity').children('input').css({'color':'black'});
      }, 1000);
    });

    btnDown.click(function () {
      $(this).prop('disable', true);
      $('.quantity').children('input').css({'color':'grey'});
      setTimeout(() => {
        var oldValue = +input.val();
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
        calculateSingleProductTotalPriceOnButtonClicked($(this), newVal);
        getProductsNumber();
        $(this)
          .parent()
          .parent()
          .siblings(".hidden_amount_changed_form")
          .submit();
        $(this).prop('disable', false);
        $('.quantity').children('input').css({'color':'black'});
      }, 750);
    });
  });

  $(".hidden_amount_changed_form").submit(function (event) {
    event.preventDefault(); // prevent actual form submit
    let form = $(this);
    let url = form.attr("action");
    let method = form.attr("method");
    let total = 0;
    $(".product_price_total").each(function () {
      total += +this.innerText.replace(/[₫.]/g, "");
    });
    let data = form.serialize();
    data += `&tongsanpham=${+$(".flaticon-bag").siblings("span")[0]
      .innerText}&tongiatien=${total}`;
    $.ajax({
      type: method,
      url,
      dataType: "json",
      data, // serializes form input
      success: function (response) {
        if (response.empty) {
          if ($('.single_product').length) {
            return;
          }
          $(".cart_container").append(`<div class="empty_cart_container">
          <img src="/resources/img/cart/empty-cart.svg" alt="empty-cart-photo">
          <h3>Không có sản phẩm nào trong giỏ hàng</h3>
          <button class="site-btn sb-line sb-dark continue_shopping_btn" onclick="window.location.href = '/products/';">Tiếp tục mua sắm</button>
        </div>`);
          $(".temp_bill").remove();
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });

  $(".delete_button").each(function () {
    $(this).click(function () {
      swal
        .fire({
          title: "Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "green",
          cancelButtonColor: "red",
          confirmButtonText: "Vâng",
          cancelButtonText: "Huỷ",
        })
        .then((result) => {
          if (result.isConfirmed) {
            swal.fire( {
              title: "Sản phẩm vừa được xoá khỏi giỏ hàng",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,}
            );
            let form = $(this)
              .parent()
              .siblings(".product_quantity")
              .children(".hidden_amount_changed_form");
            form.attr("action", "/users/remove-from-cart");
            form.submit();
            form.attr("action", "/users/change-amount-cart");
            $(this).parent().parent().remove();
            calculateAllProductTotalPrice();
            getProductsNumber();
          }
        });
    });
  });

  $(".pay_btn").click(function () {
    let cart = $(".hidden_amount_changed_form").children('input[name="magiohang"]').val();
    window.location.href = `/users/payment-preview/${cart}`;
  });

  $(".btn_update_input").click(() => {
    $('#address_post').val($('#address_input').val());
    $('#sdt_post').val($('#sdt_input').val());
    $('.pay_form').submit();
  })

  calculateSingleProductTotalPrice();
  calculateAllProductTotalPrice();

  //functions

  function calculateSingleProductTotalPrice() {
    $(".product_price_total").each(function () {
      $(this).html(
        new Intl.NumberFormat('vi-VI', { style: 'currency', currency: 'VND' }).format(
        +$(this)
          .parent()
          .siblings(".product_details")
          .find("#product_price")[0]
          .innerText.replace(/[₫.]/g, "") *
          +$(this)
            .parent()
            .siblings(".product_quantity")
            .children(".quantity")
            .children("input")
            .val()
        )
      );
    });
  }

  function calculateSingleProductTotalPriceOnButtonClicked(param, newVal) {
    param
      .parent()
      .parent()
      .parent()
      .siblings(".product_total_price")
      .find(".product_price_total")
      .html(new Intl.NumberFormat('vi-VI', { style: 'currency', currency: 'VND' }).format(
        +param
          .parent()
          .parent()
          .parent()
          .siblings(".product_details")
          .find("#product_price")[0]
          .innerText.replace(/[₫.]/g, "") *
          +param.parent().siblings("input").val()
        )
      );
    param
      .parent()
      .parent()
      .siblings(".hidden_amount_changed_form")
      .children('input[name="soluong"]')
      .val(newVal);
    calculateAllProductTotalPrice();
  }

  function calculateAllProductTotalPrice() {
    let total = 0;
    $(".product_price_total").each(function () {
      total += +this.innerText.replace(/[₫.]/g, "");
    });
    $(".total_price_container")
      .children("#total_cart_price")
      .html(new Intl.NumberFormat('vi-VI', { style: 'currency', currency: 'VND' }).format(total));
  }

  function getProductsNumber() {
    let total = 0;
    let check = false;
    $(".quantity").each(function () {
      total += +$(this).children("input").val();
      if (+$(this).children("input").val() === 0)
        check = true;
    });
    if (!check) {
      $('.pay_btn').removeClass('disable_btn');
      $('.pay_btn').prop('disabled', false);
    }
    $(".flaticon-bag").siblings("span").html(total);
  }
});
