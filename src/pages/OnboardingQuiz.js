import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig'; // Import db and auth
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { onAuthStateChanged } from 'firebase/auth';

export default function OnboardingQuiz() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    cycleLength: '28',
    healthConditions: '',
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes to get the user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        // If no user, send back to login
        navigate('/login');
      }
    });
    return unsubscribe; // Cleanup listener
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.error("No user logged in to save profile");
      return;
    }

    // Combine quiz data with auth data
    const userProfile = {
      ...formData,
      uid: currentUser.uid,
      email: currentUser.email,
      name: formData.name || currentUser.displayName, // Use form name or Google name
      gender: 'Female' // Hardcoded as per your request
    };

    try {
      // Create a document reference in the 'users' collection with the user's UID
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Save the user's profile to Firestore
      await setDoc(userDocRef, userProfile);
      
      // Go to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving profile to Firestore: ", error);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  return (
    // This page is full-screen
    <div className="bg-brand-red text-white min-h-screen flex items-center justify-center py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-brand-dark-red p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Profile</h2>
        <p className="text-center text-red-200 mb-8">This helps us personalize your experience.</p>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-red-100 font-medium mb-2">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
            className="w-full px-4 py-2 bg-red-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white" placeholder={currentUser.displayName || "Your Name"} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="age" className="block text-red-100 font-medium mb-2">Age</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange}
              className="w-full px-4 py-2 bg-red-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white" required />
          </div>
          <div>
            <label htmlFor="cycleLength" className="block text-red-100 font-medium mb-2">Average cycle length?</label>
            <input type="number" id="cycleLength" name="cycleLength" value={formData.cycleLength} onChange={handleChange}
              className="w-full px-4 py-2 bg-red-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., 28"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <label htmlFor="healthConditions" className="block text-red-100 font-medium mb-2">Any existing health conditions?</label>
          <textarea id="healthConditions" name="healthConditions" value={formData.healthConditions} onChange={handleChange} rows="3"
            className="w-full px-4 py-2 bg-red-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="e.g., PCOS, Endometriosis (Optional)"
          ></textarea>
        </div>

        <button type="submit" className="w-full bg-white text-brand-red font-bold py-3 rounded-lg hover:bg-red-200 transition duration-300">
          Go to Dashboard
        </button>
      </form>
    </div>
  );
}
