import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function loads and filters the FAQs
    const loadPersonalizedFaqs = async (user) => {
      try {
        // 1. Fetch ALL FAQs from the new public/faqs.json file
        const response = await fetch('/faqs.json');
        const allFaqs = await response.json();

        let userAge = 25; // Default age if user is logged out or has no profile

        // 2. Get the logged-in user's profile from Firestore
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            userAge = parseInt(docSnap.data().age, 10);
          }
        }
        
        // 3. Apply personalization logic based on age
        if (userAge >= 10 && userAge <= 19) {
          setFaqs(allFaqs.adolescents);
        } else if (userAge >= 20 && userAge <= 29) {
          setFaqs(allFaqs.youngAdults);
        } else if (userAge >= 30 && userAge <= 39) {
          setFaqs(allFaqs.adults);
        } else if (userAge >= 40 && userAge <= 49) {
          setFaqs(allFaqs.mature);
        } else if (userAge >= 50) {
          setFaqs(allFaqs.postMenopausal);
        } else {
          setFaqs(allFaqs.general); // Fallback
        }
      } catch (error) {
        console.error("Failed to load or parse FAQs:", error);
        // Set a default list just in case the fetch fails
        setFaqs([
          { question: "Error", answer: "Could not load FAQs. Please check your connection and try again." }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes. This runs when the page loads
    // and again if the user logs in or out.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true); // Show loading spinner
      loadPersonalizedFaqs(user); // Load FAQs for the current user (or null)
    });

    return unsubscribe; // Cleanup the listener
  }, []); // The empty array means this effect runs once on component mount

  return (
    // This page needs top padding to be below the fixed navbar
    <div className="bg-gray-100 min-h-screen pt-24">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">Curious About...?</h1>
        
        {loading ? (
          <p className="text-center text-gray-600">Loading personalized content...</p>
        ) : (
          <div className="space-y-6">
            {faqs.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-brand-dark-red mb-2">{item.question}</h2>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
