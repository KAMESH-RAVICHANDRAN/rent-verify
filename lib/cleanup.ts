import { prisma } from './prisma';

/**
 * Automatically deletes documents that have expired (older than 30 days).
 * This should be run as a scheduled task (cron job).
 */
export async function cleanupExpiredDocuments() {
  try {
    const now = new Date();
    
    const expiredDocs = await prisma.document.findMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });

    console.log(`Found ${expiredDocs.length} expired documents for cleanup.`);

    for (const doc of expiredDocs) {
      // 1. Delete from S3 storage (mock logic)
      console.log(`Deleting file from storage: ${doc.url}`);
      
      // 2. Delete from database
      await prisma.document.delete({
        where: { id: doc.id }
      });
    }

    return { success: true, deletedCount: expiredDocs.length };
  } catch (error) {
    console.error('Cleanup Error:', error);
    return { success: false, error };
  }
}
