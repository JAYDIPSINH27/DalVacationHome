import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getQuestionBank } from '../services/questionService'

const useQuestionBank = () => {
    const query = useQuery({
        queryKey: ['questionBank'],
        queryFn: getQuestionBank,
    })
  return {
    questionBank: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export default useQuestionBank