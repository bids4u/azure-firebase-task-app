// shared/taskModel.js

const DEFAULT_STATUS = 'pending'; // Default status for new tasks
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

function createTaskData({ title, description = '', status = DEFAULT_STATUS }) {
  const now = new Date();

  // Optional: validate status
  if (!VALID_STATUSES.includes(status)) {
    status = DEFAULT_STATUS;
  }

  return {
    title,
    description,
    status,
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

  return {
    ...existingTask,
    ...updates,
    status: updatedStatus,
    updatedAt: now,
  };
}

module.exports = {
  createTaskData,
  updateTaskData,
  VALID_STATUSES,
};
