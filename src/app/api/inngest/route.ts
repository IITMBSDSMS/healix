import { serve } from 'inngest/next';
import { inngest } from '../../../lib/infrastructure/inngest';
import { processAiInference } from '../../../workers/ai-inference';

// Create an API that serves zero-downtime background jobs
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processAiInference,
  ],
});
