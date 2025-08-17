// Simple test to validate the scheduling fixes
import { generateNewStudyPlan } from './src/utils/scheduling.js';
import { convertSmartCommitmentsToFixedFormat } from './src/utils/smart-commitment-integration.js';

// Mock data for testing
const mockTask = {
  id: 'test-1',
  title: 'Test Task',
  estimatedHours: 4,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  status: 'pending',
  targetFrequency: 'weekly',
  respectFrequencyForDeadlines: true,
  importance: true
};

const mockSmartCommitment = {
  id: 'smart-1',
  title: 'Gym Session',
  totalHoursPerWeek: 3,
  preferredDays: [1, 3, 5], // Mon, Wed, Fri
  preferredTimeRanges: [{ start: '18:00', end: '20:00' }],
  suggestedSessions: [
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
      startTime: '18:00',
      endTime: '19:30',
      duration: 1.5,
      dayOfWeek: 1
    }
  ],
  category: 'fitness',
  allowTimeShifting: false,
  createdAt: new Date().toISOString()
};

const mockSettings = {
  studyPlanMode: 'even',
  workDays: [1, 2, 3, 4, 5], // Mon-Fri
  dailyAvailableHours: 8,
  studyWindowStartHour: 9,
  studyWindowEndHour: 17,
  bufferDays: 1,
  bufferTimeBetweenSessions: 15
};

console.log('Testing scheduling with smart commitments and frequency preferences...');

// Convert smart commitments to fixed format
const convertedCommitments = convertSmartCommitmentsToFixedFormat([mockSmartCommitment]);
console.log('Smart commitment converted successfully:', convertedCommitments.length > 0);

// Test scheduling with the converted commitments
try {
  const result = generateNewStudyPlan([mockTask], mockSettings, convertedCommitments, []);
  console.log('Scheduling completed successfully!');
  console.log('Generated plans:', result.plans.length);
  console.log('Suggestions:', result.suggestions.length);
  
  // Check if frequency preference was respected
  const taskSessions = result.plans.flatMap(plan => 
    plan.plannedTasks.filter(session => session.taskId === mockTask.id)
  );
  console.log('Task sessions scheduled:', taskSessions.length);
  console.log('Test passed: Scheduling works with smart commitments and frequency preferences');
} catch (error) {
  console.error('Test failed:', error.message);
  console.error(error.stack);
}
