# AI Coach Deployment Guide

## Step 1: Create a New Subject
1. Copy one of the existing subject files from `src/config/subjects`
2. Rename it to your new subject (e.g., `physics.json`)
3. Edit the content:
   - Update the subject details
   - Add your teaching materials
   - Set your Synthflow widget ID

## Step 2: Deploy to Netlify
1. Log into Netlify
2. Click "New site from Git"
3. Choose your repository
4. Set these environment variables:
   - VITE_SPECIALIZATION=your_subject (e.g., math, english)
   - VITE_OPENAI_API_KEY=your_api_key

## Step 3: Update Content
To update your tutor's knowledge:
1. Open the subject file (e.g., `math.json`)
2. Edit the materials section
3. Commit and push changes
4. Netlify will automatically redeploy

## Notes:
- Each subject needs its own Synthflow widget
- Keep materials organized by topics
- Use clear, specific instructions
- Test the tutor with sample questions before sharing