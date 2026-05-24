# Pickem-Pals MVP - Product Requirements Document

**Document Version:** 1.0  
**Last Updated:** May 24, 2026  
**Status:** Draft - Ready for Development  
**Prepared for:** Development Team & Stakeholders

---

## 1. PRODUCT VISION

### 1.1 Mission Statement

Pickem-Pals transforms the way sports fans compete together. We empower groups of friends, colleagues, and communities to create teams, make weekly game predictions, and engage in friendly competition through a seamless, social-first picking platform.

### 1.2 Problem Statement

**The Gap:**
- Sports enthusiasts want to compete with friends on game predictions
- Existing solutions are either overly complex, abandoned, or lack social integration
- There's no lightweight, fun way for casual groups to organize season-long picking competitions
- Current platforms isolate users; we want to amplify the social and communal aspect

**User Pain Points:**
1. **No Easy Onboarding** - Complex registration processes deter casual players
2. **Friction in Team Creation** - Hard to invite friends and set up competitions
3. **Lack of Real-Time Feedback** - Static leaderboards don't drive engagement
4. **Missing Social Features** - No in-app communication or team bonding
5. **Poor Mobile Experience** - Most platforms aren't mobile-first

### 1.3 Target Audience

**Primary:**
- **Sports Fans** (age 18-55) who watch NFL, NCAA Football, NBA, or other major leagues
- **Casual Gamers** who enjoy friendly competition and social interaction
- **Work/Friend Groups** organizing season-long pools and competitions

**Secondary:**
- **Fantasy Sports Veterans** - Upgrade from spreadsheet-based systems
- **League Organizers** - Managing 10-50 person competitions

**Geographic Focus:**
- United States (Initial MVP)
- English-speaking regions (Phase 2)

**Device Preference:**
- Mobile-first (60% expected on mobile)
- Desktop secondary (40%)

### 1.4 Key Success Criteria (MVP Phase)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **User Acquisition** | 1,000 beta users in Month 1 | Validate product-market fit |
| **Team Formation Rate** | 80%+ of signups create/join a team | Core engagement indicator |
| **Weekly Active Users (WAU)** | 60%+ of registered users | Healthy engagement baseline |
| **Pick Submission Rate** | 75%+ of team members pick weekly | Primary engagement action |
| **Retention (Day 7)** | 50%+ | MVP baseline for casual app |
| **App Performance** | <2s page load, 99.5% uptime | Technical quality bar |
| **Mobile Responsiveness** | 100% of features on mobile | Mobile-first requirement |

---

## 2. USER FLOWS

### 2.1 User Registration & Onboarding Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   REGISTRATION & ONBOARDING                 │
└─────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  Start  │
    └────┬────┘
         │
    ┌────▼──────────────────┐
    │ Landing Page          │
    │ "Sign Up / Log In"    │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │ Email/Password Entry  │
    │ Or Social Auth        │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐      YES   ┌─────────────────────┐
    │ Email Verification?   │──────────▶ │ Check Email & Verify│
    │ (if email signup)     │           │ 6-Digit Code Entry  │
    └────┬──────────────────┘           └────┬────────────────┘
         │                                    │
         │ (social auth path skips)  ┌────────▼────────────────┐
         │                            │ Email Confirmed ✓       │
         │                            └────────┬────────────────┘
         │                                     │
    ┌────▼──────────────────────────────────────────────────┐
    │ Create Profile                                        │
    │ - Display Name (required)                             │
    │ - Profile Picture (optional)                          │
    │ - Bio (optional)                                      │
    │ - Favorite Team (optional)                            │
    └────┬───────────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────────────┐
    │ Choose Path (Onboarding)                              │
    │ ┌──────────────┐  ┌──────────────────┐                │
    │ │ Create Team  │  │ Join Existing    │                │
    │ │ (3-5 people) │  │ Team by Code     │                │
    │ └──────┬───────┘  └────────┬─────────┘                │
    │        │                   │                           │
    │        └───────────┬───────┘                           │
    └────────────────────┼─────────────────────────────────┘
                         │
                    ┌────▼──────────────────┐
                    │ Dashboard             │
                    │ "Welcome! Ready?"     │
                    │ [Start Making Picks]  │
                    └─────────────────────────┘
```

**User Stories:**
- **US-001:** As a new user, I can sign up with email/password or social auth in <60 seconds
- **US-002:** As a new user, I can create or join a team immediately after registration
- **US-003:** As a new user, I receive a welcome email with quick-start guide

---

### 2.2 Creating a Pickem Team Flow

```
┌─────────────────────────────────────────────────────────────┐
│              CREATE PICKEM TEAM FLOW                         │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │ Dashboard        │
    │ [+ Create Team]  │
    └────┬─────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ Team Setup Modal                              │
    │ ┌────────────────────────────────────────┐    │
    │ │ Team Name: ________________            │    │
    │ │ (e.g., "The Dream Team", "Office Pool")    │
    │ │                                         │    │
    │ │ League Selection: [Dropdown]            │    │
    │ │   • NFL 2026 Season                     │    │
    │ │   • NCAA Football 2026                  │    │
    │ │   • NBA 2026-27                         │    │
    │ │   • Other...                            │    │
    │ │                                         │    │
    │ │ Team Size Preference:                   │    │
    │ │   ◯ 2-5 (Small)                         │    │
    │ │ ◉ 6-15 (Standard)                       │    │
    │ │   ◯ 16+ (Large)                         │    │
    │ └────────────────────────────────────────┘    │
    └────┬─────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ Review & Confirm                              │
    │ Team created with code: TEAM-A7K9X            │
    │ [Copy Code]  [Next]                           │
    └────┬─────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ Invite Members Screen (see 2.3)               │
    └─────────────────────────────────────────────┘
```

**User Stories:**
- **US-004:** As a team creator, I can set team name, league, and size in <30 seconds
- **US-005:** As a team creator, I receive a unique team code for sharing
- **US-006:** As a team creator, I can invite members immediately or skip to dashboard

---

### 2.3 Inviting Friends Flow

```
┌─────────────────────────────────────────────────────────────┐
│              INVITE FRIENDS TO TEAM                          │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────────────┐
    │ Team Created!            │
    │ Team Code: TEAM-A7K9X    │
    │ [Invite Members Button]  │
    └────┬─────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ Share Invite Method Selection                 │
    │ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
    │ │ 📧 Email │ │ 🔗 Link  │ │ 📱 SMS   │       │
    │ │          │ │          │ │          │       │
    │ │ Direct   │ │ Share    │ │ Share    │       │
    │ │ Send to  │ │ social & │ │ group    │       │
    │ │ contacts │ │ messaging│ │ chats    │       │
    │ └──────────┘ └──────────┘ └──────────┘       │
    └──────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ Email Invite Method                           │
    │ ┌──────────────────────────────────────┐      │
    │ │ Enter emails (comma-separated):      │      │
    │ │ john@example.com, jane@example.com  │      │
    │ │                                      │      │
    │ │ Customize Message:                   │      │
    │ │ "Join us for a fun 2026 season!"   │      │
    │ │                                      │      │
    │ │ [Send Invites]                       │      │
    │ └──────────────────────────────────────┘      │
    └────┬───────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ Invitations Sent! (3/3)                       │
    │ Pending: john@, jane@, mike@                 │
    │ [Share Code Link] [Go to Dashboard]          │
    └─────────────────────────────────────────────┘
         │
         └──▶ Recipients receive email with:
              - Personal message
              - Join link or code
              - Preview of season/games
              - "Accept Invite" button
```

**User Stories:**
- **US-007:** As a user, I can send invites via email, link, or SMS
- **US-008:** As a user, I can see pending invitations and resend if needed
- **US-009:** As an invited user, I can join the team with one click from email

---

### 2.4 Making Weekly Picks Flow

```
┌─────────────────────────────────────────────────────────────┐
│            MAKING WEEKLY GAME PICKS                          │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │ Dashboard           │
    │ Week 5 Picks Due... │
    │ [Make Picks] ◀──    │ (CTA if no picks made)
    │ or View Open Week   │
    └────┬────────────────┘
         │
    ┌────▼────────────────────────────────────────────┐
    │ WEEKLY PICKS SCREEN                            │
    │                                                 │
    │ Week 5 (Sept 25 - Oct 1)                       │
    │ ⏰ Deadline: Sunday, Sept 25 @ 1:00 PM ET       │
    │ ⏱️  3 days remaining                            │
    │                                                 │
    │ Your Picks: [2/8 selected] ██▌░░░░░░           │
    │                                                 │
    │ ┌──────────────────────────────────────────┐   │
    │ │ GAME 1: Kansas City Chiefs vs. Buffalo   │   │
    │ │ Sunday, Sept 25 @ 1:00 PM ET             │   │
    │ │                                          │   │
    │ │  ◉ Kansas City (2-point favorites)       │   │
    │ │  ○ Buffalo                               │   │
    │ │  ○ Pick Later                            │   │
    │ │                                          │   │
    │ │ Your Pick: Kansas City ✓                 │   │
    │ └──────────────────────────────────────────┘   │
    │                                                 │
    │ ┌──────────────────────────────────────────┐   │
    │ │ GAME 2: Dallas Cowboys vs. Philadelphia  │   │
    │ │ Sunday, Sept 25 @ 4:30 PM ET             │   │
    │ │                                          │   │
    │ │  ○ Dallas                                │   │
    │ │  ○ Philadelphia (-6.5 favorites)         │   │
    │ │  ○ Pick Later                            │   │
    │ │                                          │   │
    │ │ Your Pick: Not selected                  │   │
    │ └──────────────────────────────────────────┘   │
    │                                                 │
    │ ┌──────────────────────────────────────────┐   │
    │ │ GAME 3: Green Bay Packers vs. Minnesota  │   │
    │ │ Monday, Sept 26 @ 8:15 PM ET             │   │
    │ │                                          │   │
    │ │  ○ Green Bay                             │   │
    │ │  ◉ Minnesota (-3 favorites)              │   │
    │ │  ○ Pick Later                            │   │
    │ │                                          │   │
    │ │ Your Pick: Minnesota ✓                   │   │
    │ └──────────────────────────────────────────┘   │
    │                                                 │
    │        [Submit Picks] [Save as Draft]          │
    └────┬────────────────────────────────────────────┘
         │
    ┌────▼────────────────────────────────────────────┐
    │ Picks Submitted! ✓                             │
    │ Your Picks: 8/8                                │
    │                                                 │
    │ Your Team (Standings):                         │
    │ 🥇 1st: John (32 pts, 6-2)                     │
    │ 🥈 2nd: You (30 pts, 5-3) ← Current            │
    │ 🥉 3rd: Sarah (28 pts, 4-4)                    │
    │                                                 │
    │ [View Full Leaderboard] [Back to Dashboard]    │
    └─────────────────────────────────────────────────┘
```

**User Stories:**
- **US-010:** As a user, I can view all games for the current week with game details
- **US-011:** As a user, I can select winners, with favorites indicated and multiple pick options
- **US-012:** As a user, I receive countdown timer warnings as deadline approaches
- **US-013:** As a user, I can save draft picks and return to finalize later
- **US-014:** As a user, once picks are locked, I cannot change them (1 hour before game)

---

### 2.5 Viewing Leaderboard Flow

```
┌─────────────────────────────────────────────────────────────┐
│              LEADERBOARD FLOW                                │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │ Dashboard           │
    │ [View Leaderboard]  │
    └────┬────────────────┘
         │
    ┌────▼────────────────────────────────────────────┐
    │ LEADERBOARD - NFL 2026 Season                   │
    │                                                 │
    │ The Dream Team (12 members)                     │
    │ Week 5 | Total Season | Head-to-Head           │
    │                                                 │
    │ Rank │ Member      │ W-L   │ Points │ Streak   │
    │──────┼─────────────┼───────┼────────┼──────────│
    │  1   │ 🏆 John D.  │ 6-2   │  30 pt │  ↑ +2   │
    │  2   │  You        │ 5-3   │  28 pt │  →  0   │
    │  3   │ 👑 Sarah M. │ 5-3   │  27 pt │  ↓ -1   │
    │  4   │ 📈 Mike R.  │ 4-4   │  25 pt │  → +1   │
    │  5   │ 🔥 Alex T.  │ 3-5   │  22 pt │  ↓ -2   │
    │  6   │  Emily K.   │ 3-5   │  21 pt │  →  0   │
    │  7   │  Chris P.   │ 2-6   │  18 pt │  ↓ -1   │
    │  8   │  Jessica L. │ 1-7   │  15 pt │  ↓ -2   │
    │                                                 │
    │ [Scroll for more] | [Week Standings]           │
    │                                                 │
    │ Last Updated: 2 hours ago                       │
    │ Next Update: When all games finish              │
    └────┬────────────────────────────────────────────┘
         │
    ┌────▼────────────────────────────────────────────┐
    │ Tap on member → Member Detail View              │
    │                                                 │
    │ Sarah M. (3rd place) 🏅                         │
    │                                                 │
    │ Season: 5-3 (W-L), 27 points                    │
    │ Week 5: 1-0 (W), 1 point                        │
    │ Streak: -1 (lost last week)                     │
    │                                                 │
    │ Recent Picks:                                   │
    │ ✅ Week 5: Kansas City (+2) vs Buffalo          │
    │ ✅ Week 4: Dallas (-6.5) vs Philadelphia        │
    │ ❌ Week 3: Minnesota (-3) vs Green Bay          │
    │                                                 │
    │ [Challenge to H2H] [Back to Leaderboard]        │
    └─────────────────────────────────────────────────┘
```

**User Stories:**
- **US-015:** As a user, I can view team leaderboard sorted by wins, points, or streak
- **US-016:** As a user, I can tap any member to see their detailed stats and pick history
- **US-017:** As a user, I can see my rank and standing compared to teammates
- **US-018:** As a user, leaderboard updates in real-time as games finish

---

### 2.6 Managing Account Flow

```
┌─────────────────────────────────────────────────────────────┐
│            ACCOUNT MANAGEMENT FLOW                           │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ Dashboard            │
    │ [Menu / Profile Icon]│
    └────┬─────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ MENU                                           │
    │ ┌────────────────────────────────────────┐    │
    │ │ 👤 My Profile                          │    │
    │ │ 🏠 My Teams                            │    │
    │ │ ⚙️  Settings                           │    │
    │ │ 🎓 How to Play / Help                  │    │
    │ │ 📧 Notifications                       │    │
    │ │ 🔓 Log Out                             │    │
    │ └────────────────────────────────────────┘    │
    └──────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │ MY PROFILE                                     │
    │                                                │
    │ 🖼️  [Profile Photo] ✏️  Edit                   │
    │                                                │
    │ Display Name: Trevor May                      │
    │ Email: trevor@example.com ✓                   │
    │ Bio: @falcons fan | Weeknight gamer           │
    │ Favorite Team: Atlanta Falcons                │
    │ Joined: June 2026                             │
    │                                                │
    │ Season Stats:                                  │
    │ Teams: 3                                       │
    │ Overall Record: 24-15 (W-L)                   │
    │ Best Streak: +6 wins                          │
    │                                                │
    │ [Edit Profile] [Change Password] [Deactivate] │
    └──────────────────────────────────────────────┘

    ┌────▼──────────────────────────────────────────┐
    │ MY TEAMS                                       │
    │                                                │
    │ The Dream Team                                │
    │ NFL 2026 | 6/12 members                       │
    │ Your Role: Creator & Manager                  │
    │ [View] [Manage] [Leave]                       │
    │                                                │
    │ Office Pool 2026                              │
    │ NFL 2026 | 8/8 members (Full)                 │
    │ Your Role: Participant                        │
    │ [View] [Leave]                                │
    │                                                │
    │ College Football Crew                         │
    │ NCAA 2026 | 5/10 members                      │
    │ Your Role: Participant                        │
    │ [View] [Leave]                                │
    └──────────────────────────────────────────────┘

    ┌────▼──────────────────────────────────────────┐
    │ NOTIFICATIONS SETTINGS                        │
    │                                                │
    │ ☑️  Email reminders when picks due             │
    │ ☑️  Notify on leaderboard changes              │
    │ ☐  Notify on new team invitations             │
    │ ☑️  Notify when games finish                   │
    │ ☐  Marketing emails                           │
    │                                                │
    │ Notification Frequency:                       │
    │ ◉ Every day | ○ Weekly | ○ Never             │
    │                                                │
    │ [Save Settings]                               │
    └──────────────────────────────────────────────┘
```

**User Stories:**
- **US-019:** As a user, I can view and edit my profile information
- **US-020:** As a user, I can see all teams I'm in and my role (creator/member)
- **US-021:** As a user, I can customize notification preferences
- **US-022:** As a user, I can view my season-long statistics across all teams

---

## 3. UI MOCKUPS

### 3.1 Home/Dashboard Screen

```
╔═══════════════════════════════════════════════════════════════╗
║ PICKEM-PALS DASHBOARD                         ☰  👤           ║
╚═══════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ Welcome Back, Trevor! 👋                                    │
│                                                              │
│ This Week's Status:                                         │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 🎯 Picks Due: Sunday, Sept 25 @ 1:00 PM ET   ⏰ 3 days │ │
│ │                                                        │ │
│ │ Your Teams:  6/8 picks made                           │ │
│ │ 🔴 THE DREAM TEAM (2/8) [Make Picks] ➜               │ │
│ │ 🟢 OFFICE POOL 2026 (4/4) ✓ All Set                  │ │
│ │                                                        │ │
│ │ [Make All Picks] [Manage Teams]                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ This Week's Leaderboard (The Dream Team)                    │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 1. 🏆 John D.      6-2    30 pts   ↑ +2               │ │
│ │ 2. ⭐ You          5-3    28 pts   →  0               │ │
│ │ 3. 👑 Sarah M.     5-3    27 pts   ↓ -1               │ │
│ │                                                        │ │
│ │ [View Full Leaderboard]                                │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ Recent Activity                                             │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ • John D. made their Week 5 picks - 5 hours ago        │ │
│ │ • Leaderboard updated - Game results posted            │ │
│ │ • Mike R. joined Office Pool 2026 - yesterday          │ │
│ │                                                        │ │
│ │ [View All Activity]                                    │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Quick Actions:                                              │
│ [➕ Create Team] [📧 Invite Friends] [👁️ View All Picks]  │
│ [⚙️ Settings]    [🎓 How to Play]                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Create Team Modal

```
╔═════════════════════════════════════════════════════════════╗
║                     CREATE NEW TEAM                    ✕    ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│ Team Name                                                   │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ The Dream Team                                        │  │
│ │ Examples: "Office Pool", "Friend Group", "Crew"       │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ Select League                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ NFL 2026 Season                                       │  │
│ │ ▼                                                     │  │
│ │ • NFL 2026 Season                                    │  │
│ │ • NCAA Football 2026                                │  │
│ │ • NBA 2026-27                                       │  │
│ │ • MLB 2026                                          │  │
│ │ • Other Sports...                                   │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ Team Size                                                  │
│ ◯ Small (2-5 people)   - Friends group                    │
│ ◉ Standard (6-15)      - Most popular                     │
│ ◯ Large (16+ people)   - Work/org leagues                │
│                                                              │
│ Team Visibility                                             │
│ ◉ Private - Only invited members can join                 │
│ ◯ Public - Anyone can join with team code                 │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Private teams are recommended for friends. Managed    │  │
│ │ invitations keep your league organized.              │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│        [Cancel]                    [Create Team ➜]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 Weekly Picks Screen (Detailed View)

```
╔═════════════════════════════════════════════════════════════╗
║ WEEK 5 PICKS          NFL 2026 Season              ☰        ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ ⏰ Deadline: Sunday, Sept 25 @ 1:00 PM ET                   │
│ ⏱️  3 days 14 hours remaining                               │
│                                                              │
│ Progress: [████░░░░░] 4/8 picks made                         │
│ [Auto-Pick Missing Games] [Save Draft]                      │
│                                                              │
│ ═══════════════════════════════════════════════════════════ │
│ SUNDAY 9/25                                                 │
│ ═══════════════════════════════════════════════════════════ │
│                                                              │
│ 🏈 GAME 1                           1:00 PM ET               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Kansas City Chiefs vs. Buffalo Bills                    ││
│ │ Spread: Chiefs -2 | O/U: 45½                            ││
│ │                                                          ││
│ │ ◉ Kansas City Chiefs                  YOUR PICK ✓       ││
│ │  ○ Buffalo Bills                                        ││
│ │  ○ Skip This Game                                       ││
│ │                                                          ││
│ │ [Change Pick]                                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ 🏈 GAME 2                           4:30 PM ET               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Dallas Cowboys vs. Philadelphia Eagles                  ││
│ │ Spread: Eagles -6.5 | O/U: 42                           ││
│ │                                                          ││
│ │  ○ Dallas Cowboys                                       ││
│ │ ◉ Philadelphia Eagles                 YOUR PICK ✓       ││
│ │  ○ Skip This Game                                       ││
│ │                                                          ││
│ │ [Change Pick]                                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ═══════════════════════════════════════════════════════════ │
│ MONDAY 9/26                                                 │
│ ═══════════════════════════════════════════════════════════ │
│                                                              │
│ 🏈 GAME 3                           8:15 PM ET               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Green Bay Packers vs. Minnesota Vikings                 ││
│ │ Spread: Vikings -3 | O/U: 44                            ││
│ │                                                          ││
│ │  ○ Green Bay Packers                                    ││
│ │  ○ Minnesota Vikings                                    ││
│ │ ◉ Skip This Game                      NOT PICKED        ││
│ │                                                          ││
│ │ [Make a Pick]                                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ [Scroll for more games...]                                 │
│                                                              │
│                                                              │
│        [Cancel]              [Submit All Picks ➜]          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.4 Leaderboard Screen

```
╔═════════════════════════════════════════════════════════════╗
║ LEADERBOARD        THE DREAM TEAM          ⓘ               ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ NFL 2026 Season | Week 5 | 12 Members                       │
│ [Weekly] [Season Totals] [Head-to-Head]                     │
│                                                              │
│ ═══════════════════════════════════════════════════════════ │
│ RANK │ MEMBER              │ W-L   │ PTS  │ STREAK         │
│ ═════╪═════════════════════╪═══════╪══════╪════════════════╡
│  1   │ 🏆 John D.          │ 6-2   │ 30   │ ↑ +2           │
│  2   │ ⭐ You (Trevor M.)  │ 5-3   │ 28   │ → 0            │
│  3   │ 👑 Sarah M.         │ 5-3   │ 27   │ ↓ -1           │
│  4   │ 📈 Mike R.          │ 4-4   │ 25   │ ↑ +1           │
│  5   │ 🔥 Alex T.          │ 3-5   │ 22   │ ↓ -2           │
│  6   │ Emily K.            │ 3-5   │ 21   │ → 0            │
│  7   │ Chris P.            │ 2-6   │ 18   │ ↓ -1           │
│  8   │ Jessica L.          │ 1-7   │ 15   │ ↓ -2           │
│  9   │ [Scroll for more...]                                │
│                                                              │
│ 📊 Team Stats:                                              │
│    Overall: 36-28 (W-L) │ Average per player: 4.5-3.5     │
│    Avg Points: 24.2     │ Games Remaining: 12              │
│                                                              │
│ [Refresh] [Export Standings]                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Tap on member to view details:                              │
│                                                              │
│ Sarah M. - 3rd Place 🏅                                     │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Season: 5-3 (W-L) | 27 pts | Last Week: +1            │ │
│ │                                                        │ │
│ │ Recent Games:                                          │ │
│ │ ✅ Week 5: Chiefs (-2)        [vs Bills]               │ │
│ │ ✅ Week 4: Eagles (-6.5)      [vs Cowboys]             │ │
│ │ ❌ Week 3: Vikings (-3)       [vs Packers]             │ │
│ │ ✅ Week 2: Ravens (-4)        [vs Steelers]            │ │
│ │                                                        │ │
│ │ [Challenge to H2H] [View Full History]                │ │
│ │                                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.5 Invite Friends Screen

```
╔═════════════════════════════════════════════════════════════╗
║ INVITE FRIENDS       THE DREAM TEAM              ✕         ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│ 👥 INVITE FRIENDS TO YOUR TEAM                              │
│                                                              │
│ Team: The Dream Team                                        │
│ Spots Available: 6/12 filled                                │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│ HOW TO INVITE:                                              │
│                                                              │
│ 📧 METHOD 1: EMAIL                                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enter email addresses (comma-separated):                ││
│ │ ┌───────────────────────────────────────────────────┐  ││
│ │ │ john@example.com, jane@example.com,              │  ││
│ │ │ mike@example.com                                  │  ││
│ │ └───────────────────────────────────────────────────┘  ││
│ │                                                         ││
│ │ Add a Personal Message (optional):                      ││
│ │ ┌───────────────────────────────────────────────────┐  ││
│ │ │ "Hey! Join us for the 2026 season. Should be      │  ││
│ │ │ epic! TEAM-A7K9X"                                 │  ││
│ │ └───────────────────────────────────────────────────┘  ││
│ │                                                         ││
│ │ [Send Emails]                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ 🔗 METHOD 2: COPY SHARE LINK                                │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ https://pickem.app/join/TEAM-A7K9X                     ││
│ │ [📋 Copy Link] [Share to Messages] [Share to Social]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ 📱 METHOD 3: TEAM CODE                                      │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Team Code: TEAM-A7K9X                                  ││
│ │ [📋 Copy Code]                                          ││
│ │                                                         ││
│ │ Share this code with friends - they can enter it on    ││
│ │ the app to join!                                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│ PENDING INVITATIONS:                                        │
│                                                              │
│ Sent 3 days ago:                                            │
│ ⏳ john@example.com  [Resend] [Revoke]                     │
│ ⏳ jane@example.com  [Resend] [Revoke]                     │
│ ✅ mike@example.com  (Joined 2 days ago)                   │
│                                                              │
│         [Done]                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.6 User Profile Screen

```
╔═════════════════════════════════════════════════════════════╗
║ MY PROFILE                                ✕  ✏️              ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│              🖼️  [PROFILE PICTURE]                          │
│              Trevor May                                      │
│              @trevor.may                                     │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Email: trevor.may@example.com ✓                        ││
│ │ Bio: @falcons fan | Weeknight gamer                    ││
│ │ Favorite Team: Atlanta Falcons 🏈                      ││
│ │ Member Since: June 2026                                ││
│ │                                                         ││
│ │ [Edit Profile]                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ═══════════════════════════════════════════════════════════ │
│ SEASON STATISTICS                                           │
│ ═══════════════════════════════════════════════════════════ │
│                                                              │
│ Overall Record:  24-15  (W-L) │  Success Rate: 61.5%       │
│ Total Points:    118 pts                                    │
│ Teams Joined:    3                                          │
│ Best Streak:     +6 wins                                    │
│ Worst Streak:    -4 losses                                  │
│                                                              │
│ Team Breakdown:                                             │
│ 🥇 The Dream Team (6-2)        1st place / 12 members      │
│ 🥈 Office Pool (5-3)           2nd place / 8 members       │
│ 🥉 College Football Crew (13-10) 3rd place / 5 members     │
│                                                              │
│ ═══════════════════════════════════════════════════════════ │
│ ACCOUNT SETTINGS                                            │
│                                                              │
│ [⚙️ Preferences]     [🔐 Change Password]                   │
│ [🔔 Notifications]   [📋 Privacy Settings]                 │
│ [📧 Email Updates]   [🗑️ Deactivate Account]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. FEATURE SPECIFICATIONS

### 4.1 User Authentication & Profiles

**Feature:** User Registration, Login, & Social Auth

**User Stories:**
- **US-001:** As a new user, I can register with email/password in one screen
- **US-002:** As a user, I can log in with Google/Apple/GitHub social auth
- **US-003:** As a logged-in user, I can view and edit my profile
- **US-004:** As a user, I can reset my password via email
- **US-005:** As a user, I can delete/deactivate my account

**Acceptance Criteria:**
- Email verification required for new email registrations
- Password minimum: 8 characters, 1 uppercase, 1 number
- Social auth OAuth2 flow completes <3 seconds
- Password reset link expires after 24 hours
- Deactivation shows 30-day grace period before data deletion

---

### 4.2 Team Management

**Feature:** Create, Join, Manage Teams

**User Stories:**
- **US-006:** As a user, I can create a new team with name, league, size
- **US-007:** As a team creator, I receive a unique team code for sharing
- **US-008:** As a team creator, I can invite members via email/link/code
- **US-009:** As a user, I can join a team via code or email invite link
- **US-010:** As a team creator, I can remove members or reset the team code
- **US-011:** As a user, I can leave a team (unless I'm the only creator)

**Acceptance Criteria:**
- Team codes are 8-character alphanumeric (e.g., TEAM-A7K9)
- Team names must be 3-50 characters, no special chars except spaces
- Max team size enforced at signup (small=5, standard=15, large=50)
- Invitations expire after 30 days if not accepted
- Creators can manage membership up until season start

---

### 4.3 Game Picking System

**Feature:** Weekly Game Selection & Deadline Management

**User Stories:**
- **US-012:** As a user, I can view all games for the current week with details
- **US-013:** As a user, I can select a winner for each game
- **US-014:** As a user, I can save draft picks and return to finalize
- **US-015:** As a user, I cannot change picks after the game lock time (1 hour before kickoff)
- **US-016:** As a user, I receive notifications when picks are due

**Acceptance Criteria:**
- Games display spread, over/under, kickoff time, and channel
- Selected picks persist to draft even if I close the app
- Lock time enforced server-side (cannot override client-side validation)
- Picks display confirmation once submitted
- Users cannot make picks for games already in progress or completed
- Timestamps in user's local timezone

---

### 4.4 Leaderboard & Scoring

**Feature:** Real-Time Leaderboard & Point Tracking

**Scoring System:**
- **Correct Pick:** 1 point
- **Incorrect Pick:** 0 points
- **Streak Bonus (Optional Phase 2):** +0.5 pts per consecutive win
- **Accuracy Tiers:** Track % accuracy separately

**User Stories:**
- **US-017:** As a user, I can view team leaderboard sorted by wins, points, or streak
- **US-018:** As a user, I can see my rank and position changes week-to-week
- **US-019:** As a user, I can view individual member stats and pick history
- **US-020:** As a user, leaderboard updates automatically as games complete

**Acceptance Criteria:**
- Leaderboard refreshes within 5 minutes of game completion
- Sorting by W-L, Points, or Current Streak
- Display member avatar, rank, record, points, and streak indicator
- Member detail view shows recent 4-week pick history
- "Streak" resets on any loss (win streaks only)

---

### 4.5 Social Features

**Feature:** Invitations, Team Chat (Phase 2), Notifications

**User Stories (MVP):**
- **US-021:** As a user, I can send team invites via email/link/code
- **US-022:** As a user, I can see who has accepted/pending invitations
- **US-023:** As a user, I receive notification when teammates make picks
- **US-024:** As a user, I receive reminder emails when picks are due

**Phase 2 Features (Post-MVP):**
- In-app team chat
- Emoji reactions and celebrations
- Direct message "challenge" system
- Social leaderboard sharing

**Acceptance Criteria (MVP):**
- Emails include join link and team details
- Notifications sent 24 hours and 1 hour before deadline
- Users can opt-out of specific notification types
- Invites show acceptance status in real-time

---

### 4.6 Admin Panel (Internal/Commissioner Features)

**Feature:** Manage Games, Scores, and Team Settings (Creator/Admin only)

**User Stories:**
- **US-025:** As a team creator, I can view admin dashboard
- **US-026:** As a team creator, I can manually adjust scores if needed
- **US-027:** As a team creator, I can view detailed team analytics

**Acceptance Criteria:**
- Admin dashboard accessible via settings (for creators only)
- Score adjustments require confirmation and log
- Analytics include participation rate, average picks per week

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 Frontend Stack

**Framework:** React 18+ (TypeScript)  
**Styling:** Tailwind CSS + PostCSS  
**State Management:** Redux Toolkit  
**HTTP Client:** Axios with interceptors for auth  
**Real-Time Updates:** Socket.io for leaderboard/game updates  
**Mobile:** React Native (Phase 2) or responsive web  
**Bundler:** Vite (dev) / Webpack (production)  

**Key Libraries:**
- react-router-dom: Routing
- react-hook-form: Form handling
- @testing-library/react: Component testing
- cypress: E2E testing
- sentry: Error tracking

---

### 5.2 Backend Stack

**Runtime:** Node.js 18+ (TypeScript)  
**Framework:** Express.js / Fastify  
**Database:** PostgreSQL (primary), Redis (caching/sessions)  
**ORM:** Prisma  
**API:** RESTful with OpenAPI/Swagger documentation  
**Auth:** JWT tokens + refresh token rotation  
**Email:** SendGrid or AWS SES  
**Hosting:** AWS (EC2/RDS) or DigitalOcean  

---

### 5.3 Database Schema Overview

**Key Tables:**

```
users
  id (PK)
  email (unique)
  password_hash
  display_name
  profile_pic_url
  bio
  favorite_team
  created_at
  updated_at

teams
  id (PK)
  name
  code (unique, 8-char)
  creator_id (FK users)
  league_id (FK leagues)
  max_members
  is_public
  season_id (FK seasons)
  created_at

team_members
  id (PK)
  team_id (FK teams)
  user_id (FK users)
  role (creator, member)
  joined_at
  status (active, invited, left)

games
  id (PK)
  league_id (FK leagues)
  week_number
  home_team
  away_team
  spread
  over_under
  kickoff_time
  channel
  status (scheduled, in_progress, completed)
  winner_id (team, null if tie/pending)
  created_at

picks
  id (PK)
  game_id (FK games)
  user_id (FK users)
  team_id (FK teams)
  selected_winner_id (team)
  is_correct (boolean, null if pending)
  created_at
  locked_at

leaderboard_snapshots
  id (PK)
  team_id (FK teams)
  week_number
  user_id (FK users)
  wins
  losses
  points
  streak
  rank
  created_at

invitations
  id (PK)
  team_id (FK teams)
  inviter_id (FK users)
  invitee_email
  status (pending, accepted, declined, expired)
  created_at
  expires_at

seasons
  id (PK)
  league_id (FK leagues)
  year
  start_date
  end_date
  total_weeks
  created_at
```

---

### 5.4 API Endpoints Summary

**Authentication:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/password-reset
POST   /api/auth/verify-email

POST   /api/auth/google
POST   /api/auth/apple
POST   /api/auth/github
```

**Users:**
```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/stats
```

**Teams:**
```
POST   /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id
GET    /api/teams/:id/members
POST   /api/teams/:id/members (add/invite)
DELETE /api/teams/:id/members/:userId
POST   /api/teams/:id/invite
GET    /api/teams/:id/leaderboard
POST   /api/teams/join/:code
```

**Games & Picks:**
```
GET    /api/leagues/:id/games?week=5
GET    /api/games/:id
POST   /api/picks
PUT    /api/picks/:id
GET    /api/picks?team_id=X&week=5
POST   /api/picks/submit
```

**Leaderboard:**
```
GET    /api/teams/:id/leaderboard
GET    /api/teams/:id/leaderboard/:userId
GET    /api/teams/:id/leaderboard/h2h/:userId/:opponentId
```

**Admin:**
```
PUT    /api/admin/games/:id/score
PUT    /api/admin/picks/:id/adjust
GET    /api/admin/teams/:id/analytics
```

---

### 5.5 Authentication Method

**JWT Token Flow:**

1. User logs in → Server validates credentials
2. Server generates:
   - **Access Token** (JWT, 15 min expiry, in Authorization header)
   - **Refresh Token** (HTTP-only cookie, 7 day expiry)
3. Client uses access token for API requests
4. On token expiry, client calls `/api/auth/refresh` to get new access token
5. On refresh token expiry, user must re-authenticate

**Social Auth (OAuth2):**
- Google: Redirect → Grant → Get ID token → Server validates → JWT issued
- Apple: Similar flow with additional validation for email privacy
- GitHub: OAuth code → token exchange → Server validates → JWT issued

---

### 5.6 Deployment Strategy

**Development Environment:**
- Local Docker containers (postgres, redis, mailhog)
- `npm run dev` starts frontend + backend with hot reload

**Staging Environment:**
- AWS EC2 instance (t3.medium)
- RDS PostgreSQL
- ElastiCache Redis
- CI/CD via GitHub Actions (lint → test → build → deploy)

**Production Environment:**
- AWS Elastic Beanstalk (auto-scaling)
- RDS PostgreSQL (Multi-AZ)
- CloudFront CDN for static assets
- SNS/SQS for email queue
- CloudWatch for monitoring
- Blue/Green deployments for zero-downtime updates

**Database Migrations:**
- Prisma migrations with version control
- Auto-run migrations on deploy via build script

---

## 6. PHASED DELIVERY TIMELINE

### Phase 1: MVP Core (Weeks 1-2)
**Goal:** Basic pick submission and leaderboard functionality

**Week 1 - Foundation:**
- [x] Project setup (monorepo, Docker, CI/CD)
- [x] User authentication (email/password + JWT)
- [x] User profile creation & management
- [x] Database schema & migrations
- [x] Basic API scaffolding

**Week 2 - Core Features:**
- [x] Team creation with unique codes
- [x] Game management & weekly picks UI
- [x] Pick submission & locking logic
- [x] Leaderboard scoring & display
- [x] Basic email notifications

**Deliverables:**
- Fully functional MVP web app
- Functional API with auth & core endpoints
- Database in place with test data
- Basic notification system
- CI/CD pipeline configured

**Definition of Done:**
- All core user flows tested (manual + automated)
- API responses documented (Swagger)
- Database backups tested
- Error handling & edge cases covered
- Mobile responsive (basic)

---

### Phase 2: Social & Teams (Weeks 3-4)
**Goal:** Enhanced team management and social engagement

**Week 3 - Team Invitations & Management:**
- [x] Email invite system with templates
- [x] Team code sharing & join flows
- [x] Invite acceptance/decline logic
- [x] Team member management (remove, promote)
- [x] Admin panel basics

**Week 4 - Social & Notifications:**
- [x] Enhanced notifications (email templates, timing)
- [x] Real-time leaderboard updates (WebSocket)
- [x] Member detail views & stats
- [x] Email digest/summary (Phase 2B)
- [x] Analytics dashboard (Phase 2B)

**Deliverables:**
- Fully social team experience
- Professional email notification system
- Real-time leaderboard
- Admin capabilities for team creators
- Analytics for team creators

---

### Phase 3: Polish & Launch (Weeks 5-6)
**Goal:** Production-readiness and public launch

**Week 5 - Testing & Bug Fixes:**
- [x] End-to-end test suite
- [x] Load testing (1K concurrent users)
- [x] Security audit & pen testing
- [x] Mobile responsiveness polish
- [x] UX review & feedback integration

**Week 6 - Launch & Monitoring:**
- [x] Deploy to production
- [x] Monitor error rates & performance
- [x] Marketing materials & social launch
- [x] Early beta user onboarding
- [x] Documentation & FAQ

**Deliverables:**
- Production-ready system
- Public beta launch
- Monitoring & alerting in place
- User documentation
- Marketing assets

---

### Phase 4: Advanced Features (Weeks 7+)
**Goal:** Scale and engage

**Week 7+ Features (Post-MVP):**
- [ ] In-app team chat & messaging
- [ ] Emoji reactions & celebrations
- [ ] Mobile app (React Native)
- [ ] Head-to-head challenges
- [ ] Streak bonuses & achievements
- [ ] Integration with sports APIs (ESPN, TheScore)
- [ ] Multi-league support enhancements
- [ ] Payment system (premium features)
- [ ] Coaching/expert picks
- [ ] Replay & stats archive

---

## 7. SUCCESS METRICS

### 7.1 User Acquisition

| Metric | Target | Timeline |
|--------|--------|----------|
| Signups | 1,000 | End of Month 1 |
| Active Users (W1) | 600 (60%) | Week 1 |
| Email Verified | 90% | Week 1 |
| Team Formation | 500+ teams | End of Month 1 |

---

### 7.2 Engagement Metrics

| Metric | Target | Success Threshold |
|--------|--------|-------------------|
| Weekly Active Users (WAU) | 60%+ | Healthy baseline |
| Daily Active Users (DAU) | 30%+ | Strong engagement |
| Picks per User per Week | 7.5/8 (94%) | High participation |
| Return after Pick Deadline | 50%+ | Leaderboard check-in |
| Session Duration | 3-5 min avg | App stickiness |
| Session Frequency | 3+ per week | Regular habit |

---

### 7.3 Retention

| Metric | Target | Notes |
|--------|--------|-------|
| Day 1 Retention | 75%+ | Return next day |
| Day 7 Retention | 50%+ | MVP baseline |
| Day 30 Retention | 35%+ | Month 1 goal |
| Season Retention | 60%+ | Stay for full season |

---

### 7.4 Technical Performance

| Metric | Target | Acceptance |
|--------|--------|-----------|
| Page Load Time | <2s | P95 latency |
| API Response Time | <500ms | P95 latency |
| Uptime | 99.5% | Monthly SLA |
| Error Rate | <0.5% | % of requests |
| Mobile Load Time | <3s | First Contentful Paint |

---

### 7.5 Business Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Cost per User Acquisition | <$5 | Organic focus |
| Server Costs | <$1K/month | MVP phase |
| NPS Score | 40+ | Month 2 survey |
| Team Invites per User | 5+ | Network effect |

---

## 8. ACCEPTANCE CRITERIA

### 8.1 Definition of "Done" for MVP

✅ **User Stories Completed:**
- All 26 user stories (US-001 through US-027) implemented and tested

✅ **Core Features Working:**
- User registration & authentication
- Team creation & member invitations
- Weekly game picking & locking
- Leaderboard with real-time scoring
- Email notifications

✅ **API Complete:**
- All endpoints in Section 5.4 implemented
- OpenAPI/Swagger documentation generated
- Request validation (input sanitization)
- Error handling with proper HTTP status codes

✅ **Database:**
- Schema matches Section 5.3
- Migrations tested (forward & rollback)
- Indexes on key queries
- Backup & recovery tested

✅ **Frontend:**
- All UI mockups (Section 3) implemented
- Mobile responsive (320px to 2560px)
- Accessibility (WCAG 2.1 AA)
- Form validation & error messages

✅ **Testing:**
- Unit tests: >80% code coverage
- Integration tests: All major user flows
- E2E tests: Critical paths (signup → picks → leaderboard)
- Manual QA: All acceptance criteria verified

✅ **Deployment:**
- CI/CD pipeline configured (GitHub Actions)
- Staging environment available
- Database migrations automated
- Monitoring & alerting setup
- Rollback procedure documented

✅ **Documentation:**
- API documentation (Swagger)
- Setup guide for developers
- User onboarding guide
- Known issues & workarounds listed

---

### 8.2 Testing Requirements

**Unit Tests:**
- Authentication logic (token generation, validation)
- Scoring calculations (correct/incorrect picks)
- Team code generation (uniqueness)
- Permission checks (users can't modify others' picks)

**Integration Tests:**
- Full signup flow (email → verification → profile)
- Team creation + invite flow
- Pick submission + lock enforcement
- Leaderboard calculation & updates

**E2E Tests (Cypress):**
1. New user signup → create team → invite friends → make picks → view leaderboard
2. Invited user accepts invite → joins team → makes picks
3. Picks lock 1 hour before game → user cannot change
4. Game completes → leaderboard updates automatically
5. Mobile responsiveness for all above flows

**Performance Tests:**
- Load test: 1,000 concurrent users picking in same week
- Database query response times <100ms
- Real-time leaderboard updates <5 second latency

---

### 8.3 Performance Benchmarks

| Metric | Benchmark | Acceptance |
|--------|-----------|-----------|
| **Frontend** | | |
| JavaScript Bundle | <300KB | gzipped |
| Largest Contentful Paint | <2.5s | P75 on 4G |
| First Input Delay | <100ms | P95 |
| **Backend** | | |
| 95th Percentile Response Time | <500ms | all endpoints |
| Database Query Time | <100ms | typical query |
| Leaderboard Update Latency | <5s | game completion → display |
| **Infrastructure** | | |
| Monthly Uptime | 99.5% | SLA |
| Error Rate | <0.5% | HTTP 500+ errors |
| Cost per User | <$0.10/month | server costs |

---

### 8.4 Security Requirements

✅ **Authentication & Authorization:**
- Passwords hashed with bcrypt (min 10 rounds)
- JWT tokens issued with short expiry (15 min access, 7 day refresh)
- CSRF protection on state-changing requests
- Rate limiting: 5 login attempts per email per 15 min
- Users cannot access other users' picks/profiles without permission

✅ **Data Protection:**
- HTTPS only (TLS 1.3)
- Sensitive data encrypted at rest (password, tokens)
- Database backups encrypted
- No passwords/tokens in logs
- PII minimization (only collect necessary data)

✅ **API Security:**
- Input validation & sanitization (SQL injection prevention)
- Output encoding (XSS prevention)
- CORS properly configured (whitelist domains)
- API rate limiting (100 requests per min per user)
- Webhook signature verification (if used)

✅ **Infrastructure:**
- WAF rules (ModSecurity)
- Secrets in environment variables (not in repo)
- SSH key-only access to servers
- Regular security patches & updates
- Intrusion detection & monitoring

✅ **Compliance:**
- GDPR compliance (data export, deletion, consent)
- Privacy policy & terms of service
- Data retention policies (auto-delete after X days if inactive)
- Audit logs for admin actions

---

### 8.5 Acceptance Criteria Checklist

**Go/No-Go for Launch:**

- [ ] Zero critical bugs (security, data loss, crashes)
- [ ] >80% unit test coverage
- [ ] All critical user flows E2E tested
- [ ] Performance benchmarks met (99.5% uptime, <2s page load)
- [ ] Security audit completed & issues resolved
- [ ] Database backup/restore tested
- [ ] Monitoring & alerting live
- [ ] Documentation complete
- [ ] Team trained on deployment & incident response
- [ ] Legal review complete (privacy, ToS)
- [ ] Marketing launch ready (social, email, blog)
- [ ] Beta user cohort confirmed (100+ testers)

**Sign-Off:**
- [ ] Product Owner sign-off
- [ ] Tech Lead sign-off
- [ ] QA Lead sign-off
- [ ] Operations sign-off

---

## APPENDIX: GLOSSARY

| Term | Definition |
|------|-----------|
| **MVP** | Minimum Viable Product - core features only |
| **WAU** | Weekly Active Users |
| **DAU** | Daily Active Users |
| **W-L** | Wins-Losses record |
| **Pick** | User's prediction for a game outcome |
| **Leaderboard** | Ranked list of team members by score |
| **Spread** | Point differential (favorite vs underdog) |
| **Lock Time** | Deadline by which picks must be finalized |
| **Season** | Complete competition period (e.g., NFL 2026) |
| **League** | Sport/competition type (NFL, NCAA, etc.) |
| **Team Code** | Unique identifier to join a team |
| **JWT** | JSON Web Token for authentication |
| **Uptime** | Percentage of time service is available |
| **SLA** | Service Level Agreement |

---

**Document Status:** READY FOR DEVELOPMENT  
**Next Step:** Present to development team, finalize timeline, begin Phase 1

---

_End of Product Requirements Document_
