import React from 'react'
import ProductClient from './components/product-client'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { ProductColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      color: true,
      size: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts: ProductColumn[] = products.map(item => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    color: item.color.value,
    size: item.size.name,
    createdAt: format(item.createdAt, 'MMMM do yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-8 p-8 pt-6'>
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
