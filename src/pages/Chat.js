import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub-flavored markdown
import remarkBreaks from "remark-breaks"; // To preserve newlines as <br />
import ReactLoading from "react-loading"; // Import react-loading

const Chat = () => {
  const [course, setCourse] = useState(null);
  const [major, setMajor] = useState(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [systemPromptSent, setSystemPromptSent] = useState(false);
  const [loadingBubbleId, setLoadingBubbleId] = useState(null); // Store ID for loading bubble

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedCourse = localStorage.getItem("selectedCourse");
    const savedMajor = localStorage.getItem("selectedMajor");
    setCourse(savedCourse);
    setMajor(savedMajor);

    if (savedMajor && savedCourse && !systemPromptSent) {
      fetchMajorData(savedMajor, savedCourse);
    }
  }, [major, course, systemPromptSent]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatLog]);

  const fetchMajorData = async (savedMajor, savedCourse) => {
    try {
      const [majorResponse, subjectDetailsResponse] = await Promise.all([
        fetch(
          "/data/courses/Bachelor_of_Engineering_(Honours)_Diploma_in_Professional_Engineering_Practice.json"
        ),
        fetch("/data/subjectDetails.json"),
      ]);

      const majorData = await majorResponse.json();
      const subjectDetailsData = await subjectDetailsResponse.json();

      const trimmedMajor = savedMajor.trim();
      const majorInfo = majorData.majors[trimmedMajor];

      if (!majorInfo) {
        console.log(`Major "${trimmedMajor}" not found.`);
        return;
      }

      const allCourses = new Set();
      const courseData = {};

      for (const year in majorInfo) {
        const yearData = majorInfo[year];
        courseData[year] = { Autumn: [], Spring: [] };

        if (yearData["Autumn Session"] && yearData["Autumn Session"].Courses) {
          courseData[year].Autumn = yearData["Autumn Session"].Courses;
          yearData["Autumn Session"].Courses.forEach((course) =>
            allCourses.add(course)
          );
        }

        if (yearData["Spring Session"] && yearData["Spring Session"].Courses) {
          courseData[year].Spring = yearData["Spring Session"].Courses;
          yearData["Spring Session"].Courses.forEach((course) =>
            allCourses.add(course)
          );
        }
      }

      const uniqueCourses = Array.from(allCourses);

      const subjectData = uniqueCourses.map((courseName) => {
        const subjectInfo = subjectDetailsData.subjectDetails[courseName];
        if (subjectInfo) {
          return { courseName, subjectInfo };
        } else {
          return { courseName, subjectInfo: "No details found." };
        }
      });

      const systemMessageContent = `
      You are a chatbot called "UTS Handbook Helper," designed to assist university students by providing detailed course handbook information. Your main goal is to guide students in choosing the right courses for their Autumn or Spring semester, based on their degree, major, and credit requirements.
    
      Important points to consider:
      1. The standard course load is 24 credit points (cp) per semester, though up to 30cp can be taken if required. Most subjects are worth 6cp. Some are worth 3 or 12 cp.
      2. The student is completing the course ${savedCourse} with a major in ${savedMajor}.
      3. Use the following course information to guide your responses: ${JSON.stringify(courseData, null, 2)}.
      4. Subject outlines, including prerequisites, co-requisites, and subject descriptions, are provided here: ${JSON.stringify(subjectData, null, 2)}. If a prerequisite is listed, note that only one subject is required to proceed with the course.
      5. When courses allow selection (e.g., "Select 6cp"), clearly explain the options and their relevance. For example, if students can choose 12cp, ensure they understand they can pick two 6cp subjects.
    
      Your responsibilities:
      - Emphasize the importance of each subject and explain how it fits into the student’s overall course progression.
      - Where applicable, explain the prerequisites for the subject and how it impacts future course selections, illustrating the flow of courses throughout their degree.
      - Highlight potential career paths or opportunities that specific courses may lead to, providing students with a broader understanding of how their choices will affect their career trajectory.
      - If detailed subject information is missing, provide general guidance about what the subject typically entails and its role in the degree program.
      
      Be accurate, cross-reference the subject data carefully, and ensure your responses are clear and helpful.
    `;
    

      setSystemMessage(systemMessageContent);
      setSystemPromptSent(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMessageSend = async () => {
    if (!message) return;
    setLoading(true);

    const messagesToSend = [
      {
        role: "system",
        content: systemMessage,
      },
      ...chatLog.map((log) => ({
        role: log.sender === "user" ? "user" : "assistant",
        content: log.message,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const newChatLog = [...chatLog, { sender: "user", message }];
    setChatLog(newChatLog);
    setMessage("");

    // Add a loading bubble as a temporary message
    const loadingId = `loading_${Date.now()}`;
    setLoadingBubbleId(loadingId);
    setChatLog((prev) => [
      ...prev,
      { sender: "assistant", message: "loading", id: loadingId, loading: true },
    ]);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messagesToSend,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const fullResponse = data.choices[0].message.content;

      // Replace loading bubble with the actual response
      setChatLog((prev) =>
        prev.map((log) =>
          log.id === loadingId ? { ...log, message: fullResponse, loading: false } : log
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("Error contacting OpenAI:", error);
      setChatLog((prev) => prev.filter((log) => log.id !== loadingId)); // Remove loading bubble if there's an error
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessageSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        padding: 4,
        justifySelf: "bottom",
      }}
    >
      {/* Header with logo and title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "50px",
          marginBottom: 1,
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            src="/uts-logo.png"
            alt="UTS Logo"
            style={{
              height: "40px",
              paddingRight: "10px",
            }}
          />
        </Link>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "24px",
            paddingTop: "5px",
          }}
        >
          Handbook Helper
        </Typography>
      </Box>

      {/* Chat log display */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#ffffff",
          padding: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {chatLog.map((chat, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                chat.sender === "user" ? "flex-end" : "flex-start",
              fontWeight: chat.sender === "user" ? "bold" : "normal",
              mb: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                maxWidth: "70%",
                backgroundColor: chat.sender === "user" ? "#168AFF" : "#e0e0e0",
                color: chat.sender === "user" ? "white" : "black",
                borderRadius: "16px",
              }}
            >
              {/* Loading animation */}
              {chat.loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "40px",
                    minWidth: "70px"
                  }}
                >
                  <ReactLoading type="bubbles" color="#0F4BEB" height={40} width={40} />
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    wordWrap: "break-word",
                    "& h1, h2, h3, h4, h5, h6": {
                      margin: "10px 0",
                      fontWeight: "bold",
                    },
                    "& p": {
                      marginBottom: chat.sender === "user" ? 0 : "10px",
                    },
                    "& ul, ol": {
                      paddingLeft: "20px",
                      marginBottom: "10px",
                    },
                  }}
                >
                  {/* Render markdown with ReactMarkdown, remarkGfm for markdown formatting, and remarkBreaks for newlines */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                  >
                    {chat.message}
                  </ReactMarkdown>
                </Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input field */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <TextField
          label={loading ? "Loading..." : "Message UTS Handbook Helper"}
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          sx={{ backgroundColor: "#fff", borderRadius: 2, flexGrow: 1 }}
        />
      </Box>
    </Box>
  );
};

export default Chat;