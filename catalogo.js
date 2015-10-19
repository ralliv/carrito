cont_clicks=0;
arrClicksPorid = new Array(); //creo este array para meter los ids de cada producto cada vez que se hace click para despues sacar la cantidad
arrPrecios = new Array();

function ponerIDarticulo(){//poner id automaticamente a los articulos en venta

	productos = document.getElementsByClassName("producto");//sacamos la lista de productos

	for (var i = 0; i < productos.length; i++) { //le ponemos los id
		productos[i].setAttribute("id",i);
		
	}

}

function sacarPrecios(){

	precios = document.getElementsByClassName("precio");
	for (var i = 0; i < precios.length; i++) {
		
		arrPrecios.push(parseInt(precios[i].innerHTML));
	}

}


function calcularPrecio(precio,cantidad){
	
	resultado = 0;
	numero_precio =  parseInt(precio);
	resultado = numero_precio*cantidad;
	return resultado.toString();

}

function borrarAntiguos(div_producto_carro){ //borrar articulos antiguos que tengan el mismo id que el recien añadido
//Cojo los divs(sus nodos) que hay dentro de div_carro y los meto en el array nodos_div_carro

	div_carro = document.getElementById("div_carro");

	nodos_div_carro = div_carro.childNodes;

	arr_divs_mismoid = new Array();//creo un array para meter los divs con el mismo id encontrados en div_carro


	for (var i = 0; i < nodos_div_carro.length; i++) { //recorro el array de nodos de div_carro

		if(nodos_div_carro[i].getAttribute("id")==div_producto_carro.getAttribute("id")){//Si el id de un nodo coincide con el id del articulo que vamos a meter..
		
			arr_divs_mismoid.push(nodos_div_carro[i]);//metemos ese nodo en el array de nodos repetidos

		}
	}

	for (var x = 0; x < arr_divs_mismoid.length-1; x++) {//recorremos el array de nodos repetidos...
		
		div_carro.removeChild(arr_divs_mismoid[x]); //y borramos todos menos el ultimo
	
	}

}

function obtenerCantidad(articulo){ //obtener la cantidad 
contador=0;

for (var i = 0; i < arrClicksPorid.length; i++) { //recorro el array
		
		if(arrClicksPorid[i]==articulo.getAttribute("id")){//cada vez que el id de un elemento del array coincida con el id de nuestro articulo, se suma 1 a la cantidad

			contador++;
		}
	}

return contador;


}

function eliminarArticulo(elemento_boton){ //borrar articulo con todas sus unidades

	div_carro = document.getElementById("div_carro");

	articulo_div = elemento_boton.parentNode;
	
	for (var i = 0; i < arrClicksPorid.length; i++) { 

		if(arrClicksPorid[i]==articulo_div.getAttribute("id")){ 

				delete arrClicksPorid[i];
		}
	}
	
	div_carro.removeChild(articulo_div);

	//para volver a calcular el total del carrito

	elemento_total = document.getElementById("div_total");
	div_new_carro.removeChild(elemento_total);
	div_new_carro.appendChild(totalCarrito());

}

function eliminarUnArticulo(elemento_boton_quitar1){ //borrar unicamente la cantidad-1
solouno = false;

	articulo_div = elemento_boton_quitar1.parentNode;

	for (var i = 0; i < arrClicksPorid.length; i++) { 

		if(arrClicksPorid[i]==articulo_div.getAttribute("id") && solouno==false){ 

				delete arrClicksPorid[i];
				solouno=true;

		}
	}

	//falta el caso en que la cantidad sea 0 y el precio 0, en ese caso se elimina
	cantidad = obtenerCantidad(articulo_div);
	
	if(cantidad==0){

		eliminarArticulo(elemento_boton_quitar1);

	}else{

		precios = document.getElementsByClassName("precio");
		texto_precio = precios[articulo_div.getAttribute("id")].innerHTML;

		cantidad = obtenerCantidad(articulo_div);

		parrafo_total = articulo_div.firstChild.nextSibling.nextSibling;
		parrafo_total.innerHTML = "Total: "+calcularPrecio(texto_precio,cantidad);

		parrafo_cantidad = articulo_div.firstChild.nextSibling.nextSibling.nextSibling;
		parrafo_cantidad.innerHTML = "Cantidad: "+cantidad;
	
	}
		//para volver a calcular el total del carrito
		elemento_total = document.getElementById("div_total");
		div_new_carro.removeChild(elemento_total);

		div_new_carro.appendChild(totalCarrito());

	

}

function vaciarCarrito(){ //quitar todos los articulos del carro

elementos_carro =  document.getElementsByClassName("producto_carro");

	while(elementos_carro.length>0){//Se hace con while porque el tamaño del carro va decrementandose en 1 cada vez que eliminamos un elemento del carro. 
									//Con un for no podriamos utilizar el tamaño para recorrer los elementos en este caso.
		ultimo_elemento = elementos_carro[elementos_carro.length-1]
		eliminarArticulo(ultimo_elemento.firstChild);
	}

}

function totalCarrito(){
	
	total_carrito=0;
	productos = document.getElementsByClassName("producto");

	for (var i = 0; i < arrClicksPorid.length; i++) {
		
		for(var x = 0; x < productos.length; x++){
			
			if(arrClicksPorid[i]==productos[x].getAttribute("id")){

					total_carrito+=arrPrecios[x];

			}
		}
	}

	div_total = document.createElement("div");
	div_total.setAttribute("id","div_total");
	div_total.innerHTML = "Total carrito: "+total_carrito;

	return div_total;

}



function aniadirAlCarrito(articulo_div){ 
	cantidad=0;

	arrClicksPorid.push(articulo_div.getAttribute("id")); //cada vez que se hace un click, se mete el id en el array arrClicksPorid.

	//sacar la cantidad

	cantidad=obtenerCantidad(articulo_div);

	if(cont_clicks==0){//creo el div_carro unicamente en el primer click

		sacarPrecios();//meto precios en el arrPrecios

		div_new_carro = document.createElement("div");
		div_new_carro.setAttribute("id","div_carro");
		contenedor = document.getElementById("contenedor");
		contenedor.appendChild(div_new_carro);

		boton_vaciar =  document.createElement("button");
		boton_vaciar.innerHTML = "vaciar carrito";
		boton_vaciar.setAttribute("class","boton_vaciar");
		boton_vaciar.setAttribute("onclick","vaciarCarrito()");
		div_new_carro.appendChild(boton_vaciar);

		div_new_carro.appendChild(totalCarrito());//añado el total

	}
	
	//una vez creado el div_carro creamos el producto en div_carro

		div_carro = document.getElementById("div_carro");
		div_producto_carro = document.createElement("div");
		div_producto_carro.setAttribute("id",articulo_div.getAttribute("id"));
		div_producto_carro.setAttribute("class","producto_carro");

	//mete imagen

		imgURL = document.getElementsByTagName("IMG")[articulo_div.getAttribute("id")].getAttribute("src");//cojes la url de la imagen
		imagen = document.createElement("IMG");
		imagen.setAttribute("src",imgURL);
		div_producto_carro.appendChild(imagen);

	//mete <p> precio 

		elemento_parrafo_precio = document.createElement("p");
		elemento_parrafo_precio.setAttribute("class","parrafo_precio")
		parrafos = document.getElementsByClassName("parrafo");
		precios = document.getElementsByClassName("precio");
		texto_parrafo = parrafos[articulo_div.getAttribute("id")].innerHTML;// cojo el <p> 'Precio: '
		texto_precio = precios[articulo_div.getAttribute("id")].innerHTML;//cojo el precio '200'
		elemento_parrafo_precio.innerHTML = texto_parrafo+" "+texto_precio;
		div_producto_carro.appendChild(elemento_parrafo_precio);

	//mete <p> total

		precios = document.getElementsByClassName("precio");
		texto_precio = precios[articulo_div.getAttribute("id")].innerHTML;//cojo el precio
		elemento_parrafo = document.createElement("p");
		elemento_parrafo.innerHTML = "Total: "+calcularPrecio(texto_precio,cantidad);
		elemento_parrafo.setAttribute("class","parrafo_total");
		div_producto_carro.appendChild(elemento_parrafo);


	//mete cantidad

		elemento_cantidad = document.createElement("p");
		elemento_cantidad.innerHTML = "Cantidad: "+cantidad;
		elemento_cantidad.setAttribute("class","cantidad");
		div_producto_carro.appendChild(elemento_cantidad);

	//mete boton borrar articulo

		boton_borrar =  document.createElement("button");
		boton_borrar.innerHTML = "borrar articulo";
		boton_borrar.setAttribute("class","boton_borrar");
		boton_borrar.setAttribute("onclick","eliminarArticulo(this)");
		div_producto_carro.appendChild(boton_borrar);

	//mete boton quitar 1 de cantidad

		boton_quitar1 =  document.createElement("button");
		boton_quitar1.innerHTML = "quitar 1";
		boton_quitar1.setAttribute("class","boton_quitar1");
		boton_quitar1.setAttribute("onclick","eliminarUnArticulo(this)");
		div_producto_carro.appendChild(boton_quitar1);

	//mete total carrito
		
		elemento_total = document.getElementById("div_total");
		div_new_carro.removeChild(elemento_total);

		div_new_carro.appendChild(totalCarrito());

	//mete el producto en el carro y en la primera posición
		
		div_carro.appendChild(div_producto_carro);//primero lo añado
		borrarAntiguos(div_producto_carro);//con esta función borro los divs del carro que tengan el mismo id que el ultimo creado

		primer_p = document.getElementsByClassName("producto_carro")[0]; //cojo el elemeto en la primera posicion dentro del div_carro como refencia
		div_carro.insertBefore(div_producto_carro,primer_p);

	cont_clicks++;
	
	
}