# AI Coach - Complete Deployment Guide

## Prerequisites
- Netlify account
- OpenAI API key
- Synthflow account

## Step-by-Step Deployment Process

### 1. Subject Configuration Setup
1. Create a new JSON file in `src/config/subjects/`
   - Example: `physics.json`
   - Copy template below and customize:
   ```json
   {
     "id": "physics-tutor",
     "subject": "Physics",
     "title": "Physics AI Coach",
     "description": "Expert physics tutor specializing in mechanics, thermodynamics, and quantum physics",
     "synthflowWidgetId": "YOUR_SYNTHFLOW_ID",
     "materials": [
       {
         "title": "Classical Mechanics",
         "content": "Newton's laws, motion, forces, and energy...",
         "topics": ["mechanics", "forces", "motion"]
       }
     ],
     "instructions": "Focus on conceptual understanding with mathematical applications..."
   }
   ```

### 2. Synthflow Setup
1. Log into Synthflow (widget.synthflow.ai)
2. Create a new widget
   - Click "Create New Widget"
   - Select "Voice Assistant"
   - Name it "[Subject] AI Coach"
   - Copy the widget ID (format: numbers with 'x')

### 3. Environment Setup
1. Create a `.env` file (if not exists)
2. Add required variables:
   ```
   VITE_OPENAI_API_KEY=your_api_key
   VITE_SPECIALIZATION=physics
   ```

### 4. Netlify Deployment
1. Go to Netlify Dashboard
2. Click "New site from Git"
3. Select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables:
   - VITE_OPENAI_API_KEY
   - VITE_SPECIALIZATION
6. Click "Deploy site"

### 5. Testing Your Deployment
1. Wait for deployment to complete
2. Open the Netlify URL
3. Test the following:
   - Voice interaction
   - Text input
   - Note-taking functionality
   - Knowledge accuracy

### 6. Updating Content
To update your tutor's knowledge:
1. Edit the subject JSON file
2. Commit and push changes
3. Netlify will automatically redeploy

### Troubleshooting
- If voice chat doesn't work: Check Synthflow widget ID
- If AI responses fail: Verify OpenAI API key
- If content is incorrect: Review subject JSON file

## Maintenance
- Regularly update teaching materials
- Monitor API usage
- Keep documentation current
- Test periodically with sample questions

Need help? Contact support at [your-support-email]