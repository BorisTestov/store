import "./scss/styles.scss";
import { Api, ApiListResponse } from "./components/base/api";
import { EventEmitter } from "./components/base/events";
import { CatalogItem, CatalogItemPreview } from "./components/Card";
import { Page } from "./components/Page";
import { ProductItem, AppState } from "./components/AppData";
import { Modal } from "./components/common/Modal";
import { API_URL } from "./utils/constants";
import { ApiResponse, IProductItem, IOrderForm } from "./types";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { api, events, appData, page, modal, successTemplate, cardCatalogTemplate, cardPreviewTemplate, cardBasketTemplate, basketTemplate, orderTemplate, contactsTemplate } from "./utils/constants";
import { BasketItem } from "./components/Basket";
import { basket } from "./utils/constants";
import { order } from "./utils/constants";
import { contacts } from "./utils/constants";
import { success } from "./utils/constants";

api.get('/product')
  .then((response: ApiResponse) => {
    appData.setCatalog(response.items as ProductItem[]);
  })
  .catch((error) => {
    console.error(error);
  });

  events.on('catalog:changed', () => {
    const updatedCatalog = appData.catalog.map((item) => {
      const itemConfig = {
        onClick: () => events.emit('card:open', item),
      };
      const catalogItem = new CatalogItem(cloneTemplate(cardCatalogTemplate), itemConfig);
      
      return catalogItem.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price,
      });
    });
    page.catalog = updatedCatalog;
});
  
  events.on('modal:close', () => {
    page.locked = false;
});
  

  events.on('card:open', (selectedItem: ProductItem) => {
    page.locked = true;
    
    const previewConfig = {
      onClick: () => events.emit('card:toBasket', selectedItem),
    };
    const previewItem = new CatalogItemPreview(cloneTemplate(cardPreviewTemplate), previewConfig);
    
    const modalContent = previewItem.render({
      picked: selectedItem.picked,
      id: selectedItem.id,
      title: selectedItem.title,
      description: selectedItem.description,
      image: selectedItem.image,
      category: selectedItem.category,
      price: selectedItem.price,
    });
    
    modal.render({ content: modalContent });
});

events.on('card:toBasket', (item: ProductItem) => {
  item.picked = true;
  console.log(item);
  appData.appendBasket(item);
  page.counter = appData.basketItemsLength();
  modal.close();
});

events.on('basket:open', () => {
  page.locked = true;
  const itemsInBasket = appData.basket.map((item, index) => {
    const basketItemConfig = { onClick: () => events.emit('basket:remove', item) };
    const newBasketItem = new BasketItem('card', cloneTemplate(cardBasketTemplate), basketItemConfig);
    
    return newBasketItem.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  const basketContent = {
    items: itemsInBasket,
    total: appData.totalPrice(),
  };

  modal.render({ content: basket.render(basketContent) });
});

events.on('basket:remove', (item: ProductItem) => {
  appData.removeBasket(item.id);
  item.picked = false;
  basket.total = appData.totalPrice();
  page.counter = appData.basketItemsLength();
  basket.indexReset();
  if (appData.basket.length === 0) {
    basket.disableButton();
  }
});

events.on('basket:order', () => {
  modal.render({
    content: order.render(
      {
        address: '',
        valid: false,
        errors: []
      }
    ),
  });
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !(payment || address);
  order.errors = [payment, address].filter(error => error).join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !(email || phone);
  contacts.errors = [email, phone].filter(error => error).join('; ');
});

events.on('input:change', ({ field, value }: { field: keyof IOrderForm, value: string }) => {
  appData.validation(field, value);
});

events.on('order:submit', () => {
  appData.order.total = appData.totalPrice();
  appData.setItems();
  modal.render({
    content: contacts.render({
      valid: false,
      errors: []
    }),
  });
});

events.on('contacts:submit', () => {
  api.post('/order', appData.order)
    .then((response) => {
      events.emit('order:success', response);
      appData.absoluteBasketClear();
      appData.orderReset();
      order.buttonsDisabled();
      page.counter = 0;
      appData.resetPicked();
    })
    .catch((error) => {
      console.error(error);
    });
});

events.on('order:success', (response: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      description: response.total
    })
  });
});





