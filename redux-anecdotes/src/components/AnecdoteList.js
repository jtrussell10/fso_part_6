import { useSelector, useDispatch } from 'react-redux'
import { likeAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (!state.filter) {
      return [...state.anecdotes].sort((a, b) => b.votes - a.votes);
    }
  
    return [...state.anecdotes].filter(anecdote => {
      if (typeof anecdote.content === 'string' && typeof state.filter === 'string') {
        return anecdote.content.toLowerCase().includes(state.filter.toLowerCase());
      }
      return false;
    }).sort((a, b) => b.votes - a.votes);
  });
  
  const dispatch = useDispatch()



  const vote = (id) => {
    dispatch(likeAnecdote({ id }));
    console.log('vote', id);
  };

  const notification = (anecdote) => {
    dispatch(setNotification(`Liked ${anecdote.content}`, 5000));
  };

  const handleVoteAndNotify = (anecdote) => {
    vote(anecdote.id);
    notification(anecdote);
  };


  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVoteAndNotify(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList