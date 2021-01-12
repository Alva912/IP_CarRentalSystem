/* UTS MIT 2020Autumn 32516IP Assignment2 CarRentalSystem
 * JiahuaLi */

// Enclosed function will execute when the DOM has loaded
$(document).ready(function () {
  $("a").attr("href", "javascript:void(0);");
  // AJAX xml
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      displayProduct(this);
    }
  };
  xmlhttp.open("GET", "cars.xml", false);
  xmlhttp.send();
  function displayProduct(xmlhttp) {
    xmlDoc = xmlhttp.responseXML;
    var displayTxt = "";
    var x = xmlDoc.getElementsByTagName("car");
    for (i = 0; i < x.length; i++) {
      var id = x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
      var availability = x[i].getElementsByTagName("availability")[0]
        .childNodes[0].nodeValue;
      var brand = x[i].getElementsByTagName("brand")[0].childNodes[0].nodeValue;
      var model = x[i].getElementsByTagName("model")[0].childNodes[0].nodeValue;
      var model_year = x[i].getElementsByTagName("model_year")[0].childNodes[0]
        .nodeValue;
      var name = brand + "-" + model + "-" + model_year;
      var mileage = x[i].getElementsByTagName("mileage")[0].childNodes[0]
        .nodeValue;
      var fuel_type = x[i].getElementsByTagName("fuel_type")[0].childNodes[0]
        .nodeValue;
      var seats = x[i].getElementsByTagName("seats")[0].childNodes[0].nodeValue;
      var price_per_day = x[i].getElementsByTagName("price_per_day")[0]
        .childNodes[0].nodeValue;
      var description = x[i].getElementsByTagName("description")[0]
        .childNodes[0].nodeValue;
      displayTxt +=
        "<div class='car col-md-4' id='" +
        id +
        "'><div class='card mb-4 shadow-sm'><div class='square'><img src='./images/" +
        model +
        ".jpg' class='card-img-top' alt='Responsive image'></div><div class='card-body'><table class='card-text table table-sm'><tbody><tr><th colspan='2' class='name'>" +
        name +
        "</th></tr><tr><td>mileage:</td><td class='mileage'>" +
        mileage +
        "</td></tr><tr><td>fuel_type:</td><td class='fuel_type'>" +
        fuel_type +
        "</td></tr><tr><td>seats:</td><td class='seats'>" +
        seats +
        "</td></tr><tr><td>price_per_day:</td><td class='price_per_day'>" +
        price_per_day +
        "</td></tr><tr><td>availability:</td><td class='availability'>" +
        availability +
        "</td></tr><tr><td>description:</td><td class='description'>" +
        description +
        "</td></tr></tbody></table><button type='button' class='addCart btn btn-sm btn-outline-primary'>Add to Cart</button></div></div></div>";
    }
    document.getElementById("displayTxt").innerHTML = displayTxt;
  }
});
$(document).on("click", ".addCart", function () {
  var ava = $(this).siblings("table").find("td.availability").html();
  if (ava == "false") {
    alert("This car is not available.");
  } else {
    var cartList = $("#cartList");
    var id = $(this).parents("div.car").attr("id");
    var name = $(this).siblings("table").find("th.name").text();
    var key = "#" + id + ": " + name;
    var price = $(this).siblings("table").find("td.price_per_day").text();
    for (var i = 0; i < sessionStorage.length; i++) {
      if (key == sessionStorage.key(i)) {
        alert("This car has already been reserved.");
        return;
      }
    }
    sessionStorage.setItem(key, price);
    var cartRow =
      "<tr class='cart-row'><td class='car-id-name'>" +
      key +
      "</td><td class='price'>" +
      price +
      "</td><td><div class='input-group'>" +
      "<input type='button' class='minus-num btn btn-sm btn-light' value='-'>" +
      "<input type='button' class='add-num btn btn-sm btn-light' value='+'>" +
      "<input type='text' class='input-num' value='1' style='width: 20px;'>" +
      "<input type='button' class='enter-num btn btn-sm btn-light' value='Ent'></div></td></td>" +
      "<td class='input-group'><input type='button' class='del-item btn btn-sm btn-light' value='Delete'></td></tr>";
    cartList.append(cartRow);
    alert("This car is added in reservation.");
  }
});
// Cart buttons
$(document).on("click", ".minus-num", function () {
  var input_num = $(this).siblings(".input-num").val();
  if (!$.isNumeric(input_num)) {
    alert("Invalid input. Please enter a number.");
    $(this).siblings(".input-num").val(1);
  } else {
    if (--input_num < 1) {
      $(this).siblings(".input-num").val(1);
    } else {
      $(this).siblings(".input-num").val(input_num);
    }
  }
});
$(document).on("click", ".add-num", function () {
  var input_num = $(this).siblings(".input-num").val();
  if (!$.isNumeric(input_num)) {
    alert("Invalid input. Please enter a number.");
    $(this).siblings(".input-num").val(1);
  } else {
    ++input_num;
    $(this).siblings(".input-num").val(input_num);
  }
});
$(document).on("click", ".enter-num", function () {
  var input_num = $(this).siblings(".input-num").val();
  if (!$.isNumeric(input_num)) {
    alert("Invalid input. Please enter a number.");
    $(this).siblings(".input-num").val(1);
  }
});
$(document).on("click", ".del-item", function () {
  var key = $(this).parents(".cart-row").find(".car-id-name").html();
  $(this).parents(".cart-row").detach();
  sessionStorage.removeItem(key);
});
$(document).on("click", ".del-cart, .sub-form", function () {
  sessionStorage.clear();
  $(".cart-row").detach();
  document
    .getElementById("check-out")
    .removeAttribute("data-target", "#staticBackdrop");
  document.getElementById("check-out").removeAttribute("data-toggle", "modal");
});
// Check out form
function checkOut() {
  if (sessionStorage.length < 1) {
    document
      .getElementById("check-out")
      .removeAttribute("data-target", "#staticBackdrop");
    document
      .getElementById("check-out")
      .removeAttribute("data-toggle", "modal");
    alert("Car reservation is empty.");
  } else {
    document
      .getElementById("check-out")
      .setAttribute("data-target", "#staticBackdrop");
    document.getElementById("check-out").setAttribute("data-toggle", "modal");
    var num = document.getElementsByClassName("input-num"); //get the num elms
    var list2 = document.getElementById("ck-list"); //target place
    var result2 = "<tbody id='ck-list'>"; //target content
    var tprice = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      var price = sessionStorage.getItem(key); //get the uprice
      sessionStorage.setItem(key, num[i].value); //set new val cknum, remove old val uprice
      var cknum = sessionStorage.getItem(key); //get the new val cknum
      var sprice = price * cknum;
      result2 +=
        "<tr class='ck-row'><td><input type='text' class='sub-row' name='" +
        key +
        "' value='" +
        cknum +
        "'></td><td>" +
        key +
        "</td><td class='ck-price'>" +
        price +
        "</td><td class='ck-num'>" +
        cknum +
        "</td><td class='ck-subtotal'>" +
        sprice.toFixed(2) +
        "</td></tr>";
      tprice += sprice;
    }
    result2 +=
      "<tr><td colspan='5' class='h5 text-right px-3'>Total : $" +
      tprice.toFixed(2) +
      "<input type='text' class='sub-row' name='Total' value='" +
      tprice +
      "'></td></tr></tbody>";
    list2.innerHTML = result2;
    $(".sub-row").hide();
  }
}
// Close Check Out
function ssBack() {
  var ckuprice = document.getElementsByClassName("ck-price"); //get the num elms
  for (let i = 0; i < sessionStorage.length; i++) {
    var key = sessionStorage.key(i);
    var val = ckuprice[i].innerHTML;
    sessionStorage.setItem(key, ckuprice[i].innerHTML); //set new val, remove old val
  }
}
