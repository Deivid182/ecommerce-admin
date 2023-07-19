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
import { Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
  store: Store;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
});

type SettingsFormData = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: store,
  });

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = useOrigin()

  const onSubmit = async (values: SettingsFormData) => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, values)
      router.refresh()
      toast.success('Store updated successfully');
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
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted successfully');
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
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
        <Heading title='Settings' description='Manage your store settings' />
        <Button variant={'destructive'} size={'sm'} onClick={() => setOpen(true)}>
          <Trash className='w-4 h-4' />
        </Button>
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
                      placeholder='Store name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='ml-auto' type='submit' disabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        variant='public'
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};

export default SettingsForm;
