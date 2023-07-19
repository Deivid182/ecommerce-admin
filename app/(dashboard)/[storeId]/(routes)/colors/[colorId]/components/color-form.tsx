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
import { Color } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';

interface SizeFormProps {
  color: Color | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  value: z.string().min(1).regex(/^#/, {
    message: 'Value must be a valid hex color'
  })
});

type ColorFormData = z.infer<typeof formSchema>;

const ColorForm: React.FC<SizeFormProps> = ({ color }) => {

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = color ? 'Edit Color' : 'Add Color'
  const description = color ? 'Edit your color' : 'Add a new color'
  const toastMessage = color ? 'Color updated successfully' : 'Color added successfully'
  const action = color ? 'Update' : 'Add'

  const form = useForm<ColorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: color || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (values: ColorFormData) => {
    try {
      setIsLoading(true)
      if(color) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values)
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values)
      }
      router.refresh()
      router.push(`/${params.storeId}/colors`)
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success('Color deleted successfully');
    } catch (error) {
      toast.error('Make sure you removed all products using this color before continue');
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
        {color && (
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
                    <div className='flex items-center gap-x-2'>
                      <Input
                        disabled={isLoading}
                        {...field}
                        placeholder='Size value'
                      />
                      <div className='border p-4 rounded-full' style={{ backgroundColor: field.value }}/>
                    </div>
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

export default ColorForm;
