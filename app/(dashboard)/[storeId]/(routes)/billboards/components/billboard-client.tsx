"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BillboardColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface BillboardClientProps {
  billboards: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientProps> = ({
  billboards
}) => {

  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between space-y-4 p-8 pt-6'>
        <Heading 
          title={`Billboards (${billboards.length})`} 
          description='Manage your billboards here'
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='label' columns={columns} data={billboards}/>
      <Heading title='API' description='API calls for billboards' />
      <ApiList entityName='billboards' entityIdName='billboardId'/>
    </>
  )
}

export default BillboardClient
