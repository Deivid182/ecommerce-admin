import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
  
  try {
    const { userId } = auth()
    const body = await request.json()
    
    const { name, billboardId } = body

    if(!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    if(!name) return NextResponse.json({ message: 'Name is required' }, { status: 400  })

    if(!billboardId) return NextResponse.json({ message: 'Billboard is required' }, { status: 400  })

    if(!params.storeId) return NextResponse.json({ message: 'Store is required'  }, { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log(error, 'ERROR_CREATE_CATEGORY')
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 }) 
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('ERROR_CATEGORIES_GET', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};