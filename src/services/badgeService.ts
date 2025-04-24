import { prisma } from '@/lib/prisma';

const BADGE_THRESHOLDS = {
  STAR_COLLECTOR: { threshold: 100, badge: 'Star Collector' },
  BOOST_MASTER: { threshold: 10, badge: 'Boost Master' },
  VERSE_EXPLORER: { threshold: 5, badge: 'Verse Explorer' },
  COSMIC_CREATOR: { threshold: 50, badge: 'Cosmic Creator' },
};

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      stars: true,
      promotions: {
        where: { boostLevel: { gt: 0 } },
      },
    },
  });

  if (!user) return;

  const newBadges: string[] = [];
  const currentBadges = new Set(user.badges);

  // Check Star Collector badge
  if (user.stars.length >= BADGE_THRESHOLDS.STAR_COLLECTOR.threshold) {
    if (!currentBadges.has(BADGE_THRESHOLDS.STAR_COLLECTOR.badge)) {
      newBadges.push(BADGE_THRESHOLDS.STAR_COLLECTOR.badge);
    }
  }

  // Check Boost Master badge
  if (user.promotions.length >= BADGE_THRESHOLDS.BOOST_MASTER.threshold) {
    if (!currentBadges.has(BADGE_THRESHOLDS.BOOST_MASTER.badge)) {
      newBadges.push(BADGE_THRESHOLDS.BOOST_MASTER.badge);
    }
  }

  // Check Verse Explorer badge
  const uniqueVerses = new Set(user.promotions.map(p => p.verse));
  if (uniqueVerses.size >= BADGE_THRESHOLDS.VERSE_EXPLORER.threshold) {
    if (!currentBadges.has(BADGE_THRESHOLDS.VERSE_EXPLORER.badge)) {
      newBadges.push(BADGE_THRESHOLDS.VERSE_EXPLORER.badge);
    }
  }

  // Check Cosmic Creator badge
  if (user.promotions.length >= BADGE_THRESHOLDS.COSMIC_CREATOR.threshold) {
    if (!currentBadges.has(BADGE_THRESHOLDS.COSMIC_CREATOR.badge)) {
      newBadges.push(BADGE_THRESHOLDS.COSMIC_CREATOR.badge);
    }
  }

  // Award new badges if any
  if (newBadges.length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        badges: {
          push: newBadges,
        },
        cosmicPoints: {
          increment: newBadges.length * 50, // Award 50 points per new badge
        },
      },
    });

    // Create notification for each new badge
    await Promise.all(
      newBadges.map(badge =>
        prisma.notification.create({
          data: {
            userId,
            type: 'BADGE_EARNED',
            title: 'New Badge Earned!',
            message: `Congratulations! You've earned the ${badge} badge.`,
            metadata: {
              badge,
            },
          },
        })
      )
    );
  }

  return newBadges;
} 