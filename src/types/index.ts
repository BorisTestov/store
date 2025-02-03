import { categoryChoice } from './../utils/constants';
import { ProductItem } from "../components/AppData";

//index.ts
export interface ApiResponse {
    items: IProductItem[];
}

//Form.ts
export interface IFormState {
    valid: boolean;
    errors: string[];
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

//Modal.ts
export interface IModalData {
    content: HTMLElement;
}

//AppData.ts
export interface IProductItem {
    picked: boolean;
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IAppState {
    basket: IProductItem[];
    catalog: IProductItem;
    order: IOrder;
    formErrors: FormErrors;
}

//Basket.ts
export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IBasketItem extends IProductItem {
    id: string;
    index: number;
}
  
export interface IBasketItemActions {
    onClick: (event: MouseEvent) => void;
}

//Card.ts
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    picked: boolean;
    id: string;
    category: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
}

//Contacts.ts
export interface IContacts {
    email: string;
    phone: string;
}

//Order.ts
export interface IOrder {
    items: string[];
    total: number;
    payment: string;
    address: string;
    email: string;
    phone:string;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrderPayment {
    payment: string;
    address: string;
}

//Page.ts
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export type CategoryOptions = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type CategoryChoice = {
    [key in CategoryOptions]: string;
};

//Success.ts
export interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
  }
  
 export interface ISuccess {
    description: number;
}
