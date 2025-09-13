import React from "react";
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const testService = {
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
              "Name": "Tags"
            }
          },
          {
            "Field": {
              "Name": "Description"
            }
          },
          {
            "Field": {
              "Name": "TestPrice"
            }
          },
          {
            "Field": {
              "Name": "Owner"
            }
          },
          {
            "Field": {
              "Name": "CreatedOn"
            }
          },
          {
            "Field": {
              "Name": "CreatedBy"
            }
          },
          {
            "Field": {
              "Name": "ModifiedOn"
            }
          },
          {
            "Field": {
              "Name": "ModifiedBy"
            }
          },
          {
            "Field": {
              "Name": "files_5"
            }
          },
          {
            "Field": {
              "Name": "files_6"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('Test', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform Test records to work with existing UI
      const transformedData = (response.data || []).map(record => ({
        ...record,
        // Map Test fields to expected task fields for UI compatibility
        title: record.Name,
        completed: record.Description?.includes('completed') || false,
        category_id: record.Tags || 'general',
        priority: record.Description?.includes('high') ? 'high' : record.Description?.includes('low') ? 'low' : 'medium',
        due_date: record.ModifiedOn,
        created_at: record.CreatedOn,
        completed_at: record.Description?.includes('completed') ? record.ModifiedOn : null,
        order: record.TestPrice || 0
      }));
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching test records:", error);
      throw error;
    }
  },

  async getById(id) {
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
              "Name": "Tags"
            }
          },
          {
            "Field": {
              "Name": "Description"
            }
          },
          {
            "Field": {
              "Name": "TestPrice"
            }
          },
          {
            "Field": {
              "Name": "files_5"
            }
          },
          {
            "Field": {
              "Name": "files_6"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('Test', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform single Test record to work with existing UI
      const record = response.data;
      if (record) {
        return {
          ...record,
          title: record.Name,
          completed: record.Description?.includes('completed') || false,
          category_id: record.Tags || 'general',
          priority: record.Description?.includes('high') ? 'high' : record.Description?.includes('low') ? 'low' : 'medium',
          due_date: record.ModifiedOn,
          created_at: record.CreatedOn,
          completed_at: record.Description?.includes('completed') ? record.ModifiedOn : null,
          order: record.TestPrice || 0
        };
      }
      
      return record;
    } catch (error) {
      console.error(`Error fetching test record with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
            Name: taskData.title || taskData.Name,
            Tags: taskData.categoryId || taskData.Tags || 'general',
            Description: `Priority: ${taskData.priority || 'medium'}${taskData.completed ? ' - completed' : ''}${taskData.dueDate ? ` - Due: ${taskData.dueDate}` : ''}`,
            TestPrice: parseFloat(taskData.order || taskData.TestPrice || 0),
            files_5: taskData.files_5 || '',
            files_6: taskData.files_6 || ''
          }
        ]
      };
      
      const response = await apperClient.createRecord('Test', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create test record');
        }
        
        // Transform response back to task format for UI compatibility
        const created = successfulRecords[0].data;
        return {
          ...created,
          title: created.Name,
          completed: created.Description?.includes('completed') || false,
          category_id: created.Tags,
          priority: created.Description?.includes('high') ? 'high' : created.Description?.includes('low') ? 'low' : 'medium',
          order: created.TestPrice
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating test record:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const record = {
        Id: parseInt(id)
      };
      
      // Only include Updateable fields that are being updated
      if (updateData.title !== undefined || updateData.Name !== undefined) {
        record.Name = updateData.title || updateData.Name;
      }
      
      if (updateData.categoryId !== undefined || updateData.Tags !== undefined) {
        record.Tags = updateData.categoryId || updateData.Tags;
      }
      
      if (updateData.completed !== undefined || updateData.priority !== undefined || updateData.Description !== undefined) {
        // Preserve existing description structure while updating completion/priority
        const priority = updateData.priority || 'medium';
        const completed = updateData.completed !== undefined ? updateData.completed : false;
        record.Description = `Priority: ${priority}${completed ? ' - completed' : ''}`;
      }
      
      if (updateData.order !== undefined || updateData.TestPrice !== undefined) {
        record.TestPrice = parseFloat(updateData.order || updateData.TestPrice);
      }
      
      if (updateData.files_5 !== undefined) {
        record.files_5 = updateData.files_5;
      }
      
      if (updateData.files_6 !== undefined) {
        record.files_6 = updateData.files_6;
      }
      
      const params = {
        records: [record]
      };
      
      const response = await apperClient.updateRecord('Test', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update test record');
        }
        
        // Transform response back to task format for UI compatibility
        const updated = successfulUpdates[0].data;
        return {
          ...updated,
          title: updated.Name,
          completed: updated.Description?.includes('completed') || false,
          category_id: updated.Tags,
          priority: updated.Description?.includes('high') ? 'high' : updated.Description?.includes('low') ? 'low' : 'medium',
          order: updated.TestPrice
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating test record:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('Test', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete test record');
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting test record:", error);
      throw error;
    }
  },

  async reorder(taskId, newOrder) {
    try {
      return await this.update(taskId, { order: newOrder });
    } catch (error) {
      console.error("Error reordering test record:", error);
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
              "Name": "Name"
            }
          },
          {
            "Field": {
              "Name": "Tags"
            }
          },
          {
            "Field": {
              "Name": "Description"
            }
          },
          {
            "Field": {
              "Name": "TestPrice"
            }
          },
          {
            "Field": {
              "Name": "CreatedOn"
            }
          },
          {
            "Field": {
              "Name": "ModifiedOn"
            }
          }
        ],
        "where": [
          {
            "FieldName": "Tags",
            "Operator": "Contains",
            "Values": [categoryId.toString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('Test', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform Test records to work with existing UI
      const transformedData = (response.data || []).map(record => ({
        ...record,
        title: record.Name,
        completed: record.Description?.includes('completed') || false,
        category_id: record.Tags,
        priority: record.Description?.includes('high') ? 'high' : record.Description?.includes('low') ? 'low' : 'medium',
        due_date: record.ModifiedOn,
        created_at: record.CreatedOn,
        order: record.TestPrice || 0
      }));
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching test records by category:", error);
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
              "Name": "Name"
            }
          },
          {
            "Field": {
              "Name": "Tags"
            }
          },
          {
            "Field": {
              "Name": "Description"
            }
          },
          {
            "Field": {
              "Name": "TestPrice"
            }
          },
          {
            "Field": {
              "Name": "CreatedOn"
            }
          },
          {
            "Field": {
              "Name": "ModifiedOn"
            }
          }
        ],
        "where": [
          {
            "FieldName": "Name",
            "Operator": "Contains",
            "Values": [query]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('Test', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform Test records to work with existing UI
      const transformedData = (response.data || []).map(record => ({
        ...record,
        title: record.Name,
        completed: record.Description?.includes('completed') || false,
        category_id: record.Tags,
        priority: record.Description?.includes('high') ? 'high' : record.Description?.includes('low') ? 'low' : 'medium',
        due_date: record.ModifiedOn,
        created_at: record.CreatedOn,
        order: record.TestPrice || 0
      }));
      
      return transformedData;
    } catch (error) {
      console.error("Error searching test records:", error);
      throw error;
    }
  }
};

export default testService;