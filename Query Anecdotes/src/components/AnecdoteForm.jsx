import { useMutation, useQueryClient} from '@tanstack/react-query'
import { createAnecdote }  from '../requests'
import { useContext } from 'react'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      console.log(queryClient.getQueryCache());
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      if (anecdotes) {
        queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote]);
      }
    },
    onError: (error) => {
      // Handle error scenario
      console.log('Error:', error);
      dispatch({ type: "VOTE", content: "An error occurred while creating the anecdote" });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  });

  const addAnecdote = (event) => {
    event.preventDefault();
    if (event.target.anecdote.value.length < 5) {
      console.log('Fail');
      dispatch({ type: "VOTE", content: "Creation failed" });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
      return;
    }
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });
    console.log('new anecdote');
    dispatch({ type: "CREATE" });
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
