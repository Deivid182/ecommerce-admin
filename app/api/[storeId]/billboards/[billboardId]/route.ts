import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: {params: { storeId: string, billboardId: string }}) {
  try {
    
    const { userId } = auth ()
    
    const { storeId, billboardId } = params
    const body = await request.json()  
    const { label, imageUrl } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!label) return NextResponse.json({ mesage: 'Label is required' }, { status: 400  })

    if(!imageUrl)  return NextResponse.json({ mesage: 'Image URL is required' }, { status: 400  })

    if(!billboardId) return NextResponse.json({ message: 'Billboard ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log(error, 'ERROR_BILLBOARD_PATCH')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: {params: { storeId: string, billboardId: string }}) {
  try {
    
    const { userId } = auth ()
    if(!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { storeId, billboardId } = params

    if(!billboardId) return NextResponse.json({ message: 'Billboard ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId
      },
    })

    return NextResponse.json(billboard, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_BILLBOARD_DELETE')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: {params: { billboardId: string }}) {
  try {
    const { billboardId } = params

    if(!billboardId) return NextResponse.json({ message: 'Billboard ID is required' }, { status: 400 })

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId
      },
    })

    return NextResponse.json(billboard, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_GETTING_DELETE')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}