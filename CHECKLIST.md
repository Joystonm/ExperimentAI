# ExperimentAI - Quick Start Checklist

## Pre-Submission Checklist

Use this checklist to ensure everything is configured correctly before submitting to the PowerSync AI Hackathon.

---

## ☐ 1. Install Dependencies

```bash
cd ExperimentAI
npm install
```

**Verify:**
- [ ] No installation errors
- [ ] All packages installed successfully
- [ ] `node_modules` folder created

---

## ☐ 2. Setup Supabase

### Create Project
- [ ] Go to https://supabase.com
- [ ] Create new project
- [ ] Note project URL and anon key

### Apply Database Schema
- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `supabase/schema.sql`
- [ ] Run the SQL script
- [ ] Verify all tables created
- [ ] Check RLS policies are enabled

### Get Credentials
- [ ] Project Settings → API
- [ ] Copy Project URL
- [ ] Copy anon/public key
- [ ] Copy JWT Secret (for PowerSync)

---

## ☐ 3. Setup PowerSync

### Create Instance
- [ ] Go to https://powersync.com
- [ ] Create account
- [ ] Create new instance
- [ ] Note instance URL

### Connect to Supabase
- [ ] PowerSync Dashboard → Connections
- [ ] Add Supabase connection
- [ ] Enter Supabase database credentials
- [ ] Test connection

### Configure Sync Rules
- [ ] PowerSync Dashboard → Sync Rules
- [ ] Copy sync rules from `docs/powersync-setup.md`
- [ ] Paste and deploy
- [ ] Wait for deployment to complete

### Setup Authentication
- [ ] PowerSync Dashboard → Authentication
- [ ] Select "Supabase" provider
- [ ] Enter Supabase JWT secret
- [ ] Configure token parameters: `{ "user_id": "{{ user.id }}" }`

---

## ☐ 4. Get API Keys

### OpenAI (for Mastra)
- [ ] Go to https://platform.openai.com
- [ ] Create API key
- [ ] Note the key (starts with `sk-`)

### Tavily (for knowledge retrieval)
- [ ] Go to https://tavily.com
- [ ] Sign up for account
- [ ] Get API key
- [ ] Note the key

---

## ☐ 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# PowerSync
VITE_POWERSYNC_URL=https://your-instance.powersync.com

# OpenAI
VITE_OPENAI_API_KEY=sk-your_openai_key_here

# Tavily
VITE_TAVILY_API_KEY=your_tavily_key_here
```

**Verify:**
- [ ] All variables filled in
- [ ] No placeholder text remaining
- [ ] File saved

---

## ☐ 6. Test Local Development

```bash
npm run dev
```

**Verify:**
- [ ] Server starts on http://localhost:3000
- [ ] No console errors
- [ ] Can access login page

---

## ☐ 7. Test Authentication

- [ ] Click "Sign up"
- [ ] Create test account
- [ ] Verify email confirmation (if enabled)
- [ ] Sign in successfully
- [ ] Redirected to home page

**Check Console:**
- [ ] "PowerSync initialized successfully" message
- [ ] No authentication errors

---

## ☐ 8. Test PowerSync Sync

### Check Connection
- [ ] Look for sync status indicator in navbar
- [ ] Should show green dot "Synced"
- [ ] No connection errors in console

### Test Offline Mode
- [ ] Open DevTools (F12)
- [ ] Network tab → Throttling → Offline
- [ ] Navigate to Physics Lab
- [ ] Verify page still works
- [ ] Sync indicator shows "Offline"
- [ ] Re-enable network
- [ ] Sync indicator shows "Syncing..." then "Synced"

---

## ☐ 9. Test AI Features

### Lab Assistant
- [ ] Click AI assistant button (if implemented in UI)
- [ ] Ask a question: "What is Newton's first law?"
- [ ] Verify response appears
- [ ] Check for source citations
- [ ] No API errors in console

### Experiment Analysis
- [ ] Create a test experiment
- [ ] Complete the experiment
- [ ] Verify AI analysis is generated
- [ ] Check notebook entry created

---

## ☐ 10. Test Lab Notebook

- [ ] Navigate to "Lab Notebook" in navbar
- [ ] Verify notebook entries appear
- [ ] Click on an entry
- [ ] Verify AI explanation displays
- [ ] Check experiment details shown

---

## ☐ 11. Test All Lab Modules

### Physics Lab
- [ ] Navigate to Physics Lab
- [ ] Interact with simulation
- [ ] Verify 3D rendering works
- [ ] No console errors

### Electrical Playground
- [ ] Navigate to Electrical Playground
- [ ] Drag components onto canvas
- [ ] Connect wires
- [ ] Verify circuit simulation works

### Astronomy Lab
- [ ] Navigate to Astronomy Lab
- [ ] Interact with planetary simulation
- [ ] Verify orbital mechanics work
- [ ] No rendering errors

---

## ☐ 12. Verify Data Persistence

- [ ] Create an experiment
- [ ] Sign out
- [ ] Sign back in
- [ ] Verify experiment still exists
- [ ] Check notebook entries persist

---

## ☐ 13. Check Supabase Data

- [ ] Open Supabase Dashboard
- [ ] Table Editor → experiments
- [ ] Verify your test experiments appear
- [ ] Check experiment_analyses table
- [ ] Check notebook_entries table

---

## ☐ 14. Check PowerSync Dashboard

- [ ] Open PowerSync Dashboard
- [ ] Verify active connection
- [ ] Check sync metrics
- [ ] Review any error logs

---

## ☐ 15. Prepare Demo Video

### Script Outline
1. **Introduction** (15 sec)
   - [ ] Introduce ExperimentAI
   - [ ] Mention hackathon submission

2. **Local-First Demo** (30 sec)
   - [ ] Show sync status indicator
   - [ ] Go offline (DevTools)
   - [ ] Run experiment offline
   - [ ] Go back online
   - [ ] Show sync happening

3. **AI Features** (45 sec)
   - [ ] Ask AI assistant a question
   - [ ] Show Tavily sources
   - [ ] Complete an experiment
   - [ ] Show AI analysis
   - [ ] Display lab notebook

4. **Lab Modules** (30 sec)
   - [ ] Quick tour of Physics Lab
   - [ ] Show Electrical Playground
   - [ ] Demo Astronomy Lab

5. **Architecture** (30 sec)
   - [ ] Explain PowerSync integration
   - [ ] Show Supabase backend
   - [ ] Mention Mastra AI agents

6. **Conclusion** (15 sec)
   - [ ] Summarize key features
   - [ ] Thank judges

**Total: ~2.5 minutes**

### Recording
- [ ] Record screen with audio
- [ ] Use 1080p resolution
- [ ] Clear audio quality
- [ ] Upload to YouTube/Vimeo
- [ ] Set to unlisted/public

---

## ☐ 16. Prepare GitHub Repository

### Code
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Verify all files uploaded
- [ ] Check .env is in .gitignore

### Documentation
- [ ] README.md is complete
- [ ] docs/powersync-setup.md exists
- [ ] docs/implementation-guide.md exists
- [ ] IMPLEMENTATION_SUMMARY.md exists

### Repository Settings
- [ ] Set repository to public
- [ ] Add description
- [ ] Add topics: `powersync`, `ai`, `hackathon`, `education`
- [ ] Add license (MIT recommended)

---

## ☐ 17. Deploy to Production (Optional but Recommended)

### Vercel/Netlify
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy
- [ ] Test production URL
- [ ] Verify all features work

---

## ☐ 18. Prepare Submission

### Required Information
- [ ] Project name: ExperimentAI
- [ ] Short description (1-2 sentences)
- [ ] Team member names
- [ ] Contact email
- [ ] GitHub repository URL (public)
- [ ] Demo video URL
- [ ] Live demo URL (if deployed)

### Prize Categories to Select
- [ ] Core Prizes (automatic)
- [ ] Best Local-First Submission
- [ ] Best Submission Using Supabase
- [ ] Best Submission Using Mastra

### Architecture Summary
- [ ] Write 2-3 paragraphs explaining:
  - How PowerSync is used
  - How Supabase is integrated
  - How Mastra AI agents work
  - How Tavily enhances responses
  - Why local-first matters for education

---

## ☐ 19. Final Review

### Code Quality
- [ ] No console errors
- [ ] No TypeScript errors (if using TS)
- [ ] Code is commented
- [ ] Functions are documented

### User Experience
- [ ] UI is responsive
- [ ] Animations are smooth
- [ ] Loading states are clear
- [ ] Error messages are helpful

### Documentation
- [ ] README is clear and complete
- [ ] Setup instructions are accurate
- [ ] Architecture is well explained
- [ ] Code examples are correct

---

## ☐ 20. Submit!

- [ ] Fill out submission form
- [ ] Double-check all information
- [ ] Verify all links work
- [ ] Submit before deadline: **March 20, 2026 at 11:59 PM PT**

---

## Post-Submission

- [ ] Join PowerSync Discord #ai-hackathon channel
- [ ] Share your submission
- [ ] Engage with other participants
- [ ] Be available for judge questions

---

## Troubleshooting

### PowerSync won't connect
→ Check `VITE_POWERSYNC_URL` in `.env`
→ Verify sync rules are deployed
→ Check browser console for errors

### AI responses failing
→ Verify `VITE_OPENAI_API_KEY` is correct
→ Check OpenAI account has credits
→ Review API usage limits

### Supabase errors
→ Verify RLS policies are enabled
→ Check user is authenticated
→ Review Supabase logs

### Sync not working
→ Check PowerSync Dashboard for errors
→ Verify Supabase connection is active
→ Test with simple query first

---

## Support

- **PowerSync**: https://discord.gg/powersync
- **Supabase**: https://supabase.com/docs
- **Mastra**: https://mastra.ai/docs
- **Tavily**: https://tavily.com/docs

---

## Good Luck! 🚀

You've built something amazing. Trust your implementation and present it confidently!
