import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ProjectForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.technologies.trim()) newErrors.technologies = 'At least one technology is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert technologies string to array
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };

      onAdd(projectData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: ''
      });
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 mb-4">
      <CardHeader>
        <CardTitle className="text-white text-lg">Add Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Project Title *</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., E-commerce Platform"
              className="bg-slate-800 border-slate-700 text-white"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label className="text-slate-300">Description *</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project, its features, and your role..."
              rows={3}
              className="bg-slate-800 border-slate-700 text-white"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label className="text-slate-300">Technologies Used *</Label>
            <Input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              className="bg-slate-800 border-slate-700 text-white"
            />
            {errors.technologies && <p className="text-red-400 text-xs mt-1">{errors.technologies}</p>}
            <p className="text-xs text-slate-500 mt-1">Separate multiple technologies with commas</p>
          </div>

          <div>
            <Label className="text-slate-300">Live URL (Optional)</Label>
            <Input
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://myproject.com"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-300">GitHub URL (Optional)</Label>
            <Input
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Project
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="bg-slate-700 text-white hover:bg-slate-600">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProjectForm;