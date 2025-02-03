import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { CDN_URL, categoryChoice } from "../utils/constants";
import { CategoryOptions } from "../types";
import { ICardActions, ICard } from "../types";
import { formatNumberWithSpaces } from "../utils/utils";

export class Card extends Component<ICard> {
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, this.container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, this.container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, this.container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, this.container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }
    
    set picked(value: boolean) {
        if (!this._button.disabled) {
          this._button.disabled = value;
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set category(value: CategoryOptions) {
        this.setText(this._category, value);
        this._category.classList.add(categoryChoice[value]);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this._image.src = CDN_URL + value;
    }

    set price(value: number | null) {
        if(value !== null){
            this.setText(this._price, formatNumberWithSpaces(value) + ' синапсов')
        }
        else {
            this.setText(this._price, 'Бесценно')
        }
        if (this._button && !value) {
            this._button.disabled = true;
        }
    }
}

export class CatalogItem extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}

export class CatalogItemPreview extends Card {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    
        this._description = ensureElement(`.${this.blockName}__text`, this.container)
      }
    
    set description(value: string) {
        this.setText(this._description, value);
    }
}



