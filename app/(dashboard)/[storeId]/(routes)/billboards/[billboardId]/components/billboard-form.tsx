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
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';
import ImageUpload from '@/components/ui/image-upload';

interface BillboardFormProps {
  billboard: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(2, 'Name is required'),
  imageUrl: z.string().min(1)
});

type BillboardFormData = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {

  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = billboard ? 'Edit Billboard' : 'Add Billboard'
  const description = billboard ? 'Edit your billboard' : 'Add a new billboard'
  const toastMessage = billboard ? 'Billboard updated successfully' : 'Billboard added successfully'
  const action = billboard ? 'Update' : 'Add'

  const form = useForm<BillboardFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: billboard || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (values: BillboardFormData) => {
    try {
      setIsLoading(true)
      if(billboard) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values)
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values)
      }
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success('Store deleted successfully');
    } catch (error) {
      toast.error('Make sure you removed all categories using this billboard before continue');
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
        {billboard && (
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
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='Store name'
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

export default BillboardForm;
