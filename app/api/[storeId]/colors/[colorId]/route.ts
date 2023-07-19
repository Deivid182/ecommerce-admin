import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request, { params }: { params: { colorId: string } }) {
  try {
    if(!params.colorId) return NextResponse.json({ message: 'Size ID is required'  })

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId
      }
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('ERROR_GET_COLOR')
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}  

export async function PATCH(request: Request, { params }: { params: { colorId: string, storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await request.json()

    const { name, value } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 })

    if(!value) return NextResponse.json({ message: 'Value is required' }, { status: 400 })

    if(!params.colorId) return NextResponse.json({ message: 'Color ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const color = await prismadb.color.update({
      where: {
        id: params.colorId
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('ERROR_UPDATING_COLOR', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500  })
  }
}

export async function DELETE(request: Request, { params }: { params: { colorId: string, storeId: string } }) {
  try {
    const { userId } = auth()

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!params.colorId) return NextResponse.json({ message: 'Color ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const color = await prismadb.color.delete({
      where: {
        id: params.colorId
      },
    })

    return NextResponse.json(color)
    
  } catch (error) {
    console.log('ERROR_DELETING_COLOR', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500  })
  }
}