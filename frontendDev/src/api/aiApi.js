import api from "./axios"; // import your Axios instance

export const getAISummary = async (text) => {
  try {
    
    const res = await api.post("ai/summary", { text: text || "" }, {
        headers: { "Content-Type": "application/json" }
    });
    // console.log("test");
    
    return res.data; // contains { success, suggestion, etc. }
  } catch (err) {
    console.error("AI Summary Error:", err);
    throw err;
  }
};

export const getAIProject = async (text) => {
  try {
    const res = await api.post("ai/project", { text });
    return res.data; // contains { success, suggestion, etc. }
  } catch (err) {
    console.error("AI Project Error:", err);
    throw err;
  }
};
