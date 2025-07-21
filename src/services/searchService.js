// src/services/searchService.js
export const searchDisasterQA = async (userQuestion) => {
  // 1. Search in your EXISTING 'knowledge_base' collection
  const q = query(
    collection(db, "knowledge_base"), // Changed from "disaster_qas"
    where("keywords", "array-contains-any", userQuestion.toLowerCase().split(' '))
  );
  const snapshot = await getDocs(q);
  
  // 2. Rest of the logic remains the same...
  if (snapshot.empty) {
    const aiResults = await generateQnAPairs();
    const bestMatch = aiResults.find(item => 
      item.question.includes(userQuestion) || 
      item.answer.includes(userQuestion)
    );
    
    if (bestMatch) {
      // Save to 'knowledge_base' instead
      await addDoc(collection(db, "knowledge_base"), { 
        question: userQuestion,
        answer: bestMatch.answer,
        keywords: extractKeywords(userQuestion + " " + bestMatch.answer),
        createdAt: serverTimestamp() // Use Firebase's timestamp
      });
      return bestMatch.answer;
    }
    return "I don't know. Contact emergency services for help.";
  }
  return snapshot.docs[0].data().answer;
};