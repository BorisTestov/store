import { formatNumberWithSpaces } from "../utils/utils";
import { Component } from "./base/Component";
import { ISuccess, ISuccessActions } from "../types";
import { ensureElement } from "../utils/utils";

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this._description = container.querySelector(`.${blockName}__description`);
    this._button = container.querySelector(`.${blockName}__close`);
    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set description(value: number) {
    this._description.textContent = 'Списано ' + formatNumberWithSpaces(value) + ' синапсов'
  }
}
