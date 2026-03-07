import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import SymptomModal from '../components/SymptomModal';
import '../Calendar.css';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Helper function to find the most recent log date
const findLastPeriodDate = (logs) => {
  if (!logs || Object.keys(logs).length === 0) {
    return new Date(); // Default to today if no logs
  }
  const mostRecentDate = Object.keys(logs).reduce((a, b) => {
    return new Date(a) > new Date(b) ? a : b;
  });
  return new Date(mostRecentDate);
};

// Helper function to format date as YYYY-MM-DD for Java
const formatToYYYYMMDD = (date) => {
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loggedData, setLoggedData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [prediction, setPrediction] = useState(null); 
  const [predictionError, setPredictionError] = useState(null); 
  const navigate = useNavigate();

  // Get the base URL from your .env / Vercel settings
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // 1. Get the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log("No user detected, redirecting to login.");
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  // 2. Listen for symptom logs from Firestore
  useEffect(() => {
    if (!currentUser) return; 

    const logsCollectionRef = collection(db, 'users', currentUser.uid, 'symptomLogs');
    const unsubscribe = onSnapshot(logsCollectionRef, (snapshot) => {
      const logs = {};
      snapshot.docs.forEach((doc) => {
        logs[doc.id] = doc.data();
      });
      setLoggedData(logs);
      
      console.log("Symptom logs updated, triggering prediction fetch...");
      fetchPrediction(currentUser.uid, logs);
    }, (error) => {
      console.error("Error listening to symptom logs: ", error);
    });

    return unsubscribe; 
  }, [currentUser]); 

  // 3. Updated function to fetch prediction with enhanced debugging
  const fetchPrediction = async (uid, logs) => {
    setPredictionError(null);
    try {
      if (!API_BASE_URL) {
        throw new Error("API URL is missing from Environment Variables.");
      }

      // a. Get user profile to find cycle length
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        throw new Error("User profile (quiz data) not found in Firestore.");
      }
      
      const userData = docSnap.data();
      const cycleLength = parseInt(userData.cycleLength, 10);
      
      if (isNaN(cycleLength) || cycleLength <= 0) {
        throw new Error(`Invalid cycle length: ${userData.cycleLength}. Please retake the quiz.`);
      }
      
      // b. Find the last logged date
      const lastPeriodDate = findLastPeriodDate(logs);
      const formattedDate = formatToYYYYMMDD(lastPeriodDate);

      const requestBody = {
        lastPeriodDate: formattedDate,
        averageCycleLength: cycleLength
      };

      console.log("Attempting API call to:", `${API_BASE_URL}/api/predict`);
      console.log("Payload:", requestBody);

      // c. Call your Live Java API on Render
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server responded with error:", errorText);
        throw new Error(`Backend Error (${response.status}): ${errorText || 'Internal Server Error'}`);
      }

      // d. Get prediction back from Java and save it
      const predictionData = await response.json();
      console.log('Successfully received prediction:', predictionData);
      setPrediction(predictionData);

    } catch (error) {
      console.error('Fetch Prediction Catch Block:', error);
      setPredictionError(error.message);
    }
  };

  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // 4. Save new symptom logs to Firestore
  const handleSaveSymptoms = async (data) => {
    if (!currentUser) return;
    const dateString = selectedDate.toDateString();
    
    try {
      const logDocRef = doc(db, 'users', currentUser.uid, 'symptomLogs', dateString);
      await setDoc(logDocRef, data, { merge: true }); 
      console.log("Symptom saved successfully for:", dateString);
      closeModal();
    } catch (error) {
      console.error("Error saving symptom to Firestore: ", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* --- PREDICTION SECTION --- */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border-l-4 border-brand-red">
          <h2 className="text-2xl font-semibold text-brand-red mb-4">Your Predictions</h2>
          {prediction ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 rounded">
                <p className="text-sm text-gray-500 uppercase font-bold">Next Period</p>
                <p className="text-lg font-semibold">{prediction.nextPeriodDate}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-500 uppercase font-bold">Ovulation</p>
                <p className="text-lg font-semibold">{prediction.ovulationDate}</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-sm text-gray-500 uppercase font-bold">Fertile Window</p>
                <p className="text-sm font-medium">{prediction.fertileWindowStart} - {prediction.ovulationDate}</p>
              </div>
            </div>
          ) : predictionError ? (
            <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200">
              <p className="font-bold italic">Connection Issue:</p>
              <p className="text-sm">{predictionError}</p>
              <button 
                onClick={() => fetchPrediction(currentUser?.uid, loggedData)}
                className="mt-2 text-xs underline font-bold"
              >
                Try Reconnecting to Server
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="animate-spin h-5 w-5 border-2 border-brand-red border-t-transparent rounded-full"></div>
              <p className="text-gray-600 italic">Syncing with Veda Bloom backend...</p>
            </div>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-brand-red mb-6">Track Your Cycle</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg text-gray-600 mb-4">Click on a date to log your symptoms and mood.</p>
          <Calendar onChange={setDate} value={date} onClickDay={openModal} className="border-0 w-full" />
        </div>

        {Object.keys(loggedData).length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-brand-red mb-4">Symptom Log Summary</h2>
            <ul className="space-y-3">
              {Object.entries(loggedData).map(([date, data]) => (
                <li key={date} className="p-3 border-b border-gray-100 last:border-0">
                  <strong className="text-brand-red block mb-1">{date}</strong> 
                  <div className="text-sm text-gray-700">
                    {data.mood && <span className="mr-3">✨ {data.mood}</span>}
                    {data.symptoms && data.symptoms.length > 0 && (
                      <span className="text-gray-500 italic">({data.symptoms.join(', ')})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedDate && (
        <SymptomModal isOpen={isModalOpen} onRequestClose={closeModal} onSave={handleSaveSymptoms} date={selectedDate} />
      )}
    </div>
  );
}
