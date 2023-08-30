import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery, useMutation, useQueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote }  from './requests'
import axios from 'axios'
import { useReducer } from 'react'
import { useNotificationValue, useNotificationDispatch } from './NotificationContext'




const App = () => {
  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })
  

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: () => getAnecdotes(),
    retry: 1,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))


  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }

  const anecdotes = result.data


  const handleVote = (anecdote) => {
    console.log('vote')
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({ type: "VOTE", content: `Voted ${anecdote.content}`})
    setTimeout(() => notificationDispatch({type: 'CLEAR_NOTIFICATION'}), 5000)
    
  }


  return (

    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
