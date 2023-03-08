import { ModalButton } from "../models/ModalButton";

type styleTypes = "info" | "warning" | "error";
const okButton = new ModalButton("Ok",() => HideModal(), undefined, undefined, null);

const modalProps: {
  visible: boolean;
  title: string;
  message: string;
  styleType: styleTypes;
  buttons: Array<ModalButton>;
  onShow: (visible: boolean) => void;
  onHide: (visible: boolean) => void;
} = {
  visible: false,
  title: "",
  message: "",
  styleType: "info",
  buttons: [okButton],
  onShow: () => null,
  onHide: () => null,
};

function InitModal(onShow: (visible: boolean) => void, onHide: (visible: boolean) => void){
    modalProps.onShow = onShow;
    modalProps.onHide = onHide;
}

function HideModal() {
  modalProps.visible = false;
  modalProps.onHide(false);
}

function ShowModal() {
  modalProps.visible = true;
  modalProps.onShow(true);
}

function OpenModal(props:{
  title: string,
  message: string,
  buttons?: Array<ModalButton>,
  styleType?: styleTypes,
}) {
  modalProps.title = props.title;
  modalProps.message = props.message;
  modalProps.styleType = props.styleType ?? "info";
  modalProps.buttons = props.buttons ?? [okButton];

  ShowModal();
}

function ClearModal() {
  modalProps.visible = false;
  modalProps.title = "";
  modalProps.message = "";
  modalProps.styleType = "info";
  modalProps.buttons = [okButton];
}

export {modalProps, InitModal, HideModal, ShowModal, OpenModal, ClearModal}
