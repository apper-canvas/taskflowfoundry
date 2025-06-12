import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoriesData];

const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.id === id);
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color || '#5B4EE5',
      taskCount: 0,
      order: categories.length
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(250);
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updateData };
      return { ...categories[index] };
    }
    throw new Error('Category not found');
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      const deletedCategory = categories.splice(index, 1)[0];
      return { ...deletedCategory };
    }
    throw new Error('Category not found');
  },

  async updateTaskCount(categoryId, count) {
    await delay(100);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      category.taskCount = count;
      return { ...category };
    }
    throw new Error('Category not found');
  }
};

export default categoryService;