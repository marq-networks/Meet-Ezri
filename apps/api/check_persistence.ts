
import prisma from './src/lib/prisma';
import { getSessions } from './src/modules/sessions/sessions.service';
import { getHabits, logHabitCompletion } from './src/modules/habits/habits.service';
import { getJournalEntries } from './src/modules/journal/journal.service';
import { getWellnessTools, toggleWellnessToolFavorite } from './src/modules/wellness/wellness.service';

const userId = 'b53646f9-8d29-46e5-8fd6-c580f0740e42';

async function check() {
  console.log('Checking persistence for user:', userId);

  try {
    // --- Habits ---
    console.log('\n--- Habits Debug ---');
    let habits = await getHabits(userId);
    console.log(`Found ${habits.length} habits.`);
    
    // Check for any logs
    let totalLogs = 0;
    habits.forEach(h => {
        if (h.habit_logs && h.habit_logs.length > 0) {
            console.log(`Habit "${h.name}" has ${h.habit_logs.length} logs.`);
            console.log('Logs:', h.habit_logs);
            totalLogs += h.habit_logs.length;
        }
    });

    if (totalLogs === 0 && habits.length > 0) {
        console.log('No logs found. Attempting to create a log for the first habit...');
        const habitId = habits[0].id;
        await logHabitCompletion(userId, habitId, { completed_at: new Date().toISOString() });
        console.log('Log created. Re-fetching...');
        
        habits = await getHabits(userId);
        const updatedHabit = habits.find(h => h.id === habitId);
        console.log(`Habit "${updatedHabit?.name}" logs:`, updatedHabit?.habit_logs);
    }

    // --- Wellness ---
    console.log('\n--- Wellness Debug ---');
    let tools = await getWellnessTools(userId);
    let favTool = tools.find(t => t.is_favorite);
    
    if (favTool) {
        console.log(`Found favorite tool: ${favTool.title}`);
    } else if (tools.length > 0) {
        console.log('No favorite tool found. Toggling favorite for first tool...');
        const toolId = tools[0].id;
        await toggleWellnessToolFavorite(userId, toolId);
        console.log('Toggled. Re-fetching...');
        
        tools = await getWellnessTools(userId);
        favTool = tools.find(t => t.is_favorite);
        console.log('Found favorite tool:', favTool ? favTool.title : 'Still None (FAILED)');
    }

  } catch (error) {
    console.error('Error checking persistence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
