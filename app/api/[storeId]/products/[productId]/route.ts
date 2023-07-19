import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: {params: { storeId: string, productId: string }}) {
  try {
    
    const { userId } = auth ()
    
    const { productId } = params
    const body = await request.json()  

    const { name, images, isArchived, isFeatured, colorId, sizeId, price, categoryId } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!productId) return NextResponse.json({ message: 'Product ID is required' })

    if(!name) return NextResponse.json({ message: 'Name are required' }, { status: 400 })

    if(!images || !images.length) return NextResponse.json({ message: 'Images are required' }, { status: 400 })

    if(!price) return NextResponse.json({ message: 'Price are required' }, { status: 400 })

    if(!colorId) return NextResponse.json({ message: 'Color ID are required' }, { status: 400 })

    if(!sizeId) return NextResponse.json({ message: 'Size ID are required' }, { status: 400 })

    if(!categoryId) return NextResponse.json({ message: 'Category ID are required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    await prismadb.product.update({
      where: {
        id: productId
      },
      data: {
        name,
        colorId,
        sizeId,
        categoryId,
        price,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {}
        }
      }
    })

    const product = await prismadb.product.update({
      where: {
        id: productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_PRODUCT_PATCH')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: {params: { storeId: string, productId: string }}) {
  try {
    
    const { userId } = auth ()
    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    const { storeId, productId } = params

    if(!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const product = await prismadb.product.delete({
      where: {
        id: productId
      },
    })

    return NextResponse.json(product, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_PRODUCT_DELETE')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: {params: { productId: string }}) {
  try {
    const { productId } = params

    if(!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 })

    const product = await prismadb.product.findUnique({
      where: {
        id: productId
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      }
    })

    return NextResponse.json(product, { status: 200 })

  } catch (error) {
    console.log(error, 'ERROR_GETTING_PRODUCT')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}