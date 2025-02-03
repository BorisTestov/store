import { Component } from "./base/Component";
import { IBasketView, IBasketItem, IBasketItemActions } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { formatNumberWithSpaces } from "../utils/utils";

export class Basket extends Component<IBasketView> {
    protected _items: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._items = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('basket:order');
            });
        }
    }

    set items(items: HTMLElement[]) {
        this._items.replaceChildren(...items);
        if(items.length <= 0) {
            this._button.disabled = true;
        }
        else {
            this._button.disabled = false;
        }
      }

    set total(total: number) {
        this.setText(this._total, total + ' синапсов');
    }

    disableButton() {
        this._button.disabled = true
      }

    indexReset() {
    Array.from(this._items.children).forEach(
      (item, index) =>
      (item.querySelector(`.basket__item-index`)!.textContent = (index + 1).toString()));
  }
}

export class BasketItem extends Component<IBasketItem> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
  
    constructor(protected blockName: string, container: HTMLElement, actions?: IBasketItemActions) {
      super(container);
        
      this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, this.container);
      this._price = ensureElement<HTMLElement>(`.${blockName}__price`, this.container);
      this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, this.container);
  
    if (this._button) {
        this._button.addEventListener('click', (evt) => {
          this.container.remove();
          actions?.onClick(evt);
        });
      }
    }
  
    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    set title(value: string) {
        this.setText(this._title, value);
    }
  
    set price(value: number) {
        if(value !== null){
            this.setText(this._price, formatNumberWithSpaces(value) + ' синапсов')
        }
        else {
            this.setText(this._price, 'Бесценно')
        }
    }
}

