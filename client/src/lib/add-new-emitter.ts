// Simple event emitter for Add New functionality
class AddNewEmitter extends EventTarget {
  setOptions(options: Array<{ label: string; onClick: () => void; }>) {
    this.dispatchEvent(new CustomEvent('optionsChanged', { detail: options }));
  }
}

export const addNewEmitter = new AddNewEmitter();