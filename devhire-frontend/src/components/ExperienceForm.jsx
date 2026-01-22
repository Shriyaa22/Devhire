import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ExperienceForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear endDate if current job
    if (name === 'current' && checked) {
      setFormData(prev => ({ ...prev, endDate: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.current && !formData.endDate) {
      newErrors.endDate = 'End date is required (or check "Current")';
    }
    if (formData.startDate && formData.endDate && !formData.current) {
      if (formData.startDate > formData.endDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const experienceData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };
      onAdd(experienceData);
      // Reset form
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        technologies: '',
        location: ''
      });
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 mb-4">
      <CardHeader>
        <CardTitle className="text-white text-lg">Add Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Company *</Label>
            <Input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Google"
              className="bg-slate-800 border-slate-700 text-white"
            />
            {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
          </div>

          <div>
            <Label className="text-slate-300">Position *</Label>
            <Input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              className="bg-slate-800 border-slate-700 text-white"
            />
            {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
          </div>

          <div>
            <Label className="text-slate-300">Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA or Remote"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Start Date *</Label>
              <Input
                type="month"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
              {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <Label className="text-slate-300">End Date</Label>
              <Input
                type="month"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.current}
                className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
              />
              {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded"
            />
            <Label htmlFor="current" className="text-slate-300">I currently work here</Label>
          </div>

          <div>
            <Label className="text-slate-300">Technologies Used</Label>
            <Input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, AWS (comma separated)"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-300">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Experience
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

export default ExperienceForm;