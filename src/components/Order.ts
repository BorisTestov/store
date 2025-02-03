import { IEvents } from "./base/events";
import { Form } from "./common/Form";
import { IOrderPayment } from "../types";

export class Order extends Form<IOrderPayment> {
  protected _online: HTMLButtonElement;
  protected _uponReceipt: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this._online = container.elements.namedItem('card') as HTMLButtonElement;
    this._uponReceipt = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._uponReceipt) {
      this._uponReceipt.addEventListener('click', () => {
        this._uponReceipt.classList.add('button_alt-active')
        this._online.classList.remove('button_alt-active')
        this.onInputChange('payment', 'uponReceipt')
      })
    }
    if (this._online) {
      this._online.addEventListener('click', () => {
        this._online.classList.add('button_alt-active')
        this._uponReceipt.classList.remove('button_alt-active')
        this.onInputChange('payment', 'online')
      })
    }
  }

  buttonsDisabled() {
    this._uponReceipt.classList.remove('button_alt-active')
    this._online.classList.remove('button_alt-active')
  }
}
