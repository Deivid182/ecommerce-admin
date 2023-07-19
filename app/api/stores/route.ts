import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = auth()

    const { name } = body

    if(!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    if(!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 })

    const store = await prismadb.store.create({
      data: {
        name,
        userId
      }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log(error, "ERROR_CREATE_STORE")
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}