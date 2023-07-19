import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: {params: { storeId: string }}) {
  try {
    
    const { userId } = auth ()
    if(!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { storeId } = params
    const body = await request.json()  
    const { name } = body

    if(!name) return NextResponse.json({ mesage: 'Name is required' }, { status: 400  })

    if(!storeId) return NextResponse.json({ message: 'Store ID is required' }, { status: 400 })

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_SETTINGS_PATCH')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: {params: { storeId: string }}) {
  try {
    
    const { userId } = auth ()
    if(!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { storeId } = params

    if(!storeId) return NextResponse.json({ message: 'Store ID is required' }, { status: 400 })

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId
      },
    })

    return NextResponse.json(store, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_SETTINGS_DELETE')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}