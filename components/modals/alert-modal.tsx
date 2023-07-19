import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if(!isMounted) return null

  return (
    <Modal 
      title='Are you sure?'
      description='This action cannot be undone'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex justify-end items-center w-full'>
        <Button disabled={isLoading} onClick={onClose} variant={"outline"}>
          Cancel
        </Button>
        <Button variant={'destructive'} disabled={isLoading} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default AlertModal
