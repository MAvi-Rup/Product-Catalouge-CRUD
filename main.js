//selector
const filterInput = document.querySelector('#filter');
const productListUl = document.querySelector('.product-collection');
const nameInput = document.querySelector('.product-name');
const priceInput = document.querySelector('.product-price');
const addBtn = document.querySelector('.add-product');
const deleteBtn = document.querySelector('.delete-btn');
const msg = document.querySelector('.msg');
const form = document.querySelector('form');

//data State to localstorage
let productData = getDatafromLocalStprage();

//get data from local Storage

function getDatafromLocalStprage(){
  let items = '';
  if(localStorage.getItem('productItems')===null){
    items=[];
  }else{
    items = JSON.parse(localStorage.getItem('productItems'))
  }
  return items;

}

function saveDataToLocalStorage(item){
    let items = '';
  if(localStorage.getItem('productItems')===null){
    items=[];
    items.push(item);
    localStorage.setItem('productItems', JSON.stringify(items));
  }else{
    items = JSON.parse(localStorage.getItem('productItems'))
    items.push(item);
    localStorage.setItem('productItems',JSON.stringify(items));
  }

}

function deleteItemFromLocalStorage(id){
  const items = JSON.parse(localStorage.getItem('productItems'));
  let result = items.filter(productItem =>{
    return productItem.id !== id;
  });
  localStorage.setItem('productItems',JSON.stringify(result));
  if(result.length===0) location.reload();

    // let result = productData.filter(product => {
    //   return product.id !== id;
    // });
    // productData = result;
}


function getData(producList){
	productListUl.innerHTML = '';
	if(productData.length > 0){
		msg.innerHTML = '';
		producList.forEach(product => {
		 const {id,name,price} = product;
		let li = document.createElement('li');
		li.className = 'list-group-item collection-item';
		li.id = `product-${id}`;
		li.innerHTML=`
		<strong>${name}</strong>-
        <span class="price">$${price}</span>
        <i class="fa fa-trash delete-btn ml-auto float-right" id="icon"></i>
		<i class="fa fa-pencil-alt mr-1 edit-product float-right" id="icon"></i>

		`;
		productListUl.appendChild(li);

	});

	}else{
		// msg.innerHTML = 'No Product to show';
		// showMessage(true,null);
		showMessage('Add item to your catalouge');
	}
};
function showMessage(message = ''){
	msg.innerHTML = message;
};

//find product to update
function findProduct(id){
	return productData.findProduct(product => product.id === id)
}
//popolate update form
function populateForm({name:productName, price : productPrice}){
	nameInput.value = productName
	priceInput.value= productPrice
}

// getData(productData);
function productsWithUpdate(evt,id){
	evt.preventDefault()
	const productname= nameInput.value
	const productPrice=priceInput.value
	productData.map(product=>{
		if(product.id===id){
			return{
				...product,
				name:productName,
				price:productPrice
			}

		}else{
			return product
		}

	})
	//data source update
	productData=productsWithUpdate
	//update to UI
	productListUl.innerHTML=''
	getData(productData)
	localStorage.setItem('productItems',JSON.stringify(productData))
}

function initialAddState(){
	document.querySelector('update-btn').remove()
	addBtn.style.display = 'block'
	
	//reset Input
	nameInput.value=''
	priceInput.value=''

}

const updateOrRemoveProduct = e => {
  if (e.target.classList.contains('delete-btn')) {
	  
    // e.target.parentElement.remove();

    //removing target from the UI
    const target = e.target.parentElement;
    e.target.parentElement.parentElement.removeChild(target);
    //removing item from the store
    //Getting id
    const id = parseInt(target.id.split('-')[1]);
    
    //return result array
    let result = productData.filter(product => {
      return product.id !== id;
    });
    productData = result;
    deleteItemFromLocalStorage(id);
    
  }else if(e.target.classList.contains('edit-product')){
	const target = e.target.parentElement;
	const id = parseInt(target.id.split('-')[1]);
	//find the product	
	const foundProduct = findProduct(id);  
	//populate the products to existing form
	populateForm(foundProduct)
	//remove submit (add product)
	addBtn.style.display='none'
	// addBtn.classList.remove('add-btn')
	// addBtn.classList.add('update-btn')

	const updateBtnElm= `<button class="btn btn-secondary mt-3 update-product">Submit</button>`
    
	//dom insert
	form.insertAdjacentElement('beforeend',updateBtnElm)

	
	//updates
	document.querySelector('update-btn').addEventListener('click',(evt)=>{
		updateItem.bind(evt,id)
		initialAddstate()
	})
	
}

}

// const deleteProduct = e=>{
// 	if(e.target.classList.contains('delete-btn')){
// 		//console.log('You want to delete this item');
// 		const target = e.target.parentElement;
// 		// e.target.parentElement.remove();
// 		e.target.parentElement.parentElement.removeChild(target);
// 		//getting id
// 		const id = Number(target.id.split('-')[1]);
//         console.log(typeof id);
// 		//removing item from the data store

// 		let result = productData.filter((product)=>{
// 			return product.id !== id;
// 		});
// 		productData = result;

// 	}
// 	console.log(e.target);
// }

const addItem= e=> {
	e.preventDefault();
	const name = nameInput.value;
	const price = priceInput.value;
	let id;
	if(productData.length===0){
		id=0;
	}else{
		id = productData[productData.length-1].id+1;
	}
	if(name === '' || price === '' || !(!isNaN(parseFloat(price)) && isFinite(price))){
		alert('Please Fill Up the Information');
	}else{
		const data = {
			id,
			name,
			price
		};
		// productListUl.innerHTML = "";
		productData.push(data);
        saveDataToLocalStorage(data);
		getData(productData);
		nameInput.value = '';
		priceInput.value = '';

	}
	console.log(name,price);


};

const filterProduct = e => {
	const text = e.target.value.toLowerCase();
	let itemLength = 0;
	document.querySelectorAll('.product-collection .collection-item').forEach(item => {
		const productName = item.firstElementChild.textContent.toLowerCase();
		if(productName.indexOf(text) === -1){
			// msg.innerHTML = 'No items to show';
			// showMessage(null,true);
			showMessage('No items to show');
			item.style.display = 'none';
		}else{
			msg.innerHTML = '';
			item.style.display = 'block';
			++itemLength;
		}
        
	});
	(itemLength>0) ? showMessage(): showMessage('No item Found');
};


// addBtn.addEventListener('click',addItem);

// // addBtn.addEventListener('click',e =>);

// //Delete Item 


// productListUl.addEventListener('click',deleteProduct);

// //Search Filter Part



// filterInput.addEventListener('keyup',filterProduct);

// filterInput.addEventListener('keyup',(e)=>);

// const filterProduct = e => {
//   const text = e.target.value.toLowerCase();
//   document.querySelectorAll('.product-collection .collection-item').forEach(item => {
//     const productName = item.firstElementChild.textContent.toLowerCase();
//     if (productName.indexOf(text) === -1) {
//       // showMessage(null, true);
//       showMessage('NO item Meet your criteria');
//       item.style.display = 'none';
//     } else {
//       msg.innerHTML = '';
//       item.style.display = 'block';
//     }
//   });
// };

// function showMessage(fetchMessage,searchMessage){
// 	if(fetchMessage){
//       msg.innerHTML = 'Please Add item to your catalouge'
// 	}else if(searchMessage){
// 		msg.innerHTML = 'No item meet your citeria'

// 	}
// };

function loadEventListener() {
	productListUl.addEventListener('click', updateOrRemoveProduct);
	window.addEventListener('DOMContentLoaded', getData.bind(null, productData));
	addBtn.addEventListener('click', addItem);  
	filterInput.addEventListener('keyup', filterProduct);
  }

loadEventListener();

