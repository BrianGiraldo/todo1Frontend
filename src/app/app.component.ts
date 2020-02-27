import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './app.constants';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	public title = 'FrontendTodo1 Hulk Store Inventario';
	public ServerUrl: string;
	public headers: any;
	public options: any;
	public paramsGetProducts: any = {
		code: '',
		name: ''
	};
	public newProduct: any = {
		code: '',
		name: '',
		stock: 0,
		price: 0
	};
	public inputTransaction = {
		type : "inputs",
		stock: 0,
		code: "",
		price: 0
	};
	public outputTransaction = {
		type : "outputs",
		stock: 0,
		code: "",
		price: 0
	};
	public products: any;
	public displayedColumns: string[];
	public displayedColumnsTransactions: string[];
	public getProductsLoad: boolean;
	public createProductLoad: boolean;
	public panelNewProductoState: boolean;
	public panelTransactionsState: boolean;
	public transactionInputLoad: boolean;
	public transactionOutputLoad: boolean;
	public getTransactionInputLoad: boolean;
	public getTransactionOutputLoad: boolean;
	public currentProduct: any;
	public inputsTransactions: any;
	public outputsTransactions: any;
	public dateTransactions: Date;

	constructor(public http: HttpClient, public _snackBar: MatSnackBar) {
		this.ServerUrl = AppSettings.API_ENDPOINT;
		this.headers = new Headers({ 'Content-Type': 'application/json' });
		this.products = [];
		this.inputsTransactions = [];
		this.outputsTransactions = [];
		this.displayedColumns = ['id', 'code', 'name', 'stock','transacciones'];
		this.displayedColumnsTransactions = ['id', 'stock', 'price', 'date'];
		this.getProductsLoad = false;
		this.createProductLoad = false;
		this.panelNewProductoState = false;
		this.panelTransactionsState = false;
		this.transactionInputLoad = false;
		this.transactionOutputLoad = false;
		this.getTransactionInputLoad = false;
		this.getTransactionOutputLoad = false;
		this.currentProduct = {};
		this.dateTransactions = new Date();
		this.getProducts();
	}

	public getProducts() {
		this.options = {
			headers: this.headers,
			params: this.paramsGetProducts
		};
		this.getProductsLoad = true;
		this.http.get(`${this.ServerUrl}products`, this.options).subscribe(response => {
			this.getProductsLoad = false;
			this.products = response;
		});
	}

	public createProduct(){
		if(this.newProduct.code === '' || this.newProduct.name === '' || this.newProduct.stock === '' ){
			this._snackBar.open('Completa todos los campos', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		var pattern = /^\d+$/;
		if(!pattern.test(this.newProduct.stock)){
			this._snackBar.open('Formato incorrecto para la cantidad', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		if(this.newProduct.stock > 0){
			if(!pattern.test(this.newProduct.price) || this.newProduct.price == 0){
				this._snackBar.open('El precio debe ser mayor a cero o tiene un formato incorrecto', 'Cerrar',{
					duration: 3000
				});
				return;
			}
		} else {
			this.newProduct.price = 0;
		}
		this.options = {
			headers: this.headers,
			params: this.newProduct
		};
		this.createProductLoad = true;
		this.http.post(`${this.ServerUrl}create_product`, this.newProduct).subscribe((response:any) => {
			this.createProductLoad = false;
			if(response.status_code == "200"){
				this._snackBar.open(response.message, 'Cerrar',{
					duration: 3000
				});
				this.getProducts();
				this.newProduct.code = '';
				this.newProduct.name = '';
			}
		}, error =>{
			this.createProductLoad = false;
			if(error.error.status_code == "400"){
				this._snackBar.open(error.error.message, 'Cerrar',{
					duration: 3000
				});
			}
		});
	}

	public transactionInput(){
		if(this.inputTransaction.stock <= 0){
			this._snackBar.open('La cantidad no pueder ser menor que 1', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		var pattern = /^\d+$/;
		if(!pattern.test(this.inputTransaction.stock.toString())){
			this._snackBar.open('Formato incorrecto para la cantidad', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		if(this.inputTransaction.price <= 0){
			this._snackBar.open('El precio no pueder ser menor que 1', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		var pattern = /^\d+$/;
		if(!pattern.test(this.inputTransaction.price.toString())){
			this._snackBar.open('Formato incorrecto para el precio', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		this.inputTransaction.code = this.currentProduct.code;
		this.transactionInputLoad = true;
		this.http.post(`${this.ServerUrl}create_transaction`, this.inputTransaction).subscribe((response:any )=> {
			this.transactionInputLoad = false;
			if(response.status_code == "200"){
				this._snackBar.open(response.message, 'Cerrar',{
					duration: 3000
				});
				this.getProducts();
				this.getTransactionInput();
				this.currentProduct.stock = parseInt(this.currentProduct.stock)+parseInt(this.inputTransaction.stock.toString());
				this.inputTransaction.stock = 0;
				this.inputTransaction.price = 0;
			}
		}, error =>{
			this.transactionInputLoad = false; 
			if(error.error.status_code == "400"){
				this._snackBar.open(error.error.message, 'Cerrar',{
					duration: 3000
				});
			}
		});
	}

	public transactionOutput(){
		if(this.currentProduct.stock <= 0){
			this._snackBar.open('El producto no tiene stock para registrar una salida', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		if(this.outputTransaction.stock <= 0){
			this._snackBar.open('La cantidad no pueder ser menor que 1', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		var pattern = /^\d+$/;
		if(!pattern.test(this.outputTransaction.stock.toString())){
			this._snackBar.open('Formato incorrecto para la cantidad', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		if(this.outputTransaction.price <= 0){
			this._snackBar.open('El precio no pueder ser menor que 1', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		var pattern = /^\d+$/;
		if(!pattern.test(this.outputTransaction.price.toString())){
			this._snackBar.open('Formato incorrecto para el precio', 'Cerrar',{
				duration: 3000
			});
			return;
		}
		this.outputTransaction.code = this.currentProduct.code;
		this.transactionOutputLoad = true;
		this.http.post(`${this.ServerUrl}create_transaction`, this.outputTransaction).subscribe((response:any )=> {
			this.transactionOutputLoad = false;
			if(response.status_code == "200"){
				this._snackBar.open(response.message, 'Cerrar',{
					duration: 3000
				});
				this.getProducts();
				this.getTransactionOutput();
				this.currentProduct.stock = parseInt(this.currentProduct.stock)-parseInt(this.outputTransaction.stock.toString());
				this.outputTransaction.stock = 0;
				this.outputTransaction.price = 0;
			}
		}, error =>{
			this.transactionOutputLoad = false; 
			if(error.error.status_code == "400"){
				this._snackBar.open(error.error.message, 'Cerrar',{
					duration: 3000
				});
			}
		});
	}

	public getTransactionInput(){
		let data = {
			type: "inputs",
			code: this.currentProduct.code,
			date: this.dateTransactions
		};
		this.options = {
			headers: this.headers,
			params: data
		};
		this.getTransactionInputLoad = true;
		this.http.get(`${this.ServerUrl}transactions`, this.options).subscribe(response => {
			this.getTransactionInputLoad = false;
			this.inputsTransactions = response;
		});
	}

	public getTransactionOutput(){
		let data = {
			type: "outputs",
			code: this.currentProduct.code,
			date: this.dateTransactions
		};
		this.options = {
			headers: this.headers,
			params: data
		};
		this.getTransactionOutputLoad = true;
		this.http.get(`${this.ServerUrl}transactions`, this.options).subscribe(response => {
			this.getTransactionOutputLoad = false;
			this.outputsTransactions = response;
		});
	}

	public openProductTransactions(product:any){
		this.currentProduct = product;
		this.openPanelNewTransactions();
		this.getTransactionInput();
		this.getTransactionOutput();
	}

	public openPanelNewProduct() {
		this.panelNewProductoState = true;
	}

	public closePanelNewProduct() {
		this.panelNewProductoState = false;
	}

	public openPanelNewTransactions() {
		this.panelTransactionsState = true;
	}

	public closePanelNewTransactions() {
		this.panelTransactionsState = false;
	}

	public validateNewProductStock(){
		var pattern = /^\d+$/;
		if(!pattern.test(this.newProduct.stock) || this.newProduct.stock <= 0){
			return false;
		}
		return true;
	}

}