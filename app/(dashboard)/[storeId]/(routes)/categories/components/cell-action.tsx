'use client';

import React, { useState } from 'react';
import AlertModal from '@/components/modals/alert-modal';
import { CategoryColumn } from './columns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface CellActionProps {
  data: CategoryColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Category ID copied');
  };
  
  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
      router.refresh()
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Make sure you removed all products using this category before continue');
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
    <AlertModal isOpen={open} onClose={() => setOpen(false)} isLoading={isLoading} onConfirm={onDelete}/>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className='w-8 h-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
        <DropdownMenuItem 
          className='cursor-pointer'
          onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}
        >
          <Edit className='mr-2 w-4 h-4'/> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopy(data.id)} className='cursor-pointer'>
          <Copy className='mr-2 w-4 h-4'/> Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setOpen(true)}
          className='cursor-pointer'
        >
          <Trash className='mr-2 w-4 h-4'/> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
};

export default CellAction;