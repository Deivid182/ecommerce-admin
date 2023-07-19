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
import { Billboard, Category } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[]
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  billboardId: z.string().min(1)
});

type CategoryFormData = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({ category, billboards }) => {

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = category ? 'Edit Category' : 'Add Category'
  const description = category ? 'Edit your category' : 'Add a new category'
  const toastMessage = category ? 'Category updated successfully' : 'Category added successfully'
  const action = category ? 'Update' : 'Add'

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: '',
      billboardId: ''
    }
  });

  const onSubmit = async (values: CategoryFormData) => {
    try {
      setIsLoading(true)
      if(category) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values)
      } else {
        await axios.post(`/api/${params.storeId}/categories`, values)
      }
      router.refresh()
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.refresh()
      router.push(`/${params.storeId}/categories`)
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
      <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {category && (
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
                      placeholder='Category name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a billboard'/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map(billboard => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
