const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const taskService = {
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
              "Name": "title"
            }
          },
          {
            "Field": {
              "Name": "completed"
            }
          },
          {
            "Field": {
              "Name": "category_id"
            }
          },
          {
            "Field": {
              "Name": "priority"
            }
          },
          {
            "Field": {
              "Name": "due_date"
            }
          },
          {
            "Field": {
              "Name": "created_at"
            }
          },
          {
            "Field": {
              "Name": "completed_at"
            }
          },
          {
            "Field": {
              "Name": "order"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'title', 'completed', 'category_id', 'priority', 'due_date', 'created_at', 'completed_at', 'order']
      };
      
      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            title: taskData.title,
            completed: taskData.completed || false,
            category_id: parseInt(taskData.categoryId) || parseInt(taskData.category_id) || null,
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate || taskData.due_date || null,
            created_at: taskData.createdAt || taskData.created_at || new Date().toISOString(),
            completed_at: taskData.completedAt || taskData.completed_at || null,
            order: taskData.order !== undefined ? taskData.order : 0
          }
        ]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        return successfulRecords[0].data;
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.title !== undefined && { title: updateData.title }),
            ...(updateData.completed !== undefined && { completed: updateData.completed }),
            ...(updateData.categoryId !== undefined && { category_id: parseInt(updateData.categoryId) }),
            ...(updateData.category_id !== undefined && { category_id: parseInt(updateData.category_id) }),
            ...(updateData.priority !== undefined && { priority: updateData.priority }),
            ...(updateData.dueDate !== undefined && { due_date: updateData.dueDate }),
            ...(updateData.due_date !== undefined && { due_date: updateData.due_date }),
            ...(updateData.createdAt !== undefined && { created_at: updateData.createdAt }),
            ...(updateData.created_at !== undefined && { created_at: updateData.created_at }),
            ...(updateData.completedAt !== undefined && { completed_at: updateData.completedAt }),
            ...(updateData.completed_at !== undefined && { completed_at: updateData.completed_at }),
            ...(updateData.order !== undefined && { order: updateData.order })
          }
        ]
      };
      
      // Handle completion timestamp logic
      if (updateData.completed && !updateData.completed_at && !updateData.completedAt) {
        params.records[0].completed_at = new Date().toISOString();
      } else if (updateData.completed === false) {
        params.records[0].completed_at = null;
      }
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update task');
        }
        
        return successfulUpdates[0].data;
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete task');
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async reorder(taskId, newOrder) {
    try {
      return await this.update(taskId, { order: newOrder });
    } catch (error) {
      console.error("Error reordering task:", error);
      throw error;
    }
  },

  async getByCategory(categoryId) {
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
              "Name": "title"
            }
          },
          {
            "Field": {
              "Name": "completed"
            }
          },
          {
            "Field": {
              "Name": "category_id"
            }
          },
          {
            "Field": {
              "Name": "priority"
            }
          },
          {
            "Field": {
              "Name": "due_date"
            }
          },
          {
            "Field": {
              "Name": "created_at"
            }
          },
          {
            "Field": {
              "Name": "completed_at"
            }
          },
          {
            "Field": {
              "Name": "order"
            }
          }
        ],
        "where": [
          {
            "FieldName": "category_id",
            "Operator": "ExactMatch",
            "Values": [categoryId.toString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      throw error;
    }
  },

  async search(query) {
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
              "Name": "title"
            }
          },
          {
            "Field": {
              "Name": "completed"
            }
          },
          {
            "Field": {
              "Name": "category_id"
            }
          },
          {
            "Field": {
              "Name": "priority"
            }
          },
          {
            "Field": {
              "Name": "due_date"
            }
          },
          {
            "Field": {
              "Name": "created_at"
            }
          },
          {
            "Field": {
              "Name": "completed_at"
            }
          },
          {
            "Field": {
              "Name": "order"
            }
          }
        ],
        "where": [
          {
            "FieldName": "title",
            "Operator": "Contains",
            "Values": [query]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }
};
export default taskService;