import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const symptomsList = ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Acne'];
const moodList = ['Happy', 'Sad', 'Anxious', 'Irritable'];

export default function SymptomModal({ isOpen, onRequestClose, onSave, date }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');

  // Clear state when the modal opens for a new date
  useEffect(() => {
    if (isOpen) {
      setSelectedSymptoms([]);
      setSelectedMood('');
    }
  }, [isOpen]);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    onSave({ symptoms: selectedSymptoms, mood: selectedMood });
    // Dashboard will close the modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Log Symptoms"
      className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto mt-20 focus:outline-none font-sans"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-2xl font-bold text-brand-red mb-4">Log for {date.toDateString()}</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Symptoms</h3>
        <div className="flex flex-wrap gap-2">
          {symptomsList.map(symptom => (
            <button
              key={symptom}
              onClick={() => handleSymptomToggle(symptom)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Mood</h3>
        <div className="flex flex-wrap gap-2">
          {moodList.map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedMood === mood
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button onClick={onRequestClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-dark-red">Save</button>
      </div>
    </Modal>
  );
}
