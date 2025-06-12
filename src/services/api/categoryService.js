const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const categoryService = {
  async getAll() {
    try {
      const params = {
        "Fields": [
          {
            "Field": {
              "Name": "Id"
            }
          },
          {
            "Field": {
              "Name": "Name"
            }
          },
          {
            "Field": {
              "Name": "color"
            }
          },
          {
            "Field": {
              "Name": "task_count"
            }
          },
          {
            "Field": {
              "Name": "order"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'color', 'task_count', 'order']
      };
      
      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [
          {
            Name: categoryData.name || categoryData.Name,
            color: categoryData.color || '#5B4EE5',
            task_count: categoryData.task_count || categoryData.taskCount || 0,
            order: categoryData.order !== undefined ? categoryData.order : 0
          }
        ]
      };
      
      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create category');
        }
        
        return successfulRecords[0].data;
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.name !== undefined && { Name: updateData.name }),
            ...(updateData.Name !== undefined && { Name: updateData.Name }),
            ...(updateData.color !== undefined && { color: updateData.color }),
            ...(updateData.task_count !== undefined && { task_count: updateData.task_count }),
            ...(updateData.taskCount !== undefined && { task_count: updateData.taskCount }),
            ...(updateData.order !== undefined && { order: updateData.order })
          }
        ]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update category');
        }
        
        return successfulUpdates[0].data;
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete category');
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  async updateTaskCount(categoryId, count) {
    try {
      return await this.update(categoryId, { task_count: count });
    } catch (error) {
      console.error("Error updating task count:", error);
      throw error;
    }
  }
};

export default categoryService;

export default categoryService;