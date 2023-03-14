import { writable } from 'svelte/store';

export const editorStore = writable({
  selectionLayer: {start: -1, end: -1},
  caretPosition: -1,
  
});

