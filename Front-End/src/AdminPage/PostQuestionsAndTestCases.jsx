import { useState } from 'react';
import axios from 'axios';

const UploadQuestions = () => {
  // Form state to hold the values of each field
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    difficulty: 'Beginner',
    description: '',
    language: '',
    Requirements: [{ sectionTitle: '', sectionContent: '' }],
    AcceptanceCriteria: [{ Criteria1: '' }],
    TestCases: [{ description: '', includes: '', includestype: '' }],
    topicname:''
    
  });

  // Handler for form input change
  const handleInputChange = (e, index, field, group) => {
    if (group) {
      const updatedGroup = [...formData[group]];
      updatedGroup[index][field] = e.target.value;
      setFormData({ ...formData, [group]: updatedGroup });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  // Handler to add more fields
  const handleAddMore = (group, newItem) => {
    setFormData({
      ...formData,
      [group]: [...formData[group], newItem],
    });
  };

  // Handler to remove a field
  const handleRemove = (group, index) => {
    const updatedGroup = [...formData[group]];
    updatedGroup.splice(index, 1);
    setFormData({ ...formData, [group]: updatedGroup });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData)
      const response = await axios.post('http://localhost:9000/questions/api', formData); // Post the data to the backend
      console.log('Response:', response.data);
      alert('Question created successfully!');
    } catch (error) {
      console.error('Error:', error.response.data);
      alert('Failed to create question'); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Question</h2>

      <label>ID:</label>
      <input
        type="number"
        value={formData.id}
        onChange={(e) => handleInputChange(e, null, 'id')}
        required
      />

      <label>Title:</label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => handleInputChange(e, null, 'title')}
        required
      />

      <label>Difficulty:</label>
      <select
        value={formData.difficulty}
        onChange={(e) => handleInputChange(e, null, 'difficulty')}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Expert">Expert</option>
      </select>

      <label>Description:</label>
      <textarea
        value={formData.description}
        onChange={(e) => handleInputChange(e, null, 'description')}
        required
      ></textarea>

      <label>Language:</label>
      <input
        type="text"
        value={formData.language}
        onChange={(e) => handleInputChange(e, null, 'language')}
        required
      />
       <label>TopicName:</label>
      <input
        type="text"
        value={formData.topicname}
        onChange={(e) => handleInputChange(e, null, 'topicname')}
        required
      />

      <h3>Requirements:</h3>
      {formData.Requirements.map((req, index) => (
        <div key={index}>
          <label>Section Title:</label>
          <input
            type="text"
            value={req.sectionTitle}
            onChange={(e) =>
              handleInputChange(e, index, 'sectionTitle', 'Requirements')
            }
            required
          />
          <label>Section Content:</label>
          <textarea
            value={req.sectionContent}
            onChange={(e) =>
              handleInputChange(e, index, 'sectionContent', 'Requirements')
            }
            required
          ></textarea>
          <button type="button" onClick={() => handleRemove('Requirements', index)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          handleAddMore('Requirements', { sectionTitle: '', sectionContent: '' })
        }
      >
        Add More Requirements
      </button>

      <h3>Acceptance Criteria:</h3>
      {formData.AcceptanceCriteria.map((criteria, index) => (
        <div key={index}>
          <label>Criteria:</label>
          <input
            type="text"
            value={criteria.Criteria1}
            onChange={(e) =>
              handleInputChange(e, index, 'Criteria1', 'AcceptanceCriteria')
            }
            required
          />
          <button type="button" onClick={() => handleRemove('AcceptanceCriteria', index)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          handleAddMore('AcceptanceCriteria', { Criteria1: '' })
        }
      >
        Add More Criteria
      </button>

      <h3>Test Cases:</h3>
      {formData.TestCases.map((testCase, index) => (
        <div key={index}>
          <label>Test Case Description:</label>
          <input
            type="text"
            value={testCase.description}
            onChange={(e) =>
              handleInputChange(e, index, 'description', 'TestCases')
            }
            required
          />
          <label>Includes:</label>
          <input
            type="text"
            value={testCase.includes}
            onChange={(e) =>
              handleInputChange(e, index, 'includes', 'TestCases')
            }
            required
          />
          <label>Includes Type:</label>
          <input
            type="text"
            value={testCase.includestype}
            onChange={(e) =>
              handleInputChange(e, index, 'includestype', 'TestCases')
            }
            required
          />
          <button type="button" onClick={() => handleRemove('TestCases', index)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          handleAddMore('TestCases', { description: '', includes: '', includestype: '' })
        }
      >
        Add More Test Cases
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UploadQuestions;
