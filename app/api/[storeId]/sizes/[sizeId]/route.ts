import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request, { params }: { params: { sizeId: string } }) {
  try {
    if(!params.sizeId) return NextResponse.json({ message: 'Size ID is required'  })

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId
      }
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('ERROR_GET_SIZE')
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}  

export async function PATCH(request: Request, { params }: { params: { sizeId: string, storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await request.json()

    const { name, value } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 })

    if(!value) return NextResponse.json({ message: 'Value is required' }, { status: 400 })

    if(!params.sizeId) return NextResponse.json({ message: 'Size ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const size = await prismadb.size.update({
      where: {
        id: params.sizeId
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('ERROR_UPDATING_SIZE', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500  })
  }
}

export async function DELETE(request: Request, { params }: { params: { sizeId: string, storeId: string } }) {
  try {
    const { userId } = auth()

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!params.sizeId) return NextResponse.json({ message: 'Size ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId
      },
    })

    return NextResponse.json(size)
    
  } catch (error) {
    console.log('ERROR_DELETING_SIZE', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500  })
  }
}