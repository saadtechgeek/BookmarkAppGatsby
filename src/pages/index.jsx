import React, {useState,useRef} from 'react';
import { useMutation,useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import "./styles.css";
const faunadb = require('faunadb'),
  q = faunadb.query;

const GET_BOOKMARKS = gql`
{
    bookmarks {
        id
        title
        url
    }
}
`;

const ADD_BOOKMARK=gql`
mutation addBookmark($title: String!,
    $url: String!){
        addBookmark(title:$title, url:$url){
            id
        }
}
`;



const Home = () => {
    let titleField;
    let urlField;
    const { loading, error, data } = useQuery(GET_BOOKMARKS);
    const [addBookmark] = useMutation(ADD_BOOKMARK);


    const handleSubmit = () => {
        console.log(titleField.value);
        console.log(urlField.value);
        addBookmark({
            variables: {
                url: urlField.value,
                title: titleField.value
            },
            refetchQueries: [{ query: GET_BOOKMARKS }]
        })
    }

    if (loading)
        return <h2>Loading..</h2>

    if (error)
        return <h2>Error</h2>

    console.log(data)

    return (
        <div className="container">
            <h2>Add New Bookmark</h2>
            <label>
                Enter Bookmark Title: <br />
                <input type="text" ref={node => titleField = node} />

            </label><br />
            <label>
                Enter Bookmark url: <br />
                <input type="text" ref={node => urlField = node} />
            </label> <br />
            <button onClick={handleSubmit}>Add Bookmark</button>

            <h2>My Bookmark List</h2>
            {/* {JSON.stringify(data.bookmarks)}  */}
            <div className="card-container">
                {data.bookmarks.map(
                    (bm) => <div className="card">
                        <p className="url"><b>{bm.url}</b></p>
                        <p className="title">{bm.title}</p>
                    </div>
                )}
            </div>

        </div>
    )
}
export default Home;