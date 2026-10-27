'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiImage, FiLink, FiX } from 'react-icons/fi';

interface Archive {
  id: string;
  year: string;
  theme: string;
  images: string[];
  driveLink: string | null;
  createdAt: string;
}

export default function ArchivesAdmin() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArchive, setEditingArchive] = useState<Archive | null>(null);

  const [formData, setFormData] = useState({
    year: '',
    theme: '',
    images: [] as string[],
    driveLink: '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const response = await fetch('/api/admin/archives');
      const data = await response.json();
      setArchives(data);
    } catch (error) {
      console.error('Failed to fetch archives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl && formData.images.length < 10) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl],
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingArchive
        ? `/api/admin/archives/${editingArchive.id}`
        : '/api/admin/archives';
      const method = editingArchive ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingArchive(null);
        setFormData({ year: '', theme: '', images: [], driveLink: '' });
        fetchArchives();
      } else {
        const error = await response.json();
        alert(error.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Failed to save archive:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this archive?')) {
      try {
        await fetch(`/api/admin/archives/${id}`, { method: 'DELETE' });
        fetchArchives();
      } catch (error) {
        console.error('Failed to delete archive:', error);
      }
    }
  };

  const openEditModal = (archive: Archive) => {
    setEditingArchive(archive);
    setFormData({
      year: archive.year,
      theme: archive.theme,
      images: archive.images,
      driveLink: archive.driveLink || '',
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingArchive(null);
    setFormData({ year: '', theme: '', images: [], driveLink: '' });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Festival Archives</h1>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus />
          <span>Add Archive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archives.map((archive) => (
          <div key={archive.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-100 relative">
              {archive.images.length > 0 ? (
                <img
                  src={archive.images[0]}
                  alt={`${archive.year} Theme`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiImage className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => openEditModal(archive)}
                  className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white text-gray-700 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(archive.id)}
                  className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-red-50 text-red-600 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                  {archive.year}
                </span>
                <span className="text-sm text-gray-500">
                  {archive.images.length}/10 photos
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{archive.theme}</h3>
              
              {archive.driveLink && (
                <a
                  href={archive.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiLink />
                  <span>View Google Drive Folder</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">
                {editingArchive ? 'Edit Archive' : 'Add New Archive'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="e.g., The Future is Now"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Drive Folder Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.driveLink}
                  onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos ({formData.images.length}/10)
                </label>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={formData.images.length >= 10}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!newImageUrl || formData.images.length >= 10}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
                  >
                    Add Image
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                        <img
                          src={url}
                          alt={`Archive photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  {editingArchive ? 'Save Changes' : 'Create Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
