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
  return date.toISOString().split('T')[0];
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
      
      // After fetching logs, trigger prediction
      fetchPrediction(currentUser.uid, logs);
    }, (error) => {
      console.error("Error listening to symptom logs: ", error);
    });

    return unsubscribe; 
  }, [currentUser]); 

  // 3. Updated function to fetch prediction from your LIVE backend
  const fetchPrediction = async (uid, logs) => {
    setPredictionError(null);
    try {
      if (!API_BASE_URL) {
        throw new Error("API URL is not configured. Check your environment variables.");
      }

      // a. Get user profile to find cycle length
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        throw new Error("User profile not found. Please complete the quiz.");
      }
      const cycleLength = parseInt(docSnap.data().cycleLength, 10);
      if (isNaN(cycleLength) || cycleLength <= 0) {
        throw new Error("Invalid cycle length in profile.");
      }
      
      // b. Find the last logged date
      const lastPeriodDate = findLastPeriodDate(logs);

      console.log(`Sending to Render: lastPeriodDate=${formatToYYYYMMDD(lastPeriodDate)}, averageCycleLength=${cycleLength}`);

      // c. Call your Live Java API on Render using the environment variable
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastPeriodDate: formatToYYYYMMDD(lastPeriodDate),
          averageCycleLength: cycleLength
        })
      });

      if (!response.ok) {
        throw new Error(`Connection to prediction server failed. Status: ${response.status}`);
      }

      // d. Get prediction back from Java and save it
      const predictionData = await response.json();
      console.log('Prediction received from Render:', predictionData);
      setPrediction(predictionData);

    } catch (error) {
      console.error('Prediction Error:', error.message);
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
      console.log("Symptom saved for:", dateString);
      closeModal();
    } catch (error) {
      console.error("Error saving symptom: ", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* --- PREDICTION SECTION --- */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-brand-red mb-4">Your Predictions</h2>
          {prediction ? (
            <div className="space-y-2">
              <p className="text-lg"><strong>Next Predicted Period:</strong> {prediction.nextPeriodDate}</p>
              <p className="text-gray-600"><strong>Predicted Ovulation:</strong> {prediction.ovulationDate}</p>
              <p className="text-gray-600"><strong>Predicted Fertile Window:</strong> {prediction.fertileWindowStart} to {prediction.ovulationDate}</p>
            </div>
          ) : predictionError ? (
            <p className="text-red-500">Could not get prediction: {predictionError}</p>
          ) : (
            <p className="text-gray-600">Calculating your predictions...</p>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-brand-red mb-6">Track Your Cycle</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg text-gray-600 mb-4">Click on a date to log your symptoms and mood.</p>
          <Calendar onChange={setDate} value={date} onClickDay={openModal} className="border-0" />
        </div>

        {Object.keys(loggedData).length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-brand-red mb-4">Symptom Log Summary</h2>
            <ul className="space-y-2">
              {Object.entries(loggedData).map(([date, data]) => (
                <li key={date} className="text-gray-700">
                  <strong className="text-gray-900">{date}:</strong> 
                  {data.mood && ` Mood - ${data.mood}. `}
                  {data.symptoms && data.symptoms.length > 0 && `Symptoms - ${data.symptoms.join(', ')}.`}
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
