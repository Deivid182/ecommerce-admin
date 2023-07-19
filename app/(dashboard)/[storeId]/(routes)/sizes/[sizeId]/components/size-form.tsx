'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Size } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';

interface SizeFormProps {
  size: Size | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  value: z.string().min(1)
});

type SizeFormData = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ size }) => {

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = size ? 'Edit Size' : 'Add Size'
  const description = size ? 'Edit your size' : 'Add a new size'
  const toastMessage = size ? 'Size updated successfully' : 'Size added successfully'
  const action = size ? 'Update' : 'Add'

  const form = useForm<SizeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: size || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (values: SizeFormData) => {
    try {
      setIsLoading(true)
      if(size) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values)
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values)
      }
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage);
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsLoading(false)
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success('Size deleted successfully');
    } catch (error) {
      toast.error('Make sure you removed all products using this size before continue');
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {size && (
          <Button variant={'destructive'} size={'sm'} onClick={() => setOpen(true)}>
            <Trash className='w-4 h-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='Size name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='Size value'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='ml-auto' type='submit' disabled={isLoading}>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default SizeForm;
