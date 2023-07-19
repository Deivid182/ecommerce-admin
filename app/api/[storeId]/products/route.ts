
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { storeId: string }  }) {
  try {
    const body = await request.json()
    const { userId } = auth()

    const { name, images, isArchived, isFeatured, colorId, sizeId, price, categoryId } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!name) return NextResponse.json({ message: 'Name are required' }, { status: 400 })

    if(!images || !images.length) return NextResponse.json({ message: 'Images are required' }, { status: 400 })

    if(!price) return NextResponse.json({ message: 'Price are required' }, { status: 400 })

    if(!colorId) return NextResponse.json({ message: 'Color ID are required' }, { status: 400 })

    if(!sizeId) return NextResponse.json({ message: 'Size ID are required' }, { status: 400 })

    if(!categoryId) return NextResponse.json({ message: 'Category ID are required' }, { status: 400 })

    if(!params.storeId) return NextResponse.json({ message: 'Store ID is required' })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        colorId,
        sizeId,
        categoryId,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        },
        storeId: params.storeId,
      }
    })

    return NextResponse.json(product)

  } catch (error) {
    console.log(error, "ERROR_CREATE_PRODUCT")
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { storeId: string }  }) {
  try {

    const { searchParams } = new URL(request.url)

    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    if(!params.storeId) return NextResponse.json({ message: 'Store ID is required' })

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)

  } catch (error) {
    console.log(error, "ERROR_GETTING_PRODUCTS")
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}