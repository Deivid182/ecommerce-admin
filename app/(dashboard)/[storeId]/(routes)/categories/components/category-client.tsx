"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CategoryColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface CategoryClientProps {
  categories: CategoryColumn[]
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  categories
}) => {

  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between space-y-4 p-8 pt-6'>
        <Heading 
          title={`Categories (${categories.length})`} 
          description='Manage your categories for your store here'
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={categories}/>
      <Heading title='API' description='API calls for billboards' />
      <ApiList entityName='categories' entityIdName='categoryId'/>
    </>
  )
}

export default CategoryClient
