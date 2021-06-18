const CART_PRODUCTS= "cartProductsId";

document.addEventListener("DOMContentLoaded", ()=> {
    loadProducts();
    loadProductsCart();
})

async function getProductsDB(){
    const url= "../dbProducts.json";

    return fetch(url)
        .then(response => {
            return response.json();
        })
        .then(response => {
            return response;
        })
        .catch((erro)=> {
            console.log(erro);
        })
}

async function loadProducts(){
    const products= await getProductsDB();

    let html= "";

    products.forEach((product)=> {
        html+= `
            <div class="col-3 product-container">
                <div class="card product">
                    <img
                        src="${product.image}"
                        class="card-img-top"
                        alt="${product.name}"
                    />
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text>${product.extraInfo}</p>
                        <p class="card-text>$${product.price} /Unidad</p>
                        <button type="button" class="btn btn-primary btn-cart" onclick="addProductCart(${product.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;
    })

    document.getElementsByClassName("products")[0].innerHTML= html;
}

function openCloseCart(){
    const containerCart= document.getElementsByClassName('cart-products')[0]
    
    //Con classList obtenemos un array de todas las classes que tiene un elemento
    containerCart.classList.forEach(item => {
        if(item === 'hidden'){
            //Usando classList tambien podemos add o remover clases de un elemento
            containerCart.classList.remove('hidden');
            containerCart.classList.add('active');
        }
        if(item === 'active'){
            containerCart.classList.remove('active');
            containerCart.classList.add('hidden');
        }
    })
}

function addProductCart(idProduct){
    let productsID= [];
    let localStorageItems= localStorage.getItem(CART_PRODUCTS);

    if(localStorageItems === null){
        productsID.push(idProduct);
        localStorage.setItem(CART_PRODUCTS, productsID);
    }
    else{
        productsID= localStorage.getItem(CART_PRODUCTS);
        if(productsID.length > 0){
            productsID += ","+idProduct
        }
        else{
            productsID = idProduct;
        }
        localStorage.setItem(CART_PRODUCTS, productsID)
    }
    loadProductsCart();
}

async function loadProductsCart(){
    const products= await getProductsDB();

    const localStorageItems= localStorage.getItem(CART_PRODUCTS);
    let html= '';

    if(!localStorageItems){
        html= `
            <div class="cart-product empty">
                <p>Carrito vacio</p>
            </div>
        `;
    }
    else{
        //Convertimos el resultado del localStorage en un array
        const idProductsSplit= localStorageItems.split(',');

        //Eliminamos los id duplicados
        const idProductsCart= Array.from(new Set(idProductsSplit));
        
        idProductsCart.forEach((id)=> {
            products.forEach(product=> {
                if(id == product.id){

                    const quantity= countDuplicatesID(id, idProductsSplit);
                    const totalPrice= product.price * quantity;
                    html+= `
                        <div class="cart-product">
                            <img src="${product.image}" alt="${product.name}"/>
                            <div class="cart-product-info">
                                <span class="quantity">${quantity}</span>
                                <p>${product.name}</p>
                                <p>$${totalPrice.toFixed(2)} mxn</p>
                                <p class="change-quantity">
                                    <button onclick="decrementProduct(${product.id})">-</button>
                                    <button onclick="incrementProduct(${product.id})">+</button>
                                </p>
                                <p class="cart-product-delete">
                                    <button onclick="deleteProductCart(${product.id})">Eliminar</button>
                                </p>
                            </div>
                        </div>
                    `;
                }
            });
        });
    }
    

    document.getElementsByClassName('cart-products')[0].innerHTML= html;
}

function deleteProductCart(idProduct){
    const idProductCart= localStorage.getItem(CART_PRODUCTS);
    const arrayIdProductsCart= idProductCart.split(',');
    const resultIdDelete= deleteAllIds(idProduct, arrayIdProductsCart);

    if(resultIdDelete){
        let count= 0;
        let idString= "";

        resultIdDelete.forEach((id)=> {
            count++;
            if(count < resultIdDelete.length){
                idString += id + ',';
            }
            else{
                idString += id;
            }
        });
        localStorage.setItem(CART_PRODUCTS, idString);
    }

    const idsLocalStorage= localStorage.getItem(CART_PRODUCTS);
    if(!idsLocalStorage){
        localStorage.removeItem(CART_PRODUCTS);
    }

    loadProductsCart();
}

function incrementProduct(idProduct){
    addProductCart(idProduct);
}

function decrementProduct(idProduct){
    let idsLocalStorage= localStorage.getItem(CART_PRODUCTS);
    const idsArray= idsLocalStorage.split(',');
    const deletedPosition= idsArray.lastIndexOf(idProduct.toString());

    if(deletedPosition !== -1){
        idsArray.splice(deletedPosition, 1);
    }
    
    if(idsArray){
        let count= 0;
        let idString= "";

        idsArray.forEach((id)=> {
            count++;
            if(count < idsArray.length){
                idString += id + ',';
            }
            else{
                idString += id;
            }
        });
        localStorage.setItem(CART_PRODUCTS, idString);
    }

    idsLocalStorage= localStorage.getItem(CART_PRODUCTS);
    if(!idsLocalStorage){
        localStorage.removeItem(CART_PRODUCTS);
    }

    loadProductsCart();
}

function countDuplicatesID(value, arrayIds){
    let count= 0;

    arrayIds.forEach(id => {
        if(value == id){
            count++;
        }
    });

    return count;
}

function deleteAllIds(id, arrayIds){
    return arrayIds.filter((itemId)=> {
        return itemId != id
    })
}