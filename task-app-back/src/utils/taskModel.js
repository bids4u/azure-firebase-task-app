// shared/taskModel.js

const DEFAULT_STATUS = 'pending'; // Default status for new tasks
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

function createTaskData({ title, description = '', status = DEFAULT_STATUS, userId }) {
  if (!userId) {
    throw new Error('userId is required');
  }

  const now = new Date();

  // Validate status
  if (!VALID_STATUSES.includes(status)) {
    status = DEFAULT_STATUS;
  }

  return {
    title,
    description,
    status,
    userId, // Include userId
    createdAt: now,
    updatedAt: now,
  };
}

function updateTaskData(existingTask, updates) {
  const now = new Date();
  let updatedStatus = existingTask.status;

  if (updates.status && VALID_STATUSES.includes(updates.status)) {
    updatedStatus = updates.status;
  }

  // Prevent updating userId for security
  const { userId, ...safeUpdates } = updates;

  return {
    ...existingTask,
    ...safeUpdates, // Only apply safe updates (exclude userId)
    status: updatedStatus,
    updatedAt: now,
  };
}

module.exports = {
  createTaskData,
  updateTaskData,
  VALID_STATUSES,
};