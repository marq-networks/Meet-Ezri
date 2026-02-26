
// @ts-nocheck
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:3001/api';
const JWT_SECRET = 'BNf04hL8JjnrbSHH7nHn1cYBVA2Dh6ahgaljbJKXSd7+5qTEu7EL/7AvexZ0iz+5Ql/CgLRH7nql2Y1rcIYuhA==';

// Helper to generate a valid JWT
function generateToken(userId) {
  const payload = {
    sub: userId,
    email: 'test@example.com',
    role: 'user',
    app_metadata: { role: 'user' },
    user_metadata: { role: 'user' },
    aud: 'authenticated',
  };
  
  // Handle Base64 secret if needed (Supabase style)
  let secret = JWT_SECRET;
  try {
    if (secret.length > 32 && !secret.includes(' ')) {
      const decoded = Buffer.from(secret, 'base64');
      if (decoded.length > 0) {
        secret = decoded;
      }
    }
  } catch (e) {
    // ignore
  }

  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

async function run() {
  // 1. Setup User
  const userId = 'b53646f9-8d29-46e5-8fd6-c580f0740e42'; // Existing profile ID
  const token = generateToken(userId);
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  console.log('Using User ID:', userId);

  try {
    // ==========================================
    // SESSIONS VERIFICATION
    // ==========================================
    console.log('\n--- Verifying Sessions ---');
    
    // Create Session
    const createSessionRes = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: 'instant',
        title: 'Persistence Test Session',
        duration_minutes: 15
      })
    });
    
    if (!createSessionRes.ok) {
      throw new Error(`Failed to create session: ${createSessionRes.status} ${await createSessionRes.text()}`);
    }
    const session = await createSessionRes.json();
    console.log('Session created:', session.id);

    // Toggle Favorite
    const toggleRes = await fetch(`${API_URL}/sessions/${session.id}/favorite`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    
    if (!toggleRes.ok) {
      throw new Error(`Failed to toggle favorite: ${toggleRes.status} ${await toggleRes.text()}`);
    }
    const toggledSession = await toggleRes.json();
    console.log('Toggled favorite. Response is_favorite:', toggledSession.is_favorite);

    // Fetch Sessions to verify persistence
    const listRes = await fetch(`${API_URL}/sessions`, { headers });
    const sessions = await listRes.json();
    const fetchedSession = sessions.find(s => s.id === session.id);
    
    if (!fetchedSession) {
      console.error('Session not found in list!');
    } else {
      console.log('Fetched session is_favorite:', fetchedSession.is_favorite);
      if (fetchedSession.is_favorite === true) {
        console.log('✅ Session favorite persistence CONFIRMED');
      } else {
        console.error('❌ Session favorite persistence FAILED');
      }
    }

    // ==========================================
    // HABITS VERIFICATION
    // ==========================================
    console.log('\n--- Verifying Habits ---');

    // Create Habit
    const createHabitRes = await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Persistence Test Habit',
        frequency: 'daily'
      })
    });

    if (!createHabitRes.ok) {
      throw new Error(`Failed to create habit: ${createHabitRes.status} ${await createHabitRes.text()}`);
    }
    const habit = await createHabitRes.json();
    console.log('Habit created:', habit.id);

    // Log Completion
    const logRes = await fetch(`${API_URL}/habits/${habit.id}/complete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        completed_at: new Date().toISOString()
      })
    });

    if (!logRes.ok) {
      throw new Error(`Failed to log habit: ${logRes.status} ${await logRes.text()}`);
    }
    console.log('Habit completion logged');

    // Fetch Habits to verify persistence
    const listHabitsRes = await fetch(`${API_URL}/habits`, { headers });
    const habits = await listHabitsRes.json();
    const fetchedHabit = habits.find(h => h.id === habit.id);

    if (!fetchedHabit) {
      console.error('Habit not found in list!');
    } else {
      console.log('Fetched habit logs:', JSON.stringify(fetchedHabit.habit_logs));
      if (fetchedHabit.habit_logs && fetchedHabit.habit_logs.length > 0) {
        console.log('✅ Habit log persistence CONFIRMED');
      } else {
        console.error('❌ Habit log persistence FAILED');
      }
    }

    // ==========================================
    // JOURNAL VERIFICATION
    // ==========================================
    console.log('\n--- Verifying Journal ---');
    
    // Create Journal Entry
    const createJournalRes = await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Persistence Test Entry',
        content: 'Testing favorite persistence',
        mood_tags: ['test']
      })
    });
    
    if (!createJournalRes.ok) {
      throw new Error(`Failed to create journal: ${createJournalRes.status} ${await createJournalRes.text()}`);
    }
    const journal = await createJournalRes.json();
    console.log('Journal created:', journal.id);

    // Toggle Favorite
    const toggleJournalRes = await fetch(`${API_URL}/journal/${journal.id}/favorite`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    
    if (!toggleJournalRes.ok) {
      throw new Error(`Failed to toggle journal favorite: ${toggleJournalRes.status} ${await toggleJournalRes.text()}`);
    }
    console.log('Journal favorite toggled');

    // Fetch Journal to verify persistence
    const listJournalRes = await fetch(`${API_URL}/journal`, { headers });
    const journals = await listJournalRes.json();
    const fetchedJournal = journals.find(j => j.id === journal.id);

    if (!fetchedJournal) {
      console.error('Journal not found in list!');
    } else {
      console.log('Fetched journal is_favorite:', fetchedJournal.is_favorite);
      if (fetchedJournal.is_favorite === true) {
        console.log('✅ Journal favorite persistence CONFIRMED');
      } else {
        console.error('❌ Journal favorite persistence FAILED');
      }
    }

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

run();
