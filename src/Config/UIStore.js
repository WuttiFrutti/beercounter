import { Store } from "pullstate";


export const defaultState = {
    snack: {},
    drawer: {},
    modal: {}
}

export const openSnack = (children, severity = "error", options) => {
    UIStore.update(s => ({ ...s,snack:{ open:true, severity:severity, children:children, ...options }  }));
}

export const openDrawer = (children, anchor = "bottom", tag = "drawer") => {
    UIStore.update(s => ({ ...s,drawer:{ open:true, anchor:anchor, children:children, tag: tag }  }));
}

export const openModal = (children, title) => {
    UIStore.update(s => ({...s, modal:{ open: true, title,  children:children }}))
}

export const closeModal = () => {
    UIStore.update(s => {
        s.modal.open = false;
      });
}

export const closeSnack = () => {
    UIStore.update(s => {
        s.snack.open = false;
      });
}

export const closeDrawer = () => {
    UIStore.update(s => {
        s.drawer.open = false;
      });
}



export const UIStore = new Store(defaultState);