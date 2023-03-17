import domtoimage from "dom-to-image";
import { hideDialog, showDialog } from "../../GlobalDialogUtils";

async function getSaveDialogEl() {
  return new Promise((resolve) => {
    showDialog({
      dialogType: "PrintDialog",
      props: {
        dialogProps: {
          title: "Generating Image to Save...",
          isCloseButtonShown: false
        },
        addPaddingBottom: true,
        hideLinearCircularToggle: true,
        hidePrintButton: true
      }
    });

    const id = setInterval(() => {
      const componentToPrint = document.querySelector(".bp3-dialog");
      if (componentToPrint) {
        clearInterval(id);
        resolve(componentToPrint);
      }
    }, 1000);
  });
}
/**
 * Function to generate a png
 *
 * @return {object} - Blob (png) | Error
 */
export const generatePngFromPrintDialog = async () => {
  const saveDialog = await getSaveDialogEl();

  const printArea = saveDialog.querySelector(".bp3-dialog-body");

  const result = await domtoimage
    .toBlob(printArea)
    .then((blob) => {
      return blob;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  hideDialog();
  return result;
};