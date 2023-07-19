import prismadb from '@/lib/prismadb';

export const getStockCount = async (storeId: string) => {
  const totalStock = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false
    }
  })

  return totalStock;
}