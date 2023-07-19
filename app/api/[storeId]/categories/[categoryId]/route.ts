import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    if(!params.categoryId) return NextResponse.json({ message: 'Category ID is required'  })

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId
      },
      include: {
        billboard: true
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}  

export async function PATCH(request: Request, { params }: { params: { categoryId: string, storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await request.json()

    const { name, billboardId } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 })

    if(!billboardId) return NextResponse.json({ message: 'Billboard ID is required' }, { status: 400 })

    if(!params.categoryId) return NextResponse.json({ message: 'Category ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const category = await prismadb.category.update({
      where: {
        id: params.categoryId
      },
      data: {
        name,
        billboardId
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('ERROR_UPDATING_CATEGORY', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500  })
  }
}

export async function DELETE(request: Request, { params }: { params: { categoryId: string, storeId: string } }) {
  try {
    const { userId } = auth()

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!params.categoryId) return NextResponse.json({ message: 'Category ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId
      },
    })

    return NextResponse.json(category)
    
  } catch (error) {
    console.log('ERROR_DELETING_CATEGORY', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500  })
  }
}