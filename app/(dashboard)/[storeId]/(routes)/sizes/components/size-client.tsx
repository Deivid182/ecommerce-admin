"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { SizeColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface BillboardClientProps {
  sizes: SizeColumn[]
}

const SizeClient: React.FC<BillboardClientProps> = ({
  sizes
}) => {

  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between space-y-4 p-8 pt-6'>
        <Heading 
          title={`Sizes (${sizes.length})`} 
          description='Manage your sizes here'
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={sizes}/>
      <Heading title='API' description='API calls for sizes' />
      <ApiList entityName='sizes' entityIdName='sizeId'/>
    </>
  )
}

export default SizeClient
