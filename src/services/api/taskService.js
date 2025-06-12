import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      categoryId: taskData.categoryId || 'general',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: tasks.length
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updateData };
      if (updateData.completed && !tasks[index].completedAt) {
        tasks[index].completedAt = new Date().toISOString();
      } else if (!updateData.completed && tasks[index].completedAt) {
        tasks[index].completedAt = null;
      }
      return { ...tasks[index] };
    }
    throw new Error('Task not found');
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      return { ...deletedTask };
    }
    throw new Error('Task not found');
  },

  async reorder(taskId, newOrder) {
    await delay(200);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.order = newOrder;
      tasks.sort((a, b) => a.order - b.order);
      return [...tasks];
    }
    throw new Error('Task not found');
  },

  async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(t => t.categoryId === categoryId);
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchTerm)
    );
  }
};

export default taskService;