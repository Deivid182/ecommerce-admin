"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProductColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface ProductClientProps {
  products: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = ({
  products
}) => {

  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between space-y-4 p-8 pt-6'>
        <Heading 
          title={`Products (${products.length})`} 
          description='Manage your products here'
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={products}/>
      <Heading title='API' description='API calls for products' />
      <ApiList entityName='products' entityIdName='productId'/>
    </>
  )
}

export default ProductClient