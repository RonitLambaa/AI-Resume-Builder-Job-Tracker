import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";



export const improveSummary = async (req, res) => {
  try {

    const { text } = req.body;
    const prompt = `Improve the following resume summary to be professional , do not give any options just give give a professionsal summary: ${text}`
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response; 

    const suggestion = response.text();
    res.json({ success: true, suggestion: suggestion });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "AI suggestion failed" });
  }
};

export const improveProjectDescription = async (req, res) => {
  try {
    const { text } = req.body;
    
    const prompt = `Rewrite this resume project description in a professional, consice and impactful way and do not give any options  : \n${text}`
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response; 

    const suggestion = response.text();
    res.json({ success: true, suggestion: suggestion });

   
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "AI suggestion failed" });
  }
};
