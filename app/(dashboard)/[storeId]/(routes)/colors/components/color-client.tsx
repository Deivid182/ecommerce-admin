"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ColorColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface ColorClientProps {
  colors: ColorColumn[]
}

const ColorClient: React.FC<ColorClientProps> = ({
  colors
}) => {

  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between space-y-4 p-8 pt-6'>
        <Heading 
          title={`Colors (${colors.length})`} 
          description='Manage your colors here'
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={colors}/>
      <Heading title='API' description='API calls for colors' />
      <ApiList entityName='colors' entityIdName='colorId'/>
    </>
  )
}

export default ColorClient
