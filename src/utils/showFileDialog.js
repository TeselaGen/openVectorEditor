// TODO maybe move to TRC or elsewhere
let hiddenInput;
let callback;

function getInput(multiple) {
  if (!hiddenInput) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.visibility = 'hidden';
    hiddenInput.addEventListener('change', event => {
      callback(event.target.files);
    });

    document.body.appendChild(hiddenInput);
  }
  hiddenInput.multiple = multiple ? 'multiple' : undefined;
  return hiddenInput;
}


export default function showFileDialog({ multiple = false, onSelect }) {
  const input = getInput(multiple);
  callback = onSelect;
  input.click();
}
