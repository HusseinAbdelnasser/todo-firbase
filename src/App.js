import { useState, useEffect} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap'
import './App.css';
import Auth from './Components/auth';
import { db, auth, storage } from './Config/firbase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import {ref, uploadBytes} from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [show, setShow] = useState(false)

  //New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState();
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // updated title
  const [updatedTitle, setUpdatedTitle] = useState()

  // uploaded file
  const [fileUpload, setFileUpload] = useState("")

  const moviesCollectionRef = collection(db, "movies")

  

  const getMovieList = async () => {
    try{
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setMovieList(filteredData)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getMovieList();
  })

  const onSubmitMovie = async () => {
    try{
      await addDoc(moviesCollectionRef,
        {
          title: newMovieTitle,
          releaseDate: newReleaseDate,
          receivedAnOscar: isNewMovieOscar,
          userId:  auth?.currentUser?.uid,
        }
      );
      getMovieList();
      setNewMovieTitle("")
      setNewReleaseDate("")
      setIsNewMovieOscar(false)
    } catch (err){
      console.log(err)
    }
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, 'movies', id)
    await deleteDoc(movieDoc);
    getMovieList();
  }

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, 'movies', id)
    await updateDoc(movieDoc, {title: updatedTitle});
    getMovieList();
    setUpdatedTitle("");
  }

  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload)
    } catch(err){
      console.log(err)
    }
  }
 
  return (
    <div className="App">
      <Auth />

      <div>
        <Row>
          <Col md={{span: 6, offset:3}}>
          <Form.Group className="mb-3 mt-5" >
            <Form.Control 
              value={newMovieTitle}
              type="text" 
              className='mb-2'
              placeholder="Movie Title..." 
              onChange={(e) => setNewMovieTitle(e.target.value)}
              required
            />
            <Form.Control 
              value={newReleaseDate}
              className='mb-2'
              type="number" 
              placeholder="Release Date..." 
              onChange={(e) => setNewReleaseDate(Number(e.target.value))}
              required
            />
            <Form.Check 
              className='mb-2' 
              type="checkbox" 
              label="Recieved An Oscar" 
              checked={isNewMovieOscar}
              onChange={(e) => setIsNewMovieOscar(e.target.checked)}
            />
            <Button  variant="primary" type="submit" onClick={onSubmitMovie}>Submit Movie</Button>
         </Form.Group> 
          </Col>
        </Row>
      </div>

      <div className='text-center mt-5'>
        {movieList.map((movie) => (
          <div>
             <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>{movie.title}</h1>
             <p>Date: {movie.releaseDate}</p>
             <Button className='mx-2' variant="danger"  onClick={() => deleteMovie(movie.id)}>
                Delete Movie
             </Button>

             <Button  variant="secondary" onClick={() => setShow(true)}>
                Edit Movie
             </Button>
             
             <Row>
               <Col md={{span: 6, offset:3}}>
                  <Form style={{display: show ? "" : "none"}} className='mt-3 '>
                    <Form.Control
                      type="text" 
                      value={updatedTitle}
                      placeholder="Update Title..." 
                      className='mb-2'
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                    <Button variant="secondary" onClick={() => {
                      updateMovieTitle(movie.id) 
                      setShow(!show)
                      }}>
                      Update Movie 
                    </Button>
                  </Form>
               </Col>
             </Row>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
