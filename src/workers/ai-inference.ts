import { inngest } from '../lib/infrastructure/inngest';
import { createLogger } from '../lib/infrastructure/logger';
import { setCache } from '../lib/infrastructure/cache';
import { pushToDlq } from '../lib/infrastructure/dlq';

const logger = createLogger('worker-ai-inference');

export const processAiInference = inngest.createFunction(
  { 
    id: 'process-ai-inference', 
    retries: 3,
    // Inngest v4 combines trigger into the first argument
    triggers: [{ event: 'ai/inference.requested' }]
  },
  async ({ event, step }) => {
    logger.info('Starting AI inference job', { eventId: event.id, payload: event.data });
    
    try {
      // 1. Validate payload
      const { telemetryId, patientId, metrics } = event.data as any;
      if (!telemetryId || !patientId || !metrics) {
        throw new Error('Invalid inference payload: Missing required fields');
      }

      // 2. Simulate AI Processing
      const result = await step.run('run-model-inference', async () => {
        // Simulate a delay for model execution
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const riskScore = Math.random() * 100;
        const status = riskScore > 85 ? 'critical' : riskScore > 50 ? 'warning' : 'normal';
        
        return {
          riskScore,
          status,
          timestamp: new Date().toISOString(),
          recommendations: status === 'critical' ? ['Immediate attention required'] : [],
        };
      });

      // 3. Cache the result for fast access
      await step.run('cache-inference-result', async () => {
        await setCache(`inference:${telemetryId}`, result, { ttlSeconds: 3600 });
      });

      logger.info('Successfully completed AI inference', { eventId: event.id, result });
      return { success: true, result };

    } catch (error: any) {
      logger.error('AI inference job failed', error, { eventId: event.id });
      
      await step.run('push-to-dlq', async () => {
        await pushToDlq({
          queue: 'ai-inference',
          event: event,
          error: error.message,
        });
      });

      throw error;
    }
  }
);
