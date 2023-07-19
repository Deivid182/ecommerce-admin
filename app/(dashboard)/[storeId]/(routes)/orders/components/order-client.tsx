"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface OrderClientProps {
  orders: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({
  orders
}) => {

  const router = useRouter()
  const params = useParams()

  return (
    <>
      <Heading 
        title={`Orders (${orders.length})`} 
        description='Manage your billboards here'
      />
      <Separator />
      <DataTable searchKey='products' columns={columns} data={orders}/>
    </>
  )
}

export default OrderClient
