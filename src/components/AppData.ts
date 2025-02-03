import { Model } from "./base/Model";
import { IProductItem, IAppState, IOrder, IOrderForm, FormErrors } from "../types";

export class ProductItem extends Model<IProductItem> {
    picked: boolean;
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export class AppState extends Model<IAppState> {
    catalog: ProductItem[];
    order: IOrder = {
        items: [],
        total: null,
        payment: '',
        address: '',
        email: '',
        phone: '',
    };
    basket: ProductItem[] = [];

    formErrors: FormErrors = {};

    basketItemsLength() {
        return this.basket.length;
    }

    setItems() {
        this.order.items = this.basket.map(item => item.id);
    }

    totalPrice() {
        return this.basket.reduce((total, item) => total + item.price, 0);
    }

    appendBasket(item: ProductItem) {
        this.basket.push(item);
    }

    removeBasket(id: string) {
        this.basket = this.basket.filter(item => item.id !== id);
    }

    absoluteBasketClear() {
        this.basket = [];
    }

    setCatalog(products: ProductItem[]) {
        this.catalog = products.map(item => new ProductItem({ ...item, picked: false }, this.events));
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    resetPicked() {
        for (const product of this.catalog) {
            product.picked = false;
        }
    }

    validateOrder() {
        const errors: FormErrors = {};
        if (!this.order.address) errors.address = 'Необходимо указать адрес';
        if (!this.order.payment) errors.payment = 'Необходимо указать способ оплаты';
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return !Object.keys(errors).length;
    }

    validateContacts() {
        const errors: FormErrors = {};
        if (!this.order.email) errors.email = 'Необходимо указать email';
        if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return !Object.keys(errors).length;
    }

    validation(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateContacts()) this.events.emit('contacts:ready', this.order);
        if (this.validateOrder()) this.events.emit('order:ready', this.order);
    }

    orderReset() {
        this.order = {
            items: [],
            total: null,
            address: '',
            email: '',
            phone: '',
            payment: '',
        };
    }
}