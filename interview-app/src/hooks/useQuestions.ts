import Papa from 'papaparse'
import { useState, useEffect } from 'react'

type Question = {
  question_id: string
  question: string
  category: string
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    fetch('/data/questions.csv')
      .then((response) => response.text())
      .then((csv) => {
        const parsedData = Papa.parse<Question>(csv, {
          header: true,
          skipEmptyLines: true
        })
        const parsedQuestions = parsedData.data.map((row) => ({
          question_id: row.question_id,
          question: row.question,
          category: row.category
        }))
        setQuestions(parsedQuestions)
      })
      .catch((error) => {
        console.error('Error fetching questions:', error)
      })
  }, [])

  return questions
}
