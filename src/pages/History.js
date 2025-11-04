import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { db, auth } from '../firebaseConfig'; // This path will now work
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth state changed: User is logged in", user.uid);
        setCurrentUser(user);
      } else {
        console.log("Auth state changed: User is logged out");
        navigate('/login');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);

  const handleDownloadPDF = async () => {
    if (!currentUser) {
      alert("Please log in to download your history.");
      return;
    }
    setError(null);
    console.log("Starting PDF download...");

    try {
      console.log("Current user:", currentUser.uid);
      
      // 1. Get user profile
      console.log("Fetching user profile...");
      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      const userProfile = docSnap.exists() ? docSnap.data() : {};
      console.log("User profile fetched:", userProfile);

      // 2. Get all symptom logs
      console.log("Fetching symptom logs...");
      const logsCollectionRef = collection(db, 'users', currentUser.uid, 'symptomLogs');
      const querySnapshot = await getDocs(logsCollectionRef);
      const loggedData = {};
      querySnapshot.docs.forEach((doc) => {
        loggedData[doc.id] = doc.data();
      });
      console.log("Logs fetched:", loggedData);

      // 3. Create a new PDF document
      console.log("Creating PDF document...");
      const pdfDoc = new jsPDF(); 
      
      pdfDoc.setFont('helvetica', 'bold');
      pdfDoc.setFontSize(20);
      pdfDoc.text('Veda Bloom Health History', 105, 20, { align: 'center' });
      
      pdfDoc.setFontSize(14);
      pdfDoc.text(`Report for: ${userProfile?.name || 'User'}`, 20, 40);
      
      pdfDoc.setFont('helvetica', 'normal');
      pdfDoc.setFontSize(12);
      pdfDoc.text(`Age: ${userProfile?.age || 'N/A'}`, 20, 50);
      pdfDoc.text(`Health Conditions: ${userProfile?.healthConditions || 'None noted'}`, 20, 60);
      
      pdfDoc.setFont('helvetica', 'bold');
      pdfDoc.setFontSize(14);
      pdfDoc.text('Symptom & Mood Log', 20, 80);
      
      pdfDoc.setFont('helvetica', 'normal');
      pdfDoc.setFontSize(12);
      let yPosition = 90;

      if (Object.keys(loggedData).length > 0) {
        const sortedDates = Object.keys(loggedData).sort((a, b) => new Date(a) - new Date(b));

        for (const date of sortedDates) {
          const data = loggedData[date];
          if (yPosition > 270) { 
            pdfDoc.addPage();
            yPosition = 20;
          }
          let logEntry = `${date}:`;
          if (data.mood) logEntry += ` Mood - ${data.mood}.`;
          if (data.symptoms.length > 0) logEntry += ` Symptoms - ${data.symptoms.join(', ')}.`;
          
          pdfDoc.text(logEntry, 20, yPosition);
          yPosition += 10;
        }
      } else {
        pdfDoc.text('No symptoms have been logged.', 20, yPosition);
      }
      
      // 4. Save the PDF
      console.log("PDF generation complete. Saving file...");
      pdfDoc.save('VedaBloom_Health_History.pdf');
      console.log("PDF save attempted.");

    } catch (error) {
      console.error("Error generating PDF: ", error);
      setError(`Could not generate PDF: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center pt-16">
      <div className="text-center max-w-2xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-brand-red mb-4">Your History</h1>
        <p className="text-lg text-gray-600 mb-8">
          Download a complete summary of your logged symptoms and profile data from the cloud.
        </p>
        <button
          onClick={handleDownloadPDF}
          disabled={loading || !currentUser}
          className="bg-brand-red text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-brand-dark-red transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading User...' : 'Download as PDF'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
