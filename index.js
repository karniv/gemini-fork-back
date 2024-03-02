const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold 
} = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json()); 
app.use((req, res, next) => {
  console.log('Request received', req.method, req.path,req);
  next();
});

const port = 3000;
const MODEL_NAME = "gemini-1.0-pro-001";
const API_KEY = "AIzaSyC4e7uaI2gpQHypSFe_lXwDVwubLAqXibU"; // 제미나이 API 키로 대체
const prompt = ''; // 당신의 챗봇에 맞게 프롬프트 변경해주세요

app.post('/generate', async (req, res) => {  
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.9,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
        };
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
       const parts = [
            { text: '너는 사용자가 제공해 주는 제시어(' + req.body.userInput + ')를 가지고 베르나르 베르베르 소설가 느낌으로 10대들이 재미를 느낄 수 있는 위트있는 말로 50자로 만들어줘.' }
        ];
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });
        
        const response = result.response;     
        const text = response.text(); 
        res.send({ text: text }); 

     } catch (error) {
        console.error("Error during content generation:", error);
        res.status(500).send({ message: "An error occurred during content generation." });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
