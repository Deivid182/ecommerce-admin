
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { storeId: string }  }) {
  try {
    const body = await request.json()
    const { userId } = auth()

    const { label, imageUrl } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!label || !imageUrl) return NextResponse.json({ message: 'Fields are required' }, { status: 400 })

    if(!params.storeId) return NextResponse.json({ message: 'Store ID is required' })


    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log(error, "ERROR_CREATE_BILLBOARD")
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { storeId: string }  }) {
  try {

    if(!params.storeId) return NextResponse.json({ message: 'Store ID is required' })

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboards)

  } catch (error) {
    console.log(error, "ERROR_GETTING_BILLBOARD")
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}