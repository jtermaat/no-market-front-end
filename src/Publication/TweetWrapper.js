import React, { useState, useEffect } from "react";
import { Tweet } from 'react-twitter-widgets';
import styles from './TweetWrapper.module.css';

// const months = {
//     0: 'January',
//     1: 'February',
//     2: 'March',
//     3: 'April',
//     4: 'May',
//     5: 'June',
//     6: 'July',
//     7: 'August',
//     8: 'September',
//     9: 'October',
//     10: 'November',
//     11: 'December'
//   }

const TweetWrapper = (props) => {
    // const [content, setContent] = useState('');
    const [linkId, setLinkId] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/tweets/' + props.date).then(response => {
            return response.json();
        }).then(responseData => {
            
            // setDate(responseData.date);
            setLinkId(responseData.permalink.split('/')[5]);
            setError(false);
            // setLink(responseData.permalink);
            // setContent(responseData.content);
            // setNeedsTweet(false);
        }).catch(error =>  {
            setError(true);
        }); 
    });

    // if (props.date !== date) {
        // setNeedsTweet(true);
    // }

    // const parsedDate = Date.parse(props.date);

    return (
        // <React.Fragment>
        //     <blockquote class="twitter-tweet">
        //         <p lang="en" dir="ltr">
        //             {content.replace(/(?:\r\n|\r|\n)/g, '<br>')}
        //         </p>
    
        //         &mdash; No Market for Old Men (@John_TerMaat) 
        //         <a href={`${link}?ref_src=twsrc%5Etfw`}>
        //             {`${months[new Date(props.date).getMonth()]} ${new Date(props.date).getDate()+1}, ${new Date(props.date).getFullYear()}`}
        //         </a>
        //     </blockquote> 
        //     <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        // </React.Fragment>
        <div className={styles.panel}>
        <h2><b>Record-keeping Tweet</b></h2>
        {!error && <div className={styles.left}>
            <Tweet tweetId={linkId} />
        </div>}
        {!!error && <i>No Tweet for {props.date}</i>}
        </div>
    );
}

export default TweetWrapper;