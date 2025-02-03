import { Api } from "../components/base/api";
import { EventEmitter } from "../components/base/events";
import { AppState } from "../components/AppData";
import { Page } from "../components/Page";
import { Modal } from "../components/common/Modal";
import { Basket } from "../components/Basket";
import { ensureElement } from "./utils";
import { CategoryChoice } from "../types";
import { cloneTemplate } from "./utils";
import { Order } from "../components/Order";
import { Contacts } from "../components/Contacts";
import { Success } from "../components/Success";

//Темплейты
export const successTemplate = ensureElement<HTMLTemplateElement>('#success');
export const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
export const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
export const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
export const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
export const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
export const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//Константы
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const api = new Api(API_URL);
export const events = new EventEmitter();
export const appData = new AppState({}, events);
export const page = new Page(document.body, events);
export const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
export const basket = new Basket(cloneTemplate(basketTemplate), events);
export const categoryChoice: CategoryChoice = { 'софт-скил': 'card__category_soft', 'другое': 'card__category_other', 'дополнительное': 'card__category_additional', 'кнопка': 'card__category_button', 'хард-скил': 'card__category_hard' } 

export const order = new Order('order', cloneTemplate(orderTemplate), events);
export const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
export const success = new Success('order-success', cloneTemplate(successTemplate), {onClick: () => {events.emit('modal:close'), modal.close()}})
