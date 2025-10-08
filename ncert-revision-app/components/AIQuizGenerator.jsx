import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, FileText, Brain, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Question interface equivalent in JS
// id: string, question: string, type: 'short' | 'long', answer?: string, options?: string[], correctAnswer?: string

// Quiz interface equivalent in JS
// title: string, questions: Question[]

export default function AIQuizGenerator() {
  const [file, setFile] = useState(null);
  const [questionType, setQuestionType] = useState('mixed');
  const [questionCount, setQuestionCount] = useState('10');
  const [difficulty, setDifficulty] = useState('medium');
  const [systemPrompt, setSystemPrompt] = useState(`You are an expert quiz generator. Generate educational quiz questions from the provided PDF content. Create clear, accurate questions that test comprehension and knowledge. For short questions, provide multiple choice options with one correct answer. For long questions, provide open-ended questions that require detailed explanations. Format your response as JSON with the following structure:

{
  "title": "Quiz Title",
  "questions": [
    {
      "id": "1",
      "question": "Question text",
      "type": "short",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    },
    {
      "id": "2",
      "question": "Question text",
      "type": "long"
    }
  ]
}`);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a valid PDF file');
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const generateQuiz = async () => {
    if (!file) {
      setError('Please upload a PDF file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64File = await convertFileToBase64(file);

      const questionTypePrompt = questionType === 'mixed'
        ? `Generate a mix of ${Math.floor(parseInt(questionCount) / 2)} short questions and ${Math.ceil(parseInt(questionCount) / 2)} long questions`
        : `Generate ${questionCount} ${questionType} questions`;

      const prompt = `${systemPrompt}

Please analyze this PDF document and ${questionTypePrompt} at ${difficulty} difficulty level. Make sure questions cover the key concepts and information from the document.`;

      const response = await fetch('https://llm.blackbox.ai/chat/completions', {
        method: 'POST',
        headers: {
          'customerId': 'cus_TBjHIHRmAU67rY',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx'
        },
        body: JSON.stringify({
          model: 'openrouter/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: prompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Generate quiz questions from this PDF document.'
                },
                {
                  type: 'file',
                  file: {
                    filename: file.name,
                    file_data: base64File
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const quizData = JSON.parse(jsonMatch[0]);
      setQuiz(quizData);
      setUserAnswers({});
      setShowAnswers(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const exportQuiz = () => {
    if (!quiz) return;

    const exportData = {
      quiz,
      userAnswers,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.replace(/\s+/g, '_')}_quiz.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI Quiz Generator
          </h1>
          <p className="text-muted-foreground">Upload a PDF and automatically generate intelligent quiz questions</p>
        </div>

        {/* Configuration Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF
              </CardTitle>
              <CardDescription>
                Select or drag & drop a PDF document to generate quiz questions from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-primary mx-auto" />
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Click to upload or drag & drop your PDF file here
                    </p>
                  </div>
                )}
              </div>
              <Input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Quiz Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
              <CardDescription>
                Configure the type and difficulty of questions to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <RadioGroup value={questionType} onValueChange={(value) => setQuestionType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short">Short Answer (Multiple Choice)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long">Long Answer (Open-ended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">Mixed (Both Types)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Number of Questions</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setQuestionType('short');
                  setTimeout(() => generateQuiz(), 100);
                }}
                disabled={!file || loading}
                variant="outline"
                size="lg"
                className="px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Short Quiz
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  setQuestionType('long');
                  setTimeout(() => generateQuiz(), 100);
                }}
                disabled={!file || loading}
                variant="outline"
                size="lg"
                className="px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Long Quiz
                  </>
                )}
              </Button>
            </div>

            <Button
              onClick={generateQuiz}
              disabled={!file || loading}
              size="lg"
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>

          {/* Settings Summary */}
          <div className="bg-muted/50 rounded-lg p-4 border">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Current Settings</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Question Type:</span>{' '}
                <span className="text-primary">
                  {questionType === 'short' ? 'Short Answer (Multiple Choice)' :
                   questionType === 'long' ? 'Long Answer (Open-ended)' :
                   'Mixed (Both Types)'}
                </span>
              </div>
              <div>
                <span className="font-medium">Number of Questions:</span>{' '}
                <span className="text-primary">{questionCount} Questions</span>
              </div>
              <div>
                <span className="font-medium">Difficulty Level:</span>{' '}
                <span className="text-primary capitalize">{difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Quiz */}
        {quiz && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>
                    {quiz.questions.length} questions generated from your PDF
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAnswers(!showAnswers)}
                  >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                  </Button>
                  <Button variant="outline" onClick={exportQuiz}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 space-y-3">
                      <p className="font-medium text-foreground">{question.question}</p>

                      {question.type === 'short' && question.options ? (
                        <RadioGroup
                          value={userAnswers[question.id] || ''}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={option}
                                id={`${question.id}-${optionIndex}`}
                                disabled={showAnswers}
                              />
                              <Label
                                htmlFor={`${question.id}-${optionIndex}`}
                                className={`${
                                  showAnswers && question.correctAnswer === option
                                    ? 'text-green-600 font-medium'
                                    : showAnswers && userAnswers[question.id] === option && option !== question.correctAnswer
                                    ? 'text-red-600'
                                    : ''
                                }`}
                              >
                                {option}
                                {showAnswers && question.correctAnswer === option && (
                                  <CheckCircle className="w-4 h-4 inline-block ml-2 text-green-600" />
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Textarea
                          value={userAnswers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Enter your detailed answer here..."
                          rows={4}
                          disabled={showAnswers}
                        />
                      )}

                      {showAnswers && question.type === 'short' && (
                        <div className="mt-2 p-2 bg-muted rounded">
                          <p className="text-sm text-muted-foreground">
                            <strong>Correct Answer:</strong> {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
