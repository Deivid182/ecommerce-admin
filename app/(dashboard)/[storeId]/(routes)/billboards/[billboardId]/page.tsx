import prismadb from '@/lib/prismadb';
import BillboardForm from './components/billboard-form';

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const { billboardId: id } = params; 

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm billboard={billboard}/>
      </div>
    </div>
  );
};

export default BillboardPage;
