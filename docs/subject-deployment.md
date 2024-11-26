# Subject Deployment Guide

## 1. Prepare Knowledge Sources
1. Gather your course materials (PDFs, documents, URLs)
2. Organize materials by module/topic
3. Ensure materials are in accessible format

## 2. Configure Subject
1. Create new subject config in `src/config/subjects/[subject].json`
2. Update the following:
   - subject details
   - module structure 
   - custom prompts
   - Synthflow widget ID

## 3. Process Knowledge Sources
1. Use the `knowledgeBase.ts` processor:
```typescript
import { processKnowledgeSource } from '../lib/knowledgeBase';

// For PDF course materials
const source = {
  type: 'pdf',
  content: courseFile,
  metadata: {
    title: "Introduction to PLCs - Module 1",
    topic: ["PLC basics", "hardware components"]
  }
};

const processedDocs = await processKnowledgeSource(source);
```

## 4. Deploy Instance
1. Create new Netlify site
2. Set environment variables:
```bash
VITE_SPECIALIZATION=plc  # your subject
VITE_OPENAI_API_KEY=your_key
```
3. Deploy with:
```bash
netlify deploy --prod
```

## 5. Verify Deployment
1. Test knowledge accuracy
2. Verify voice interaction
3. Check module navigation
4. Test note-taking features

## 6. Update Content
To update subject knowledge:
1. Process new materials
2. Update subject config
3. Redeploy (automatic with Netlify)