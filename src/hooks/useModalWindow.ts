import { useCallback, useState } from 'react';

export const useModalWindow = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { modalIsOpen, openModal, closeModal };
};
