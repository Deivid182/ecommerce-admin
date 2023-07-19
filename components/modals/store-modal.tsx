"use client"

import axios, { Axios, AxiosError } from 'axios'
import { useStoreModal } from '@/hooks/use-store-modal'
import { Modal } from '../ui/modal'
import React from 'react'
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { redirect } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(3).max(50)
})

export const StoreModal = () => {

  const storeModal = useStoreModal()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('/api/stores', values)
      toast.success('Store created successfully')
      window.location.assign(`/${data.id}`)
    } catch (error) {
      console.log(error)
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    }
    finally {
      setIsLoading(false)
    }
  } 

  return (
    <Modal
      title='Create a store'
      description='Register your store and start getting sales'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField 
                name='name' 
                control={form.control} 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} placeholder='E-Commerce' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}  
              />
              <div className='pt-6 space-x-2 flex items-center  justify-end w-full'>
                <Button disabled={isLoading} variant={"outline"} onClick={storeModal.onClose}>Cancel</Button>
                <Button disabled={isLoading} type='submit' >Create</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
