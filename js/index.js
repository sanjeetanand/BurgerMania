var cart = {};

var priceList = {
    Veg : 100,
    Egg : 150,
    Chicken : 200
};

var formIndex = {
    CrispySupreme:0,
    Surprise:1,
    WHOPPER:2,
    ChilliCheese:3,
    TandoorGrill:4
};

var data = {
    totalQuantity: 0,
    totalPrice: 0,
};

//add data to cart on AddToCart button press.
function addToCart(name){
    var form = document.forms[formIndex[name]];
    
    var e = form.elements.category;
    var category = e.options[e.selectedIndex].value;
    
    var quantity = form.elements.quantity.value;
    if(quantity > 5 || quantity < 1){
        alert("Quantity should be min 1 and max 5");
        return;
    }
    
    var price = priceList[category];
    var totalPrice = quantity * price;

    burger = new Burger(name,category,price,quantity,totalPrice);
    cart[name] = burger;
}

//save order in local storage.
function saveCart(){
    var b;
    for(b in cart){
        var burger = cart[b];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

//gets cart data from local storage, calculate quantity and price and display.
function getData() {
    var temp = localStorage.getItem("cart");
    var x = JSON.parse(temp);

    data.totalQuantity = Object.keys(x).length;
    data.totalPrice = 0;

    var b;
    for (b in x) {
        var burger = x[b];
        data.totalPrice += burger.totalPrice;
    }
    document.getElementById("total").innerHTML = "Total Quantity : " + data.totalQuantity + " & Total Price : Rs. " +data.totalPrice+"/-.";
}

//send AJAX request.
function placeOrder() {

    $.ajax({
        type: "POST",
        url: "http://localhost:9876/orders",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data) {
            $(".outer").remove();
            $(".infoDiv").append(
                "<p>Total Quanity is <b>" 
                    + data.quantity 
                    + "</b> you will get <b>" 
                    + data.discount 
                    + "</b>% discount & Total Price after Discount Rs. <b>" 
                    + data.price 
                    + "/-</b></p>"
                    + "<br><br><br><h4><a href='index.html'>Click here to go to index page...</a></h4>"
            );
            window.localStorage.removeItem("cart");
        },
        error: function () {
            alert("lol");
        },
    });
}


//display cart data to the user.
function appendData() {
    var tbl = document.getElementById('my-table');

    var temp = localStorage.getItem("cart");
    var x = JSON.parse(temp);

    var b;
    for (b in x) {
        var burger = x[b];
        var i = tbl.rows.length;
        var row = tbl.insertRow(i);
        createCell(row.insertCell(0), 0, burger.name);
        createCell(row.insertCell(1), 1, burger.category);
        createCell(row.insertCell(2), 2, burger.price);
        createCell(row.insertCell(3), 3, burger.quantity);
        createCell(row.insertCell(4), 4, burger.totalPrice);
        createCell(row.insertCell(5), 5, 'Remove');
    }

    getData();

}

// create element and append to the table cell
function createCell(cell, i, text) {

    if (i == 5) {
        var img = document.createElement('img');
        img.setAttribute('src', 'images/delete.png');
        img.setAttribute('width', '30px');
        img.setAttribute('height', '30px');
        img.setAttribute('onclick', 'deleteRows(this)');

        cell.appendChild(img);
    } else {
        var txt = document.createTextNode(text);
        cell.appendChild(txt);
    }
}

// delete table rows with index greater then 0
function deleteRows(i) {

    // table reference
    var tbl = document.getElementById('my-table'); 

    //rowIndex to delete
    var index = i.parentNode.parentNode.rowIndex;

    //name of the burger to be deleted
    var name = tbl.rows[index].cells[0].innerHTML;
    
    //get cart from storage
    var temp = localStorage.getItem("cart");
    var cart = JSON.parse(temp);
    
    //delete data in cart
    delete cart[name];
    console.log(cart);

    //save back the data
    localStorage.setItem("cart", JSON.stringify(cart));

    //Modify the html
    tbl.deleteRow(index);

    getData();
}
