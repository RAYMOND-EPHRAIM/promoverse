import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Achievements } from '@/components/ui/Achievements';
import { prisma } from '@/lib/prisma';

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Fetch user data with achievements
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
      },
      verses: true,
      promotions: true,
      stars: true,
      boosts: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Calculate metrics
  const metrics = {
    verseCount: user.verses.length,
    promotionCount: user.promotions.length,
    starCount: user.stars.length,
    boostCount: user.boosts.length,
  };

  // Format achievements and progress
  const achievements = user.achievements.map(ua => ({
    id: ua.achievement.id,
    name: ua.achievement.name,
    description: ua.achievement.description,
    category: ua.achievement.category,
    threshold: ua.achievement.threshold,
    reward: {
      points: ua.achievement.points,
      badge: ua.achievement.badge,
    },
  }));

  const progress = user.achievements.map(ua => ({
    achievementId: ua.achievement.id,
    progress: ua.progress,
  }));

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Your Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock new achievements as you explore the PromoVerse.
        </p>
      </div>
      
      <div className="mt-8">
        <Achievements
          achievements={achievements}
          progress={progress}
          metrics={metrics}
        />
      </div>
    </div>
  );
} 