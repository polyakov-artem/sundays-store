import { FC, memo } from 'react';
import ReactModal from 'react-modal';
import { ReactModalProps } from './reactModalProps';
import Button from '../Button/Button';
import './ModalWindow.scss';

export const BODY_LOCKED = `body-locked`;
export const MODAL_BLOCK = `modal-block`;
export const MODAL_BLOCK_WINDOW = `${MODAL_BLOCK}__window`;
export const MODAL_BLOCK_CLOSE_BTN = `${MODAL_BLOCK}__close-btn`;
export const MODAL_BLOCK_CONTENT = `${MODAL_BLOCK}__content`;

export type TModalWindowProps = ReactModalProps & {
  withCloseBtn?: boolean;
};

const root = document.getElementById('root')!;

const ModalWindow: FC<TModalWindowProps> = (props) => {
  const { withCloseBtn = true, children, ...reactModalProps } = props;

  return (
    <ReactModal
      {...reactModalProps}
      appElement={root}
      overlayClassName={MODAL_BLOCK}
      className={MODAL_BLOCK_WINDOW}
      bodyOpenClassName={BODY_LOCKED}>
      {withCloseBtn && (
        <Button
          className={MODAL_BLOCK_CLOSE_BTN}
          view="icon"
          theme="primary"
          el="button"
          icon={'✕'}
          onClick={(e) => reactModalProps.onRequestClose?.(e)}
        />
      )}
      <div className={MODAL_BLOCK_CONTENT}>{children}</div>
    </ReactModal>
  );
};

export default memo(ModalWindow);
