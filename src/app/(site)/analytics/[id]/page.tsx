import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import AnalyticsDashboard from '@/components/ui/AnalyticsDashboard';

interface AnalyticsPageProps {
  params: {
    id: string;
  };
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const promotion = await prisma.promotion.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: true,
    },
  });

  if (!promotion) {
    notFound();
  }

  if (promotion.authorId !== session.user.id) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights for your promotion
        </p>
      </div>

      <AnalyticsDashboard promotionId={params.id} />
    </div>
  );
} 