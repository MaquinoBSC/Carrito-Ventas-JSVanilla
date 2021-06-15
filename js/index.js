const CAR_PRODUCTS= "cartProductsId";

document.addEventListener("DOMContentLoaded", ()=> {
    loadProducts();
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
                        <button type="button" class="btn btn-primary btn-cart">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;
    })

    document.getElementsByClassName("products")[0].innerHTML= html;
}